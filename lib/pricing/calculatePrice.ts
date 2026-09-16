import { getBox, getMaterial } from "@/data/catalog";
import type { DesignDraft, PriceBreakdown } from "@/types";

export const pricingConfig = {
  vatRate: 0.15,
  shippingFlat: 25,
  freeShippingThreshold: 300,
  minimumQuantity: 5,
  individualNameFee: 2,
  glossFee: 1.5,
  engravingFee: 3,
} as const;

const round = (value: number) => Math.round(value * 100) / 100;

export function getDiscountRate(quantity: number) {
  if (quantity >= 50) return 0.15;
  if (quantity >= 25) return 0.1;
  if (quantity >= 10) return 0.05;
  return 0;
}

export function calculatePrice(draft: DesignDraft): PriceBreakdown {
  const box = getBox(draft.boxId);
  const size = box.sizes.find((item) => item.id === draft.sizeId) ?? box.sizes[0];
  const material = getMaterial(draft.materialId);
  const quantity = Math.max(pricingConfig.minimumQuantity, draft.quantity || 0);
  const unitPrice = round(
    box.basePrice +
      size.priceModifier +
      material.priceModifier +
      (draft.finish === "gloss" && material.family === "paper" ? pricingConfig.glossFee : 0) +
      (material.family !== "paper" ? pricingConfig.engravingFee : 0) +
      (draft.individualNames ? pricingConfig.individualNameFee : 0),
  );
  const subtotalBeforeDiscount = round(unitPrice * quantity);
  const discountRate = getDiscountRate(quantity);
  const discountAmount = round(subtotalBeforeDiscount * discountRate);
  const subtotal = round(subtotalBeforeDiscount - discountAmount);
  const shipping = subtotal >= pricingConfig.freeShippingThreshold ? 0 : pricingConfig.shippingFlat;
  const vat = round((subtotal + shipping) * pricingConfig.vatRate);
  return {
    unitPrice,
    quantity,
    discountRate,
    discountAmount,
    subtotalBeforeDiscount,
    subtotal,
    shipping,
    vat,
    total: round(subtotal + shipping + vat),
  };
}
