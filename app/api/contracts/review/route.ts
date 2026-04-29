import { NextResponse } from "next/server";
import { z } from "zod";
import { generateJson } from "@/lib/ai/generateJson";
import { buildMockContractReviewResult } from "@/lib/ai/mockWorkflows";
import { MissingOpenAIKeyError } from "@/lib/ai/openai";
import { contractReviewPrompt } from "@/lib/ai/prompts";
import { ContractReviewResultSchema } from "@/lib/ai/schemas";
import { findContractById, saveContractReview } from "@/lib/contracts/contractRepository";
import { retrieveAuthoritativeLegalSources } from "@/lib/legal/retrieveAuthoritativeLegalSources";
import { formatSourceContext } from "@/lib/legal/sourceContext";

export const runtime = "nodejs";

const ReviewRequestSchema = z.object({
  contractId: z.string().min(1),
  reviewingParty: z.string().optional()
});

export async function POST(request: Request) {
  try {
    const payload = ReviewRequestSchema.parse(await request.json());
    const contract = await findContractById(payload.contractId);

    if (!contract) {
      return NextResponse.json({ error: "未找到合同，请先上传合同文件。" }, { status: 404 });
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
          requiredOutputShape: "ContractReviewResultSchema"
        }),
        schema: ContractReviewResultSchema
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
      if (!(error instanceof MissingOpenAIKeyError)) {
        throw error;
      }

      const fallback = buildMockContractReviewResult(contract.contractId, contract.rawText);
      const { databaseWarning } = await saveContractReview(
        contract.contractId,
        fallback,
        payload.reviewingParty
      );
      const result = ContractReviewResultSchema.parse({
        ...fallback,
        sources,
        databaseWarning
      });

      return NextResponse.json(result);
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "请求参数无效。" }, { status: 400 });
    }
    return NextResponse.json({ error: "合同审查失败，请稍后重试。" }, { status: 500 });
  }
}
