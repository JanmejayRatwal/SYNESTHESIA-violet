import type { Metadata, Viewport } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "A Little Universe for You",
  description: "Someone has left a little universe for you. Open when you're ready. ✨.",
  robots: { index: false, follow: false }
};
export const viewport: Viewport = {
  themeColor: "#03040c", width: "device-width", initialScale: 1, viewportFit: "cover"
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
