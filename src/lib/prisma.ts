import { PrismaClient } from '@prisma/client';

export function getWibDate(): Date {
  const now = new Date();
  return new Date(now.getTime() + 7 * 3600 * 1000);
}

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  throw new Error('DATABASE_URL environment variable is missing.');
}

const createPrismaClient = () => {
  const baseClient = new PrismaClient({
    datasources: {
      db: {
        url: dbUrl,
      },
    },
    log: process.env.DEBUG_PRISMA === 'true' ? ['query', 'error', 'warn'] : ['error', 'warn'],
  });

  return baseClient.$extends({
    query: {
      $allModels: {
        async $allOperations({ operation, args, query }) {
          const wibNow = getWibDate();
          const dataAny = (args as any)?.data;

          if (operation === 'create' && dataAny) {
            if (dataAny.createdAt === undefined) dataAny.createdAt = wibNow;
            if (dataAny.updatedAt === undefined) dataAny.updatedAt = wibNow;
          } else if (operation === 'createMany' && Array.isArray(dataAny)) {
            dataAny.forEach((item: any) => {
              if (item.createdAt === undefined) item.createdAt = wibNow;
              if (item.updatedAt === undefined) item.updatedAt = wibNow;
            });
          } else if ((operation === 'update' || operation === 'updateMany') && dataAny) {
            dataAny.updatedAt = wibNow;
            if (dataAny.deletedAt === true) {
              dataAny.deletedAt = wibNow;
            }
          } else if (operation === 'upsert') {
            const createAny = (args as any)?.create;
            const updateAny = (args as any)?.update;
            if (createAny) {
              if (createAny.createdAt === undefined) createAny.createdAt = wibNow;
              if (createAny.updatedAt === undefined) createAny.updatedAt = wibNow;
            }
            if (updateAny) {
              if (updateAny.updatedAt === undefined) updateAny.updatedAt = wibNow;
            }
          }

          return query(args);
        },
      },
    },
  });
};

type ExtendedPrismaClient = ReturnType<typeof createPrismaClient>;

const globalForPrisma = globalThis as unknown as {
  prisma: ExtendedPrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
