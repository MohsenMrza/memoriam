import "./globals.css";

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
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
