"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowRight, CalendarDays, CreditCard, MapPin, PackageCheck, Truck } from "lucide-react";
import { DesignThumb } from "@/components/commerce/DesignThumb";
import { EmptyState } from "@/components/commerce/EmptyState";
import { OrderTimeline } from "@/components/orders/OrderTimeline";
import { getBox, getMaterial, getTemplate } from "@/data/catalog";
import { formatCurrency, formatDate } from "@/lib/format";
import { getProductionLabel } from "@/lib/orders/status";
import { useAppStore } from "@/store/useAppStore";

export function OrderDetailView() {
  const params = useParams<{ orderId: string }>();
  const orders = useAppStore((state) => state.orders);
  const hasHydrated = useAppStore((state) => state.hasHydrated);
  const order = orders.find((item) => item.id === params.orderId || item.number === params.orderId);
  if (!hasHydrated) return <div className="page-loading-skeleton" />;
  if (!order) return <EmptyState title="لم نعثر على هذا الطلب" text="تأكد من رابط الطلب أو ارجع إلى قائمة طلباتك." href="/account/orders" action="عرض طلباتي" />;
  return <><Link href="/account/orders" className="back-link"><ArrowRight size={17} /> العودة للطلبات</Link><div className="order-detail-heading"><div><span>طلب {order.number}</span><h1>تفاصيل وتتبع الطلب</h1><p>تم إنشاء الطلب في {formatDate(order.createdAt)}</p></div><strong>{formatCurrency(order.total)}</strong></div><div className="order-detail-grid"><section><article className="detail-card"><div className="detail-card-title"><PackageCheck size={20} /><div><h2>حالة الطلب</h2><p>تتحدث المرحلة تلقائيًا بحسب طريقة الإنتاج.</p></div></div><OrderTimeline order={order} /></article><article className="detail-card"><div className="detail-card-title"><PackageCheck size={20} /><div><h2>محتويات الطلب</h2><p>{order.items.length} {order.items.length === 1 ? "تصميم" : "تصاميم"}</p></div></div><div className="order-products">{order.items.map((item) => { const box = getBox(item.design.boxId); const material = getMaterial(item.design.materialId); const template = getTemplate(item.design.templateId); return <div key={item.id}><DesignThumb design={item.design} /><div><h3>{item.design.name}</h3><p>{box.name} · {material.name}</p><dl><span>الإنتاج: <b>{getProductionLabel(material.family)}</b></span><span>القالب: <b>{template.concept}</b></span><span>الكمية: <b>{item.design.quantity}</b></span></dl></div><strong>{formatCurrency(item.price.total)}</strong></div>; })}</div></article></section><aside><article className="detail-card compact-card"><div className="detail-card-title"><MapPin size={19} /><div><h2>عنوان التوصيل</h2></div></div><b>{order.address.recipient}</b><p>{order.address.city}، {order.address.district}<br />{order.address.street}، مبنى {order.address.building}<br /><span dir="ltr">{order.address.mobile}</span></p></article><article className="detail-card compact-card"><div className="detail-card-title"><Truck size={19} /><div><h2>التوصيل</h2></div></div><p>{order.deliveryMethod === "express" ? "توصيل سريع" : "توصيل عادي"}</p><span><CalendarDays size={16} /> المتوقع: {formatDate(order.estimatedDelivery)}</span></article><article className="detail-card compact-card"><div className="detail-card-title"><CreditCard size={19} /><div><h2>الدفع</h2></div></div><p>{order.paymentMethod === "mada" ? "مدى" : order.paymentMethod === "apple-pay" ? "Apple Pay" : "بطاقة ائتمانية"}</p><span>مدفوع تجريبيًا · {formatCurrency(order.total)}</span></article></aside></div></>;
}
