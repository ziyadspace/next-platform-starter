"use client";

import dynamic from "next/dynamic";
import { LoaderCircle, Maximize2, Pause, Play, RotateCcw, ScanLine } from "lucide-react";
import type { DesignDraft } from "@/types";
import { getMaterial, getTemplate } from "@/data/catalog";
import { getProductionArtwork } from "@/lib/rendering/productionArtwork";

const ThreePreview = dynamic(() => import("@/components/3d/ThreePreview"), {
  ssr: false,
  loading: () => (
    <div className="preview-loading" role="status"><LoaderCircle className="spin" /><span>نجهّز المعاينة الواقعية…</span></div>
  ),
});

interface Props {
  draft: DesignDraft;
  open: boolean;
  autoRotate: boolean;
  resetToken: number;
  previewName?: string;
  onToggleOpen: () => void;
  onToggleAutoRotate: () => void;
  onReset: () => void;
  compact?: boolean;
}

export function ConfiguratorPreview({ draft, open, autoRotate, resetToken, previewName, onToggleOpen, onToggleAutoRotate, onReset, compact }: Props) {
  const material = getMaterial(draft.materialId);
  const template = getTemplate(draft.templateId);
  const color = material.colors.find((item) => item.id === draft.materialColorId)?.hex ?? material.colors[0].hex;
  const artwork = getProductionArtwork(template, material, draft, color);
  return (
    <div className={`three-preview ${compact ? "is-compact" : ""}`}>
      <div className="preview-topline">
        <span className={`production-chip is-${material.family}`}><ScanLine size={15} />{artwork.label}</span>
        <span className="live-chip"><i /> معاينة مباشرة</span>
      </div>
      <ThreePreview draft={draft} open={open} autoRotate={autoRotate} resetToken={resetToken} previewName={previewName} />
      <div className="preview-toolbar" aria-label="أدوات المعاينة">
        <button type="button" onClick={onToggleAutoRotate} title={autoRotate ? "إيقاف الدوران" : "تشغيل الدوران"}>{autoRotate ? <Pause size={18} /> : <Play size={18} />}</button>
        <button type="button" onClick={onReset} title="إعادة ضبط الكاميرا"><RotateCcw size={18} /></button>
        <button type="button" onClick={onToggleOpen} className={open ? "is-active" : ""}><Maximize2 size={18} />{open ? "إغلاق البوكس" : "فتح البوكس"}</button>
      </div>
      <div className="preview-hint">اسحب للتدوير · مرّر للتقريب</div>
    </div>
  );
}
