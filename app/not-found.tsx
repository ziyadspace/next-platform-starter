import Link from "next/link";
import { ArrowRight, PackageOpen } from "lucide-react";
import { SiteHeader } from "@/components/layout/SiteHeader";

export default function NotFound() {
  return <><SiteHeader solid /><main className="inner-page"><div className="shell account-page-shell"><div className="empty-state"><span><PackageOpen size={34} /></span><h1>هذه الصفحة خارج البوكس</h1><p>الرابط غير موجود أو تم نقله. ارجع للرئيسية وابدأ من هناك.</p><Link href="/" className="button primary"><ArrowRight size={17} /> العودة للرئيسية</Link></div></div></main></>;
}
