"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, ShoppingBag, UserRound, X } from "lucide-react";
import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";

export function SiteHeader({ solid = false }: { solid?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const session = useAppStore((state) => state.session);
  const cartCount = useAppStore((state) => state.cart.length);
  const hasHydrated = useAppStore((state) => state.hasHydrated);
  const designHref = hasHydrated && session ? "/design" : "/auth?next=/design";
  return (
    <header className={`site-header ${solid ? "is-solid" : ""}`}>
      <div className="shell header-inner">
        <Link href="/" className="brand-link" aria-label="غلّف - الرئيسية">
          <Image src="/brand/ghallif-logo.svg" alt="غلّف Ghallif" width={159} height={60} priority />
        </Link>
        <nav className={`main-nav ${menuOpen ? "is-open" : ""}`} aria-label="التنقل الرئيسي">
          <Link href="/" onClick={() => setMenuOpen(false)}>الرئيسية</Link>
          <Link href="/#how" onClick={() => setMenuOpen(false)}>كيف يعمل؟</Link>
          <Link href="/#showcase" onClick={() => setMenuOpen(false)}>التصاميم</Link>
          <Link href="/#materials" onClick={() => setMenuOpen(false)}>الخامات</Link>
          <Link href="/track" onClick={() => setMenuOpen(false)}>تتبع الطلب</Link>
          <Link href={hasHydrated && session ? "/account" : "/auth"} onClick={() => setMenuOpen(false)}>
            {hasHydrated && session ? "حسابي" : "تسجيل الدخول"}
          </Link>
          <Link href={designHref} className="button primary mobile-only" onClick={() => setMenuOpen(false)}>صمّم بوكسك</Link>
        </nav>
        <div className="header-actions">
          <Link href="/cart" className="icon-button cart-button" aria-label={`السلة، ${cartCount} عناصر`}>
            <ShoppingBag size={20} />
            {hasHydrated && cartCount > 0 && <span>{cartCount}</span>}
          </Link>
          <Link href={hasHydrated && session ? "/account" : "/auth"} className="icon-button desktop-only" aria-label="الحساب"><UserRound size={20} /></Link>
          <Link href={designHref} className="button primary header-cta">صمّم بوكسك</Link>
          <button type="button" className="icon-button menu-toggle" onClick={() => setMenuOpen((value) => !value)} aria-expanded={menuOpen} aria-label="القائمة">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
    </header>
  );
}
