import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Program Studi Teknologi Informasi - Universitas Timor (UNIMOR)",
  description: "Website Resmi Program Studi Teknologi Informasi, Fakultas Pertanian, Sains dan Kesehatan, Universitas Timor. Unggul dalam rekayasa perangkat lunak, sistem cerdas, dan keamanan siber.",
  keywords: ["Teknologi Informasi", "UNIMOR", "Universitas Timor", "Kefamenanu", "TTU", "Kuliah IT NTT", "Prodi TI"],
  icons: {
    icon: "/images/logo-unimor.png",
    apple: "/images/logo-unimor.png"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className="min-h-screen flex flex-col font-sans bg-slate-50 text-slate-900 antialiased selection:bg-blue-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
