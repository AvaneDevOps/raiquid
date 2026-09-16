<<<<<<< HEAD
import type { UserRole } from "@/types";

declare global {
  interface UserUnsafeMetadata {
    role: UserRole;
=======
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
>>>>>>> 126c1250105090cfeb3f5a136297e976271e7075
  }
}

export {};
