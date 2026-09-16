import { formatCurrency } from "@/lib/format";
import type { PriceBreakdown as PriceBreakdownType } from "@/types";

export function PriceBreakdown({ price, compact = false }: { price: PriceBreakdownType; compact?: boolean }) {
  return (
    <div className={`price-breakdown ${compact ? "is-compact" : ""}`}>
      <div><span>سعر القطعة</span><b>{formatCurrency(price.unitPrice)}</b></div>
      <div><span>الكمية</span><b>{price.quantity}</b></div>
      {price.discountRate > 0 && <><div className="discount-row"><span>خصم الكمية ({Math.round(price.discountRate * 100)}%)</span><b>− {formatCurrency(price.discountAmount)}</b></div></>}
      <div><span>المجموع قبل الضريبة</span><b>{formatCurrency(price.subtotal)}</b></div>
      <div><span>ضريبة القيمة المضافة (15%)</span><b>{formatCurrency(price.vat)}</b></div>
      <div><span>الشحن</span><b>{price.shipping === 0 ? "مجاني" : formatCurrency(price.shipping)}</b></div>
      <div className="price-total"><span>الإجمالي</span><b>{formatCurrency(price.total)}</b></div>
    </div>
  );
}
