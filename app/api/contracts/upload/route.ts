import { NextResponse } from "next/server";
import { saveContract } from "@/lib/contracts/mockContractStore";
import type { UploadedContract } from "@/types/legal";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "请上传 TXT 合同文件。" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "文件大小不能超过 10MB。" }, { status: 413 });
    }

    if (!isTxtFile(file)) {
      return NextResponse.json({ error: "第一版仅支持 TXT 文件。" }, { status: 415 });
    }

    const rawText = await file.text();
    if (!rawText.trim()) {
      return NextResponse.json({ error: "文件内容为空，无法提取合同文本。" }, { status: 400 });
    }

    const contract: UploadedContract = {
      contractId: crypto.randomUUID(),
      fileName: file.name || "contract.txt",
      fileType: file.type || "text/plain",
      fileSize: file.size,
      rawText,
      rawTextPreview: rawText.slice(0, 500),
      createdAt: new Date().toISOString()
    };

    saveContract(contract);

    return NextResponse.json({
      contractId: contract.contractId,
      fileName: contract.fileName,
      fileType: contract.fileType,
      rawTextPreview: contract.rawTextPreview
    });
  } catch {
    return NextResponse.json({ error: "合同上传失败，请稍后重试。" }, { status: 500 });
  }
}

function isTxtFile(file: File) {
  const fileName = file.name.toLowerCase();
  return file.type === "text/plain" || fileName.endsWith(".txt");
}
