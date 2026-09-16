"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ClipboardList, LayoutDashboard, LogOut, MapPin, Palette, UserRound } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

const links = [
  ["/account", "نظرة عامة", LayoutDashboard],
  ["/account/orders", "طلباتي", ClipboardList],
  ["/account/designs", "تصاميمي", Palette],
] as const;

export function AccountNav() {
  const pathname = usePathname();
  const router = useRouter();
  const session = useAppStore((state) => state.session);
  const logout = useAppStore((state) => state.logout);
  return (
    <aside className="account-nav"><div className="account-person"><span><UserRound /></span><div><b>{session?.fullName}</b><small>{session?.email}</small></div></div><nav>{links.map(([href, label, Icon]) => <Link key={href} href={href} className={pathname === href ? "is-active" : ""}><Icon size={18} />{label}</Link>)}<a href="#addresses"><MapPin size={18} />عناويني</a><a href="#profile"><UserRound size={18} />بيانات الحساب</a></nav><button type="button" onClick={() => { logout(); router.push("/"); }}><LogOut size={18} /> تسجيل الخروج</button></aside>
  );
}
