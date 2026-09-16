import type { Metadata } from "next";
import "@fontsource/ibm-plex-sans-arabic/400.css";
import "@fontsource/ibm-plex-sans-arabic/500.css";
import "@fontsource/ibm-plex-sans-arabic/600.css";
import "@fontsource/ibm-plex-sans-arabic/700.css";
import "./globals.css";
import "@/styles/home.css";
import "@/styles/configurator.css";
import "@/styles/commerce.css";
import "@/styles/account.css";
import "@/styles/responsive.css";

export const metadata: Metadata = {
  title: {
    default: "غلّف | صمّم بوكسك بطريقتك",
    template: "%s | غلّف",
  },
  description: "منصة سعودية لتصميم وطلب بوكسات شخصية بكميات قليلة، مع معاينة مباشرة للطباعة والحفر قبل الطلب.",
  icons: { icon: "/brand/ghallif-logo.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
