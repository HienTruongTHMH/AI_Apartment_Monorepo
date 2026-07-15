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

      const meRes = await apiClient.get('/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!meRes.data?.user) {
        throw new Error('Không thể tải thông tin tài khoản. Vui lòng thử lại.');
      }

      const u = meRes.data.user;
      
      // Normalize and infer role correctly based on backend payload
      let finalRole: 'GUEST' | 'TENANT' | 'OWNER' = 'GUEST';
      if (u.role) {
        const upper = u.role.toUpperCase();
        if (upper === 'OWNER') finalRole = 'OWNER';
        else if (upper === 'TENANT') finalRole = 'TENANT';
        else if (upper === 'GUEST') finalRole = 'GUEST';
      } else {
        if (u.hasOwnerProfile || u.ownerProfileId) {
          finalRole = 'OWNER';
        } else if (u.hasTenantProfile || u.tenantProfileId) {
          finalRole = 'TENANT';
        }
      }

      const profileData = {
        id: u.accountId,
        email: u.email,
        fullName: u.fullName,
        phone: u.phone || '',
        identityCard: u.identityCard,
        isActive: u.isActive,
        role: finalRole,
        tenantProfileId: u.tenantProfileId || undefined,
        ownerProfileId: u.ownerProfileId || undefined,
      };
      setAuth(token, profileData);
      router.push('/');
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
      <div className="w-full max-w-md p-8 rounded-3xl bg-white border border-[#E8E8E8] shadow-xl space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-[#FFF5F5] border border-[#E03C3D]/10 text-[#E03C3D] mb-2">
            <Building2 className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-[#2C2C2C]">Đăng Nhập Tài Khoản</h1>
          <p className="text-xs text-[#5A5A5A]">Chào mừng trở lại với AI Apartment Monorepo</p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-[#FFF5F5] border border-red-200 text-red-600 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#2C2C2C]">Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="nhapemail@domain.com"
                className="w-full bg-[#F9F9F9] border border-[#E8E8E8] focus:border-[#E03C3D] focus:ring-1 focus:ring-[#E03C3D]/20 rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#2C2C2C] focus:outline-none transition-all placeholder-gray-400"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#2C2C2C]">Mật khẩu</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-[#F9F9F9] border border-[#E8E8E8] focus:border-[#E03C3D] focus:ring-1 focus:ring-[#E03C3D]/20 rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#2C2C2C] focus:outline-none transition-all placeholder-gray-400"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-[#E03C3D] hover:bg-[#C92F30] disabled:opacity-50 text-white font-extrabold text-sm transition-all flex items-center justify-center gap-2 mt-4 shadow-sm"
          >
            <span>{loading ? 'Đang Xử Lý xác thực...' : 'Đăng Nhập'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-[#5A5A5A] pt-2 border-t border-[#E8E8E8]">
          Chưa có tài khoản?{' '}
          <Link href="/register" className="text-[#E03C3D] font-bold hover:underline">
            Tạo tài khoản mới
          </Link>
        </div>
      </div>
    </div>
  );
}
