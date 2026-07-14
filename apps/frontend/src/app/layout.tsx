import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import UserActivationBanner from '@/components/shared/UserActivationBanner';
import AiBrokerSidePanel from '@/components/ai-broker/AiBrokerSidePanel';

export const metadata: Metadata = {
  title: 'AI Apartment Monorepo - Thuê Căn Hộ Tích Hợp AI Smart Broker',
  description: 'Nền tảng tìm kiếm và quản lý hợp đồng thuê căn hộ tích hợp Trợ lý AI Broker & AI Verifier thông minh.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="dark scroll-smooth" data-scroll-behavior="smooth">
      <body className="bg-[#0b0f19] text-gray-100 min-h-screen flex flex-col antialiased selection:bg-emerald-500 selection:text-slate-950">
        <Navbar />
        <UserActivationBanner />
        <main className="flex-1">
          {children}
        </main>
        <AiBrokerSidePanel />
        <Footer />
      </body>
    </html>
  );
}
