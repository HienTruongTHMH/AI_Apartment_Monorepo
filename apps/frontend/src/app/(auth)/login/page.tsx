'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { apiClient } from '@/lib/api';
import { Building2, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await apiClient.post('/auth/login', { email, password });
      const token = res.data?.accessToken || res.data?.access_token;

      if (!token) {
        throw new Error('Không nhận được token xác thực từ backend.');
      }
      
      let profileData: { id: string; email: string; fullName: string; phone: string; isActive: boolean; role: 'TENANT' | 'OWNER' | 'GUEST' } = {
        id: 'usr-' + Date.now(),
        email: email,
        fullName: 'Người Dùng AI Apartment',
        phone: '0901234567',
        isActive: false, // Initial state specification
        role: 'TENANT'
      };

      try {
        const meRes = await apiClient.get('/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (meRes.data && meRes.data.user) {
          const u = meRes.data.user;
          profileData = {
            id: u.accountId || profileData.id,
            email: u.email || email,
            fullName: u.fullName || profileData.fullName,
            phone: profileData.phone,
            isActive: false,
            role: u.hasOwnerProfile ? 'OWNER' : 'TENANT'
          };
        }
      } catch {
        // Fallback for profile data if /auth/me fails
      }

      setAuth(token, profileData);
      router.push(profileData.role === 'OWNER' ? '/owner/dashboard' : '/tenant/dashboard');
    } catch (err: any) {
      const serverMessage = err.response?.data?.message;
      if (Array.isArray(serverMessage)) {
        setErrorMsg(serverMessage.join(', '));
      } else if (typeof serverMessage === 'string') {
        setErrorMsg(serverMessage);
      } else if (err.message) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg('Email hoặc mật khẩu không tồn tại trên hệ thống DB!');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md p-8 rounded-3xl bg-slate-900/80 border border-white/10 glass-panel shadow-2xl space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-emerald-400 mb-2">
            <Building2 className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-white">Đăng Nhập Tài Khoản</h1>
          <p className="text-xs text-gray-400">Chào mừng trở lại với AI Apartment Monorepo</p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-300">Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="nhapemail@domain.com"
                className="w-full bg-slate-950 border border-white/10 focus:border-emerald-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-300">Mật khẩu</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-white/10 focus:border-emerald-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 text-slate-950 font-extrabold text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 mt-4"
          >
            <span>{loading ? 'Đang xác thực với Database...' : 'Đăng Nhập'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-gray-400 pt-2 border-t border-white/5">
          Chưa có tài khoản?{' '}
          <Link href="/register" className="text-emerald-400 font-bold hover:underline">
            Tạo tài khoản mới (`isActive = false`)
          </Link>
        </div>
      </div>
    </div>
  );
}
