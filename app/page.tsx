import Link from "next/link";
import { ArrowLeft, Box, Check, Eye, Layers3, MapPin, MousePointer2, PackageCheck, Palette, ShieldCheck, Truck } from "lucide-react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { HeroMaterialDemo } from "@/components/home/HeroMaterialDemo";
import { MiniProductVisual } from "@/components/home/MiniProductVisual";
import { getMaterial, materials, showcaseProducts } from "@/data/catalog";

const benefits = [
  [Box, "كميات قليلة", "ابدأ من 5 بوكسات فقط"],
  [Palette, "تصميم شخصي", "اسمك وعبارتك بطريقتك"],
  [Eye, "معاينة مباشرة", "شاهد النتيجة قبل الطلب"],
  [Layers3, "خامات متعددة", "ورق وخشب وجلد"],
  [MousePointer2, "طلب كامل أونلاين", "من التصميم حتى الدفع"],
  [Truck, "توصيل داخل المملكة", "إلى مدينتك بكل عناية"],
] as const;

const faqs = [
  ["هل يوجد حد أدنى للطلب؟", "نعم، الحد الأدنى في النموذج هو 5 بوكسات، مع خصومات تبدأ من 10 قطع."],
  ["هل أقدر أضع اسم مختلف على كل بوكس؟", "أكيد. فعّل خيار «اسم مختلف لكل بوكس» وأدخل الأسماء كل اسم في سطر مستقل."],
  ["هل أقدر أشوف التصميم قبل الطلب؟", "نعم. المعاينة الثلاثية الأبعاد تتحدث مباشرة مع كل اختيار، وتوضح الفرق بين الطباعة والحفر."],
  ["كم يستغرق تجهيز الطلب؟", "الورق 3–5 أيام عمل، الجلد 5–7 أيام، والخشب 5–8 أيام، قبل مدة الشحن."],
  ["هل أقدر أعدل التصميم بعد الدفع؟", "يمكن طلب تعديل أثناء مرحلة مراجعة التصميم، وبعد بدء الإنتاج قد لا يكون التعديل ممكنًا."],
  ["ما الخامات المتوفرة؟", "ثلاثة أنواع ورق مقوى، خشب بيرش، وثلاثة أنواع من الجلد الطبيعي والصناعي."],
] as const;

