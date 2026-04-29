import { NextResponse } from "next/server";
import { z } from "zod";
import { generateJson } from "@/lib/ai/generateJson";
import { buildMockContractReviewResult } from "@/lib/ai/mockWorkflows";
import { contractReviewPrompt } from "@/lib/ai/prompts";
import { ContractReviewAIResultSchema, ContractReviewResultSchema } from "@/lib/ai/schemas";
import { findContractById, saveContractReview } from "@/lib/contracts/contractRepository";
import { retrieveAuthoritativeLegalSources } from "@/lib/legal/retrieveAuthoritativeLegalSources";
import { formatSourceContext } from "@/lib/legal/sourceContext";
import { aiFallbackMessage } from "@/lib/legal/userMessages";

export const runtime = "nodejs";

const ReviewRequestSchema = z.object({
  contractId: z.string().min(1),
  rawText: z.string().optional(),
  fileName: z.string().optional(),
  fileType: z.string().optional(),
  reviewingParty: z.string().optional()
});

export async function POST(request: Request) {
  try {
    const payload = ReviewRequestSchema.parse(await request.json());
    const storedContract = await findContractById(payload.contractId);
    const contract =
      storedContract ??
      (payload.rawText?.trim()
        ? {
            contractId: payload.contractId,
            fileName: payload.fileName ?? "contract.txt",
            fileType: payload.fileType ?? "text/plain",
            fileSize: Buffer.byteLength(payload.rawText),
            rawText: payload.rawText,
            rawTextPreview: payload.rawText.slice(0, 500),
            createdAt: new Date().toISOString()
          }
        : null);

    if (!contract) {
      return NextResponse.json(
        { error: "未找到合同文本，请重新上传文件或粘贴合同内容后再审查。" },
        { status: 404 }
      );
    }

    const sources = retrieveAuthoritativeLegalSources(
      `${payload.reviewingParty ?? ""} ${contract.rawText}`,
      5
    );
    const sourceContext = formatSourceContext(sources);

    try {
      const aiResult = await generateJson({
        systemPrompt: contractReviewPrompt,
        userPrompt: JSON.stringify({
          contractId: contract.contractId,
          reviewingParty: payload.reviewingParty ?? "未指定",
          contractText: contract.rawText,
          sourceContext,
          requiredOutputShape: {
            title: "string",
            legalArea: "合同 | 劳动 | 公司 | 争议解决 | 其他",
            overallRisk: "低 | 中 | 高",
            summary: "string",
            keyClauses: ["string"],
            keyIssues: [
              {
                title: "string",
                riskLevel: "低 | 中 | 高",
                explanation: "string",
                suggestion: "string"
              }
            ],
            suggestedClauses: ["string"]
          }
        }),
        schema: ContractReviewAIResultSchema
      });
      const result = ContractReviewResultSchema.parse({
        ...aiResult,
        id: aiResult.id || `review-${contract.contractId}`,
        sources,
        aiMode: "real"
      });
      const { databaseWarning } = await saveContractReview(
        contract.contractId,
        result,
        payload.reviewingParty
      );

      return NextResponse.json({ ...result, databaseWarning });
    } catch (error) {
      console.error("[contract-review] ai fallback", summarizeError(error));

      const fallback = buildMockContractReviewResult(contract.contractId, contract.rawText);
      const { databaseWarning } = await saveContractReview(
        contract.contractId,
        fallback,
        payload.reviewingParty
      );
      const result = ContractReviewResultSchema.parse({
        ...fallback,
        warning: aiFallbackMessage,
        sources,
        databaseWarning
      });

      return NextResponse.json(result);
    }
  } catch (error) {
    console.error("[contract-review] failed", summarizeError(error));

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "请求参数无效。" }, { status: 400 });
    }
    return NextResponse.json({ error: "合同审查失败，请检查输入后重试。" }, { status: 500 });
  }
}

function summarizeError(error: unknown) {
  if (error instanceof Error) {
    return { name: error.name, message: error.message };
  }

  return { name: "UnknownError", message: String(error) };
}
