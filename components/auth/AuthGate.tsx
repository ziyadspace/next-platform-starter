"use client";

import { LoaderCircle } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const session = useAppStore((state) => state.session);
  const hasHydrated = useAppStore((state) => state.hasHydrated);
  useEffect(() => {
    if (hasHydrated && !session) router.replace(`/auth?next=${encodeURIComponent(pathname)}`);
  }, [hasHydrated, session, pathname, router]);
  if (!hasHydrated || !session) return <div className="full-page-loading"><LoaderCircle className="spin" /><span>لحظة واحدة…</span></div>;
  return children;
}
