"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/auth";
import { signOut } from "@/auth";
import { findDemoAccount, ROLE_HOME } from "@/lib/demo-accounts";

export async function authenticate(
  _prevState: string | undefined,
  formData: FormData,
): Promise<string | undefined> {
  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof email !== "string" || typeof password !== "string" || !email || !password) {
    return "Enter an email and password.";
  }

  const account = findDemoAccount(email, password);
  if (!account) {
    return "Incorrect email or password.";
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: ROLE_HOME[account.role],
    });
  } catch (error) {
    // signIn() redirects internally on success by throwing a special
    // NEXT_REDIRECT error — only swallow real auth failures here and let
    // anything else (including that redirect) propagate.
    if (error instanceof AuthError) {
      return "Incorrect email or password.";
    }
    throw error;
  }
}

export async function handleSignOut() {
  await signOut({ redirectTo: "/auth" });
}
