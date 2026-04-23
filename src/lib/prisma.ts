import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../generated/prisma/client";
import { DATABASE_URL } from "./env";

/**
 * Prisma client configured with the Neon serverless adapter.
 * Using PrismaNeon instead of the default driver allows the app
 * to work efficiently in serverless/edge environments (e.g. Vercel).
 *
 * The `omit` option globally hides sensitive fields (password, isBanned)
 * from all query results so they are never accidentally exposed in API responses.
 * If a specific query needs these fields (e.g. login), it overrides omit locally.
 */
const adapter = new PrismaNeon({ connectionString: DATABASE_URL })
const prisma = new PrismaClient({
    adapter,
    omit: {
        user: {
            password: true,
            isBanned: true
        }
    }
})
export default prisma