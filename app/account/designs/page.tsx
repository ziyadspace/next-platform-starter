import { AuthGate } from "@/components/auth/AuthGate";
import { AccountShell } from "@/components/account/AccountShell";
import { SavedDesignsView } from "@/components/account/SavedDesignsView";
import { SiteHeader } from "@/components/layout/SiteHeader";
export const metadata = { title: "تصاميمي" };
export default function DesignsPage() { return <AuthGate><SiteHeader solid /><main className="inner-page account-page"><AccountShell><SavedDesignsView /></AccountShell></main></AuthGate>; }
