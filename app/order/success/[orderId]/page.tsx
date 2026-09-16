import { AuthGate } from "@/components/auth/AuthGate";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { OrderSuccessView } from "@/components/orders/OrderSuccessView";
export const metadata = { title: "تم استلام الطلب" };
export default function OrderSuccessPage() { return <AuthGate><SiteHeader solid /><main className="inner-page success-page"><OrderSuccessView /></main></AuthGate>; }
