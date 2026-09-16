export type BoxId = "magnetic" | "drawer" | "lid-base";
export type MaterialId =
  | "sbs-white"
  | "kraft"
  | "rigid-paper"
  | "birch"
  | "full-grain"
  | "saffiano"
  | "pu-leather";
export type MaterialFamily = "paper" | "wood" | "leather";
export type ProductionMethod =
  | "ink-print"
  | "laser-engraving-wood"
  | "laser-engraving-leather";
export type Finish = "matte" | "gloss";
export type EngravingDepth = "light" | "medium" | "dark";
export type Placement = "lid" | "front" | "side";
export type TextAlign = "right" | "center" | "left";

export interface BoxSize {
  id: "small" | "medium" | "large";
  name: string;
  dimensions: [number, number, number];
  priceModifier: number;
}

export interface BoxModel {
  id: BoxId;
  name: string;
  englishName: string;
  description: string;
  basePrice: number;
  sizes: BoxSize[];
}

export interface MaterialColor {
  id: string;
  name: string;
  hex: string;
}

export interface Material {
  id: MaterialId;
  family: MaterialFamily;
  name: string;
  englishName: string;
  description: string;
  productionMethod: ProductionMethod;
  priceModifier: number;
  colors: MaterialColor[];
  finishes?: Finish[];
  compatibleBoxes: BoxId[];
}

export interface DesignTemplate {
  id: string;
  family: MaterialFamily;
  concept: string;
  variation: string;
  variationName: string;
  palette: [string, string, string];
  pattern: "stars" | "arches" | "lines" | "frame" | "band" | "badge" | "signature" | "corners";
  engravingCompatibility: "native" | "adapted";
}

export interface DesignDraft {
  id: string;
  boxId: BoxId;
  sizeId: BoxSize["id"];
  materialId: MaterialId;
  materialColorId: string;
  productionMethod: ProductionMethod;
  templateId: string;
  name: string;
  phrase: string;
  year: string;
  font: string;
  fontSize: number;
  fontWeight: number;
  alignment: TextAlign;
  placement: Placement;
  textColor: string;
  finish: Finish;
  engravingDepth: EngravingDepth;
  individualNames: boolean;
  names: string[];
  quantity: number;
  occasionDate: string;
  updatedAt: string;
}

export interface PriceBreakdown {
  unitPrice: number;
  quantity: number;
  discountRate: number;
  discountAmount: number;
  subtotalBeforeDiscount: number;
  subtotal: number;
  shipping: number;
  vat: number;
  total: number;
}

export interface User {
  id: string;
  fullName: string;
  mobile: string;
  email: string;
}

export interface RegisteredUser extends User {
  password: string;
}

export interface Address {
  id: string;
  label: string;
  recipient: string;
  mobile: string;
  city: string;
  district: string;
  street: string;
  building: string;
  postalCode: string;
}

export interface CartItem {
  id: string;
  design: DesignDraft;
  price: PriceBreakdown;
  addedAt: string;
}

export type OrderStatus =
  | "received"
  | "design-review"
  | "preparing"
  | "production"
  | "quality"
  | "ready"
  | "shipped"
  | "delivered";

export interface Order {
  id: string;
  number: string;
  createdAt: string;
  status: OrderStatus;
  items: CartItem[];
  address: Address;
  paymentMethod: "mada" | "apple-pay" | "credit-card";
  deliveryMethod: "standard" | "express";
  total: number;
  estimatedDelivery: string;
}
