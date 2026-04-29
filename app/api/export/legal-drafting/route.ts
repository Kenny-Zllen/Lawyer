import { NextResponse } from "next/server";
import { DraftingResultSchema } from "@/lib/ai/schemas";
import { exportDraftingResultToDocx } from "@/lib/export/docx";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const result = DraftingResultSchema.parse(await request.json());
    const buffer = await exportDraftingResultToDocx(result);

    return new Response(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent("法律文书草稿.docx")}`
      }
    });
  } catch (error) {
    console.error("[export-legal-drafting] failed", summarizeError(error));
    return NextResponse.json({ error: "导出失败，请稍后重试或复制文本手动保存。" }, { status: 400 });
  }
}

function summarizeError(error: unknown) {
  if (error instanceof Error) {
    return { name: error.name, message: error.message };
  }

  return { name: "UnknownError", message: String(error) };
}
