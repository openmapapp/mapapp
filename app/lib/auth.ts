import { betterAuth } from "better-auth";
import { username, admin } from "better-auth/plugins";
import { PostgresDialect } from "kysely";
import { Pool } from "pg";

const dialect = new PostgresDialect({
  pool: new Pool({
    host: "localhost",
    database: "Nathan",
    port: 5432,
    max: 20,
  }),
});

export const auth = betterAuth({
  database: {
    dialect,
    type: "postgres",
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // cache for 5 minutes
    },
  },
  emailAndPassword: { enabled: true, autoSignIn: true },
  user: {
    deleteUser: {
      enabled: true,
      requirePassword: true,
    },
  },
  plugins: [username(), admin()],
});

export type Session = typeof auth.$Infer.Session;
