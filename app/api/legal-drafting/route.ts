import { NextResponse } from "next/server";
import { z } from "zod";
import { buildMockDraftingResult } from "@/lib/ai/mockWorkflows";
import { documentTemplates } from "@/lib/legal/documentTemplates";

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

    const result = buildMockDraftingResult(payload);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "请补充完整的文书生成信息。" }, { status: 400 });
    }
    return NextResponse.json({ error: "文书生成失败，请稍后重试。" }, { status: 500 });
  }
}
