"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading" || !session) return null;

  return (
    <div className="min-h-screen bg-void">
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <h1 className="text-xl font-bold text-ink">لوحة الإدارة</h1>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="rounded-full bg-electric px-4 py-2 text-sm text-ink"
          >
            خروج
          </button>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-12">
        <h2 className="text-2xl font-bold text-ink">مرحبا {session.user?.name}</h2>
        <p className="mt-2 text-silver">لوحة الإدارة</p>
      </main>
    </div>
  );
}
