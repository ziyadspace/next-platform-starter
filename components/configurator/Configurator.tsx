"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, ArrowRight, Box, CalendarDays, Check, ChevronLeft, ChevronRight, CircleAlert,
  CircleCheck, Layers3, Minus, PackageCheck, Palette, Plus, Save, ScanLine, ShoppingBag, Sparkles, Type,
} from "lucide-react";
import { boxes, formatDimensions, getBox, getMaterial, getTemplate, materials, templates } from "@/data/catalog";
import { calculatePrice, pricingConfig } from "@/lib/pricing/calculatePrice";
import { formatCurrency } from "@/lib/format";
import { getDeliveryWindow, getProductionLabel } from "@/lib/orders/status";
import { getProductionArtwork } from "@/lib/rendering/productionArtwork";
import { useAppStore } from "@/store/useAppStore";
import type { BoxId, DesignDraft, Material, MaterialId } from "@/types";
import { ConfiguratorPreview } from "@/components/3d/ConfiguratorPreview";
import { PriceBreakdown } from "@/components/commerce/PriceBreakdown";

const steps = [
  ["البوكس", Box], ["المقاس", PackageCheck], ["الخامة", Layers3], ["التصميم", Palette],
  ["التخصيص", Type], ["الكمية", Plus], ["المراجعة", Check],
] as const;

function BoxGlyph({ type }: { type: BoxId }) {
  return <div className={`box-glyph is-${type}`}><i /><b /><span /></div>;
}

function MaterialCard({ material, selected, compatible, onSelect }: { material: Material; selected: boolean; compatible: boolean; onSelect: () => void }) {
  return (
    <button type="button" className={`material-option ${selected ? "is-selected" : ""} ${!compatible ? "is-disabled" : ""}`} onClick={onSelect} disabled={!compatible}>
      <div className={`material-option-swatch is-${material.family}`} style={{ background: material.colors[0].hex }}><i /></div>
      <span><b>{material.name}</b><small>{material.englishName}</small><em>{getProductionLabel(material.family)}</em></span>
      {selected && <Check className="selection-check" size={17} />}
      {!compatible && <small className="unavailable">غير متاح لهذا النوع من البوكس</small>}
    </button>
  );
}

