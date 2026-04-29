import { NextResponse } from "next/server";
import { z } from "zod";
import { buildMockLegalResearchResult } from "@/lib/ai/mockWorkflows";

const LegalResearchRequestSchema = z.object({
  question: z.string().min(4),
  legalArea: z.enum(["合同", "劳动", "公司", "争议解决", "其他"]).optional()
});

export async function POST(request: Request) {
  try {
    const payload = LegalResearchRequestSchema.parse(await request.json());
    const result = buildMockLegalResearchResult(payload.question, payload.legalArea);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "请提交更完整的中国大陆法律检索问题。" }, { status: 400 });
    }
    return NextResponse.json({ error: "法律检索失败，请稍后重试。" }, { status: 500 });
  }
}
