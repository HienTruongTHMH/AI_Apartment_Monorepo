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
      <div className="w-full max-w-lg p-8 rounded-3xl bg-white border border-[#E8E8E8] shadow-xl space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-[#FFF5F5] border border-[#E03C3D]/10 text-[#E03C3D] mb-2">
            <Building2 className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-[#2C2C2C]">Đăng Ký Tài Khoản</h1>
          <p className="text-xs text-[#5A5A5A]">Tham gia hệ thống căn hộ cao cấp tích hợp AI</p>
        </div>

        {/* Business Rule Banner Notice */}
        <div className="p-3.5 rounded-2xl bg-[#FFFBEB] border border-[#FEF3C7] text-[#D97706] text-xs space-y-1">
          <div className="font-bold flex items-center gap-1.5 text-[#D97706]">
            <ShieldAlert className="w-4 h-4" />
            Lưu Ý Về Trạng Thái Tài Khoản
          </div>
          <p className="text-[#D97706] leading-relaxed text-[11px]">
            Tài khoản mới sẽ ở trạng thái <span className="font-semibold">chưa kích hoạt</span>. Sau khi chọn nhà & xác nhận ký hợp đồng bản cứng ngoài thực tế, tài khoản sẽ được chính thức kích hoạt.
          </p>
        </div>

        {/* Display Server Errors if any */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-[#FFF5F5] border border-red-200 text-red-600 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Display Real Success Feedback Box if backend returned success */}
        {successInfo ? (
          <div className="p-5 rounded-2xl bg-[#F0FDF4] border border-[#BBF7D0] text-[#166534] text-xs space-y-4 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-bold text-[#15803d]">
              <CheckCircle2 className="w-5 h-5" /> {successInfo.message}
            </div>
            <div className="p-3 rounded-xl bg-[#F9F9F9] border border-[#E8E8E8] space-y-1 text-[11px] font-mono text-[#2C2C2C]">
              <div>• Account ID: <span className="font-bold">{successInfo.accountId}</span></div>
              <div>• Email: <span className="font-bold">{successInfo.email}</span></div>
              <div>• Trạng thái ban đầu: <span className="text-[#D97706] font-bold font-sans">Chưa kích hoạt</span></div>
              <div>• Vai trò: <span className="text-[#166534] font-bold">{role}</span></div>
            </div>
            <p className="text-[11px] text-[#166534]">
              Tài khoản của bạn đã được lưu chính thức vào PostgreSQL Database qua NestJS Backend! Vui lòng đăng nhập với thông tin vừa tạo.
            </p>
            <div className="pt-2">
              <Link
                href="/login"
                className="w-full py-3 rounded-xl bg-[#E03C3D] hover:bg-[#C92F30] text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <span>Đăng Nhập Ngay Với Tài Khoản Vừa Tạo</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            {/* Persona Selection */}
            <div className="grid grid-cols-2 gap-3 p-1 rounded-xl bg-[#F2F2F2] border border-[#E8E8E8] text-xs">
              <button
                type="button"
                onClick={() => setRole('TENANT')}
                className={`py-2 rounded-lg font-semibold transition-all ${
                  role === 'TENANT'
                    ? 'bg-white text-[#2C2C2C] shadow-sm'
                    : 'text-[#5A5A5A] hover:text-[#2C2C2C]'
                }`}
              >
                Khách Hàng
              </button>
              <button
                type="button"
                onClick={() => setRole('OWNER')}
                className={`py-2 rounded-lg font-semibold transition-all ${
                  role === 'OWNER'
                    ? 'bg-white text-[#2C2C2C] shadow-sm'
                    : 'text-[#5A5A5A] hover:text-[#2C2C2C]'
                }`}
              >
                Chủ hộ
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#2C2C2C]">Họ và Tên</label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  placeholder="Nguyễn Văn A"
                  className="w-full bg-[#F9F9F9] border border-[#E8E8E8] focus:border-[#E03C3D] focus:ring-1 focus:ring-[#E03C3D]/20 rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#2C2C2C] focus:outline-none transition-all placeholder-gray-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#2C2C2C]">Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="name@email.com"
                    className="w-full bg-[#F9F9F9] border border-[#E8E8E8] focus:border-[#E03C3D] focus:ring-1 focus:ring-[#E03C3D]/20 rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#2C2C2C] focus:outline-none transition-all placeholder-gray-400"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#2C2C2C]">Số điện thoại</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    placeholder="0901234567"
                    className="w-full bg-[#F9F9F9] border border-[#E8E8E8] focus:border-[#E03C3D] focus:ring-1 focus:ring-[#E03C3D]/20 rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#2C2C2C] focus:outline-none transition-all placeholder-gray-400"
                  />
                </div>
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
                  placeholder="Tối thiểu 6 ký tự"
                  className="w-full bg-[#F9F9F9] border border-[#E8E8E8] focus:border-[#E03C3D] focus:ring-1 focus:ring-[#E03C3D]/20 rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#2C2C2C] focus:outline-none transition-all placeholder-gray-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-[#E03C3D] hover:bg-[#C92F30] disabled:opacity-50 text-white font-extrabold text-sm transition-all flex items-center justify-center gap-2 mt-4 shadow-sm"
            >
              <span>{loading ? 'Đang gửi thông tin vào Database...' : 'Đăng Ký Tài Khoản'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        <div className="text-center text-xs text-[#5A5A5A] pt-2 border-t border-[#E8E8E8]">
          Đã có tài khoản?{' '}
          <Link href="/login" className="text-[#E03C3D] font-bold hover:underline">
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    </div>
  );
}
