import type { Prisma } from "@prisma/client";
import { getPrismaClient } from "@/lib/prisma";
import type { UploadedContract } from "@/types/legal";
import { databaseUnavailableMessage } from "@/lib/legal/userMessages";
import { getContract, saveContract } from "./mockContractStore";

export async function saveUploadedContract(contract: UploadedContract) {
  saveContract(contract);

  const prisma = getPrismaClient();
  if (!prisma) {
    return { contract, databaseWarning: databaseUnavailableMessage };
  }

  try {
    await prisma.contract.create({
      data: {
        id: contract.contractId,
        fileName: contract.fileName,
        fileType: contract.fileType,
        rawText: contract.rawText
      }
    });
    return { contract };
  } catch {
    return { contract, databaseWarning: databaseUnavailableMessage };
  }
}

export async function findContractById(contractId: string) {
  const memoryContract = getContract(contractId);
  if (memoryContract) {
    return memoryContract;
  }

  const prisma = getPrismaClient();
  if (!prisma) {
    return null;
  }

  try {
    const contract = await prisma.contract.findUnique({ where: { id: contractId } });
    if (!contract) {
      return null;
    }

    return {
      contractId: contract.id,
      fileName: contract.fileName,
      fileType: contract.fileType,
      fileSize: Buffer.byteLength(contract.rawText),
      rawText: contract.rawText,
      rawTextPreview: contract.rawText.slice(0, 500),
      createdAt: contract.createdAt.toISOString()
    };
  } catch {
    return null;
  }
}

export async function saveContractReview(
  contractId: string,
  reviewJson: unknown,
  reviewingParty?: string
) {
  const prisma = getPrismaClient();
  if (!prisma) {
    return { databaseWarning: databaseUnavailableMessage };
  }

  try {
    await prisma.contract.update({
      where: { id: contractId },
      data: { reviewJson: reviewJson as Prisma.InputJsonValue, reviewingParty }
    });
    return {};
  } catch {
    return { databaseWarning: databaseUnavailableMessage };
  }
}
