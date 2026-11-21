import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ระบบค้นหาคอนโดมิเนียมภาษาธรรมชาติ | Thai NLP Condo Search",
  description: "ระบบค้นหาคอนโดมิเนียมจากข้อความภาษาธรรมชาติภาษาไทยตามเงื่อนไขไลฟ์สไตล์ (Next.js + Python FastAPI + SQLite)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="bg-glow" />
        {children}
      </body>
    </html>
  );
}
