import type { DesignDraft, DesignTemplate, Material, MaterialFamily, ProductionMethod } from "@/types";

export interface ProductionArtwork {
  family: MaterialFamily;
  method: ProductionMethod;
  label: string;
  artworkMode: "full-color-ink" | "burned-engraving" | "tonal-deboss";
  supportsInkColor: boolean;
  primary: string;
  secondary: string;
  accent: string;
  opacity: number;
  bumpScale: number;
  roughness: number;
  warning?: string;
}

function tonalEngravingColor(baseHex: string, family: MaterialFamily, depth: DesignDraft["engravingDepth"]) {
  const hex = baseHex.replace("#", "");
  const number = Number.parseInt(hex.length === 3 ? hex.split("").map((c) => c + c).join("") : hex, 16);
  const rgb = [(number >> 16) & 255, (number >> 8) & 255, number & 255];
  const luminance = rgb[0] * 0.299 + rgb[1] * 0.587 + rgb[2] * 0.114;
  const factor = depth === "light" ? 0.74 : depth === "dark" ? 0.42 : 0.58;
  const adjusted = luminance < 52
    ? rgb.map((value) => Math.min(255, Math.round(value + (depth === "dark" ? 38 : 52))) )
    : rgb.map((value) => Math.max(0, Math.round(value * factor)));
  if (family === "wood") adjusted[0] = Math.min(255, adjusted[0] + 12);
  return `#${adjusted.map((value) => value.toString(16).padStart(2, "0")).join("")}`;
}

export function getProductionArtwork(
  template: DesignTemplate,
  material: Material,
  draft: DesignDraft,
  baseColor: string,
): ProductionArtwork {
  if (material.family === "paper") {
    return {
      family: "paper",
      method: "ink-print",
      label: "طباعة حبر مسطّحة",
      artworkMode: "full-color-ink",
      supportsInkColor: true,
      primary: draft.textColor || template.palette[0],
      secondary: template.palette[1],
      accent: template.palette[2],
      opacity: 0.98,
      bumpScale: 0,
      roughness: draft.finish === "gloss" ? 0.34 : 0.72,
    };
  }

  const engraving = tonalEngravingColor(baseColor, material.family, draft.engravingDepth);
  return {
    family: material.family,
    method: material.productionMethod,
    label: material.family === "wood" ? "حفر ليزر على الخشب" : "حفر ليزر غائر",
    artworkMode: material.family === "wood" ? "burned-engraving" : "tonal-deboss",
    supportsInkColor: false,
    primary: engraving,
    secondary: engraving,
    accent: engraving,
    opacity: draft.engravingDepth === "light" ? 0.55 : draft.engravingDepth === "dark" ? 0.9 : 0.74,
    bumpScale: draft.engravingDepth === "light" ? -0.012 : draft.engravingDepth === "dark" ? -0.035 : -0.022,
    roughness: material.family === "wood" ? 0.9 : 0.76,
    warning: template.family === "paper" ? "بعض تفاصيل التصميم دقيقة جدًا للحفر، تم تبسيطها للمعاينة." : undefined,
  };
}
