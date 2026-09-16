"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Check, Eye, EyeOff, LockKeyhole, Mail, Phone, UserRound } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { demoCredentials, useAppStore } from "@/store/useAppStore";

const schema = z.object({
  fullName: z.string().optional(),
  mobile: z.string().optional(),
  email: z.string().min(1, "أدخل البريد الإلكتروني أو رقم الجوال"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
  confirmPassword: z.string().optional(),
}).superRefine((data, context) => {
  if (data.confirmPassword !== undefined) {
    if (!data.fullName || data.fullName.trim().length < 3) context.addIssue({ code: "custom", path: ["fullName"], message: "أدخل الاسم الكامل" });
    if (!data.mobile || !/^05\d{8}$/.test(data.mobile)) context.addIssue({ code: "custom", path: ["mobile"], message: "أدخل رقم جوال سعودي صحيح" });
    if (!z.email().safeParse(data.email).success) context.addIssue({ code: "custom", path: ["email"], message: "أدخل بريدًا إلكترونيًا صحيحًا" });
    if (data.password !== data.confirmPassword) context.addIssue({ code: "custom", path: ["confirmPassword"], message: "كلمتا المرور غير متطابقتين" });
  }
});

type FormData = z.infer<typeof schema>;

export function AuthForm() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");
  const [notice, setNotice] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const login = useAppStore((state) => state.login);
  const registerUser = useAppStore((state) => state.register);
  const session = useAppStore((state) => state.session);
  const hasHydrated = useAppStore((state) => state.hasHydrated);
  const destination = searchParams.get("next") || "/design";
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { fullName: "", mobile: "", email: "", password: "", confirmPassword: undefined },
  });

  useEffect(() => {
    if (hasHydrated && session) router.replace(destination);
  }, [hasHydrated, session, destination, router]);

  const switchMode = (nextMode: "login" | "register") => {
    setMode(nextMode);
    setAuthError("");
    setNotice("");
    form.reset({ fullName: "", mobile: "", email: "", password: "", confirmPassword: nextMode === "register" ? "" : undefined });
  };

  const onSubmit = (data: FormData) => {
    setAuthError("");
    if (mode === "login") {
      if (!login(data.email, data.password)) {
        setAuthError("بيانات الدخول غير صحيحة. جرّب الحساب التجريبي الموضح أدناه.");
        return;
      }
    } else {
      registerUser({ fullName: data.fullName!, mobile: data.mobile!, email: data.email, password: data.password });
    }
    router.replace(destination);
  };

  const fillDemo = () => {
    form.setValue("email", demoCredentials.email, { shouldValidate: true });
    form.setValue("password", demoCredentials.password, { shouldValidate: true });
  };

  return (
    <div className="auth-card">
      <div className="auth-tabs" role="tablist">
        <button type="button" className={mode === "login" ? "is-active" : ""} onClick={() => switchMode("login")}>تسجيل الدخول</button>
        <button type="button" className={mode === "register" ? "is-active" : ""} onClick={() => switchMode("register")}>إنشاء حساب</button>
      </div>
      <div className="auth-heading"><h1>{mode === "login" ? "أهلًا بك من جديد" : "أنشئ حسابك"}</h1><p>{mode === "login" ? "أكمل تصميمك أو تابع طلباتك السابقة." : "احفظ تصاميمك واطلب بوكسك خلال دقائق."}</p></div>
      <form className="auth-form" onSubmit={form.handleSubmit(onSubmit)} noValidate>
        {mode === "register" && <>
          <label><span>الاسم الكامل</span><div className="input-with-icon"><UserRound size={18} /><input {...form.register("fullName")} placeholder="الاسم الثلاثي" autoComplete="name" /></div>{form.formState.errors.fullName && <small className="field-error">{form.formState.errors.fullName.message}</small>}</label>
          <label><span>رقم الجوال</span><div className="input-with-icon"><Phone size={18} /><input {...form.register("mobile")} placeholder="05xxxxxxxx" inputMode="tel" dir="ltr" autoComplete="tel" /></div>{form.formState.errors.mobile && <small className="field-error">{form.formState.errors.mobile.message}</small>}</label>
        </>}
        <label><span>{mode === "login" ? "البريد الإلكتروني أو الجوال" : "البريد الإلكتروني"}</span><div className="input-with-icon"><Mail size={18} /><input {...form.register("email")} placeholder="name@example.com" dir="ltr" autoComplete="email" /></div>{form.formState.errors.email && <small className="field-error">{form.formState.errors.email.message}</small>}</label>
        <label><span>كلمة المرور</span><div className="input-with-icon"><LockKeyhole size={18} /><input {...form.register("password")} type={showPassword ? "text" : "password"} placeholder="••••••••" dir="ltr" autoComplete={mode === "login" ? "current-password" : "new-password"} /><button type="button" className="password-toggle" onClick={() => setShowPassword((value) => !value)} aria-label="إظهار كلمة المرور">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div>{form.formState.errors.password && <small className="field-error">{form.formState.errors.password.message}</small>}</label>
        {mode === "register" && <label><span>تأكيد كلمة المرور</span><div className="input-with-icon"><LockKeyhole size={18} /><input {...form.register("confirmPassword")} type={showPassword ? "text" : "password"} placeholder="••••••••" dir="ltr" autoComplete="new-password" /></div>{form.formState.errors.confirmPassword && <small className="field-error">{form.formState.errors.confirmPassword.message}</small>}</label>}
        {mode === "login" && <button type="button" className="forgot-link" onClick={() => setNotice("في النسخة التجريبية استخدم حساب العرض، أو أنشئ حسابًا جديدًا.")}>نسيت كلمة المرور؟</button>}
        {authError && <div className="form-alert is-error">{authError}</div>}
        {notice && <div className="form-alert">{notice}</div>}
        <button type="submit" className="button primary large auth-submit">{mode === "login" ? "تسجيل الدخول" : "إنشاء الحساب"}<ArrowLeft size={19} /></button>
      </form>
      {mode === "login" && <button type="button" className="demo-login" onClick={fillDemo}><span><Check size={16} /> حساب تجريبي جاهز</span><b>{demoCredentials.email}</b><small>{demoCredentials.password}</small></button>}
      <p className="auth-terms">بالمتابعة، أنت توافق على شروط الاستخدام وسياسة الخصوصية للنموذج التجريبي.</p>
    </div>
  );
}
