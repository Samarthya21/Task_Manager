import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient | undefined;

// Check if the environment is production
if (process.env.NODE_ENV === 'production') {
    prisma = new PrismaClient();
} else {
    // Declare global and its property prisma
    declare global {
        namespace NodeJS {
            interface Global {
                prisma?: PrismaClient;
            }
        }
    }

    // Check if prisma has already been initialized globally
    if (!global.prisma) {
        global.prisma = new PrismaClient();
    }
    prisma = global.prisma;
}

// Export prisma only if it's defined
if (prisma) {
    export default prisma;
} else {
    throw new Error('Prisma instance is not defined.');
}
