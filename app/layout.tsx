import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "中国大陆法律 AI 工作台",
  description: "面向大陆民商事合同场景的法律 AI 工作台 MVP"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
