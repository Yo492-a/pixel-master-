import Link from "next/link";

const items = [
  { href: "/admin/orders", title: "الطلبات", desc: "طلبات الزبائن، تغيير الحالة وتحديد السعر" },
  { href: "/admin/works", title: "الأعمال", desc: "رفع صور وفيديوهات، نشر وإخفاء وحذف" },
  { href: "/admin/categories", title: "التصنيفات", desc: "إضافة وتعديل وترتيب التصنيفات" },
  { href: "/", title: "عرض الموقع", desc: "شاهد الموقع كما يراه الزوار" },
];

export default function AdminHome() {
  return (
    <main dir="rtl" className="mx-auto max-w-xl p-4 text-white">
      <h1 className="mb-6 text-2xl font-bold">لوحة الإدارة</h1>
      <div className="space-y-3">
        {items.map((i) => (
          <Link
            key={i.href}
            href={i.href}
            className="block rounded-xl bg-white/5 p-4 transition hover:bg-white/10"
          >
            <div className="text-lg font-semibold">{i.title}</div>
            <div className="mt-1 text-sm text-gray-400">{i.desc}</div>
          </Link>
        ))}
      </div>
    </main>
  );
}
