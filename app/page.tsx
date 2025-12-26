"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Home() {
  const router = useRouter();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-4">
      <div className="space-y-4 text-center">
        <h1 className="font-bold text-4xl tracking-tight">Welcome to Kinyx</h1>
        <p className="text-lg text-muted-foreground">
          Get started by creating an account or signing in
        </p>
      </div>
      <div className="flex gap-4">
        <Button onClick={() => router.push("/sign-up")} size="lg">
          Sign Up
        </Button>
        <Button
          onClick={() => router.push("/sign-in")}
          size="lg"
          variant="outline"
        >
          Sign In
        </Button>
      </div>
    </main>
  );
}
