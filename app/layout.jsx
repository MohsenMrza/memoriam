import "./globals.css";
import { Tinos } from "next/font/google";

// Tinos is a free font that looks identical to Times New Roman. Phones don't
// ship with Times New Roman, so we load this one for every device.
const tinos = Tinos({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-tinos",
});

export const metadata = {
  title: "Memoriam",
  description:
    "A digital memorial platform that preserves identity beyond the gravestone.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#10503b",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={tinos.variable}>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
