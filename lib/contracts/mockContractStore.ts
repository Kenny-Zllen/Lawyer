import type { UploadedContract } from "@/types/legal";

const globalForContracts = globalThis as typeof globalThis & {
  __mainlandLegalAiContracts?: Map<string, UploadedContract>;
};

const contractStore =
  globalForContracts.__mainlandLegalAiContracts ??
  new Map<string, UploadedContract>();

globalForContracts.__mainlandLegalAiContracts = contractStore;

export function saveContract(contract: UploadedContract) {
  contractStore.set(contract.contractId, contract);
  return contract;
}

export function getContract(contractId: string) {
  return contractStore.get(contractId);
}
