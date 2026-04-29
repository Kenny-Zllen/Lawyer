import type { Prisma } from "@prisma/client";
import { getPrismaClient } from "@/lib/prisma";
import type { DraftingRequest, LegalArea } from "@/types/legal";

export async function saveLegalResearchResult({
  question,
  legalArea,
  resultJson
}: {
  question: string;
  legalArea?: LegalArea;
  resultJson: unknown;
}) {
  const prisma = getPrismaClient();
  if (!prisma) {
    return { databaseWarning: "DATABASE_URL 未配置，检索结果未写入数据库。" };
  }

  try {
    await prisma.legalResearchQuery.create({
      data: {
        question,
        legalArea,
        jurisdiction: "中国大陆",
        resultJson: resultJson as Prisma.InputJsonValue
      }
    });
    return {};
  } catch {
    return { databaseWarning: "数据库暂不可用，检索结果未写入数据库。" };
  }
}

export async function saveLegalDraftResult({
  request,
  resultJson
}: {
  request: DraftingRequest;
  resultJson: unknown;
}) {
  const prisma = getPrismaClient();
  if (!prisma) {
    return { databaseWarning: "DATABASE_URL 未配置，文书结果未写入数据库。" };
  }

  try {
    await prisma.legalDraft.create({
      data: {
        documentType: request.templateId,
        jurisdiction: "中国大陆",
        inputJson: request as unknown as Prisma.InputJsonValue,
        resultJson: resultJson as Prisma.InputJsonValue
      }
    });
    return {};
  } catch {
    return { databaseWarning: "数据库暂不可用，文书结果未写入数据库。" };
  }
}
