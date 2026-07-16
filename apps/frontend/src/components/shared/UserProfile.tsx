'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuthStore } from '@/store/useAuthStore';
import { apiService } from '@/lib/api';
import { User, Mail, Save, AlertCircle, CheckCircle2 } from 'lucide-react';

const profileSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Họ và tên phải có ít nhất 2 ký tự')
    .max(50, 'Họ và tên không được vượt quá 50 ký tự')
    .nonempty('Không được bỏ trống họ và tên'),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function UserProfile() {
  const { user, updateUser } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.fullName || '',
    },
  });

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      setIsSubmitting(true);
      setStatus({ type: null, message: '' });

      const response = await apiService.updateProfile({ fullName: data.fullName });
      
      // Update global Zustand store
      updateUser({ fullName: data.fullName });
      
      setStatus({ type: 'success', message: response.message || 'Cập nhật thông tin thành công!' });
    } catch (error: any) {
      console.error(error);
      setStatus({ type: 'error', message: error?.response?.data?.message || 'Có lỗi xảy ra khi cập nhật.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <div className="w-full max-w-2xl mx-auto bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-2xl">
      {/* Header Profile */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="flex items-center gap-6 relative z-10">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border-2 border-white/50 shadow-inner">
            <User className="w-10 h-10 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{user.fullName || 'Người Dùng Ẩn Danh'}</h2>
            <p className="text-blue-100 flex items-center gap-2 mt-1 opacity-90 text-sm font-medium">
              <Mail className="w-4 h-4" />
              {user.email}
            </p>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Thông Tin Cá Nhân</h3>

        {status.type && (
          <div className={`mb-6 p-4 rounded-xl flex items-start gap-3 transition-all duration-300 animate-in fade-in slide-in-from-top-2 ${
            status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {status.type === 'success' ? <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0" /> : <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />}
            <p className="text-sm font-medium">{status.message}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email (Readonly) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email (Đăng nhập)</label>
            <input
              type="text"
              value={user.email}
              disabled
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed focus:outline-none"
            />
            <p className="mt-1 text-xs text-gray-500">Email không thể thay đổi.</p>
          </div>

          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
            <input
              id="fullName"
              type="text"
              {...register('fullName')}
              className={`w-full px-4 py-3 bg-white border rounded-xl text-gray-800 focus:outline-none focus:ring-2 transition-all duration-200 ${
                errors.fullName ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:border-indigo-400 focus:ring-indigo-100 hover:border-gray-300'
              }`}
              placeholder="Nhập họ và tên của bạn"
            />
            {errors.fullName && (
              <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
                <AlertCircle className="w-4 h-4" /> {errors.fullName.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={!isDirty || isSubmitting}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-medium rounded-xl shadow-md hover:shadow-lg hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transition-all duration-200 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <Save className="w-5 h-5" />
              )}
              {isSubmitting ? 'Đang lưu...' : 'Lưu Thay Đổi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
