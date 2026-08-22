"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-void">
        <p className="text-ink">جاري التحميل...</p>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-void">
      {/* Header */}
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <h1 className="font-display text-2xl font-bold text-ink">
            PIXEL Master
          </h1>
          <button
            onClick={() => signOut({ redirect: true, callbackUrl: "/login" })}
            className="rounded-full bg-electric px-6 py-2 text-sm font-semibold text-ink hover:brightness-110"
          >
            تسجيل خروج
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-8">
          <h2 className="font-display text-3xl font-bold text-ink">
            أهلاً، {session.user?.name || "مدير"}
          </h2>
          <p className="mt-2 text-silver">
            مرحباً بك في لوحة تحكم PIXEL Master
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-12">
          <div className="rounded-2xl border border-line bg-surface p-6">
            <p className="text-sm text-silver">الأعمال المنشورة</p>
            <p className="mt-2 font-display text-3xl font-bold text-neon">0</p>
          </div>
          <div className="rounded-2xl border border-line bg-surface p-6">
            <p className="text-sm text-silver">الطلبات الجديدة</p>
            <p className="mt-2 font-display text-3xl font-bold text-neon">0</p>
          </div>
          <div className="rounded-2xl border border-line bg-surface p-6">
            <p className="text-sm text-silver">الإجمالي المتوقع</p>
            <p className="mt-2 font-display text-3xl font-bold text-neon">$0</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h3 className="font-display text-xl font-bold text-ink">
            الإجراءات السريعة
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <button className="rounded-2xl border border-line bg-surface p-6 text-left transition hover:border-neon hover:shadow-glowSm">
              <p className="font-semibold text-ink">+ إضافة عمل جديد</p>
              <p className="mt-1 text-sm text-silver">رفع صورة أو فيديو جديد</p>
            </button>
            <button className="rounded-2xl border border-line bg-surface p-6 text-left transition hover:border-neon hover:shadow-glowSm">
              <p className="font-semibold text-ink">عرض الطلبات</p>
              <p className="mt-1 text-sm text-silver">إدارة طلبات العملاء</p>
            </button>
            <button className="rounded-2xl border border-line bg-surface p-6 text-left transition hover:border-neon hover:shadow-glowSm">
              <p className="font-semibold text-ink">إعدادات الموقع</p>
              <p className="mt-1 text-sm text-silver">تعديل النصوص والأسعار</p>
            </button>
            <button className="rounded-2xl border border-line bg-surface p-6 text-left transition hover:border-neon hover:shadow-glowSm">
              <p className="font-semibold text-ink">إدارة الدفع</p>
              <p className="mt-1 text-sm text-silver">طرق الدفع والحسابات</p>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
