import Link from "next/link";
import { ArrowLeft, PackageOpen } from "lucide-react";

export function EmptyState({ title, text, href = "/design", action = "ابدأ تصميم بوكسك" }: { title: string; text: string; href?: string; action?: string }) {
  return <div className="empty-state"><span><PackageOpen size={34} /></span><h2>{title}</h2><p>{text}</p><Link href={href} className="button primary">{action}<ArrowLeft size={17} /></Link></div>;
}
