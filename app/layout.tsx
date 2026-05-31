import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ECommer - Mua sắm trực tuyến",
  description: "Website mua sắm trực tuyến với thanh toán linh hoạt",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
