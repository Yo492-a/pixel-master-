"use client";
import { useEffect, useState } from "react";

type Cat = { id: string; name: string };
type Work = {
  id: string;
  title: string;
  kind: "IMAGE" | "VIDEO";
  status: "PUBLISHED" | "HIDDEN";
  category: { name: string };
  previewMedia: { url: string };
};

export default function AdminWorksPage() {
  const [cats, setCats] = useState<Cat[]>([]);
  const [works, setWorks] = useState<Work[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [price, setPrice] = useState("");
  const [publish, setPublish] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [fileKey, setFileKey] = useState(0);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function load() {
    const [c, w] = await Promise.all([
      fetch("/api/admin/categories"),
      fetch("/api/admin/works"),
    ]);
    if (c.ok) {
      const list: Cat[] = await c.json();
      setCats(list);
      setCategoryId((cur) => cur || list[0]?.id || "");
    }
    if (w.ok) setWorks(await w.json());
  }
  useEffect(() => {
    load();
  }, []);

  async function submit() {
    setMsg("");
    if (!title.trim() || !file || !categoryId) {
      setMsg("اكتب العنوان، اختر التصنيف، واختر ملف");
      return;
    }
    setBusy(true);
    try {
      const sRes = await fetch("/api/admin/upload-signature");
      if (!sRes.ok) throw new Error((await sRes.json()).error || "فشل التوقيع");
      const s = await sRes.json();

      const fd = new FormData();
      fd.append("file", file);
      fd.append("api_key", s.apiKey);
      fd.append("timestamp", String(s.timestamp));
      fd.append("signature", s.signature);
      fd.append("folder", s.folder);
      const up = await fetch(
        `https://api.cloudinary.com/v1_1/${s.cloudName}/auto/upload`,
        { method: "POST", body: fd }
      );
      const u = await up.json();
      if (!up.ok) throw new Error(u.error?.message || "فشل رفع الملف");

      const r = await fetch("/api/admin/works", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          categoryId,
          price,
          status: publish ? "PUBLISHED" : "HIDDEN",
          kind: u.resource_type === "video" ? "VIDEO" : "IMAGE",
          url: u.secure_url,
          width: u.width,
          height: u.height,
          sizeBytes: u.bytes,
          originalName: u.original_filename,
        }),
      });
      if (!r.ok) throw new Error((await r.json()).error || "فشل الحفظ");

      setTitle("");
      setDescription("");
      setPrice("");
      setFile(null);
      setFileKey((k) => k + 1);
      await load();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "صار خطأ");
    }
    setBusy(false);
  }

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

  const input = "w-full rounded bg-white/10 p-2";

  return (
    <main dir="rtl" className="mx-auto max-w-xl p-4 text-white">
      <h1 className="mb-4 text-2xl font-bold">إدارة الأعمال</h1>

      <div className="mb-6 space-y-2 rounded bg-white/5 p-3">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="عنوان العمل" className={input} />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="وصف (اختياري)" className={input} rows={3} />
        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className={input}>
          {cats.map((c) => (
            <option key={c.id} value={c.id} className="text-black">{c.name}</option>
          ))}
        </select>
        <input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="السعر (اختياري)" inputMode="decimal" className={input} />
        <input key={fileKey} type="file" accept="image/*,video/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className={input} />
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={publish} onChange={(e) => setPublish(e.target.checked)} />
          نشر مباشرة على الموقع
        </label>
        <button onClick={submit} disabled={busy} className="w-full rounded bg-blue-600 p-2 disabled:opacity-50">
          {busy ? "جاري الرفع..." : "إضافة العمل"}
        </button>
      </div>

      {msg && <p className="mb-3 rounded bg-red-500/20 p-2 text-sm">{msg}</p>}

      <ul className="space-y-2">
        {works.map((w) => (
          <li key={w.id} className="flex items-center gap-3 rounded bg-white/5 p-3">
            {w.kind === "IMAGE" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={w.previewMedia.url} alt="" className="h-14 w-14 rounded object-cover" />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded bg-white/10 text-xs">فيديو</div>
            )}
            <div className="flex-1">
              <div>{w.title}</div>
              <small className="text-gray-400">
                {w.category.name} · {w.status === "PUBLISHED" ? "منشور" : "مخفي"}
              </small>
            </div>
            <button
              onClick={() => call(`/api/admin/works?id=${w.id}`, "PATCH", { status: w.status === "PUBLISHED" ? "HIDDEN" : "PUBLISHED" })}
              className="text-blue-400"
            >
              {w.status === "PUBLISHED" ? "إخفاء" : "نشر"}
            </button>
            <button
              onClick={() => confirm("متأكد من الحذف؟") && call(`/api/admin/works?id=${w.id}`, "DELETE")}
              className="text-red-400"
            >
              حذف
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
  }
