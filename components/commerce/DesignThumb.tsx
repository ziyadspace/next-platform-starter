import { getMaterial } from "@/data/catalog";
import type { DesignDraft } from "@/types";

export function DesignThumb({ design, small = false }: { design: DesignDraft; small?: boolean }) {
  const material = getMaterial(design.materialId);
  const color = material.colors.find((item) => item.id === design.materialColorId)?.hex ?? material.colors[0].hex;
  return (
    <div className={`design-thumb is-${material.family} ${small ? "is-small" : ""}`} style={{ "--thumb-color": color } as React.CSSProperties}>
      <div className="design-thumb-box"><div className="design-thumb-lid"><span>{design.name || "اسمك"}</span><small>{design.phrase}</small></div><div className="design-thumb-front" /><div className="design-thumb-side" /></div>
      <span className="thumb-method">{material.family === "paper" ? "حبر" : "ليزر"}</span>
    </div>
  );
}
