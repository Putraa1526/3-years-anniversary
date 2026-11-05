import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { createClient, type Client } from '@libsql/client';

// Pick the right driver:
//  - On Vercel/production: set DATABASE_URL to your Turso libSQL URL
//    (libsql://<db>.turso.io) and TURSO_AUTH_TOKEN to the access token.
//    Prisma uses the libSQL adapter → all writes persist in the cloud.
//  - On local dev: DATABASE_URL is a file:// path → use the SQLite
//    driver directly (no adapter needed).
const isTurso =
  process.env.DATABASE_URL?.startsWith('libsql://') ||
  process.env.DATABASE_URL?.startsWith('libsql:');

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
};

function createPrisma(): PrismaClient {
  if (isTurso) {
    const url = process.env.DATABASE_URL as string;
    const authToken = process.env.TURSO_AUTH_TOKEN;
    const libsqlClient: Client = createClient({ url, authToken });
    const adapter = new PrismaLibSql(libsqlClient);
    return new PrismaClient({ adapter } as never);
  }
  // Local SQLite dev — plain PrismaClient.
  return new PrismaClient({ log: ['error', 'warn'] });
}

export const db = globalForPrisma.prisma ?? createPrisma();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;
