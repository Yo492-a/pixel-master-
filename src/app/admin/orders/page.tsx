"use client";
import { useEffect, useState } from "react";

const LABELS: Record<string, string> = {
  AWAITING_PAYMENT: "بانتظار الدفع",
  PAYMENT_UNDER_REVIEW: "الدفع قيد المراجعة",
  PAYMENT_CONFIRMED: "تم تأكيد الدفع",
  IN_PROGRESS: "قيد التنفيذ",
  READY_FOR_DELIVERY: "جاهز للتسليم",
  COMPLETED: "مكتمل",
  REJECTED: "مرفوض",
  CANCELLED: "ملغى",
};

type Order = {
  id: string;
  orderNumber: number;
  status: string;
  price: string;
  notes: string | null;
  createdAt: string;
  customer: { name: string; phone: string; telegram: string | null };
};

const API = "/api/admin/orders";

function Card({ o, onChange }: { o: Order; onChange: () => void }) {
  const [status, setStatus] = useState(o.status);
  const [price, setPrice] = useState(o.price);
  const [msg, setMsg] = useState("");

  async function save() {
    setMsg("");
    const r = await fetch(`${API}?id=${o.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, price }),
    });
    if (!r.ok) setMsg((await r.json()).error || "صار خطأ");
    else {
      setMsg("تم الحفظ");
      onChange();
    }
  }

  async function remove() {
    if (!confirm("متأكد من حذف الطلب؟")) return;
    await fetch(`${API}?id=${o.id}`, { method: "DELETE" });
    onChange();
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/pay/${o.id}`);
      setMsg("تم نسخ رابط الدفع");
    } catch {
      setMsg("ما قدرت أنسخ الرابط");
    }
  }

  return (
    <li className="rounded-xl bg-white/5 p-4">
      <div className="flex items-center justify-between">
        <b>طلب #{o.orderNumber}</b>
        <small className="text-gray-400">
          {new Date(o.createdAt).toLocaleString("ar")}
        </small>
      </div>
      <div className="mt-2 text-sm">
        {o.customer.name} ·{" "}
        <a href={`tel:${o.customer.phone}`} className="text-blue-400">
          {o.customer.phone}
        </a>
        {o.customer.telegram && <> · {o.customer.telegram}</>}
      </div>
      {o.notes && (
        <p className="mt-2 whitespace-pre-line rounded bg-white/5 p-2 text-sm text-gray-300">
          {o.notes}
        </p>
      )}
      <div className="mt-3 flex gap-2">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="flex-1 rounded bg-white/10 p-2"
        >
          {Object.entries(LABELS).map(([k, v]) => (
            <option key={k} value={k} className="text-black">
              {v}
            </option>
          ))}
        </select>
        <input
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          inputMode="decimal"
          placeholder="السعر"
          className="w-24 rounded bg-white/10 p-2"
        />
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-4">
        <button onClick={save} className="rounded bg-blue-600 px-4 py-1">
          حفظ
        </button>
        <button onClick={copyLink} className="text-blue-400">
          نسخ رابط الدفع
        </button>
        <button onClick={remove} className="text-red-400">
          حذف
        </button>
        {msg && <small className="text-gray-400">{msg}</small>}
      </div>
    </li>
  );
}

export default function AdminOrdersPage() {
  const [items, setItems] = useState<Order[]>([]);
  const [msg, setMsg] = useState("");

  async function load() {
    const r = await fetch(API);
    if (r.ok) setItems(await r.json());
    else setMsg("ما قدرت أجيب الطلبات، تأكد إنك مسجل دخول كمدير");
  }
  useEffect(() => {
    load();
  }, []);

  return (
    <main dir="rtl" className="mx-auto max-w-xl p-4 text-white">
      <h1 className="mb-4 text-2xl font-bold">الطلبات</h1>
      {msg && <p className="mb-3 rounded bg-red-500/20 p-2 text-sm">{msg}</p>}
      {items.length === 0 && !msg && (
        <p className="text-gray-400">ما في طلبات لسا.</p>
      )}
      <ul className="space-y-3">
        {items.map((o) => (
          <Card key={`${o.id}-${o.status}-${o.price}`} o={o} onChange={load} />
        ))}
      </ul>
    </main>
  );
}
