import { z } from "zod";

/**
 * Single source of truth for environment variables. Import `env` from
 * here instead of reading `process.env.X` directly anywhere else in the
 * codebase — that way a missing/misnamed variable fails loudly at boot
 * instead of silently as `undefined` deep in a component.
 *
 * Add a new variable in exactly two places: the schema below, and
 * .env.example (with a placeholder value + comment).
 */
const envSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  // NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL: z.string().url(),
  // BRICKKEN_API_KEY: z.string().min(1),
  // DATABASE_URL: z.string().url(),
});

export const env = envSchema.parse({
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
});
