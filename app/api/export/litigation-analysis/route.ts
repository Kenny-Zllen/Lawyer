import { NextResponse } from "next/server";
import { LitigationAnalysisResultSchema } from "@/lib/ai/schemas";
import { exportLitigationAnalysisToDocx } from "@/lib/export/docx";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const result = LitigationAnalysisResultSchema.parse(await request.json());
    const buffer = await exportLitigationAnalysisToDocx(result);

    return new Response(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent("案件分析与诉讼文书报告.docx")}`
      }
    });
  } catch (error) {
    console.error("[export-litigation-analysis] failed", summarizeError(error));
    return NextResponse.json({ error: "导出失败，请稍后重试或复制文本手动保存。" }, { status: 400 });
  }
}

function summarizeError(error: unknown) {
  if (error instanceof Error) {
    return { name: error.name, message: error.message };
  }

  return { name: "UnknownError", message: String(error) };
}
