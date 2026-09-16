"use client";

import Link from "next/link";
import { ArrowLeft, Minus, Plus, ShieldCheck, Trash2, Truck } from "lucide-react";
import { EmptyState } from "@/components/commerce/EmptyState";
import { DesignThumb } from "@/components/commerce/DesignThumb";
import { getBox, getMaterial, getTemplate } from "@/data/catalog";
import { formatCurrency } from "@/lib/format";
import { getProductionLabel } from "@/lib/orders/status";
import { useAppStore } from "@/store/useAppStore";

export function CartView() {
  const cart = useAppStore((state) => state.cart);
  const remove = useAppStore((state) => state.removeFromCart);
  const updateQuantity = useAppStore((state) => state.updateCartQuantity);
  const hasHydrated = useAppStore((state) => state.hasHydrated);
  if (!hasHydrated) return <div className="page-loading-skeleton" />;
  if (!cart.length) return <div className="shell account-page-shell"><EmptyState title="سلتك تنتظر أول تصميم" text="صمّم بوكسك وشاهد السعر وطريقة الإنتاج قبل إضافته إلى السلة." /></div>;
  const subtotal = cart.reduce((sum, item) => sum + item.price.subtotal, 0);
  const vat = cart.reduce((sum, item) => sum + item.price.vat, 0);
  const shipping = cart.reduce((sum, item) => sum + item.price.shipping, 0);
  const total = cart.reduce((sum, item) => sum + item.price.total, 0);
  return (
    <div className="shell cart-layout">
      <section className="cart-main"><div className="page-title"><span>سلة الطلب</span><h1>تصاميمك المختارة</h1><p>{cart.length} {cart.length === 1 ? "تصميم" : "تصاميم"} جاهزة للمراجعة.</p></div>
        <div className="cart-items">{cart.map((item) => {
          const box = getBox(item.design.boxId); const size = box.sizes.find((entry) => entry.id === item.design.sizeId)!; const material = getMaterial(item.design.materialId); const template = getTemplate(item.design.templateId);
          return <article className="cart-item" key={item.id}><DesignThumb design={item.design} /><div className="cart-item-info"><div><span>{getProductionLabel(material.family)}</span><h2>{box.name}</h2><p>{size.dimensions.join(" × ")} سم · {material.name}</p></div><dl><div><dt>القالب</dt><dd>{template.concept} — {template.variationName}</dd></div><div><dt>النص</dt><dd>{item.design.individualNames ? `${item.design.names.length} أسماء مختلفة` : item.design.name}</dd></div><div><dt>الخامة</dt><dd>{material.name}</dd></div></dl><div className="cart-item-bottom"><div className="quantity-mini"><button type="button" onClick={() => updateQuantity(item.id, item.design.quantity - 1)}><Minus size={15} /></button><span>{item.design.quantity}</span><button type="button" onClick={() => updateQuantity(item.id, item.design.quantity + 1)}><Plus size={15} /></button></div><b>{formatCurrency(item.price.total)}</b><button type="button" className="remove-button" onClick={() => remove(item.id)}><Trash2 size={16} /> حذف</button></div></div></article>;
        })}</div>
        <Link href="/design" className="text-link back-to-design">+ أضف تصميمًا آخر</Link>
      </section>
      <aside className="cart-summary"><h2>ملخص الطلب</h2><div><span>المنتجات</span><b>{formatCurrency(subtotal)}</b></div><div><span>ضريبة القيمة المضافة</span><b>{formatCurrency(vat)}</b></div><div><span>الشحن</span><b>{shipping === 0 ? "مجاني" : formatCurrency(shipping)}</b></div><div className="cart-total"><span>الإجمالي</span><b>{formatCurrency(total)}</b></div><Link href="/checkout" className="button primary large full-width">متابعة الدفع <ArrowLeft size={18} /></Link><p><ShieldCheck size={17} /> لن يتم خصم أي مبلغ حقيقي في النموذج.</p><p><Truck size={17} /> تقدير التوصيل النهائي يظهر بعد تحديد العنوان.</p></aside>
    </div>
  );
}
