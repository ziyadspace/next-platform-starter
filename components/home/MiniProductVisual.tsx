import type { MaterialFamily } from "@/types";

export function MiniProductVisual({ name, family, color }: { name: string; family: MaterialFamily; color: string }) {
  return (
    <div className={`mini-product is-${family}`} style={{ "--product-color": color } as React.CSSProperties} aria-hidden="true">
      <div className="mini-lid"><span>{name}</span><i /></div>
      <div className="mini-front" />
      <div className="mini-side" />
    </div>
  );
}
