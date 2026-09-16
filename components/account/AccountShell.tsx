import { AccountNav } from "@/components/account/AccountNav";

export function AccountShell({ children }: { children: React.ReactNode }) {
  return <div className="shell account-layout"><AccountNav /><section className="account-content">{children}</section></div>;
}
