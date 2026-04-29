import { NextResponse } from "next/server";
import { saveUploadedContract } from "@/lib/contracts/contractRepository";
import {
  DocumentExtractionError,
  extractTextFromFile,
  getNormalizedFileType
} from "@/lib/documents/extractText";
import type { UploadedContract } from "@/types/legal";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "请上传 TXT、DOCX 或 PDF 合同文件。" }, { status: 400 });
    }

    const rawText = await extractTextFromFile(file);
    const fileType = getNormalizedFileType(file);

    const contract: UploadedContract = {
      contractId: crypto.randomUUID(),
      fileName: file.name || "contract",
      fileType,
      fileSize: file.size,
      rawText,
      rawTextPreview: rawText.slice(0, 500),
      createdAt: new Date().toISOString()
    };

    const { databaseWarning } = await saveUploadedContract(contract);

    return NextResponse.json({
      contractId: contract.contractId,
      fileName: contract.fileName,
      fileType: contract.fileType,
      rawTextPreview: contract.rawTextPreview,
      databaseWarning
    });
  } catch (error) {
    if (error instanceof DocumentExtractionError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: "合同上传失败，请稍后重试。" }, { status: 500 });
  }
}
