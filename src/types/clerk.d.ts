/**
 * Clerk metadata keys used by Raiquid — `role` drives route-guard
 * redirects in getSessionUser(), `subtitle` feeds the UserSummary slot.
 */
import type { UserRole } from "@/types";

declare global {
  interface UserPublicMetadata {
    role?: UserRole;
    subtitle?: string;
  }

  interface UserUnsafeMetadata {
    role?: UserRole;
    subtitle?: string;
  }
}

export {};
