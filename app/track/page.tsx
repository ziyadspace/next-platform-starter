import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { TrackView } from "@/components/orders/TrackView";
export const metadata = { title: "تتبع الطلب" };
export default function TrackPage() { return <><SiteHeader solid /><main className="inner-page"><TrackView /></main><SiteFooter /></>; }
