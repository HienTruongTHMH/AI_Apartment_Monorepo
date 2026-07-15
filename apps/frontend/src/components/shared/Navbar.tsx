'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import {
  Building2,
  Sparkles,
  LogOut,
  ShieldCheck,
  ShieldAlert,
  Search,
  Sliders
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { user, isLoggedIn, logout, toggleAiPanel, updateUser } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isOwnerPath = pathname.startsWith('/owner');
  const isTenantPath = pathname.startsWith('/tenant');
  const currentRole = isOwnerPath ? 'OWNER' : (isTenantPath ? 'TENANT' : user?.role);

  const getRoleLabel = (role?: string) => {
    if (role === 'OWNER') return 'Chủ hộ';
    if (role === 'TENANT') return 'Khách Hàng';
    return role || '';
  };



  const isUserLoggedIn = mounted && isLoggedIn && !!user;

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-[#E8E8E8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-[#E03C3D] p-0.5 shadow-sm group-hover:shadow-md transition-all">
            <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
              <Building2 className="w-5 h-5 text-[#E03C3D] group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div>
            <div className="text-lg font-black tracking-tight text-[#2C2C2C] flex items-center gap-1">
              Nesta <span className="text-[#E03C3D] font-extrabold text-xs px-1.5 py-0.5 rounded bg-red-50 border border-red-100">VIET</span>
            </div>
            <div className="text-[10px] text-[#5A5A5A] uppercase tracking-widest">Luxury Living </div>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium" suppressHydrationWarning>
          <Link
            href="/"
            className={`transition-colors ${pathname === '/' ? 'text-[#2C2C2C] font-bold' : 'text-[#2C2C2C] hover:text-[#E03C3D]'}`}
          >
            Trang Chủ
          </Link>
          <Link
            href="/search"
            className={`flex items-center gap-1.5 transition-colors ${pathname.startsWith('/search') ? 'text-[#2C2C2C] font-bold' : 'text-[#2C2C2C] hover:text-[#E03C3D]'}`}
          >
            <Search className="w-4 h-4" /> Tìm Căn Hộ
          </Link>

          {isUserLoggedIn && currentRole === 'TENANT' && (
            <Link
              href="/tenant/dashboard"
              className={`transition-colors ${pathname.startsWith('/tenant') ? 'text-[#2C2C2C] font-bold' : 'text-[#2C2C2C] hover:text-[#E03C3D]'}`}
            >
              Dashboard Tenant
            </Link>
          )}

          {isUserLoggedIn && currentRole === 'OWNER' && (
            <Link
              href="/owner/dashboard"
              className={`transition-colors ${pathname.startsWith('/owner') ? 'text-[#2C2C2C] font-bold' : 'text-[#2C2C2C] hover:text-[#E03C3D]'}`}
            >
              Dashboard Chủ Nhà
            </Link>
          )}
        </nav>

        {/* Action Controls & User Account Pill */}
        <div className="flex items-center gap-3">


          {/* AI Broker Quick Launch Trigger */}
          <button
            onClick={toggleAiPanel}
            className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-transparent border border-[#E03C3D] text-[#E03C3D] hover:bg-[#FFF5F5] transition-colors duration-200 text-xs font-semibold group"
          >
            <Sparkles className="w-4 h-4 text-[#E03C3D]" />
            <span className="hidden sm:inline">Trợ Lý Tư Vấn Ảo</span>
          </button>

          {/* User Auth Controls */}
          {mounted ? (
            isUserLoggedIn ? (
              <div className="flex items-center gap-2">
                {/* Account Activation Status Badge */}
                {currentRole === 'TENANT' && (
                  <Link
                    href="/tenant/dashboard/activate"
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                      user.isActive
                        ? 'bg-green-50 border-green-200 text-green-700'
                        : 'bg-amber-50 border-amber-200 text-amber-700 animate-pulse'
                    }`}
                    title={user.isActive ? 'Tài khoản đã kích hoạt' : 'Tài khoản chưa kích hoạt (Chờ xác nhận thuê)'}
                  >
                    {user.isActive ? (
                      <>
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Đã kích hoạt</span>
                      </>
                    ) : (
                      <>
                        <ShieldAlert className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Chưa kích hoạt</span>
                      </>
                    )}
                  </Link>
                )}

                <div className="flex items-center gap-2 pl-2 border-l border-[#E8E8E8]">
                  <div className="text-right hidden xl:block">
                    <div className="text-xs font-semibold text-[#2C2C2C]">{user.fullName}</div>
                    <div className="text-[10px] text-[#5A5A5A]">{getRoleLabel(currentRole)}</div>
                  </div>
                  <button
                    onClick={logout}
                    className="w-9 h-9 rounded-xl bg-[#F2F2F2] hover:bg-red-50 border border-[#E8E8E8] hover:border-red-200 flex items-center justify-center text-[#5A5A5A] hover:text-[#E03C3D] transition-all"
                    title="Đăng xuất"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-[#5A5A5A] hover:text-[#2C2C2C] transition-colors"
                >
                  Đăng Nhập
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 rounded-[8px] bg-[#E03C3D] hover:bg-[#C92F30] text-white font-bold text-xs border-0 transition-colors duration-200"
                >
                  Đăng Ký
                </Link>
              </div>
            )
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-16 h-8 rounded-xl bg-[#F2F2F2] animate-pulse" />
              <div className="w-16 h-8 rounded-xl bg-[#F2F2F2] animate-pulse" />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
