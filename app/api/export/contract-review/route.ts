import { NextResponse } from "next/server";
import { ContractReviewResultSchema } from "@/lib/ai/schemas";
import { exportContractReviewToDocx } from "@/lib/export/docx";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const result = ContractReviewResultSchema.parse(await request.json());
    const buffer = await exportContractReviewToDocx(result);

    return docxResponse(buffer, "合同审查报告.docx");
  } catch (error) {
    console.error("[export-contract-review] failed", summarizeError(error));
    return NextResponse.json({ error: "导出失败，请稍后重试或复制文本手动保存。" }, { status: 400 });
  }
}

function docxResponse(buffer: Buffer, filename: string) {
  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`
    }
  });
}

function summarizeError(error: unknown) {
  if (error instanceof Error) {
    return { name: error.name, message: error.message };
  }

  return { name: "UnknownError", message: String(error) };
}
