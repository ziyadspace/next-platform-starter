import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { AuthForm } from "@/components/auth/AuthForm";

export const metadata = { title: "تسجيل الدخول" };

export default function AuthPage() {
  return (
    <main className="auth-page">
      <Link href="/" className="auth-back"><ArrowRight size={18} /> العودة للرئيسية</Link>
      <section className="auth-brand-panel">
        <Image src="/brand/ghallif-logo.svg" alt="غلّف" width={176} height={67} priority />
        <div className="auth-brand-copy"><span><Sparkles size={16} /> تصميم يبدأ باسمك</span><h2>بوكسك كما تخيلته،<br />قبل ما تطلبه.</h2><p>اختر الخامة، شاهد طريقة تنفيذ التصميم الحقيقية، واحفظ كل شيء في حسابك.</p></div>
        <div className="auth-preview-box"><div className="auth-box-lid"><b>نورة</b><small>مبروك التخرج</small></div><div className="auth-box-front" /></div>
        <div className="auth-points"><span><CheckCircle2 /> معاينة ثلاثية الأبعاد</span><span><CheckCircle2 /> حفظ التصاميم</span><span><CheckCircle2 /> تتبع الطلب</span></div>
      </section>
      <section className="auth-form-panel"><Suspense fallback={<div className="full-page-loading">نجهّز صفحة الدخول…</div>}><AuthForm /></Suspense></section>
    </main>
  );
}
