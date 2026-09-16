"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { DesignThumb } from "@/components/commerce/DesignThumb";
import { EmptyState } from "@/components/commerce/EmptyState";
import { getMaterial } from "@/data/catalog";
import { formatCurrency, formatDate } from "@/lib/format";
import { getStatusLabel } from "@/lib/orders/status";
import { useAppStore } from "@/store/useAppStore";

export function OrdersView() {
  const orders = useAppStore((state) => state.orders);
  if (!orders.length) return <EmptyState title="لا توجد طلبات حتى الآن" text="بعد إتمام أول طلب ستتمكن من متابعة جميع مراحله من هنا." />;
  return <><div className="account-heading"><div><span>حسابي / طلباتي</span><h1>طلباتي</h1><p>تابع الإنتاج، فحص الجودة والشحن في مكان واحد.</p></div></div><div className="orders-list">{orders.map((order) => { const first = order.items[0]; const family = getMaterial(first.design.materialId).family; return <article key={order.id} className="order-card"><div className="order-card-top"><div><span>رقم الطلب</span><b>{order.number}</b><small>{formatDate(order.createdAt)}</small></div><em className={`status-pill status-${order.status}`}>{getStatusLabel(order.status, family)}</em></div><div className="order-card-main"><DesignThumb design={first.design} /><div><h2>{first.design.name}</h2><p>{first.design.quantity} بوكس · {getMaterial(first.design.materialId).name}</p><small>{order.items.length > 1 ? `+ ${order.items.length - 1} تصاميم أخرى` : "تصميم واحد"}</small></div><strong>{formatCurrency(order.total)}</strong></div><div className="order-card-bottom"><span>التوصيل المتوقع: {formatDate(order.estimatedDelivery)}</span><Link href={`/account/orders/${order.id}`}>تفاصيل وتتبع الطلب <ArrowLeft size={16} /></Link></div></article>; })}</div></>;
}
