import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { expo } from "@better-auth/expo";
import { betterAuth } from "better-auth";
import * as schema from "@/db/schema";
import { db } from "@/db";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        schema
    }),
    emailAndPassword: {
        enabled: true,
    },
    plugins: [
        nextCookies(),
        expo()
    ],
    trustedOrigins: ["myapp://"]
});

export type Session = typeof auth.$Infer.Session.session;
export type User = typeof auth.$Infer.Session.user;