export default function HomePage() {
  return (
    <main>
      <SiteHeader />
      <section className="hero-section">
        <div className="shell hero-grid">
          <div className="hero-copy">
            <h1>كل مناسبة لها اسم.<br /><span>غلّفها به.</span></h1>
            <p>صمّم بوكسك بطريقتك، اختر خامته وتصميمه، أضف الاسم أو العبارة، وشاهد النتيجة مباشرة قبل الطلب.</p>
            <div className="hero-actions">
              <Link href="/auth?next=/design" className="button primary large">ابدأ تصميم بوكسك <ArrowLeft size={19} /></Link>
              <Link href="#how" className="button secondary large">شاهد كيف يعمل</Link>
            </div>
            <div className="hero-trust"><span><ShieldCheck size={18} /> معاينة قبل الإنتاج</span><span><PackageCheck size={18} /> أقل كمية 5</span><span><MapPin size={18} /> توصيل لكل المملكة</span></div>
          </div>
          <HeroMaterialDemo />
        </div>
      </section>

      <section className="benefit-strip">
        <div className="shell benefits-grid">
          {benefits.map(([Icon, title, text]) => <div className="benefit" key={title}><Icon size={22} /><span><b>{title}</b><small>{text}</small></span></div>)}
        </div>
      </section>

      <section className="section" id="how">
        <div className="shell">
          <div className="section-heading centered"><span>من فكرتك إلى يدك</span><h2>أربع خطوات، وبوكسك جاهز</h2><p>بدون مراسلات طويلة أو انتظار عروض أسعار.</p></div>
          <div className="steps-grid">
            {["اختر البوكس", "اختر الخامة والتصميم", "خصّصه باسمك", "شاهد النتيجة واطلبه"].map((step, index) => (
              <article className="step-card" key={step}><div>{String(index + 1).padStart(2, "0")}</div><h3>{step}</h3><p>{["ثلاثة هياكل وتسعة مقاسات.", "ورق مطبوع أو حفر على الخشب والجلد.", "اسم واحد أو اسم مختلف لكل قطعة.", "معاينة ثلاثية الأبعاد وسعر فوري."][index]}</p></article>
            ))}
          </div>
        </div>
      </section>

      <section className="section occasion-section">
        <div className="shell split-heading"><div><span>لكل لحظة</span><h2>صمّمه للمناسبة التي تعني لك</h2></div><p>تخرج، عيد، زواج، أو حتى هدية بلا مناسبة. القالب بداية فقط، والباقي باسمك.</p></div>
        <div className="shell occasion-cloud">{["تخرج", "عيد", "مواليد", "زواج", "عيد ميلاد", "أصدقاء", "عائلة", "هدايا خاصة"].map((item, i) => <span key={item} className={`occasion-${(i % 4) + 1}`}>{item}<i /></span>)}</div>
      </section>

      <section className="section showcase-section" id="showcase">
        <div className="shell">
          <div className="section-heading"><span>مصممة لأصحابها</span><h2>أفكار تبدأ منها</h2><p>ستة نماذج توضح كيف تتحول المناسبة إلى بوكس شخصي.</p></div>
          <div className="showcase-grid">
            {showcaseProducts.map((product) => {
              const material = getMaterial(product.materialId as never);
              return <article className="showcase-card" key={product.name}><div className="showcase-visual"><MiniProductVisual name={product.name} family={material.family} color={product.color} /></div><div><span>{product.occasion}</span><h3>{product.name}</h3><small>{material.name} · {material.family === "paper" ? "طباعة حبر" : "حفر ليزر"}</small></div></article>;
            })}
          </div>
        </div>
      </section>

      <section className="section materials-section" id="materials">
        <div className="shell">
          <div className="split-heading"><div><span>الخامة تغيّر النتيجة</span><h2>سبع خامات، وثلاث طرق ظهور</h2></div><p>الألوان تطبع فوق الورق. أما الخشب والجلد فيتحول التصميم عليهما إلى نقش تونالي محفور — لا إلى ملصق ملون.</p></div>
          <div className="materials-grid">
            {materials.map((material) => <article className={`material-card is-${material.family}`} key={material.id}><div className="material-swatch" style={{ backgroundColor: material.colors[0].hex }}><i /><b>{material.family === "paper" ? "حبر" : "ليزر"}</b></div><h3>{material.name}</h3><p>{material.englishName}</p><span>{material.family === "paper" ? "طباعة ألوان كاملة" : material.family === "wood" ? "حفر داكن غائر" : "حفر تونالي غائر"}</span></article>)}
          </div>
          <div className="production-comparison">
            <div className="comparison-copy"><span>لماذا تبدو مختلفة؟</span><h3>التخصيص يتبع حقيقة التصنيع</h3><p>نفس الاسم والتكوين، لكن مظهره يتغير تلقائيًا بحسب الخامة المختارة.</p><Link href="/auth?next=/design" className="text-link">جرّب الفرق بنفسك <ArrowLeft size={17} /></Link></div>
            <div className="comparison-samples"><div className="sample paper"><b>نورة</b><small>حبر مسطّح وملوّن</small></div><div className="sample wood"><b>نورة</b><small>حفر خشبي محروق</small></div><div className="sample leather"><b>نورة</b><small>حفر جلدي غائر</small></div></div>
          </div>
        </div>
      </section>

      <section className="section faq-section" id="faq"><div className="shell faq-layout"><div className="section-heading"><span>قبل أن تبدأ</span><h2>أسئلة شائعة</h2><p>كل ما تحتاج معرفته قبل تصميم أول بوكس.</p></div><div className="faq-list">{faqs.map(([question, answer], index) => <details key={question} open={index === 0}><summary>{question}<i /></summary><p>{answer}</p></details>)}</div></div></section>

      <section className="final-cta"><div className="shell"><div><span>المناسبة قريبة؟</span><h2>خلّ اسمها أول شيء ينشاف.</h2><p>ابدأ الآن وشاهد بوكسك قبل ما تطلبه.</p></div><Link href="/auth?next=/design" className="button light large">صمّم بوكسك <ArrowLeft size={19} /></Link></div></section>
      <SiteFooter />
    </main>
  );
}
