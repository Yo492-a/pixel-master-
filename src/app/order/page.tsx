"use client";
import Link from "next/link";
import { useState } from "react";

const field =
  "w-full rounded-xl border border-line bg-surface px-4 py-3 text-ink placeholder:text-silver outline-none focus:border-neon";

export default function OrderPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [telegram, setTelegram] = useState("");
  const [notes, setNotes] = useState("");
  const [website, setWebsite] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [done, setDone] = useState<number | null>(null);

  async function submit() {
    setMsg("");
    setBusy(true);
    try {
      const r = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone: phone.replace(/[\s-]/g, ""),
          telegram,
          notes,
          website,
        }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "صار خطأ");
      setDone(j.orderNumber ?? 0);
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "صار خطأ");
    }
    setBusy(false);
  }

  if (done !== null) {
    return (
      <main dir="rtl" className="px-6 py-20 text-center">
        <div className="mx-auto max-w-md">
          <h1 className="font-display text-3xl font-600 text-ink">
            تم استلام طلبك
          </h1>
          {done > 0 && (
            <p className="mt-4 text-neon">رقم الطلب: #{done}</p>
          )}
          <p className="mt-4 text-silver">
            رح نتواصل معك على رقم هاتفك لتأكيد التفاصيل والسعر وطريقة الدفع.
          </p>
          <Link href="/" className="mt-8 inline-block text-sm text-neon hover:underline">
            ← الرجوع للرئيسية
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main dir="rtl" className="px-6 py-14">
      <div className="mx-auto max-w-xl">
        <h1 className="font-display text-2xl font-600 text-ink sm:text-3xl">
          اطلب تصميمك
        </h1>
        <p className="mt-2 text-sm text-silver">
          اكتب تفاصيل طلبك وبنتواصل معك بأسرع وقت.
        </p>

        <div className="mt-8 space-y-3">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="الاسم" className={field} />
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="رقم الهاتف" inputMode="tel" className={field} />
          <input value={telegram} onChange={(e) => setTelegram(e.target.value)} placeholder="معرّف تيليغرام (اختياري)" className={field} />
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="شو بدك نصمّملك؟ اكتب كل التفاصيل" rows={6} className={field} />
          <input
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="absolute -left-[9999px] h-0 w-0 opacity-0"
          />
          {msg && <p className="rounded-xl bg-red-500/20 p-3 text-sm text-ink">{msg}</p>}
          <button
            onClick={submit}
            disabled={busy}
            className="w-full rounded-full bg-electric px-7 py-3 text-sm font-semibold text-ink shadow-glow transition hover:brightness-110 disabled:opacity-50"
          >
            {busy ? "جاري الإرسال..." : "إرسال الطلب"}
          </button>
        </div>
      </div>
    </main>
  );
}
