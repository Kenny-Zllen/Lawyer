import mammoth from "mammoth";
import { PDFParse } from "pdf-parse";

export const MAX_UPLOAD_SIZE_BYTES = 10 * 1024 * 1024;

const supportedTypes = new Set([
  "text/plain",
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
]);

const executableExtensions = [
  ".app",
  ".bat",
  ".bin",
  ".cmd",
  ".com",
  ".dll",
  ".dmg",
  ".exe",
  ".js",
  ".msi",
  ".pkg",
  ".ps1",
  ".scr",
  ".sh"
];

export class DocumentExtractionError extends Error {
  constructor(message: string, readonly status = 400) {
    super(message);
    this.name = "DocumentExtractionError";
  }
}

export async function extractTextFromFile(file: File): Promise<string> {
  validateFile(file);

  try {
    if (isTxtFile(file)) {
      return normalizeExtractedText(await file.text());
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    if (isDocxFile(file)) {
      const result = await mammoth.extractRawText({ buffer });
      return normalizeExtractedText(result.value);
    }

    if (isPdfFile(file)) {
      // TODO: Add OCR for scanned PDFs in a later phase.
      const parser = new PDFParse({ data: new Uint8Array(buffer) });
      try {
        const result = await parser.getText();
        return normalizeExtractedText(result.text);
      } finally {
        await parser.destroy();
      }
    }
  } catch {
    throw new DocumentExtractionError("文件解析失败，请确认文件未损坏且包含可提取文本。", 422);
  }

  throw new DocumentExtractionError("暂不支持该文件类型。", 415);
}

export function getNormalizedFileType(file: File) {
  if (isTxtFile(file)) return "text/plain";
  if (isDocxFile(file)) return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  if (isPdfFile(file)) return "application/pdf";
  return file.type || "application/octet-stream";
}

function validateFile(file: File) {
  if (file.size > MAX_UPLOAD_SIZE_BYTES) {
    throw new DocumentExtractionError("文件大小不能超过 10MB。", 413);
  }

  const fileName = file.name.toLowerCase();
  if (executableExtensions.some((extension) => fileName.endsWith(extension))) {
    throw new DocumentExtractionError("不允许上传可执行文件。", 415);
  }

  if (!supportedTypes.has(file.type) && !hasSupportedExtension(fileName)) {
    throw new DocumentExtractionError("仅支持 TXT、DOCX、PDF 文件。", 415);
  }
}

function normalizeExtractedText(text: string) {
  const normalized = text.replace(/\u0000/g, "").trim();
  if (!normalized) {
    throw new DocumentExtractionError("文件中未提取到可用文本；扫描件 PDF 暂不支持 OCR。", 422);
  }
  return normalized;
}

function hasSupportedExtension(fileName: string) {
  return fileName.endsWith(".txt") || fileName.endsWith(".docx") || fileName.endsWith(".pdf");
}

function isTxtFile(file: File) {
  return file.type === "text/plain" || file.name.toLowerCase().endsWith(".txt");
}

function isDocxFile(file: File) {
  return (
    file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    file.name.toLowerCase().endsWith(".docx")
  );
}

function isPdfFile(file: File) {
  return file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
}
