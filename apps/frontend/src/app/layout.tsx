import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import UserActivationBanner from '@/components/shared/UserActivationBanner';
import AiBrokerSidePanel from '@/components/ai-broker/AiBrokerSidePanel';

export const metadata: Metadata = {
  title: 'Apartment Network - Nền Tảng Thuê Căn Hộ Cao Cấp',
  description: 'Hệ thống tìm kiếm, ký kết hợp đồng trực tiếp và quản lý thuê căn hộ chính chủ. Trải nghiệm tìm nhà nhanh chóng qua trợ lý ảo thông minh, bảo mật và thông tin xác thực.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="scroll-smooth" data-scroll-behavior="smooth">
      <body className="bg-[#FFFFFF] text-[#2C2C2C] min-h-screen flex flex-col antialiased selection:bg-[#E03C3D] selection:text-white">
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