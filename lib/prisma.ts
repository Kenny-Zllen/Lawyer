import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient;
};

export function isDatabaseConfigured() {
  return Boolean(process.env.DATABASE_URL);
}

export function getPrismaClient() {
  if (!isDatabaseConfigured()) {
    return null;
  }

  globalForPrisma.prisma ??= new PrismaClient();
  return globalForPrisma.prisma;
}
