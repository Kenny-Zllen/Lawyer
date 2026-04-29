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
import type { LegalResearchResult } from "@/types/legal";

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
      console.error("[legal-research] ai fallback", summarizeError(error));

      const fallback = withAiFallbackWarning(
        buildMockLegalResearchResult(payload.question, payload.legalArea),
        error
      );
      const { databaseWarning } = await saveLegalResearchResult({
        question: payload.question,
        legalArea: fallback.legalArea,
        resultJson: fallback
      });

      return NextResponse.json({ ...fallback, sources, databaseWarning });
    }
  } catch (error) {
    console.error("[legal-research] failed", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "请提交更完整的中国大陆法律检索问题。" }, { status: 400 });
    }

    if (process.env.NODE_ENV === "development") {
      return NextResponse.json(
        {
          error: "法律检索失败",
          detail: error instanceof Error ? error.message : "未知错误",
          name: error instanceof Error ? error.name : "UnknownError"
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ error: "法律检索失败，请稍后重试。" }, { status: 500 });
  }
}

function withAiFallbackWarning(
  result: LegalResearchResult,
  error: unknown
): LegalResearchResult {
  if (error instanceof MissingOpenAIKeyError) {
    return {
      ...result,
      aiMode: "mock",
      warning: "当前未配置 OPENAI_API_KEY，返回 mock 示例结果。"
    };
  }

  return {
    ...result,
    aiMode: "mock",
    warning: "当前真实 AI 调用失败，返回 mock 示例结果。请检查 OPENAI_API_KEY、OPENAI_MODEL 或网络连接。"
  };
}

function summarizeError(error: unknown) {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message
    };
  }

  return { name: "UnknownError", message: String(error) };
}
