import type { Prisma } from "@prisma/client";
import { getPrismaClient } from "@/lib/prisma";
import type { UploadedContract } from "@/types/legal";
import { getContract, saveContract } from "./mockContractStore";

export async function saveUploadedContract(contract: UploadedContract) {
  saveContract(contract);

  const prisma = getPrismaClient();
  if (!prisma) {
    return { contract, databaseWarning: "DATABASE_URL 未配置，合同仅保存到内存 mock store。" };
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
    return { contract, databaseWarning: "数据库暂不可用，合同已保存到内存 mock store。" };
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
    return { databaseWarning: "DATABASE_URL 未配置，审查结果未写入数据库。" };
  }

  try {
    await prisma.contract.update({
      where: { id: contractId },
      data: { reviewJson: reviewJson as Prisma.InputJsonValue, reviewingParty }
    });
    return {};
  } catch {
    return { databaseWarning: "数据库暂不可用，审查结果未写入数据库。" };
  }
}
