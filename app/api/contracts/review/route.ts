import { NextResponse } from "next/server";
import { z } from "zod";
import { buildMockContractReviewResult } from "@/lib/ai/mockWorkflows";
import { getContract } from "@/lib/contracts/mockContractStore";

const ReviewRequestSchema = z.object({
  contractId: z.string().min(1)
});

export async function POST(request: Request) {
  try {
    const payload = ReviewRequestSchema.parse(await request.json());
    const contract = getContract(payload.contractId);

    if (!contract) {
      return NextResponse.json({ error: "未找到合同，请先上传 TXT 合同文件。" }, { status: 404 });
    }

    const result = buildMockContractReviewResult(contract.contractId, contract.rawText);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "请求参数无效。" }, { status: 400 });
    }
    return NextResponse.json({ error: "合同审查失败，请稍后重试。" }, { status: 500 });
  }
}
