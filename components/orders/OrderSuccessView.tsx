"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, CalendarDays, Check, MapPin, PackageCheck } from "lucide-react";
import { DesignThumb } from "@/components/commerce/DesignThumb";
import { EmptyState } from "@/components/commerce/EmptyState";
import { getMaterial } from "@/data/catalog";
import { formatCurrency, formatDate } from "@/lib/format";
import { getProductionLabel } from "@/lib/orders/status";
import { useAppStore } from "@/store/useAppStore";

export function OrderSuccessView() {
  const params = useParams<{ orderId: string }>();
  const order = useAppStore((state) => state.orders.find((item) => item.id === params.orderId));
  const hasHydrated = useAppStore((state) => state.hasHydrated);
  if (!hasHydrated) return <div className="page-loading-skeleton" />;
  if (!order) return <div className="shell success-shell"><EmptyState title="لم نعثر على الطلب" text="قد يكون الرابط قديمًا. افتح طلباتك للعثور على آخر طلب." href="/account/orders" action="عرض طلباتي" /></div>;
  const first = order.items[0]; const material = getMaterial(first.design.materialId);
  return <div className="shell success-shell"><div className="success-mark"><span><Check size={34} /></span><i /><i /></div><span className="success-kicker">تم استلام طلبك بنجاح</span><h1>بوكسك دخل مرحلة المراجعة</h1><p>سنراجع وضوح التصميم والمساحة الآمنة، ثم نبدأ {material.family === "paper" ? "الطباعة" : "الحفر بالليزر"}.</p><div className="success-order-number"><span>رقم الطلب</span><b>{order.number}</b><small>احتفظ به لتتبع الطلب</small></div><div className="success-grid"><div className="success-product"><DesignThumb design={first.design} /><div><span>{getProductionLabel(material.family)}</span><h2>{first.design.name}</h2><p>{material.name} · {first.design.quantity} بوكس</p></div></div><div className="success-facts"><div><CalendarDays size={20} /><span><b>الوصول المتوقع</b><small>{formatDate(order.estimatedDelivery)}</small></span></div><div><MapPin size={20} /><span><b>التوصيل إلى</b><small>{order.address.city}، {order.address.district}</small></span></div><div><PackageCheck size={20} /><span><b>إجمالي الطلب</b><small>{formatCurrency(order.total)}</small></span></div></div></div><div className="success-actions"><Link href={`/account/orders/${order.id}`} className="button primary large">تتبع الطلب <ArrowLeft size={18} /></Link><Link href="/design" className="button secondary large">تصميم بوكس آخر</Link></div><p className="success-note">هذا طلب تجريبي محفوظ على هذا المتصفح، ولا توجد عملية دفع أو تصنيع حقيقية.</p></div>;
}
