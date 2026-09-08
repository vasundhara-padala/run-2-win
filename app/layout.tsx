import type { Metadata } from "next";
import "./globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import Providers from "./providers";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Run2Win",
  description: "Run2Win UI build (static preview data, no backend)",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="min-h-full">
        <AntdRegistry>
          <Providers>
            <div className="min-h-screen bg-slate-50">
              <Header />
              <main className="p-4 sm:p-6">{children}</main>
            </div>
          </Providers>
        </AntdRegistry>
      </body>
    </html>
  );
}