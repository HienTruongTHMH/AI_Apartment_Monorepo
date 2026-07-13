'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { apiClient } from '@/lib/api';
import { Building2, Lock, Mail, User, Phone, ShieldAlert, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'TENANT' | 'OWNER'>('TENANT');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successInfo, setSuccessInfo] = useState<{ accountId: string; email: string; message: string } | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !fullName || !phone) return;
    setLoading(true);
    setErrorMsg('');
    setSuccessInfo(null);

    try {
      const res = await apiClient.post('/auth/register', {
        email,
        password,
        passwordTwo: password,
        fullName,
        phone,
        roles: role
      });

      const responseData = res.data;
      setSuccessInfo({
        accountId: responseData.accountId || 'account-uuid',
        email: responseData.email || email,
        message: responseData.message || 'Đăng ký tài khoản thành công !!!'
      });
    } catch (err: any) {
      const serverMessage = err.response?.data?.message;
      if (Array.isArray(serverMessage)) {
        setErrorMsg(serverMessage.join(', '));
      } else if (typeof serverMessage === 'string') {
        setErrorMsg(serverMessage);
      } else if (err.message) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg('Không thể đăng ký tài khoản. Vui lòng kiểm tra lại kết nối!');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg p-8 rounded-3xl bg-slate-900/80 border border-white/10 glass-panel shadow-2xl space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-emerald-400 mb-2">
            <Building2 className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-white">Đăng Ký Tài Khoản</h1>
          <p className="text-xs text-gray-400">Tham gia hệ thống căn hộ cao cấp tích hợp AI</p>
        </div>

        {/* Business Rule Banner Notice */}
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs space-y-1">
          <div className="font-bold flex items-center gap-1.5 text-amber-400">
            <ShieldAlert className="w-4 h-4" />
            Lưu Ý Về Trạng Thái Tài Khoản (`isActive = false`)
          </div>
          <p className="text-gray-300 leading-relaxed text-[11px]">
            Tài khoản mới sẽ lưu vào Database với trạng thái <span className="font-semibold text-amber-300">chưa kích hoạt (isActive = false)</span>. Sau khi chọn nhà & xác nhận ký hợp đồng bản cứng ngoài thực tế, tài khoản sẽ chuyển thành <span className="font-semibold text-emerald-400">isActive = true</span>.
          </p>
        </div>

        {/* Display Server Errors if any */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Display Real Success Feedback Box if backend returned success */}
        {successInfo ? (
          <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 text-xs space-y-4 shadow-xl">
            <div className="flex items-center gap-2 text-sm font-bold text-emerald-400">
              <CheckCircle2 className="w-5 h-5" /> {successInfo.message}
            </div>
            <div className="p-3 rounded-xl bg-slate-950/80 border border-white/10 space-y-1 text-[11px] font-mono">
              <div>• Account ID: <span className="text-white">{successInfo.accountId}</span></div>
              <div>• Email: <span className="text-white">{successInfo.email}</span></div>
              <div>• Trạng thái ban đầu: <span className="text-amber-400 font-bold">isActive = false</span></div>
              <div>• Vai trò: <span className="text-emerald-400 font-bold">{role}</span></div>
            </div>
            <p className="text-[11px] text-gray-300">
              Tài khoản của bạn đã được lưu chính thức vào PostgreSQL Database qua NestJS Backend! Vui lòng đăng nhập với thông tin vừa tạo.
            </p>
            <div className="pt-2">
              <Link
                href="/login"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20"
              >
                <span>Đăng Nhập Ngay Với Tài Khoản Vừa Tạo</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            {/* Persona Selection */}
            <div className="grid grid-cols-2 gap-3 p-1 rounded-xl bg-slate-950 border border-white/10 text-xs">
              <button
                type="button"
                onClick={() => setRole('TENANT')}
                className={`py-2 rounded-lg font-semibold transition-all ${
                  role === 'TENANT'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Khách Thuê (Tenant)
              </button>
              <button
                type="button"
                onClick={() => setRole('OWNER')}
                className={`py-2 rounded-lg font-semibold transition-all ${
                  role === 'OWNER'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Chủ Nhà (Owner)
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-300">Họ và Tên</label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  placeholder="Nguyễn Văn A"
                  className="w-full bg-slate-950 border border-white/10 focus:border-emerald-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-300">Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="name@email.com"
                    className="w-full bg-slate-950 border border-white/10 focus:border-emerald-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-300">Số điện thoại</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    placeholder="0901234567"
                    className="w-full bg-slate-950 border border-white/10 focus:border-emerald-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none transition-all"
                  />
                </div>
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
                  placeholder="Tối thiểu 6 ký tự"
                  className="w-full bg-slate-950 border border-white/10 focus:border-emerald-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 disabled:opacity-50 text-white font-extrabold text-sm shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 mt-4 hover:scale-[1.01]"
            >
              <span>{loading ? 'Đang gửi thông tin vào Database...' : 'Đăng Ký Tài Khoản (Lưu DB & isActive = false)'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        <div className="text-center text-xs text-gray-400 pt-2 border-t border-white/5">
          Đã có tài khoản?{' '}
          <Link href="/login" className="text-emerald-400 font-bold hover:underline">
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    </div>
  );
}
