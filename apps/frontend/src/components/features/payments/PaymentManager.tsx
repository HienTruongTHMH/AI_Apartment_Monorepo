'use client';

import React, { useState } from 'react';
import { CreditCard, Search, Download } from 'lucide-react';
import { usePayments } from '@/lib/api-hooks';

interface PaymentManagerProps {
  role: 'tenant' | 'owner';
}

export default function PaymentManager({ role }: PaymentManagerProps) {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [search, setSearch] = useState('');

  const { data: payments = [], isLoading } = usePayments(role);

  const filtered = (payments || []).filter((p: any) =>
    (filterStatus === 'all' || p.status?.toLowerCase() === filterStatus) &&
    (p.id?.toLowerCase().includes(search.toLowerCase()) || 
     p.contract?.apartment?.fullAddress?.toLowerCase().includes(search.toLowerCase()) ||
     p.apartmentName?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="w-full min-h-full bg-[#F9FAFB] py-8 px-4 sm:px-6 font-sans">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111827] mb-1">
            Quản lý Thanh toán
          </h1>
          <p className="text-[#4B5563] text-sm max-w-xl">
            {role === 'owner' 
              ? 'Theo dõi dòng tiền, hóa đơn đã xuất và xác nhận thanh toán từ khách thuê.' 
              : 'Xem lịch sử thanh toán, hóa đơn đến hạn và phương thức thanh toán.'}
          </p>
        </div>
      </div>

      {/* Main Card Panel */}
      <div className="bg-[#FFFFFF] rounded-[12px] border border-[#E5E7EB] shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_0_rgba(0,0,0,0.06)] p-[24px]">
        {/* Panel Header Flex */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 mb-6 border-b border-[#E5E7EB]">
          <h2 className="text-[18px] font-semibold text-[#111827]">
            Lịch sử giao dịch
          </h2>

          <div className="flex flex-wrap items-center gap-[12px]">
            {/* Search Input */}
            <div className="flex items-center gap-2 bg-[#FFFFFF] border border-[#E5E7EB] rounded-[6px] px-3 py-1.5 w-full sm:w-[260px] focus-within:ring-2 focus-within:ring-[#111827]/10 focus-within:border-[#111827] transition-all">
              <Search size={16} className="text-[#9CA3AF] shrink-0" />
              <input 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
                placeholder="Tìm mã giao dịch, căn hộ..."
                className="flex-1 bg-transparent outline-none text-[#111827] placeholder-[#9CA3AF] text-sm" 
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-[#F9FAFB] p-1 rounded-[20px] border border-[#E5E7EB]">
              {[
                { v: 'all', l: 'Tất cả' }, 
                { v: 'paid', l: 'Thành công' }, 
                { v: 'pending', l: 'Đang xử lý' }
              ].map((f) => {
                const isActive = filterStatus === f.v;
                return (
                  <button 
                    key={f.v} 
                    onClick={() => setFilterStatus(f.v)}
                    className={`px-3.5 py-1.5 rounded-[20px] text-xs font-medium transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-[#111827] text-[#FFFFFF] shadow-xs' 
                        : 'bg-transparent text-[#4B5563] hover:text-[#111827] hover:bg-gray-200/50'
                    }`}
                  >
                    {f.l}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Dynamic States */}
        {isLoading ? (
          <div className="py-20 flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#111827]"></div>
          </div>
        ) : filtered.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-[80px]">
            <CreditCard size={48} className="text-[#9CA3AF] mb-[16px]" strokeWidth={1.5} />
            <p className="text-[#4B5563] text-[14px] mb-[20px] font-normal text-center">
              Chưa có lịch sử giao dịch nào
            </p>
            <button className="flex items-center gap-2 px-4 py-2 border border-[#E5E7EB] bg-[#FFFFFF] text-[#111827] hover:bg-[#F9FAFB] rounded-[6px] text-sm font-medium transition-colors shadow-xs cursor-pointer">
              <Download size={16} />
              <span>Xuất báo cáo</span>
            </button>
          </div>
        ) : (
          /* Data State - Table */
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E5E7EB]">
                  <th className="py-3 px-4 text-[13px] font-medium text-[#4B5563] first:pl-2 last:pr-2">
                    Mã giao dịch
                  </th>
                  <th className="py-3 px-4 text-[13px] font-medium text-[#4B5563]">
                    Căn hộ / Dự án
                  </th>
                  <th className="py-3 px-4 text-[13px] font-medium text-[#4B5563]">
                    Ngày giao dịch
                  </th>
                  <th className="py-3 px-4 text-[13px] font-medium text-[#4B5563]">
                    Số tiền
                  </th>
                  <th className="py-3 px-4 text-[13px] font-medium text-[#4B5563] text-right last:pr-2">
                    Trạng thái
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {filtered.map((p: any) => {
                  const statusLower = (p.status || '').toLowerCase();
                  const isSuccess = statusLower === 'paid' || statusLower === 'success' || statusLower === 'thành công';
                  const isPending = statusLower === 'pending' || statusLower === 'đang xử lý';

                  return (
                    <tr 
                      key={p.id} 
                      className="border-b border-[#E5E7EB] hover:bg-[#F9FAFB] transition-colors text-[14px]"
                    >
                      <td className="py-3.5 px-4 first:pl-2 font-mono font-medium text-[#111827]">
                        {p.id}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-[#111827]">
                        {p.contract?.apartment?.fullAddress || p.apartmentName || 'Thanh toán hợp đồng'}
                      </td>
                      <td className="py-3.5 px-4 text-[#4B5563]">
                        {p.paymentDate ? p.paymentDate.substring(0, 10) : 'Chưa cập nhật'}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-[#111827]">
                        {Number(p.amount || 0).toLocaleString('vi-VN')} ₫
                      </td>
                      <td className="py-3.5 px-4 text-right last:pr-2">
                        {isSuccess ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#DEF7EC] text-[#03543F]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#03543F]" />
                            Thành công
                          </span>
                        ) : isPending ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FEF3C7] text-[#92400E]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#92400E]" />
                            Đang xử lý
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-800" />
                            {p.status || 'Khác'}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

