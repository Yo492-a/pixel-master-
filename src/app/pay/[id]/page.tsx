"use client";
import { useEffect, useState, type ReactNode } from "react";

type Method = {
  id: string;
  name: string;
  accountNumber: string;
  instructions: string;
  qrUrl: string | null;
};
type Data = {
  orderNumber: number;
  price: string;
  status: string;
  methods: Method[];
};

const STATUS_TEXT: Record<string, string> = {
  PAYMENT_UNDER_REVIEW: "وصلنا تأكيد الدفع وهو قيد المراجعة، رح نتواصل معك قريباً.",
  PAYMENT_CONFIRMED: "تم تأكيد الدفع. شكراً لك!",
  IN_PROGRESS: "تم تأكيد الدفع وطلبك قيد التنفيذ.",
  READY_FOR_DELIVERY: "طلبك جاهز للتسليم، رح نتواصل معك.",
  COMPLETED: "طلبك مكتمل. شكراً لثقتك!",
  REJECTED: "تم رفض هذا الطلب. تواصل معنا لمعرفة التفاصيل.",
  CANCELLED: "تم إلغاء هذا الطلب.",
};

const field =
  "w-full rounded-xl border border-line bg-surface px-4 py-3 text-ink placeholder:text-silver outline-none focus:border-neon";

function Step({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <section className="mt-8">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-line bg-surface font-mono text-sm text-neon">
          {n}
        </span>
        <h2 className="text-lg font-semibold text-ink">{title}</h2>
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export default function PayPage({ params }: { params: { id: string } }) {
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [txn, setTxn] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [copied, setCopied] = useState(false);

  async function load() {
    const r = await fetch(`/api/pay/${params.id}`);
    const j = await r.json();
    if (!r.ok) {
      setError(j.error || "صار خطأ");
      return;
    }
    setData(j);
    if (j.methods.length === 1) setSelectedId((cur: string) => cur || j.methods[0].id);
  }
  useEffect(() => {
    load();
    // eslint-disable-next-line react-h
