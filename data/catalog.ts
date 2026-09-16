import type { BoxModel, DesignDraft, DesignTemplate, Material, MaterialFamily, Order } from "@/types";

export const boxes: BoxModel[] = [
  {
    id: "magnetic",
    name: "بوكس مغناطيسي",
    englishName: "Magnetic Lid Box",
    description: "فتح فاخر بغطاء مفصلي وإغلاق مغناطيسي أنيق.",
    basePrice: 28,
    sizes: [
      { id: "small", name: "صغير", dimensions: [18, 12, 6], priceModifier: 0 },
      { id: "medium", name: "وسط", dimensions: [24, 18, 8], priceModifier: 8 },
      { id: "large", name: "كبير", dimensions: [30, 22, 10], priceModifier: 16 },
    ],
  },
  {
    id: "drawer",
    name: "بوكس درج",
    englishName: "Drawer Box",
    description: "تجربة فتح سلسة بدرج داخلي وغلاف خارجي متين.",
    basePrice: 25,
    sizes: [
      { id: "small", name: "صغير", dimensions: [15, 10, 5], priceModifier: 0 },
      { id: "medium", name: "وسط", dimensions: [20, 14, 6], priceModifier: 7 },
      { id: "large", name: "كبير", dimensions: [26, 18, 8], priceModifier: 14 },
    ],
  },
  {
    id: "lid-base",
    name: "بوكس بغطاء منفصل",
    englishName: "Lid & Base Box",
    description: "هيكل كلاسيكي بغطاء منفصل يناسب جميع الخامات.",
    basePrice: 26,
    sizes: [
      { id: "small", name: "صغير", dimensions: [16, 16, 6], priceModifier: 0 },
      { id: "medium", name: "وسط", dimensions: [22, 22, 8], priceModifier: 8 },
      { id: "large", name: "كبير", dimensions: [28, 28, 10], priceModifier: 15 },
    ],
  },
];

export const materials: Material[] = [
  {
    id: "sbs-white",
    family: "paper",
    name: "كرتون أبيض فاخر",
    englishName: "SBS / FBB Premium White Paperboard",
    description: "سطح أبيض ناعم يعرض الألوان المطبوعة بدقة ووضوح.",
    productionMethod: "ink-print",
    priceModifier: 0,
    colors: [
      { id: "white", name: "أبيض", hex: "#f7f7f3" },
      { id: "warm-white", name: "أبيض دافئ", hex: "#eee9df" },
      { id: "soft-black", name: "أسود هادئ", hex: "#252827" },
    ],
    finishes: ["matte", "gloss"],
    compatibleBoxes: ["magnetic", "drawer", "lid-base"],
  },
  {
    id: "kraft",
    family: "paper",
    name: "كرتون كرافت طبيعي",
    englishName: "Natural Kraft Paperboard",
    description: "ملمس طبيعي دافئ مع ظهور خفيف لألياف الورق.",
    productionMethod: "ink-print",
    priceModifier: 3,
    colors: [
      { id: "natural", name: "كرافت طبيعي", hex: "#b98b57" },
      { id: "light", name: "كرافت فاتح", hex: "#d0aa78" },
      { id: "dark", name: "كرافت داكن", hex: "#805c38" },
    ],
    finishes: ["matte"],
    compatibleBoxes: ["magnetic", "drawer", "lid-base"],
  },
  {
    id: "rigid-paper",
    family: "paper",
    name: "كرتون صلب فاخر",
    englishName: "Rigid Grey Chipboard + Art Paper Wrap",
    description: "قلب رمادي صلب مغلف بورق فني مطبوع لمظهر فاخر.",
    productionMethod: "ink-print",
    priceModifier: 7,
    colors: [
      { id: "white", name: "أبيض", hex: "#f3f1ea" },
      { id: "cream", name: "كريمي", hex: "#e4d6bc" },
      { id: "black", name: "أسود", hex: "#171b19" },
    ],
    finishes: ["matte", "gloss"],
    compatibleBoxes: ["magnetic", "drawer", "lid-base"],
  },
  {
    id: "birch",
    family: "wood",
    name: "خشب بيرش",
    englishName: "Birch Plywood",
    description: "طبقات بيرش طبيعية بحفر ليزر غائر وتدرج محروق خفيف.",
    productionMethod: "laser-engraving-wood",
    priceModifier: 20,
    colors: [
      { id: "natural", name: "طبيعي", hex: "#cda66f" },
      { id: "warm", name: "دافئ", hex: "#a7794f" },
      { id: "dark-stained", name: "مصبوغ داكن", hex: "#604633" },
    ],
    compatibleBoxes: ["drawer", "lid-base"],
  },
  {
    id: "full-grain",
    family: "leather",
    name: "جلد طبيعي كامل الحبة",
    englishName: "Full-Grain Leather",
    description: "حبيبات طبيعية ولمسة غنية مع حفر ليزر تونالي راقٍ.",
    productionMethod: "laser-engraving-leather",
    priceModifier: 24,
    colors: [
      { id: "tan", name: "جملي", hex: "#a76d42" },
      { id: "dark-brown", name: "بني داكن", hex: "#4b3027" },
      { id: "black", name: "أسود", hex: "#171918" },
    ],
    compatibleBoxes: ["magnetic", "lid-base"],
  },
  {
    id: "saffiano",
    family: "leather",
    name: "جلد سافيانو",
    englishName: "Saffiano Leather",
    description: "نقشة متقاطعة دقيقة ومظهر رسمي مقاوم للخدش.",
    productionMethod: "laser-engraving-leather",
    priceModifier: 21,
    colors: [
      { id: "black", name: "أسود", hex: "#161817" },
      { id: "burgundy", name: "عنابي", hex: "#5d1c2a" },
      { id: "forest-green", name: "أخضر غابة", hex: "#173e33" },
    ],
    compatibleBoxes: ["magnetic", "lid-base"],
  },
  {
    id: "pu-leather",
    family: "leather",
    name: "جلد صناعي فاخر",
    englishName: "Premium PU Leather",
    description: "سطح متجانس ناعم مناسب للحفر الشخصي الدقيق.",
    productionMethod: "laser-engraving-leather",
    priceModifier: 13,
    colors: [
      { id: "black", name: "أسود", hex: "#181a19" },
      { id: "cream", name: "كريمي", hex: "#e3d4bb" },
      { id: "royal-green", name: "أخضر ملكي", hex: "#0e5149" },
    ],
    compatibleBoxes: ["magnetic", "drawer", "lid-base"],
  },
];

