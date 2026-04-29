import { NextResponse } from "next/server";
import { z } from "zod";
import { generateJson } from "@/lib/ai/generateJson";
import { MissingOpenAIKeyError } from "@/lib/ai/openai";
import {
  LitigationAnalysisResultSchema,
  LitigationRequestSchema
} from "@/lib/ai/schemas";
import { createMockLitigationAnalysis } from "@/lib/legal/mockLitigationAnalysis";
import { retrieveAuthoritativeLegalSources } from "@/lib/legal/retrieveAuthoritativeLegalSources";
import { saveLitigationAnalysisResult } from "@/lib/legal/resultRepository";
import { formatSourceContext } from "@/lib/legal/sourceContext";
import { aiFallbackMessage } from "@/lib/legal/userMessages";
import type { LitigationAnalysisResult } from "@/types/legal";

export const runtime = "nodejs";

const CompactLitigationAIResultSchema = z.object({
  caseSummary: z.string().catch("已根据用户提交材料生成初步案情摘要，需由律师结合完整证据核验。"),
  keyIssues: z
    .array(
      z.object({
        issue: z.string().catch("争议焦点"),
        explanation: z.string().catch("需结合用户事实和权威来源进一步核验。"),
        importance: z.enum(["high", "medium", "low"]).catch("medium")
      })
    )
    .catch([]),
  claimsOrDefenseSuggestions: z.array(z.string()).catch([]),
  evidenceAnalysis: z
    .object({
      existingEvidenceSummary: z.array(z.string()).catch([]),
      missingEvidence: z
        .array(
          z.object({
            evidenceName: z.string().catch("补充证据"),
            purpose: z.string().catch("用于补强相关事实的证明链条。"),
            priority: z.enum(["high", "medium", "low"]).catch("medium")
          })
        )
        .catch([]),
      evidenceStrategy: z.array(z.string()).catch([])
    })
    .catch({
      existingEvidenceSummary: [],
      missingEvidence: [],
      evidenceStrategy: []
    }),
  opposingArgumentsAndResponses: z
    .array(
      z.object({
        possibleOpposingArgument: z.string().catch("对方可能对事实、责任或金额提出异议。"),
        responseStrategy: z.string().catch("结合合同、履行记录和证据链进行回应。"),
        neededEvidence: z.array(z.string()).catch([])
      })
    )
    .catch([]),
  riskWarnings: z.array(z.string()).catch([]),
  recommendedNextSteps: z.array(z.string()).catch([])
});

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
      const baseline = createMockLitigationAnalysis(payload, sources);
      const aiResult = await generateJson({
        systemPrompt: litigationCompactPrompt,
        userPrompt: JSON.stringify({
          request: payload,
          sourceContext: formatSourceContext(sources, { maxChars: 3600, maxResults: 4 }),
          requiredOutputShape: {
            caseSummary: "string",
            keyIssues: [{ issue: "string", explanation: "string", importance: "high | medium | low" }],
            claimsOrDefenseSuggestions: ["string"],
            evidenceAnalysis: {
              existingEvidenceSummary: ["string"],
              missingEvidence: [{ evidenceName: "string", purpose: "string", priority: "high | medium | low" }],
              evidenceStrategy: ["string"]
            },
            opposingArgumentsAndResponses: [
              {
                possibleOpposingArgument: "string",
                responseStrategy: "string",
                neededEvidence: ["string"]
              }
            ],
            riskWarnings: ["string"],
            recommendedNextSteps: ["string"]
          }
        }),
        schema: CompactLitigationAIResultSchema
      });
      const result = LitigationAnalysisResultSchema.parse({
        ...baseline,
        ...aiResult,
        legalBasis: sources.slice(0, 4).map((source) => ({
          title: source.title,
          articleNumber: source.articleNumber,
          sourceName: source.sourceName,
          relevance: "该规则摘要可作为本案初步分析的参考依据，需核验正式法律文本。"
        })),
        role: payload.role,
        caseType: payload.caseType,
        jurisdiction: "中国大陆",
        isMockFallback: false,
        fallbackReason: undefined
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

const litigationCompactPrompt = `
你是一名中国大陆法域下的民商事诉讼辅助 AI。
仅支持中华人民共和国大陆民商事案件，不处理刑事辩护、行政诉讼、港澳台或境外法律。
只能基于用户提交材料和 source context 分析，不得编造法律条文、案例、案号、裁判规则、事实或证据。
本次只生成核心诉讼分析，不生成起诉状、答辩状或代理词全文。
如果证据不足，必须列入 missingEvidence。
不得承诺胜诉，不得给出确定胜率。
输出必须是合法 JSON，不输出 Markdown，不输出 JSON 以外的解释。
JSON 只能包含 requiredOutputShape 中列明的字段。
`;

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
