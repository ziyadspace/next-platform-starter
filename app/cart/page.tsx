import { AuthGate } from "@/components/auth/AuthGate";
import { CartView } from "@/components/commerce/CartView";
import { SiteHeader } from "@/components/layout/SiteHeader";

export const metadata = { title: "سلة الطلب" };
export default function CartPage() { return <AuthGate><SiteHeader solid /><main className="inner-page"><CartView /></main></AuthGate>; }
