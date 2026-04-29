import { NextResponse } from "next/server";
import { z } from "zod";
import { generateJson } from "@/lib/ai/generateJson";
import { buildMockDraftingResult } from "@/lib/ai/mockWorkflows";
import { legalDraftingPrompt } from "@/lib/ai/prompts";
import { DraftingResultSchema } from "@/lib/ai/schemas";
import { documentTemplates } from "@/lib/legal/documentTemplates";
import { retrieveAuthoritativeLegalSources } from "@/lib/legal/retrieveAuthoritativeLegalSources";
import { saveLegalDraftResult } from "@/lib/legal/resultRepository";
import { formatSourceContext } from "@/lib/legal/sourceContext";
import { aiFallbackMessage } from "@/lib/legal/userMessages";

export const runtime = "nodejs";

const DraftingRequestSchema = z.object({
  templateId: z.string().min(1),
  parties: z.string().min(1),
  scenario: z.string().min(1),
  keyTerms: z.string().min(1)
});

export async function POST(request: Request) {
  try {
    const payload = DraftingRequestSchema.parse(await request.json());
    const templateExists = documentTemplates.some((template) => template.id === payload.templateId);

    if (!templateExists) {
      return NextResponse.json({ error: "未找到对应文书模板。" }, { status: 404 });
    }

    const template = documentTemplates.find((item) => item.id === payload.templateId);
    const sources = retrieveAuthoritativeLegalSources(
      `${template?.name ?? ""} ${payload.scenario} ${payload.keyTerms}`,
      5
    );

    try {
      const aiResult = await generateJson({
        systemPrompt: legalDraftingPrompt,
        userPrompt: JSON.stringify({
          draftingRequest: payload,
          documentTemplate: template,
          jurisdiction: "中国大陆",
          sourceContext: formatSourceContext(sources),
          requiredOutputShape: "DraftingResultSchema"
        }),
        schema: DraftingResultSchema
      });
      const result = DraftingResultSchema.parse({
        ...aiResult,
        legalArea: template?.legalArea ?? aiResult.legalArea,
        sources,
        aiMode: "real"
      });
      const { databaseWarning } = await saveLegalDraftResult({
        request: payload,
        resultJson: result
      });

      return NextResponse.json({ ...result, databaseWarning });
    } catch (error) {
      console.error("[legal-drafting] ai fallback", summarizeError(error));

      const fallback = {
        ...buildMockDraftingResult(payload),
        warning: aiFallbackMessage
      };
      const { databaseWarning } = await saveLegalDraftResult({
        request: payload,
        resultJson: fallback
      });

      return NextResponse.json({ ...fallback, sources, databaseWarning });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "请补充完整的文书生成信息。" }, { status: 400 });
    }
    return NextResponse.json({ error: "文书生成失败，请补充完整信息后重试。" }, { status: 500 });
  }
}

function summarizeError(error: unknown) {
  if (error instanceof Error) {
    return { name: error.name, message: error.message };
  }

  return { name: "UnknownError", message: String(error) };
}
