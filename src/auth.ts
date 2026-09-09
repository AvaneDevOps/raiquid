import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { findDemoAccount } from "@/lib/demo-accounts";
import type { UserRole } from "@/types";

/**
 * Auth.js v5 configuration using JWT sessions with no database.
 *
 * Credentials are currently validated against the demo accounts defined
 * in src/lib/demo-accounts.ts. Those accounts are seeded for development
 * only; see that file for details.
 *
 * The current setup keeps authentication independent of a backend decision.
 * When a real backend is introduced, the `authorize()` function can be
 * updated to query the user store and validate hashed passwords without
 * changing the provider configuration, session strategy, or consumers of
 * `auth()`.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },

  pages: {
    signIn: "/auth",
  },

  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      authorize(credentials) {
        const { email, password } = credentials ?? {};

        if (typeof email !== "string" || typeof password !== "string") {
          return null;
        }

        const account = findDemoAccount(email, password);

        if (!account) {
          return null;
        }

        return {
          id: account.email,
          name: account.name,
          email: account.email,
          role: account.role,
          subtitle: account.subtitle,
          initials: account.initials,
        };
      },
    }),
  ],

  secret: process.env.AUTH_SECRET,

  callbacks: {
    jwt({ token, user }) {
      // `user` is available during sign-in. Persist the custom user
      // fields on the JWT so they remain available on subsequent requests.
      if (user) {
        token.role = user.role as UserRole;
        token.subtitle = user.subtitle as string;
        token.initials = user.initials as string;
      }

      return token;
    },

    session({ session, token }) {
      // Expose the custom JWT fields on `session.user` for consumers
      // calling `auth()` or accessing the session.
      session.user.role = token.role as UserRole;
      session.user.subtitle = token.subtitle as string;
      session.user.initials = token.initials as string;

      return session;
    },
  },
});