const templateGroups: Record<MaterialFamily, Array<{ concept: string; variations: Array<[string, string, [string, string, string], DesignTemplate["pattern"]]> }>> = {
  paper: [
    { concept: "لحظة تخرج", variations: [
      ["emerald", "زمردي", ["#0e5149", "#d6b76a", "#f7f3ea"], "stars"],
      ["burgundy", "عنابي", ["#6a1f32", "#e3bc73", "#fff8ef"], "frame"],
      ["midnight", "ليلي", ["#17213b", "#a9c6d9", "#ffffff"], "lines"],
    ] },
    { concept: "فرحة العيد", variations: [
      ["sand", "رملي", ["#b78855", "#f5ead7", "#365a4c"], "arches"],
      ["green", "أخضر", ["#155b48", "#d9c889", "#f8f2e8"], "corners"],
      ["navy", "كحلي", ["#172d4f", "#d5b56f", "#ffffff"], "stars"],
    ] },
    { concept: "لمّة", variations: [
      ["terracotta", "طوبي", ["#a6533f", "#f1d9bd", "#47322d"], "band"],
      ["olive", "زيتوني", ["#5c6737", "#ded3a3", "#fbf8ed"], "frame"],
      ["plum", "برقوقي", ["#59304c", "#d2a6b9", "#fff6f3"], "corners"],
    ] },
  ],
  wood: [
    { concept: "نقش الاسم", variations: [
      ["name", "الاسم فقط", ["#3e2516", "#714b2e", "#cda66f"], "signature"],
      ["name-date", "الاسم + التاريخ", ["#3b2416", "#805637", "#cda66f"], "frame"],
      ["name-phrase", "الاسم + العبارة", ["#382215", "#765039", "#cda66f"], "lines"],
    ] },
    { concept: "خطوط تراثية", variations: [
      ["corner", "زاوية", ["#3b2417", "#6f4930", "#cda66f"], "corners"],
      ["frame", "إطار", ["#362116", "#76513a", "#cda66f"], "frame"],
      ["center-band", "شريط وسطي", ["#3a2418", "#795239", "#cda66f"], "band"],
    ] },
    { concept: "مناسبة", variations: [
      ["graduation", "تخرج", ["#382116", "#714b31", "#cda66f"], "stars"],
      ["eid", "عيد", ["#3c2618", "#735035", "#cda66f"], "arches"],
      ["family", "عائلة", ["#3a2519", "#765039", "#cda66f"], "frame"],
    ] },
  ],
  leather: [
    { concept: "حروف", variations: [
      ["centered", "وسط", ["#161817", "#343735", "#8b6a4e"], "badge"],
      ["corner", "زاوية", ["#181918", "#3b3530", "#9c7350"], "corners"],
      ["badge", "شارة", ["#161817", "#42362e", "#9a704e"], "badge"],
    ] },
    { concept: "نقش أنيق", variations: [
      ["crest", "شعار وسطي", ["#181918", "#43392f", "#9f7451"], "badge"],
      ["minimal", "خط بسيط", ["#171918", "#3b332d", "#946b4c"], "lines"],
      ["signature", "توقيع", ["#171918", "#40352f", "#986f50"], "signature"],
    ] },
    { concept: "اسمك", variations: [
      ["horizontal", "أفقي", ["#171918", "#3f352f", "#987050"], "band"],
      ["stacked", "متراص", ["#171918", "#45372f", "#9e7554"], "frame"],
      ["small-signature", "توقيع صغير", ["#171918", "#3f342e", "#956b4d"], "signature"],
    ] },
  ],
};

