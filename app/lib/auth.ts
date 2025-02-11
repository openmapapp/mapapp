import { betterAuth } from "better-auth";
import { username, customSession } from "better-auth/plugins";
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
    additionalFields: {
      trust: {
        type: "number",
        required: true,
        default: 1,
        input: false,
      },
    },
  },
  plugins: [
    username(),
    // customSession(async ({ user, session }) => {
    //   const trust1 = findUserTrust(session.sesion.userId)
    //   const { trust } = user.additionalFields.trust;
    //   return {
    //     trust,
    //     user: {
    //       id: user.id,
    //       username: user.username,
    //       trust,
    //     },
    //     session,
    //   };
    // }),
  ],
});

type Session = typeof auth.$Infer.Session;
