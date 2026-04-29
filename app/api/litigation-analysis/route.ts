import { NextResponse } from "next/server";
import { z } from "zod";
import { generateJson } from "@/lib/ai/generateJson";
import { MissingOpenAIKeyError } from "@/lib/ai/openai";
import { litigationAnalysisPrompt } from "@/lib/ai/prompts";
import { LitigationAnalysisResultSchema, LitigationRequestSchema } from "@/lib/ai/schemas";
import { createMockLitigationAnalysis } from "@/lib/legal/mockLitigationAnalysis";
import { retrieveAuthoritativeLegalSources } from "@/lib/legal/retrieveAuthoritativeLegalSources";
import { saveLitigationAnalysisResult } from "@/lib/legal/resultRepository";
import { formatSourceContext } from "@/lib/legal/sourceContext";
import { aiFallbackMessage } from "@/lib/legal/userMessages";
import type { LitigationAnalysisResult } from "@/types/legal";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const payload = LitigationRequestSchema.parse({
      jurisdiction: "中国大陆",
      ...(await request.json())
    });
    const sources = retrieveAuthoritativeLegalSources(
      `${payload.caseType} ${payload.facts} ${payload.claimsOrDefense ?? ""} ${payload.existingEvidence ?? ""} ${payload.userQuestions}`,
      6
    );

    try {
      const aiResult = await generateJson({
        systemPrompt: litigationAnalysisPrompt,
        userPrompt: JSON.stringify({
          request: payload,
          sourceContext: formatSourceContext(sources),
          requiredOutputShape: "LitigationAnalysisResultSchema"
        }),
        schema: LitigationAnalysisResultSchema
      });
      const result = LitigationAnalysisResultSchema.parse({
        ...aiResult,
        role: payload.role,
        caseType: payload.caseType,
        jurisdiction: "中国大陆",
        isMockFallback: false
      });
      const { databaseWarning } = await saveLitigationAnalysisResult({
        request: payload,
        resultJson: result
      });

      return NextResponse.json({ ...result, databaseWarning });
    } catch (error) {
      console.error("[litigation-analysis] ai fallback", summarizeError(error));

      const fallback = withFallbackReason(
        createMockLitigationAnalysis(payload, sources),
        error
      );
      const { databaseWarning } = await saveLitigationAnalysisResult({
        request: payload,
        resultJson: fallback
      });

      return NextResponse.json({ ...fallback, databaseWarning });
    }
  } catch (error) {
    console.error("[litigation-analysis] failed", summarizeError(error));

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "请补充完整的诉讼角色、案件类型、案情陈述和待解决问题。" },
        { status: 400 }
      );
    }

    if (process.env.NODE_ENV === "development") {
      return NextResponse.json(
        {
          error: "案件分析失败",
          detail: error instanceof Error ? error.message : "未知错误",
          name: error instanceof Error ? error.name : "UnknownError"
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ error: "案件分析失败，请稍后重试。" }, { status: 500 });
  }
}

function withFallbackReason(
  result: LitigationAnalysisResult,
  error: unknown
): LitigationAnalysisResult {
  if (error instanceof MissingOpenAIKeyError) {
    return {
      ...result,
      isMockFallback: true,
      fallbackReason: aiFallbackMessage
    };
  }

  return {
    ...result,
    isMockFallback: true,
    fallbackReason: aiFallbackMessage
  };
}

function summarizeError(error: unknown) {
  if (error instanceof Error) {
    return { name: error.name, message: error.message };
  }

  return { name: "UnknownError", message: String(error) };
}
