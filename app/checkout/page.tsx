import { AuthGate } from "@/components/auth/AuthGate";
import { CheckoutView } from "@/components/commerce/CheckoutView";
import { SiteHeader } from "@/components/layout/SiteHeader";

export const metadata = { title: "إتمام الطلب" };
export default function CheckoutPage() { return <AuthGate><SiteHeader solid /><main className="inner-page"><CheckoutView /></main></AuthGate>; }
