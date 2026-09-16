"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { ArrowLeft, Box, Search, ShieldCheck } from "lucide-react";
import { DesignThumb } from "@/components/commerce/DesignThumb";
import { OrderTimeline } from "@/components/orders/OrderTimeline";
import { getMaterial } from "@/data/catalog";
import { formatCurrency, formatDate } from "@/lib/format";
import { getProductionLabel, getStatusLabel } from "@/lib/orders/status";
import { useAppStore } from "@/store/useAppStore";

export function TrackView() {
  const orders = useAppStore((state) => state.orders);
  const hasHydrated = useAppStore((state) => state.hasHydrated);
  const [query, setQuery] = useState("");
  const [resultId, setResultId] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const order = orders.find((item) => item.id === resultId);
  const submit = (event: FormEvent) => {
    event.preventDefault();
    const normalized = query.trim().toUpperCase();
    const match = orders.find((item) => item.number.toUpperCase() === normalized || item.id === query.trim());
    setResultId(match?.id ?? null);
    setSearched(true);
  };
  const fillDemo = () => { setQuery("GH-2609-1042"); const match = orders.find((item) => item.number === "GH-2609-1042"); setResultId(match?.id ?? null); setSearched(true); };
  return <div className="track-page"><section className="track-hero"><div className="shell"><span><Box size={17} /> أين وصل بوكسك؟</span><h1>تتبع الطلب خطوة بخطوة</h1><p>أدخل رقم الطلب لتعرف مرحلة المراجعة والإنتاج والشحن الحالية.</p><form onSubmit={submit}><div><Search size={20} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="مثال: GH-2609-1042" dir="ltr" aria-label="رقم الطلب" /></div><button className="button primary large" type="submit">تتبع الطلب <ArrowLeft size={18} /></button></form><button type="button" className="demo-track" onClick={fillDemo}>استخدم رقم الطلب التجريبي: <b dir="ltr">GH-2609-1042</b></button></div></section><section className="shell track-results">{!searched && <div className="track-placeholder"><Search size={30} /><h2>جاهز للبحث</h2><p>ستظهر لك مراحل الطلب كاملة هنا.</p></div>}{searched && !order && <div className="track-placeholder is-error"><Search size={30} /><h2>لم نعثر على الطلب</h2><p>تأكد من كتابة الرقم كما يظهر في صفحة التأكيد، بما في ذلك الشرطات.</p></div>}{order && (() => { const first = order.items[0]; const material = getMaterial(first.design.materialId); return <div className="track-card"><div className="track-card-top"><div><span>الطلب</span><h2>{order.number}</h2><p>أُنشئ في {formatDate(order.createdAt)}</p></div><em className={`status-pill status-${order.status}`}>{getStatusLabel(order.status, material.family)}</em></div><div className="track-grid"><div><OrderTimeline order={order} /></div><aside><DesignThumb design={first.design} /><h3>{first.design.name}</h3><p>{material.name} · {first.design.quantity} بوكس</p><dl><div><dt>طريقة الإنتاج</dt><dd>{getProductionLabel(material.family)}</dd></div><div><dt>التوصيل المتوقع</dt><dd>{formatDate(order.estimatedDelivery)}</dd></div><div><dt>الإجمالي</dt><dd>{formatCurrency(order.total)}</dd></div></dl><Link href={`/account/orders/${order.id}`} className="button secondary full-width">التفاصيل الكاملة</Link></aside></div></div>; })()}</section><div className="shell track-trust"><ShieldCheck size={20} /><span><b>معلومة مهمة</b><small>حالة «قيد الإنتاج» تتغير إلى «قيد الطباعة» للورق و«قيد الحفر بالليزر» للخشب والجلد.</small></span></div>{!hasHydrated && <div className="track-loading" />}</div>;
}
