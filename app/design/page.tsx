import { AuthGate } from "@/components/auth/AuthGate";
import { Configurator } from "@/components/configurator/Configurator";
import { SiteHeader } from "@/components/layout/SiteHeader";

export const metadata = { title: "صمّم بوكسك" };

export default function DesignPage() {
  return <AuthGate><SiteHeader solid /><Configurator /></AuthGate>;
}
