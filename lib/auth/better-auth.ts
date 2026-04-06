import { betterAuth } from 'better-auth';
import { prisma } from '@/lib/db/prisma';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import bcrypt from "bcryptjs"

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "mongodb"
    }),

    user: { modelName: "User" },
    session: { modelName: "Session" },
    account: { modelName: "Account" },

    advanced: {
        database: { generateId: false },
    },

    emailAndPassword: {
        enabled: true,
        async hash(password: string) {
            // Implement password hashing logic here
            return await bcrypt.hash(password, 10);
        },
        async verify(password: string, hash: string) {
            // Implement password verification logic here
            return await bcrypt.compare(password, hash);
        }
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        },
        github: {
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        },
    },
});