import Link from "next/link";
import { Button } from "@/components/shared/ui/button";
import { Card } from "@/components/shared/ui/card";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <Card className="w-full max-w-lg p-8 text-center md:p-10">
        <p className="text-muted-foreground font-mono text-xs tracking-[0.2em]">404</p>
        <h1 className="font-display text-foreground mt-3 text-3xl font-semibold">Page not found</h1>
        <p className="text-muted-foreground mx-auto mt-3 max-w-md text-sm leading-6">
          The page you requested does not exist or may have moved.
        </p>
        <div className="mt-7">
          <Button asChild>
            <Link href="/">Return home</Link>
          </Button>
        </div>
      </Card>
    </main>
  );
}
