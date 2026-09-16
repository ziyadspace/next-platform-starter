"use client";

import { useState } from "react";
import { Check, MousePointer2, Sparkles } from "lucide-react";

type DemoMaterial = "paper" | "wood" | "leather";

const options: Array<{ id: DemoMaterial; label: string; method: string }> = [
  { id: "paper", label: "ورق صلب", method: "طباعة حبر ملونة" },
  { id: "wood", label: "خشب بيرش", method: "حفر ليزر" },
  { id: "leather", label: "جلد فاخر", method: "حفر غائر" },
];

export function HeroMaterialDemo() {
  const [material, setMaterial] = useState<DemoMaterial>("paper");
  return (
    <div className="hero-product-stage" aria-label="تجربة خامات بوكس نورة">
      <div className={`hero-box is-${material}`}>
        <div className="box-lid">
          <div className="box-artwork"><Sparkles size={24} /><b>نورة</b><small>مبروك التخرج</small><span>2026</span></div>
        </div>
        <div className="box-front"><span>صُمّم لكِ</span></div>
        <div className="box-side" />
      </div>
      <div className="hero-floating-note"><Check size={16} /><span><b>{options.find((item) => item.id === material)?.method}</b>تتغيّر المعالجة حسب الخامة</span></div>
      <div className="material-demo-switch" role="group" aria-label="اختر خامة المعاينة">
        {options.map((option) => (
          <button key={option.id} type="button" className={material === option.id ? "is-active" : ""} onClick={() => setMaterial(option.id)}>
            <i className={`swatch is-${option.id}`} />{option.label}
          </button>
        ))}
      </div>
      <div className="drag-note"><MousePointer2 size={15} />جرّب تغيير الخامة</div>
    </div>
  );
}
