"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Apple, ArrowLeft, Check, ChevronDown, CreditCard, MapPin, PackageCheck, ShieldCheck, Truck, UserRound } from "lucide-react";
import { DesignThumb } from "@/components/commerce/DesignThumb";
import { EmptyState } from "@/components/commerce/EmptyState";
import { formatCurrency } from "@/lib/format";
import { useAppStore } from "@/store/useAppStore";
import type { Address, Order } from "@/types";

const cities = ["الرياض", "جدة", "مكة المكرمة", "المدينة المنورة", "الدمام", "الخبر"];

const emptyAddress: Omit<Address, "id"> = {
  label: "عنوان جديد", recipient: "", mobile: "", city: "الرياض", district: "", street: "", building: "", postalCode: "",
};

export function CheckoutView() {
  const router = useRouter();
  const cart = useAppStore((state) => state.cart);
  const session = useAppStore((state) => state.session);
  const addresses = useAppStore((state) => state.addresses);
  const addAddress = useAppStore((state) => state.addAddress);
  const createOrder = useAppStore((state) => state.createOrder);
  const hasHydrated = useAppStore((state) => state.hasHydrated);
  const [selectedAddressId, setSelectedAddressId] = useState(addresses[0]?.id ?? "new");
  const [addressForm, setAddressForm] = useState({ ...emptyAddress, recipient: session?.fullName ?? "", mobile: session?.mobile ?? "" });
  const [delivery, setDelivery] = useState<Order["deliveryMethod"]>("standard");
  const [payment, setPayment] = useState<Order["paymentMethod"]>("mada");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const subtotal = useMemo(() => cart.reduce((sum, item) => sum + item.price.total, 0), [cart]);
  const expressFee = delivery === "express" ? 25 : 0;
  const total = subtotal + expressFee;
  if (!hasHydrated) return <div className="page-loading-skeleton" />;
  if (!cart.length) return <div className="shell account-page-shell"><EmptyState title="لا يوجد طلب لإكماله" text="أضف تصميمًا إلى السلة أولًا، ثم ارجع لإكمال بيانات التوصيل والدفع." href="/design" /></div>;

  const updateAddress = (field: keyof typeof addressForm, value: string) => setAddressForm((state) => ({ ...state, [field]: value }));
  const submit = () => {
    setError("");
    let address = addresses.find((item) => item.id === selectedAddressId);
    if (!address) {
      if (!addressForm.recipient.trim() || !/^05\d{8}$/.test(addressForm.mobile) || !addressForm.district.trim() || !addressForm.street.trim()) {
        setError("أكمل اسم المستلم ورقم الجوال والحي والشارع قبل تأكيد الطلب.");
        return;
      }
      address = addAddress(addressForm);
    }
    setSubmitting(true);
    const order = createOrder(address, payment, delivery);
    if (!order) { setError("تعذر إنشاء الطلب. حاول مرة أخرى."); setSubmitting(false); return; }
    router.push(`/order/success/${order.id}`);
  };

  return (
    <div className="shell checkout-layout">
      <section className="checkout-main">
        <div className="page-title"><span>إتمام الطلب</span><h1>باقي خطوة ونبدأ تجهيز بوكسك</h1><p>راجع بياناتك واختر التوصيل وطريقة الدفع التجريبية.</p></div>
        <div className="checkout-section"><div className="checkout-section-title"><span>1</span><div><h2>بيانات العميل</h2><p>سنستخدمها لتحديثات الطلب.</p></div><UserRound size={20} /></div><div className="checkout-customer"><label><span>الاسم الكامل</span><input value={session?.fullName ?? ""} readOnly /></label><label><span>البريد الإلكتروني</span><input value={session?.email ?? ""} readOnly dir="ltr" /></label><label><span>رقم الجوال</span><input value={session?.mobile ?? ""} readOnly dir="ltr" /></label></div></div>

        <div className="checkout-section"><div className="checkout-section-title"><span>2</span><div><h2>عنوان التوصيل</h2><p>اختر عنوانًا محفوظًا أو أضف عنوانًا جديدًا.</p></div><MapPin size={20} /></div>
          <div className="address-options">{addresses.map((address) => <button type="button" key={address.id} className={selectedAddressId === address.id ? "is-selected" : ""} onClick={() => setSelectedAddressId(address.id)}><span><b>{address.label}</b><small>{address.city}، {address.district}</small><p>{address.street} · مبنى {address.building}</p></span>{selectedAddressId === address.id && <Check size={17} />}</button>)}<button type="button" className={selectedAddressId === "new" ? "is-selected" : ""} onClick={() => setSelectedAddressId("new")}><span><b>+ عنوان جديد</b><small>أدخل بيانات مستلم مختلفة</small></span>{selectedAddressId === "new" && <Check size={17} />}</button></div>
          {selectedAddressId === "new" && <div className="new-address-form"><div className="field-grid two"><label><span>اسم المستلم</span><input value={addressForm.recipient} onChange={(event) => updateAddress("recipient", event.target.value)} /></label><label><span>رقم الجوال</span><input value={addressForm.mobile} onChange={(event) => updateAddress("mobile", event.target.value)} inputMode="tel" dir="ltr" placeholder="05xxxxxxxx" /></label></div><div className="field-grid two"><label><span>المدينة</span><select value={addressForm.city} onChange={(event) => updateAddress("city", event.target.value)}>{cities.map((city) => <option key={city}>{city}</option>)}</select></label><label><span>الحي</span><input value={addressForm.district} onChange={(event) => updateAddress("district", event.target.value)} /></label></div><label><span>الشارع</span><input value={addressForm.street} onChange={(event) => updateAddress("street", event.target.value)} /></label><div className="field-grid two"><label><span>رقم المبنى</span><input value={addressForm.building} onChange={(event) => updateAddress("building", event.target.value)} /></label><label><span>الرمز البريدي</span><input value={addressForm.postalCode} onChange={(event) => updateAddress("postalCode", event.target.value)} inputMode="numeric" /></label></div></div>}
        </div>

        <div className="checkout-section"><div className="checkout-section-title"><span>3</span><div><h2>طريقة التوصيل</h2><p>تقدير تقريبي بعد اكتمال الإنتاج.</p></div><Truck size={20} /></div><div className="delivery-options"><button type="button" className={delivery === "standard" ? "is-selected" : ""} onClick={() => setDelivery("standard")}><span><b>توصيل عادي</b><small>2–4 أيام عمل بعد التجهيز</small></span><strong>مشمولة</strong></button><button type="button" className={delivery === "express" ? "is-selected" : ""} onClick={() => setDelivery("express")}><span><b>توصيل سريع</b><small>1–2 يوم عمل بعد التجهيز</small></span><strong>+ {formatCurrency(25)}</strong></button></div></div>

        <div className="checkout-section"><div className="checkout-section-title"><span>4</span><div><h2>طريقة الدفع</h2><p>محاكاة فقط — لا توجد عملية خصم حقيقية.</p></div><CreditCard size={20} /></div><div className="payment-options"><button type="button" className={payment === "mada" ? "is-selected" : ""} onClick={() => setPayment("mada")}><i className="mada-mark">مدى</i><span><b>مدى</b><small>بطاقة مدى البنكية</small></span></button><button type="button" className={payment === "apple-pay" ? "is-selected" : ""} onClick={() => setPayment("apple-pay")}><Apple /><span><b>Apple Pay</b><small>دفع سريع وآمن</small></span></button><button type="button" className={payment === "credit-card" ? "is-selected" : ""} onClick={() => setPayment("credit-card")}><CreditCard /><span><b>بطاقة ائتمانية</b><small>Visa أو Mastercard</small></span></button></div></div>
      </section>

      <aside className="checkout-summary"><h2>مراجعة الطلب</h2><div className="checkout-products">{cart.map((item) => <div key={item.id}><DesignThumb design={item.design} small /><span><b>{item.design.name}</b><small>{item.design.quantity} بوكس</small></span><strong>{formatCurrency(item.price.total)}</strong></div>)}</div><div className="checkout-totals"><div><span>إجمالي السلة</span><b>{formatCurrency(subtotal)}</b></div>{expressFee > 0 && <div><span>التوصيل السريع</span><b>{formatCurrency(expressFee)}</b></div>}<div className="price-total"><span>الإجمالي</span><b>{formatCurrency(total)}</b></div></div>{error && <div className="form-alert is-error">{error}</div>}<button type="button" className="button primary large full-width" onClick={submit} disabled={submitting}>{submitting ? "جاري تأكيد الطلب…" : "تأكيد الطلب التجريبي"}<ArrowLeft size={18} /></button><p><ShieldCheck size={17} /> الطلب تجريبي ولن يُطلب منك إدخال بيانات بطاقة حقيقية.</p><div className="checkout-safe"><PackageCheck size={19} /><span><b>سنراجع التصميم قبل الإنتاج</b><small>للتأكد من وضوح النص والمساحة الآمنة.</small></span><ChevronDown size={16} /></div></aside>
    </div>
  );
}