export function Configurator() {
  const router = useRouter();
  const draft = useAppStore((state) => state.draft);
  const updateDraft = useAppStore((state) => state.updateDraft);
  const saveDesign = useAppStore((state) => state.saveDesign);
  const addToCart = useAppStore((state) => state.addToCart);
  const [step, setStep] = useState(0);
  const [boxOpen, setBoxOpen] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [resetToken, setResetToken] = useState(0);
  const [previewNameIndex, setPreviewNameIndex] = useState(0);
  const [toast, setToast] = useState("");

  const box = getBox(draft.boxId);
  const size = box.sizes.find((item) => item.id === draft.sizeId) ?? box.sizes[0];
  const material = getMaterial(draft.materialId);
  const template = getTemplate(draft.templateId);
  const color = material.colors.find((item) => item.id === draft.materialColorId) ?? material.colors[0];
  const artwork = getProductionArtwork(template, material, draft, color.hex);
  const price = useMemo(() => calculatePrice(draft), [draft]);
  const familyTemplates = templates.filter((item) => item.family === material.family);
  const names = draft.names.filter(Boolean);
  const previewName = draft.individualNames && names.length ? names[Math.min(previewNameIndex, names.length - 1)] : undefined;

  const issues = useMemo(() => {
    const list: string[] = [];
    if (!draft.name.trim() && !draft.individualNames) list.push("أضف الاسم الذي سيظهر على البوكس");
    if (draft.name.length > 28) list.push("الاسم أطول من مساحة الطباعة/الحفر الآمنة");
    if (draft.phrase.length > 48) list.push("العبارة الإضافية أطول من المساحة الآمنة");
    if (draft.quantity < pricingConfig.minimumQuantity) list.push("الحد الأدنى للطلب 5 بوكسات");
    if (draft.individualNames && names.length === 0) list.push("أدخل اسمًا واحدًا على الأقل");
    if (draft.individualNames && names.length > draft.quantity) list.push("الكمية يجب أن تساوي عدد الأسماء أو تزيد عنه");
    if (!material.compatibleBoxes.includes(draft.boxId)) list.push("الخامة غير متاحة لهذا النوع من البوكس");
    return list;
  }, [draft, material, names.length]);

  const selectBox = (boxId: BoxId) => {
    const selectedBox = boxes.find((item) => item.id === boxId)!;
    const patch: Partial<DesignDraft> = { boxId, sizeId: "medium" };
    if (!material.compatibleBoxes.includes(boxId)) {
      const fallback = materials.find((item) => item.compatibleBoxes.includes(boxId))!;
      Object.assign(patch, { materialId: fallback.id, materialColorId: fallback.colors[0].id, productionMethod: fallback.productionMethod, finish: fallback.finishes?.[0] ?? "matte" });
    }
    updateDraft(patch);
    if (!selectedBox) return;
  };

  const selectMaterial = (materialId: MaterialId) => {
    const next = getMaterial(materialId);
    if (!next.compatibleBoxes.includes(draft.boxId)) return;
    updateDraft({
      materialId,
      materialColorId: next.colors[0].id,
      productionMethod: next.productionMethod,
      finish: next.finishes?.[0] ?? "matte",
    });
  };

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  };

  const handleSave = () => {
    saveDesign();
    showToast("تم حفظ التصميم في حسابك");
  };

  const handleCart = () => {
    if (issues.length) { setStep(6); showToast("راجع الملاحظات قبل إضافة التصميم للسلة"); return; }
    addToCart();
    router.push("/cart");
  };

  const next = () => setStep((value) => Math.min(6, value + 1));
  const previous = () => setStep((value) => Math.max(0, value - 1));

  return (
    <div className="configurator-page">
      {toast && <div className="toast"><CircleCheck size={18} />{toast}</div>}
      <div className="configurator-topbar">
        <div className="shell config-topbar-inner">
          <div><span>مصمم البوكس</span><b>{box.name} · {material.name}</b></div>
          <div className="topbar-price"><small>الإجمالي</small><b>{formatCurrency(price.total)}</b></div>
          <button type="button" className="button secondary" onClick={handleSave}><Save size={17} /> حفظ التصميم</button>
        </div>
      </div>
      <div className="configurator-shell">
        <aside className="step-nav" aria-label="خطوات التصميم">
          {steps.map(([label, Icon], index) => <button type="button" key={label} className={`${step === index ? "is-current" : ""} ${index < step ? "is-complete" : ""}`} onClick={() => setStep(index)}><span>{index < step ? <Check size={15} /> : <Icon size={17} />}</span><b>{label}</b><small>{index + 1}</small></button>)}
        </aside>

        <section className="configurator-controls">
          <div className="controls-heading"><span>الخطوة {step + 1} من 7</span><h1>{steps[step][0]}</h1><p>{[
            "اختر طريقة فتح البوكس المناسبة لهديتك.", "حدد المقاس، وستتغير أبعاد النموذج مباشرة.", "الخامة تحدد الملمس وطريقة تنفيذ التصميم.", "اختر نقطة البداية، ويمكنك تغيير النص بعدها.", "اكتب الاسم والعبارة واضبط طريقة ظهورها.", "حدد الكمية وموعد مناسبتك للحصول على تقدير أدق.", "راجع التصميم والسعر وتأكد أن كل شيء جاهز.",
          ][step]}</p></div>

          <div className="control-panel">
            {step === 0 && <div className="box-options">
              {boxes.map((item) => <button type="button" key={item.id} className={`box-option ${draft.boxId === item.id ? "is-selected" : ""}`} onClick={() => selectBox(item.id)}><BoxGlyph type={item.id} /><span><b>{item.name}</b><small>{item.englishName}</small><p>{item.description}</p></span>{draft.boxId === item.id && <Check className="selection-check" size={17} />}</button>)}
            </div>}

            {step === 1 && <div className="size-options">
              {box.sizes.map((item) => <button type="button" key={item.id} className={draft.sizeId === item.id ? "is-selected" : ""} onClick={() => updateDraft({ sizeId: item.id })}><span><b>{item.name}</b><small>{item.id === "small" ? "للإهداءات الخفيفة" : item.id === "medium" ? "الأكثر اختيارًا" : "للهدايا المتعددة"}</small></span><strong>{formatDimensions(item.dimensions)}</strong>{item.id === "medium" && <em>موصى به</em>}</button>)}
              <div className="dimension-note"><Box size={19} /><span><b>الأبعاد الخارجية</b><small>العرض × العمق × الارتفاع بالسنتيمتر. مساحة الداخل تقل قليلًا بحسب سماكة الخامة.</small></span></div>
            </div>}

            {step === 2 && <>
              <div className="material-options">{materials.map((item) => <MaterialCard key={item.id} material={item} selected={draft.materialId === item.id} compatible={item.compatibleBoxes.includes(draft.boxId)} onSelect={() => selectMaterial(item.id)} />)}</div>
              <div className="sub-control"><label>لون الخامة</label><div className="color-options">{material.colors.map((item) => <button type="button" key={item.id} className={draft.materialColorId === item.id ? "is-selected" : ""} onClick={() => updateDraft({ materialColorId: item.id })}><i style={{ background: item.hex }} /><span>{item.name}</span>{draft.materialColorId === item.id && <Check size={14} />}</button>)}</div></div>
              <div className={`production-note is-${material.family}`}><ScanLine size={21} /><div><b>{artwork.label}</b><p>{material.family === "paper" ? "يظهر التصميم كطبقة حبر ملونة فوق الورق بلا عمق أو حفر." : material.family === "wood" ? "يتحول التصميم إلى قناع أحادي اللون، غائر قليلًا وداكنًا مع بقاء عروق الخشب ظاهرة." : "يتحول التصميم إلى حفر تونالي غائر يناسب لون الجلد وملمسه، بدون حبر ملون."}</p></div></div>
            </>}

            {step === 3 && <>
              {template.family !== material.family && <div className="adaptation-banner"><Sparkles size={18} /><span><b>نحافظ على تكوينك الحالي</b><small>تم تكييف ألوانه تلقائيًا لتناسب {material.family === "paper" ? "الطباعة الحبرية" : "الحفر بالليزر"}. اختر قالبًا جديدًا أدناه فقط إذا رغبت.</small></span></div>}
              <div className="template-groups">
                {Array.from(new Set(familyTemplates.map((item) => item.concept))).map((concept) => <div className="template-group" key={concept}><h3>{concept}</h3><div className="template-options">{familyTemplates.filter((item) => item.concept === concept).map((item) => <button type="button" key={item.id} className={draft.templateId === item.id ? "is-selected" : ""} onClick={() => updateDraft({ templateId: item.id, textColor: item.palette[0] })}><span className={`template-thumb pattern-${item.pattern}`} style={{ "--c1": item.palette[0], "--c2": item.palette[1], "--c3": item.palette[2] } as React.CSSProperties}><b>اسمك</b><i /></span><small>{item.variationName}</small>{draft.templateId === item.id && <Check size={14} />}</button>)}</div></div>)}
              </div>
            </>}

            {step === 4 && <div className="personalization-controls">
              <div className="field-grid two"><label><span>الاسم</span><input value={draft.name} onChange={(event) => updateDraft({ name: event.target.value })} maxLength={36} placeholder="نورة" /><small>{draft.name.length}/28 حرفًا موصى به</small></label><label><span>السنة <em>اختياري</em></span><input value={draft.year} onChange={(event) => updateDraft({ year: event.target.value.replace(/\D/g, "").slice(0, 4) })} inputMode="numeric" dir="ltr" placeholder="2026" /></label></div>
              <label><span>عبارة إضافية <em>اختياري</em></span><input value={draft.phrase} onChange={(event) => updateDraft({ phrase: event.target.value })} maxLength={60} placeholder="مبروك التخرج" /><small>{draft.phrase.length}/48 حرفًا موصى به</small></label>
              <div className="field-grid two"><label><span>الخط</span><select value={draft.font} onChange={(event) => updateDraft({ font: event.target.value })}><option>IBM Plex Sans Arabic</option><option>Tahoma</option><option>Arial</option></select></label><label><span>السماكة</span><div className="segmented"><button type="button" className={draft.fontWeight === 500 ? "is-active" : ""} onClick={() => updateDraft({ fontWeight: 500 })}>متوسط</button><button type="button" className={draft.fontWeight === 700 ? "is-active" : ""} onClick={() => updateDraft({ fontWeight: 700 })}>عريض</button></div></label></div>
              <label className="range-field"><span>حجم النص <b>{draft.fontSize}</b></span><input type="range" min="38" max="82" value={draft.fontSize} onChange={(event) => updateDraft({ fontSize: Number(event.target.value) })} /></label>
              <div className="field-grid two"><label><span>المحاذاة</span><div className="segmented">{(["right", "center", "left"] as const).map((value) => <button type="button" key={value} className={draft.alignment === value ? "is-active" : ""} onClick={() => updateDraft({ alignment: value })}>{value === "right" ? "يمين" : value === "center" ? "وسط" : "يسار"}</button>)}</div></label><label><span>موضع التصميم</span><select value={draft.placement} onChange={(event) => updateDraft({ placement: event.target.value as DesignDraft["placement"] })}><option value="lid">الغطاء</option><option value="front">الواجهة الأمامية</option><option value="side">الجانب</option></select></label></div>
              {material.family === "paper" ? <div className="paper-controls"><label><span>لون النص</span><input className="color-input" type="color" value={draft.textColor} onChange={(event) => updateDraft({ textColor: event.target.value })} /></label><label><span>نوع الطباعة</span><div className="segmented"><button type="button" className={draft.finish === "matte" ? "is-active" : ""} onClick={() => updateDraft({ finish: "matte" })}>مطفي</button><button type="button" disabled={!material.finishes?.includes("gloss")} className={draft.finish === "gloss" ? "is-active" : ""} onClick={() => updateDraft({ finish: "gloss" })}>لامع</button></div></label></div> : <div className="engraving-controls"><label><span>درجة الحفر</span><div className="segmented">{(["light", "medium", "dark"] as const).map((value) => <button type="button" key={value} className={draft.engravingDepth === value ? "is-active" : ""} onClick={() => updateDraft({ engravingDepth: value })}>{value === "light" ? "خفيف" : value === "medium" ? "متوسط" : "داكن"}</button>)}</div></label><div><ScanLine size={19} /><span><b>معاينة الحفر</b><small>لون الحبر مخفي لأن هذه الخامة تُخصص بالحفر، وليس بالطباعة الملونة.</small></span></div></div>}
              <div className="multi-name-card"><label className="switch-row"><span><b>اسم مختلف لكل بوكس</b><small>مثالي لهدايا العائلة أو الصديقات</small></span><input type="checkbox" checked={draft.individualNames} onChange={(event) => { updateDraft({ individualNames: event.target.checked }); setPreviewNameIndex(0); }} /><i /></label>{draft.individualNames && <div className="names-editor"><label><span>الأسماء — كل اسم في سطر</span><textarea rows={6} value={draft.names.join("\n")} onChange={(event) => { const nextNames = event.target.value.split("\n").map((name) => name.trim()).filter(Boolean); updateDraft({ names: nextNames }); setPreviewNameIndex(0); }} placeholder={"سارة\nنورة\nريم\nلمى\nهيا"} /></label><div className="names-count"><b>عدد الأسماء: {names.length}</b>{names.length > 0 && <span><button type="button" onClick={() => setPreviewNameIndex((value) => Math.max(0, value - 1))} disabled={previewNameIndex === 0}><ChevronRight size={16} /></button>معاينة {previewNameIndex + 1} من {names.length}<button type="button" onClick={() => setPreviewNameIndex((value) => Math.min(names.length - 1, value + 1))} disabled={previewNameIndex >= names.length - 1}><ChevronLeft size={16} /></button></span>}</div></div>}</div>
            </div>}

            {step === 5 && <div className="quantity-controls">
              <div className="quantity-picker"><div><span>الكمية</span><small>الحد الأدنى 5 بوكسات</small></div><div><button type="button" onClick={() => updateDraft({ quantity: Math.max(5, draft.quantity - 1) })}><Minus size={18} /></button><input type="number" min="5" value={draft.quantity} onChange={(event) => updateDraft({ quantity: Math.max(0, Number(event.target.value)) })} /><button type="button" onClick={() => updateDraft({ quantity: draft.quantity + 1 })}><Plus size={18} /></button></div></div>
              <div className="quantity-presets">{[5, 10, 25, 50].map((quantity) => <button type="button" key={quantity} className={draft.quantity === quantity ? "is-selected" : ""} onClick={() => updateDraft({ quantity })}><b>{quantity}</b><small>{quantity === 5 ? "بدون خصم" : `خصم ${quantity === 10 ? 5 : quantity === 25 ? 10 : 15}%`}</small></button>)}</div>
              <label className="occasion-date"><span><CalendarDays size={18} /><b>متى مناسبتك؟</b><small>سنساعدك في التأكد من أن الموعد مناسب.</small></span><input type="date" value={draft.occasionDate} onChange={(event) => updateDraft({ occasionDate: event.target.value })} /></label>
              <div className="delivery-estimate"><TruckIcon /><span><b>التجهيز المتوقع: {getDeliveryWindow(material.family)}</b><small>يضاف إليها وقت الشحن حسب المدينة وطريقة التوصيل.</small></span></div>
              <PriceBreakdown price={price} />
            </div>}

            {step === 6 && <div className="review-controls">
              <div className={`preflight ${issues.length ? "has-issues" : "is-ready"}`}>{issues.length ? <CircleAlert size={22} /> : <CircleCheck size={22} />}<div><b>{issues.length ? "راجع هذه النقاط" : "تصميمك جاهز للطلب"}</b>{issues.length ? <ul>{issues.map((issue) => <li key={issue}>{issue}</li>)}</ul> : <p>تأكدنا من الخامة، طريقة الإنتاج، المساحة الآمنة، الأسماء والكمية.</p>}{artwork.warning && <small>{artwork.warning}</small>}</div></div>
              <div className="review-card"><h3>ملخص التصميم</h3><dl><div><dt>البوكس</dt><dd>{box.name}</dd></div><div><dt>المقاس</dt><dd>{size.name} · {formatDimensions(size.dimensions)}</dd></div><div><dt>الخامة</dt><dd>{material.name} · {color.name}</dd></div><div><dt>طريقة الإنتاج</dt><dd>{getProductionLabel(material.family)}</dd></div><div><dt>القالب</dt><dd>{template.concept} · {template.variationName}</dd></div><div><dt>النص</dt><dd>{draft.individualNames ? `${names.length} أسماء مختلفة` : `${draft.name}${draft.phrase ? ` — ${draft.phrase}` : ""}`}</dd></div><div><dt>الكمية</dt><dd>{draft.quantity} بوكس</dd></div></dl></div>
              <PriceBreakdown price={price} />
              <div className="review-actions"><button type="button" className="button secondary large" onClick={handleSave}><Save size={18} /> حفظ التصميم</button><button type="button" className="button primary large" onClick={handleCart} disabled={issues.length > 0}><ShoppingBag size={18} /> أضف إلى السلة</button></div>
            </div>}
          </div>

          <div className="controls-footer"><button type="button" onClick={previous} disabled={step === 0}><ArrowRight size={18} /> السابق</button><span>{steps.map((_, index) => <i key={index} className={index === step ? "is-active" : ""} />)}</span>{step < 6 ? <button type="button" className="button primary" onClick={next}>التالي <ArrowLeft size={18} /></button> : <button type="button" className="button primary" onClick={handleCart} disabled={issues.length > 0}>أضف للسلة <ShoppingBag size={17} /></button>}</div>
        </section>

        <section className="preview-column">
          <ConfiguratorPreview draft={draft} open={boxOpen} autoRotate={autoRotate} resetToken={resetToken} previewName={previewName} onToggleOpen={() => setBoxOpen((value) => !value)} onToggleAutoRotate={() => setAutoRotate((value) => !value)} onReset={() => setResetToken((value) => value + 1)} />
          <div className="preview-meta"><span><b>{material.name}</b><small>{artwork.label}</small></span><span><b>{(previewName ?? draft.name) || "اسمك"}</b><small>{template.concept}</small></span></div>
        </section>
      </div>
    </div>
  );
}

function TruckIcon() { return <span className="truck-symbol">↗</span>; }
