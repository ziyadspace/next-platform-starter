import { AuthGate } from "@/components/auth/AuthGate";
import { AccountDashboard } from "@/components/account/AccountDashboard";
import { AccountShell } from "@/components/account/AccountShell";
import { SiteHeader } from "@/components/layout/SiteHeader";
export const metadata = { title: "حسابي" };
export default function AccountPage() { return <AuthGate><SiteHeader solid /><main className="inner-page account-page"><AccountShell><AccountDashboard /></AccountShell></main></AuthGate>; }
