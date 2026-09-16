"use client";

import { useRouter } from "next/navigation";
import { Edit3, Plus, Trash2 } from "lucide-react";
import { DesignThumb } from "@/components/commerce/DesignThumb";
import { EmptyState } from "@/components/commerce/EmptyState";
import { getBox, getMaterial, getTemplate } from "@/data/catalog";
import { formatDate } from "@/lib/format";
import { getProductionLabel } from "@/lib/orders/status";
import { useAppStore } from "@/store/useAppStore";

export function SavedDesignsView() {
  const router = useRouter();
  const designs = useAppStore((state) => state.savedDesigns);
  const replaceDraft = useAppStore((state) => state.replaceDraft);
  const deleteDesign = useAppStore((state) => state.deleteDesign);
  if (!designs.length) return <EmptyState title="لا توجد تصاميم محفوظة" text="عندما تحفظ تصميمًا سيظهر هنا لتعديله أو طلبه لاحقًا." />;
  return <><div className="account-heading"><div><span>حسابي / تصاميمي</span><h1>تصاميمي المحفوظة</h1><p>استكمل أي تصميم أو ابدأ نسخة جديدة منه.</p></div><button className="button primary" type="button" onClick={() => router.push("/design")}><Plus size={17} /> تصميم جديد</button></div><div className="saved-designs-grid">{designs.map((design) => { const box = getBox(design.boxId); const material = getMaterial(design.materialId); const template = getTemplate(design.templateId); return <article key={design.id} className="saved-design-card"><DesignThumb design={design} /><div className="saved-design-info"><span>{getProductionLabel(material.family)}</span><h2>{design.name || "تصميم بدون اسم"}</h2><p>{box.name} · {material.name}</p><dl><div><dt>القالب</dt><dd>{template.concept}</dd></div><div><dt>الكمية</dt><dd>{design.quantity}</dd></div></dl><small>آخر تعديل: {formatDate(design.updatedAt)}</small><div><button type="button" className="button primary" onClick={() => { replaceDraft(design); router.push("/design"); }}><Edit3 size={16} /> فتح وتعديل</button><button type="button" className="icon-button danger" onClick={() => deleteDesign(design.id)} aria-label="حذف التصميم"><Trash2 size={17} /></button></div></div></article>; })}</div></>;
}
