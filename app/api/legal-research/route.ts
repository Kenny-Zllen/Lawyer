import { NextResponse } from "next/server";
import { z } from "zod";
import { generateJson } from "@/lib/ai/generateJson";
import { buildMockLegalResearchResult } from "@/lib/ai/mockWorkflows";
import { MissingOpenAIKeyError } from "@/lib/ai/openai";
import { legalResearchPrompt } from "@/lib/ai/prompts";
import { LegalResearchResultSchema } from "@/lib/ai/schemas";
import { retrieveAuthoritativeLegalSources } from "@/lib/legal/retrieveAuthoritativeLegalSources";
import { saveLegalResearchResult } from "@/lib/legal/resultRepository";
import { formatSourceContext } from "@/lib/legal/sourceContext";

export const runtime = "nodejs";

const LegalResearchRequestSchema = z.object({
  question: z.string().min(4),
  legalArea: z.enum(["合同", "劳动", "公司", "争议解决", "其他"]).optional()
});

export async function POST(request: Request) {
  try {
    const payload = LegalResearchRequestSchema.parse(await request.json());
    const sources = retrieveAuthoritativeLegalSources(
      `${payload.legalArea ?? ""} ${payload.question}`,
      5
    );

    if (sources.length < 2) {
      const insufficientResult = LegalResearchResultSchema.parse({
        query: payload.question,
        legalArea: payload.legalArea ?? "其他",
        answer: "当前权威资料不足，无法基于现有资料给出可靠结论。",
        sources,
        nextSteps: ["补充更具体的事实、合同类型、争议阶段和关键词后重新检索。"],
        aiMode: "mock",
        warning: "当前权威资料不足，未调用真实大模型。"
      });
      const { databaseWarning } = await saveLegalResearchResult({
        question: payload.question,
        legalArea: payload.legalArea,
        resultJson: insufficientResult
      });

      return NextResponse.json({ ...insufficientResult, databaseWarning });
    }

    try {
      const aiResult = await generateJson({
        systemPrompt: legalResearchPrompt,
        userPrompt: JSON.stringify({
          question: payload.question,
          legalArea: payload.legalArea,
          jurisdiction: "中国大陆",
          sourceContext: formatSourceContext(sources),
          requiredOutputShape: "LegalResearchResultSchema"
        }),
        schema: LegalResearchResultSchema
      });
      const result = LegalResearchResultSchema.parse({
        ...aiResult,
        query: payload.question,
        legalArea: payload.legalArea ?? aiResult.legalArea,
        sources,
        aiMode: "real"
      });
      const { databaseWarning } = await saveLegalResearchResult({
        question: payload.question,
        legalArea: result.legalArea,
        resultJson: result
      });

      return NextResponse.json({ ...result, databaseWarning });
    } catch (error) {
      if (!(error instanceof MissingOpenAIKeyError)) {
        throw error;
      }

      const fallback = buildMockLegalResearchResult(payload.question, payload.legalArea);
      const { databaseWarning } = await saveLegalResearchResult({
        question: payload.question,
        legalArea: fallback.legalArea,
        resultJson: fallback
      });

      return NextResponse.json({ ...fallback, sources, databaseWarning });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "请提交更完整的中国大陆法律检索问题。" }, { status: 400 });
    }
    return NextResponse.json({ error: "法律检索失败，请稍后重试。" }, { status: 500 });
  }
}
