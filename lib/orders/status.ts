import type { MaterialFamily, OrderStatus } from "@/types";

export const orderStatusFlow: OrderStatus[] = [
  "received",
  "design-review",
  "preparing",
  "production",
  "quality",
  "ready",
  "shipped",
  "delivered",
];

export function getStatusLabel(status: OrderStatus, family: MaterialFamily) {
  const labels: Record<OrderStatus, string> = {
    received: "تم استلام الطلب",
    "design-review": "مراجعة التصميم",
    preparing: "قيد التجهيز",
    production: family === "paper" ? "قيد الطباعة" : "قيد الحفر بالليزر",
    quality: "فحص الجودة",
    ready: "جاهز للشحن",
    shipped: "تم الشحن",
    delivered: "تم التسليم",
  };
  return labels[status];
}

export function getProductionLabel(family: MaterialFamily) {
  return family === "paper" ? "طباعة حبر" : "حفر ليزر";
}

export function getDeliveryWindow(family: MaterialFamily) {
  if (family === "paper") return "3–5 أيام عمل";
  if (family === "leather") return "5–7 أيام عمل";
  return "5–8 أيام عمل";
}
