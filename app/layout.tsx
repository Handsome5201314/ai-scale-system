import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI量表系统",
  description: "一核双门 - 医疗量表 AI 平台",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
