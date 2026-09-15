"use client";

import Link from "next/link";
import { Button } from "@/components/shared/ui/button";
import { Card } from "@/components/shared/ui/card";

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <Card className="w-full max-w-lg p-8 text-center md:p-10">
        <p className="text-muted-foreground font-mono text-xs tracking-[0.2em]">ERROR</p>
        <h1 className="font-display text-foreground mt-3 text-3xl font-semibold">
          Something went wrong
        </h1>
        <p className="text-muted-foreground mx-auto mt-3 max-w-md text-sm leading-6">
          Raiquid could not complete that request. Try again, or return to your dashboard if the
          problem continues.
        </p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Button onClick={reset}>Try again</Button>
          <Button asChild variant="secondary">
            <Link href="/">Return home</Link>
          </Button>
        </div>
      </Card>
    </main>
  );
}
