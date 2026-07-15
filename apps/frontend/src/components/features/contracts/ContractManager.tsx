'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FileText, Search, Filter, Plus } from 'lucide-react';
import { useContracts } from '@/lib/api-hooks';

interface ContractManagerProps {
  role: 'tenant' | 'owner';
}

export default function ContractManager({ role }: ContractManagerProps) {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [search, setSearch] = useState('');
  
  const { data: contracts, isLoading } = useContracts(role);

  const filtered = contracts.filter((c) =>
    (filterStatus === 'all' || c.status === filterStatus) &&
    (c.tenant.toLowerCase().includes(search.toLowerCase()) ||
     c.property.toLowerCase().includes(search.toLowerCase()) ||
     c.id.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="w-full text-[#2C2C2C]">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold mb-2 text-[#2C2C2C]">
            Quản lý Hợp đồng
          </h1>
          <p className="text-[#5A5A5A] text-sm max-w-xl">
            {role === 'owner' 
              ? 'Quản lý các hợp đồng cho thuê, theo dõi trạng thái và tạo hợp đồng mới.' 
              : 'Xem danh sách các hợp đồng thuê nhà của bạn, kiểm tra hiệu lực pháp lý và gia hạn.'}
          </p>
        </div>
        {role === 'owner' && (
          <button className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-white bg-[#E03C3D] hover:bg-[#C92F30] transition-colors text-sm shadow-sm">
            <Plus size={16} /> Tạo hợp đồng mới
          </button>
        )}
      </div>

      {/* Contract list */}
      <div className="bg-white border border-[#E8E8E8] rounded-2xl p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <h2 className="text-[#2C2C2C] font-bold text-lg">Danh sách hợp đồng</h2>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-[#F9F9F9] border border-[#E8E8E8] rounded-xl px-3 py-2 min-w-[220px] focus-within:border-[#999999] transition-colors">
              <Search size={16} className="text-[#777777]" />
              <input 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
                placeholder="Tìm hợp đồng, mã HĐ..."
                className="flex-1 bg-transparent outline-none text-[#2C2C2C] placeholder-gray-400 text-sm" 
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-[#777777]" />
              {[
                { v: 'all', l: 'Tất cả' },
                { v: 'active', l: 'Hiệu lực' },
                { v: 'pending', l: 'Chờ ký' },
                { v: 'expired', l: 'Hết hạn' }
              ].map((f) => (
                <button 
                  key={f.v} 
                  onClick={() => setFilterStatus(f.v)}
                  className={`px-3 py-1.5 rounded-lg border transition-all text-xs font-medium ${
                    filterStatus === f.v 
                      ? 'border-[#E03C3D] bg-[#E03C3D] text-white shadow-sm' 
                      : 'border-[#E8E8E8] bg-transparent text-[#5A5A5A] hover:bg-gray-50'
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
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E03C3D]"></div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center text-[#5A5A5A] rounded-xl border border-[#E8E8E8] bg-[#F9F9F9]">
              <FileText size={32} className="mx-auto mb-3 opacity-30 text-[#777777]" />
              <p className="text-sm font-semibold">Không tìm thấy hợp đồng phù hợp</p>
              {role === 'owner' && (
                <button className="mt-4 flex items-center gap-2 mx-auto px-4 py-2 rounded-lg text-[#E03C3D] border border-[#E03C3D]/30 hover:bg-[#FFF5F5] transition-all text-xs font-medium">
                  <Plus size={14} /> Tạo hợp đồng mới
                </button>
              )}
            </div>
          ) : (
            filtered.map((c: any) => {
              const isActiveStatus = c.contractStatus === 'Active' || c.status === 'active';
              const isPendingStatus = c.contractStatus === 'Draft' || c.status === 'pending';
              const isExpiredStatus = c.contractStatus === 'Expired' || c.status === 'expired';
              
              return (
                <div key={c.id} className="p-4 rounded-xl border border-[#E8E8E8] bg-white flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#F9F9F9] transition-colors shadow-sm">
                  <div className="flex-1">
                    <p className="text-[#2C2C2C] font-semibold mb-1 truncate max-w-md">
                      {c.apartment?.fullAddress || c.property || 'Không rõ địa chỉ'}
                    </p>
                    <p className="text-[#777777] text-xs">Mã HĐ: {c.id}</p>
                  </div>
                  
                  <div className="flex-1">
                    <p className="text-sm text-[#2C2C2C]">
                      <span className="text-[#5A5A5A]">Người thuê: </span> 
                      {c.tenant?.fullName || c.tenant || 'Chưa cập nhật'}
                    </p>
                  </div>

                  <div className="flex-1 text-left md:text-right">
                    <p className="text-[#E03C3D] font-bold mb-1">
                      {Number(c.rentPrice || c.amount || 0).toLocaleString('vi-VN')} VND / tháng
                    </p>
                    <p className="text-[#777777] text-xs font-medium">
                      {(c.startDate || '').substring(0, 10)} - {(c.endDate || '').substring(0, 10)}
                    </p>
                  </div>

                  <div className="flex-shrink-0">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                      isActiveStatus ? 'bg-[#ECFDF5] border-[#A7F3D0] text-[#065F46]' :
                      isPendingStatus ? 'bg-[#FFFBEB] border-[#FEF3C7] text-[#D97706]' :
                      isExpiredStatus ? 'bg-[#FFF5F5] border-red-200 text-[#E03C3D]' :
                      'bg-gray-100 border-gray-200 text-gray-500'
                    }`}>
                      {c.contractStatus === 'Active' || c.status === 'active' ? 'Hiệu lực' :
                       c.contractStatus === 'Draft' || c.status === 'pending' ? 'Chờ ký' :
                       c.contractStatus === 'Expired' || c.status === 'expired' ? 'Hết hạn' :
                       c.contractStatus || c.status || 'Khác'}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
