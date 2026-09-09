/**
 * Module augmentation for Auth.js. Extends the built-in User/Session/JWT
 * shapes with the fields Raiquid actually needs — role plus the two
 * SessionUser display fields (subtitle, initials) — so `session.user.role`
 * is typed everywhere instead of `any`.
 */
import type { DefaultSession } from "next-auth";
import type { UserRole } from "@/types";

declare module "next-auth" {
  interface User {
    role: UserRole;
    subtitle: string;
    initials: string;
  }

  interface Session {
    user: {
      role: UserRole;
      subtitle: string;
      initials: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: UserRole;
    subtitle: string;
    initials: string;
  }
}
