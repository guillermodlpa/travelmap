import { PrismaClient } from '@prisma/client';

// @see https://www.prisma.io/docs/support/help-articles/nextjs-prisma-client-dev-practices
// In development, the command next dev clears Node.js cache on run. This in turn initializes
// a new PrismaClient instance each time due to hot reloading that creates a connection to
// the database. This can quickly exhaust the database connections as each PrismaClient instance
// holds its own connection pool.
// The solution in this case is to instantiate a single instance PrismaClient and save it on
// the global object. Then we keep a check to only instantiate PrismaClient if it's not on the
// global object otherwise use the same instance again if already present to prevent instantiating
// extra PrismaClient instances.

declare global {
  var prisma: PrismaClient | undefined;
}

export const getPrismaClient = (): PrismaClient => {
  const prisma =
    global.prisma ||
    new PrismaClient({
      log: ['query'],
    });
  if (process.env.NODE_ENV !== 'production' || process.env.IS_CI) {
    global.prisma = prisma;
  }
  return prisma;
};
