"use client";
import { useEffect, useState } from "react";

type Cat = {
  id: string;
  name: string;
  slug: string;
  order: number;
  _count: { works: number };
};
const API = "/api/admin/categories";

export default function CategoriesPage() {
  const [items, setItems] = useState<Cat[]>([]);
  const [name, setName] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [msg, setMsg] = useState("");

  async function load() {
    const r = await fetch(API);
    if (r.ok) setItems(await r.json());
    else setMsg("ما قدرت أجيب التصنيفات، تأكد إنك مسجل دخول كمدير");
  }
  useEffect(() => {
    load();
  }, []);

  async function call(url: string, method: string, body?: object) {
    setMsg("");
    const r = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!r.ok) setMsg((await r.json()).error || "صار خطأ");
    await load();
  }

  return (
    <main dir="rtl" className="mx-auto max-w-xl p-4 text-white">
      <h1 className="mb-4 text-2xl font-bold">إدارة التصنيفات</h1>

      <div className="mb-4 flex gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="اسم التصنيف الجديد"
          className="flex-1 rounded bg-white/10 p-2"
        />
        <button
          onClick={async () => {
            await call(API, "POST", { name });
            setName("");
          }}
          className="rounded bg-blue-600 px-4"
        >
          إضافة
        </button>
      </div>

      {msg && <p className="mb-3 rounded bg-red-500/20 p-2 text-sm">{msg}</p>}

      <ul className="space-y-2">
        {items.map((c, i) => (
          <li key={c.id} className="flex items-center gap-2 rounded bg-white/5 p-3">
            {editId === c.id ? (
              <>
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="flex-1 rounded bg-white/10 p-1"
                />
                <button
                  onClick={async () => {
                    await call(`${API}?id=${c.id}`, "PATCH", { name: editName });
                    setEditId(null);
                  }}
                  className="text-green-400"
                >
                  حفظ
                </button>
                <button onClick={() => setEditId(null)} className="text-gray-400">
                  إلغاء
                </button>
              </>
            ) : (
              <>
                <span className="flex-1">
                  {c.name}{" "}
                  <small className="text-gray-400">({c._count.works})</small>
                </span>
                <button
                  disabled={i === 0}
                  onClick={() =>
                    call(`${API}?id=${c.id}`, "PATCH", { order: items[i - 1].order - 1 })
                  }
                  className="disabled:opacity-30"
                >
                  ↑
                </button>
                <button
                  disabled={i === items.length - 1}
                  onClick={() =>
                    call(`${API}?id=${c.id}`, "PATCH", { order: items[i + 1].order + 1 })
                  }
                  className="disabled:opacity-30"
                >
                  ↓
                </button>
                <button
                  onClick={() => {
                    setEditId(c.id);
                    setEditName(c.name);
                  }}
                  className="text-blue-400"
                >
                  تعديل
                </button>
                <button
                  onClick={() =>
                    confirm("متأكد من الحذف؟") &&
                    call(`${API}?id=${c.id}`, "DELETE")
                  }
                  className="text-red-400"
                >
                  حذف
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
      }
