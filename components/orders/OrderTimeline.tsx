import { Check, Clock3 } from "lucide-react";
import { getMaterial } from "@/data/catalog";
import { getStatusLabel, orderStatusFlow } from "@/lib/orders/status";
import type { Order } from "@/types";

export function OrderTimeline({ order }: { order: Order }) {
  const currentIndex = orderStatusFlow.indexOf(order.status);
  const family = getMaterial(order.items[0].design.materialId).family;
  return (
    <ol className="order-timeline">
      {orderStatusFlow.map((status, index) => <li key={status} className={`${index < currentIndex ? "is-complete" : ""} ${index === currentIndex ? "is-current" : ""}`}><span>{index <= currentIndex ? <Check size={16} /> : <Clock3 size={15} />}</span><div><b>{getStatusLabel(status, family)}</b><small>{index < currentIndex ? "اكتملت" : index === currentIndex ? "المرحلة الحالية" : "بانتظار الوصول"}</small></div></li>)}
    </ol>
  );
}
