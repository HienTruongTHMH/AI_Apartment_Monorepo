'use client';

import React, { useState } from 'react';
import { CreditCard, Search, Filter, Download } from 'lucide-react';
import { usePayments } from '@/lib/api-hooks';

interface PaymentManagerProps {
  role: 'tenant' | 'owner';
}

export default function PaymentManager({ role }: PaymentManagerProps) {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [search, setSearch] = useState('');
  
  const { data: payments, isLoading, error } = usePayments(role);

  const filtered = payments.filter((p: any) =>
    (filterStatus === 'all' || p.status?.toLowerCase() === filterStatus) &&
    (p.id?.toLowerCase().includes(search.toLowerCase()) || 
     p.contract?.apartment?.fullAddress?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="w-full text-white">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold mb-2 text-white">
            Quản lý Thanh toán
          </h1>
          <p className="text-gray-400 text-sm max-w-xl">
            {role === 'owner' 
              ? 'Theo dõi dòng tiền, hóa đơn đã xuất và xác nhận thanh toán từ khách thuê.' 
              : 'Xem lịch sử thanh toán, hóa đơn đến hạn và phương thức thanh toán.'}
          </p>
        </div>
      </div>

      {/* Payment list */}
      <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <h2 className="text-white font-bold text-lg">Lịch sử giao dịch</h2>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-950 border border-white/10 rounded-xl px-3 py-2 min-w-[220px]">
              <Search size={16} className="text-gray-400" />
              <input 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
                placeholder="Tìm mã giao dịch..."
                className="flex-1 bg-transparent outline-none text-white placeholder-gray-500 text-sm" 
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-gray-400" />
              {[{ v: 'all', l: 'Tất cả' }, { v: 'paid', l: 'Thành công' }, { v: 'pending', l: 'Đang xử lý' }].map((f) => (
                <button 
                  key={f.v} 
                  onClick={() => setFilterStatus(f.v)}
                  className={`px-3 py-1.5 rounded-lg border transition-all text-xs font-medium ${
                    filterStatus === f.v 
                      ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-400' 
                      : 'border-white/10 bg-transparent text-gray-400 hover:text-white'
                  }`}
                >
                  {f.l}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {isLoading ? (
            <div className="py-12 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center text-gray-400 rounded-xl border border-white/5 bg-slate-950/30">
              <CreditCard size={32} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">Chưa có giao dịch nào</p>
              {role === 'owner' && (
                <button className="mt-4 flex items-center gap-2 mx-auto px-4 py-2 rounded-lg text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/10 transition-all text-xs font-medium">
                  <Download size={14} /> Xuất báo cáo
                </button>
              )}
            </div>
          ) : (
            filtered.map((p: any) => (
              <div key={p.id} className="p-4 rounded-xl border border-white/10 bg-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-white/10 transition-colors">
                <div className="flex-1">
                  <p className="text-white font-medium mb-1 truncate max-w-md">
                    {p.contract?.apartment?.fullAddress || 'Thanh toán hợp đồng'}
                  </p>
                  <p className="text-gray-400 text-xs">Mã GD: {p.id}</p>
                </div>

                <div className="flex-1 text-right">
                  <p className="text-cyan-400 font-bold mb-1">
                    {Number(p.amount || 0).toLocaleString('vi-VN')} VND
                  </p>
                  <p className="text-gray-500 text-xs">
                    Ngày TT: {p.paymentDate ? p.paymentDate.substring(0, 10) : 'Chưa cập nhật'}
                  </p>
                </div>

                <div className="flex-shrink-0">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    p.status?.toLowerCase() === 'paid' ? 'bg-cyan-500/20 text-cyan-400' :
                    p.status?.toLowerCase() === 'pending' ? 'bg-amber-500/20 text-amber-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {p.status || 'Khác'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
