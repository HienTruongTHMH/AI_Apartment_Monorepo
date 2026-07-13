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

  const handleRoleSwitch = (role: 'GUEST' | 'TENANT' | 'OWNER') => {
    if (!user) {
      useAuthStore.getState().setAuth('demo-token-123', {
        id: 'user-demo-id',
        email: 'demo@aiapartment.vn',
        fullName: role === 'OWNER' ? 'Chủ Nhà Demo' : 'Người Thuê Demo',
        isActive: false,
        role: role
      });
    } else {
      updateUser({ role });
    }
  };

  const isUserLoggedIn = mounted && isLoggedIn && !!user;

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 p-0.5 shadow-[0_0_20px_rgba(16,185,129,0.3)] group-hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Building2 className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div>
            <div className="text-lg font-black tracking-tight text-white flex items-center gap-1">
              AI APARTMENT <span className="text-emerald-400 font-extrabold text-xs px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">MONOREPO</span>
            </div>
            <div className="text-[10px] text-gray-400 uppercase tracking-widest">Luxury Living & AI Broker</div>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium" suppressHydrationWarning>
          <Link
            href="/"
            className={`transition-colors ${pathname === '/' ? 'text-emerald-400 font-semibold' : 'text-gray-300 hover:text-white'}`}
          >
            Trang Chủ
          </Link>
          <Link
            href="/search"
            className={`flex items-center gap-1.5 transition-colors ${pathname.startsWith('/search') ? 'text-emerald-400 font-semibold' : 'text-gray-300 hover:text-white'}`}
          >
            <Search className="w-4 h-4" /> Tìm Căn Hộ
          </Link>

          {isUserLoggedIn && user?.role === 'TENANT' && (
            <Link
              href="/tenant/dashboard"
              className={`transition-colors ${pathname.startsWith('/tenant') ? 'text-emerald-400 font-semibold' : 'text-gray-300 hover:text-white'}`}
            >
              Dashboard Tenant
            </Link>
          )}

          {isUserLoggedIn && user?.role === 'OWNER' && (
            <Link
              href="/owner/dashboard"
              className={`transition-colors ${pathname.startsWith('/owner') ? 'text-emerald-400 font-semibold' : 'text-gray-300 hover:text-white'}`}
            >
              Dashboard Chủ Nhà
            </Link>
          )}
        </nav>

        {/* Action Controls & User Account Pill */}
        <div className="flex items-center gap-3">
          {/* Quick Demo Persona Switcher Tooltip */}
          <div className="hidden lg:flex items-center gap-1 bg-slate-900 border border-white/10 p-1 rounded-xl text-xs">
            <span className="text-[10px] text-gray-400 px-2 flex items-center gap-1">
              <Sliders className="w-3 h-3 text-emerald-400" /> Vai trò:
            </span>
            <button
              onClick={() => handleRoleSwitch('TENANT')}
              className={`px-2.5 py-1 rounded-lg transition-all text-xs font-medium ${
                mounted && user?.role === 'TENANT' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-gray-400 hover:text-white'
              }`}
            >
              Tenant
            </button>
            <button
              onClick={() => handleRoleSwitch('OWNER')}
              className={`px-2.5 py-1 rounded-lg transition-all text-xs font-medium ${
                mounted && user?.role === 'OWNER' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-gray-400 hover:text-white'
              }`}
            >
              Owner
            </button>
          </div>

          {/* AI Broker Quick Launch Trigger */}
          <button
            onClick={toggleAiPanel}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 text-emerald-300 hover:border-emerald-400 transition-all text-xs font-semibold"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">AI Broker Chat</span>
          </button>

          {/* User Auth Controls */}
          {mounted ? (
            isUserLoggedIn ? (
              <div className="flex items-center gap-2">
                {/* Account Activation Status Badge */}
                <Link
                  href="/tenant/dashboard/activate"
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                    user.isActive
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                      : 'bg-amber-500/10 border-amber-500/40 text-amber-400 animate-pulse'
                  }`}
                  title={user.isActive ? 'Tài khoản đã kích hoạt' : 'Tài khoản chưa kích hoạt (Chờ xác nhận thuê)'}
                >
                  {user.isActive ? (
                    <>
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Active</span>
                    </>
                  ) : (
                    <>
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">isActive=false</span>
                    </>
                  )}
                </Link>

                {/* User Dropdown / Profile */}
                <div className="flex items-center gap-2 pl-2 border-l border-white/10">
                  <div className="text-right hidden xl:block">
                    <div className="text-xs font-semibold text-white">{user.fullName}</div>
                    <div className="text-[10px] text-gray-400">{user.role}</div>
                  </div>
                  <button
                    onClick={logout}
                    className="w-9 h-9 rounded-xl bg-white/5 hover:bg-rose-500/20 border border-white/10 hover:border-rose-500/40 flex items-center justify-center text-gray-400 hover:text-rose-400 transition-all"
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
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-gray-300 hover:text-white transition-colors"
                >
                  Đăng Nhập
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 hover:scale-105 transition-transform"
                >
                  Đăng Ký
                </Link>
              </div>
            )
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-16 h-8 rounded-xl bg-white/5 animate-pulse" />
              <div className="w-16 h-8 rounded-xl bg-white/5 animate-pulse" />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
