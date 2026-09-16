import { AuthGate } from "@/components/auth/AuthGate";
import { AccountShell } from "@/components/account/AccountShell";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { OrderDetailView } from "@/components/orders/OrderDetailView";
export const metadata = { title: "تفاصيل الطلب" };
export default function OrderDetailPage() { return <AuthGate><SiteHeader solid /><main className="inner-page account-page"><AccountShell><OrderDetailView /></AccountShell></main></AuthGate>; }
