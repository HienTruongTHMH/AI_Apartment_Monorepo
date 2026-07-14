'use client';

import React from 'react';
import { AlertCircle, Plus } from 'lucide-react';

export default function TenantReportsPage() {
  return (
    <div className="p-6 text-white w-full">
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold mb-2 text-white">
            Báo cáo & Hỗ trợ
          </h1>
          <p className="text-gray-400 text-sm max-w-xl">
            Gửi yêu cầu bảo trì, báo cáo sự cố hoặc liên hệ với ban quản lý.
          </p>
        </div>
        <button className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-slate-900 bg-emerald-400 hover:bg-emerald-500 transition-colors text-sm">
          <Plus size={16} /> Tạo báo cáo mới
        </button>
      </div>

      <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
        <h2 className="text-white font-bold text-lg mb-6">Lịch sử báo cáo</h2>
        <div className="py-16 text-center text-gray-400 rounded-xl border border-white/5 bg-slate-950/30">
          <AlertCircle size={32} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">Chưa có báo cáo nào</p>
        </div>
      </div>
    </div>
  );
}
