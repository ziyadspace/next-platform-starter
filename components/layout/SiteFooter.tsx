import Image from "next/image";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div>
          <Image src="/brand/ghallif-logo.svg" alt="غلّف" width={152} height={58} />
          <p>بوكسات شخصية لمناسباتك، من الفكرة حتى باب بيتك.</p>
        </div>
        <div><strong>اكتشف</strong><Link href="/#how">كيف يعمل؟</Link><Link href="/#materials">الخامات</Link><Link href="/#showcase">التصاميم</Link></div>
        <div><strong>حسابك</strong><Link href="/account">نظرة عامة</Link><Link href="/account/designs">تصاميمي</Link><Link href="/account/orders">طلباتي</Link></div>
        <div><strong>المساعدة</strong><Link href="/track">تتبع الطلب</Link><Link href="/#faq">الأسئلة الشائعة</Link><a href="mailto:hello@ghallif.sa">hello@ghallif.sa</a></div>
      </div>
      <div className="shell footer-bottom"><span>© 2026 غلّف. نموذج تجريبي.</span><span>صُنع للمناسبات السعودية</span></div>
    </footer>
  );
}
