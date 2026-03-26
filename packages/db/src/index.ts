// packages/db/src/index.ts
export { PrismaClient } from "./generated/prisma";
import { PrismaClient } from "./generated/prisma";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
