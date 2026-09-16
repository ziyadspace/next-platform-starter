"use client";

import Link from "next/link";
import { ArrowLeft, Box, ClipboardList, MapPin, Palette, Plus } from "lucide-react";
import { DesignThumb } from "@/components/commerce/DesignThumb";
import { getMaterial } from "@/data/catalog";
import { formatCurrency, formatDate } from "@/lib/format";
import { getStatusLabel } from "@/lib/orders/status";
import { useAppStore } from "@/store/useAppStore";

export function AccountDashboard() {
  const session = useAppStore((state) => state.session);
  const orders = useAppStore((state) => state.orders);
  const designs = useAppStore((state) => state.savedDesigns);
  const addresses = useAppStore((state) => state.addresses);
  const resetDemo = useAppStore((state) => state.resetDemo);
  return <><div className="account-heading"><div><span>حسابي</span><h1>أهلًا، {session?.fullName.split(" ")[0]}</h1><p>كل تصاميمك وطلباتك محفوظة هنا.</p></div><Link href="/design" className="button primary"><Plus size={17} /> تصميم جديد</Link></div><div className="stats-grid"><article><span><ClipboardList /></span><div><b>{orders.length}</b><small>إجمالي الطلبات</small></div></article><article><span><Palette /></span><div><b>{designs.length}</b><small>تصاميم محفوظة</small></div></article><article><span><MapPin /></span><div><b>{addresses.length}</b><small>عناوين محفوظة</small></div></article><article><span><Box /></span><div><b>{orders.reduce((sum, order) => sum + order.items.reduce((itemsSum, item) => itemsSum + item.design.quantity, 0), 0)}</b><small>بوكس تم طلبه</small></div></article></div>
    <div className="dashboard-section"><div className="section-mini-heading"><div><h2>أحدث الطلبات</h2><p>تابع مرحلة الإنتاج والتوصيل.</p></div><Link href="/account/orders">عرض الكل <ArrowLeft size={16} /></Link></div><div className="orders-table">{orders.slice(0, 3).map((order) => { const family = getMaterial(order.items[0].design.materialId).family; return <Link href={`/account/orders/${order.id}`} key={order.id} className="order-row"><DesignThumb design={order.items[0].design} small /><span><b>{order.number}</b><small>{formatDate(order.createdAt)}</small></span><em className={`status-pill status-${order.status}`}>{getStatusLabel(order.status, family)}</em><strong>{formatCurrency(order.total)}</strong><ArrowLeft size={17} /></Link>; })}</div></div>
    <div className="dashboard-columns"><div className="dashboard-section"><div className="section-mini-heading"><div><h2>تصاميمك</h2><p>ارجع وعدّلها في أي وقت.</p></div><Link href="/account/designs">عرض الكل</Link></div><div className="recent-designs">{designs.slice(0, 2).map((design) => <div key={design.id}><DesignThumb design={design} small /><span><b>{design.name}</b><small>{getMaterial(design.materialId).name}</small></span></div>)}</div></div><div className="dashboard-section" id="addresses"><div className="section-mini-heading"><div><h2>العناوين</h2><p>عناوين التوصيل المحفوظة.</p></div></div><div className="address-mini-list">{addresses.map((address) => <div key={address.id}><MapPin size={18} /><span><b>{address.label}</b><small>{address.city}، {address.district} · {address.street}</small></span></div>)}</div></div></div>
    <div className="dashboard-section profile-card" id="profile"><div><span><b>بيانات الحساب</b><small>{session?.fullName} · {session?.email} · {session?.mobile}</small></span></div><div className="profile-actions"><button type="button" className="button secondary" disabled>تعديل البيانات</button><button type="button" className="button reset-button" onClick={() => { if (window.confirm("سيتم حذف تعديلاتك المحلية وإعادة البيانات التجريبية. هل تريد المتابعة؟")) resetDemo(); }}>إعادة ضبط النموذج</button></div></div>
  </>;
}