export const templates: DesignTemplate[] = (Object.keys(templateGroups) as MaterialFamily[]).flatMap((family) =>
  templateGroups[family].flatMap((group) =>
    group.variations.map(([variation, variationName, palette, pattern]) => ({
      id: `${family}-${group.concept}-${variation}`,
      family,
      concept: group.concept,
      variation,
      variationName,
      palette,
      pattern,
      engravingCompatibility: family === "paper" ? "adapted" : "native",
    })),
  ),
);

export const defaultDraft: DesignDraft = {
  id: "draft-main",
  boxId: "magnetic",
  sizeId: "medium",
  materialId: "rigid-paper",
  materialColorId: "white",
  productionMethod: "ink-print",
  templateId: "paper-لحظة تخرج-emerald",
  name: "نورة",
  phrase: "مبروك التخرج",
  year: "2026",
  font: "IBM Plex Sans Arabic",
  fontSize: 62,
  fontWeight: 700,
  alignment: "center",
  placement: "lid",
  textColor: "#0e5149",
  finish: "matte",
  engravingDepth: "medium",
  individualNames: false,
  names: [],
  quantity: 10,
  occasionDate: "",
  updatedAt: new Date(2026, 8, 16).toISOString(),
};

export const showcaseProducts = [
  { name: "لحظة نورة", occasion: "تخرج", materialId: "rigid-paper", color: "#0e5149" },
  { name: "عيدنا أجمل", occasion: "عيد", materialId: "kraft", color: "#b78855" },
  { name: "ذكرى خالد", occasion: "ميلاد", materialId: "saffiano", color: "#5d1c2a" },
  { name: "بيت العروس", occasion: "زواج", materialId: "full-grain", color: "#a76d42" },
  { name: "لمّة العائلة", occasion: "عائلة", materialId: "birch", color: "#cda66f" },
  { name: "لأنك تستحق", occasion: "هدية خاصة", materialId: "pu-leather", color: "#0e5149" },
];

export const seedDrafts: DesignDraft[] = [
  { ...defaultDraft, id: "design-seed-1", updatedAt: "2026-09-15T17:20:00.000Z" },
  { ...defaultDraft, id: "design-seed-2", boxId: "drawer", materialId: "birch", materialColorId: "natural", productionMethod: "laser-engraving-wood", templateId: "wood-مناسبة-graduation", name: "سارة", phrase: "خطوة جديدة", quantity: 12, updatedAt: "2026-09-12T09:10:00.000Z" },
  { ...defaultDraft, id: "design-seed-3", boxId: "lid-base", materialId: "full-grain", materialColorId: "tan", productionMethod: "laser-engraving-leather", templateId: "leather-اسمك-horizontal", name: "ريم", phrase: "بكل حب", quantity: 8, updatedAt: "2026-09-08T14:30:00.000Z" },
];

export const seedOrders: Order[] = [];

export const getBox = (id: DesignDraft["boxId"]) => boxes.find((box) => box.id === id) ?? boxes[0];
export const getMaterial = (id: DesignDraft["materialId"]) => materials.find((material) => material.id === id) ?? materials[0];
export const getTemplate = (id: string) => templates.find((template) => template.id === id) ?? templates[0];
export const formatDimensions = (dimensions: [number, number, number]) => `${dimensions[0]} × ${dimensions[1]} × ${dimensions[2]} سم`;
