import { AuthGate } from "@/components/auth/AuthGate";
import { AccountShell } from "@/components/account/AccountShell";
import { OrdersView } from "@/components/account/OrdersView";
import { SiteHeader } from "@/components/layout/SiteHeader";
export const metadata = { title: "طلباتي" };
export default function OrdersPage() { return <AuthGate><SiteHeader solid /><main className="inner-page account-page"><AccountShell><OrdersView /></AccountShell></main></AuthGate>; }
