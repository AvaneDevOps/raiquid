import type { UserRole } from "@/types";

declare global {
  interface UserUnsafeMetadata {
    role: UserRole;
  }
}

export {};
