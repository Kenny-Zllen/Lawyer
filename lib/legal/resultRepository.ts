import type { Prisma } from "@prisma/client";
import { getPrismaClient } from "@/lib/prisma";
import type { DraftingRequest, LegalArea, LitigationRequest } from "@/types/legal";
import { databaseUnavailableMessage } from "./userMessages";

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
    return { databaseWarning: databaseUnavailableMessage };
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
    return { databaseWarning: databaseUnavailableMessage };
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
    return { databaseWarning: databaseUnavailableMessage };
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
    return { databaseWarning: databaseUnavailableMessage };
  }
}

export async function saveLitigationAnalysisResult({
  request,
  resultJson
}: {
  request: LitigationRequest;
  resultJson: unknown;
}) {
  const prisma = getPrismaClient();
  if (!prisma) {
    return { databaseWarning: databaseUnavailableMessage };
  }

  try {
    await prisma.litigationAnalysis.create({
      data: {
        role: request.role,
        caseType: request.caseType,
        jurisdiction: "中国大陆",
        inputJson: request as unknown as Prisma.InputJsonValue,
        resultJson: resultJson as Prisma.InputJsonValue
      }
    });
    return {};
  } catch (error) {
    console.warn("[litigation-analysis] save skipped", summarizeSaveError(error));
    return { databaseWarning: databaseUnavailableMessage };
  }
}

function summarizeSaveError(error: unknown) {
  if (error instanceof Error) {
    return { name: error.name, message: error.message };
  }

  return { name: "UnknownError", message: String(error) };
}
