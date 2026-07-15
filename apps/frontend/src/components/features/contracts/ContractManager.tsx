'use client';

import React, { useState } from 'react';
import { FileText, Search, Filter, Plus } from 'lucide-react';
import { useContracts } from '@/lib/api-hooks';
import { apiService } from '@/lib/api';

interface ContractRecord {
  id: string;
  property: string;
  tenant: string;
  status: 'active' | 'pending' | 'expired';
  startDate: string;
  endDate: string;
  amount: number;
}

interface ContractManagerProps {
  role: 'tenant' | 'owner';
}

export default function ContractManager({ role }: ContractManagerProps) {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [search, setSearch] = useState('');

  const { data: contracts, isLoading, error } = useContracts(role);

  const filtered = contracts.filter((c) => {
    const statusMatch = filterStatus === 'all' || c.contractStatus === filterStatus || c.status === filterStatus;
    
    const tenantName = (c.tenant?.fullName || c.tenant || '').toString().toLowerCase();
    const propertyName = (c.apartment?.fullAddress || c.property || '').toString().toLowerCase();
    const contractId = (c.id || '').toString().toLowerCase();
    const searchLower = search.toLowerCase();

    const searchMatch = !search || 
      tenantName.includes(searchLower) || 
      propertyName.includes(searchLower) || 
      contractId.includes(searchLower);

    return statusMatch && searchMatch;
  });

  return (
    <div className="w-full text-white">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold mb-2 text-white">
            Quản lý Hợp đồng
          </h1>
          <p className="text-gray-400 text-sm max-w-xl">
            {role === 'owner'
              ? 'Quản lý các hợp đồng cho thuê, theo dõi trạng thái và tạo hợp đồng mới.'
              : 'Xem danh sách các hợp đồng thuê nhà của bạn, kiểm tra hiệu lực pháp lý và gia hạn.'}
          </p>
        </div>
        {role === 'owner' && (
          <button className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-slate-900 bg-emerald-400 hover:bg-emerald-500 transition-colors text-sm">
            <Plus size={16} /> Tạo hợp đồng mới
          </button>
        )}
      </div>

      {/* Contract list */}
      <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <h2 className="text-white font-bold text-lg">Danh sách hợp đồng</h2>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-950 border border-white/10 rounded-xl px-3 py-2 min-w-[220px]">
              <Search size={16} className="text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm hợp đồng, mã HĐ..."
                className="flex-1 bg-transparent outline-none text-white placeholder-gray-500 text-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-gray-400" />
              {[{ v: 'all', l: 'Tất cả' }, { v: 'active', l: 'Hiệu lực' }, { v: 'pending', l: 'Chờ ký' }, { v: 'expired', l: 'Hết hạn' }].map((f) => (
                <button
                  key={f.v}
                  onClick={() => setFilterStatus(f.v)}
                  className={`px-3 py-1.5 rounded-lg border transition-all text-xs font-medium ${filterStatus === f.v
                    ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400'
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
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center text-gray-400 rounded-xl border border-white/5 bg-slate-950/30">
              <FileText size={32} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">Không tìm thấy hợp đồng phù hợp</p>
              {role === 'owner' && (
                <button className="mt-4 flex items-center gap-2 mx-auto px-4 py-2 rounded-lg text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/10 transition-all text-xs font-medium">
                  <Plus size={14} /> Tạo hợp đồng mới
                </button>
              )}
            </div>
          ) : (
            filtered.map((c: any) => (
              <div key={c.id} className="p-4 rounded-xl border border-white/10 bg-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-white/10 transition-colors">
                <div className="flex-1">
                  <p className="text-white font-medium mb-1 truncate max-w-md">
                    {c.apartment?.fullAddress || c.property || 'Không rõ địa chỉ'}
                  </p>
                  <p className="text-gray-400 text-xs">Mã HĐ: {c.id}</p>
                </div>

                <div className="flex-1">
                  <p className="text-sm text-gray-300">
                    <span className="text-gray-500">Người thuê: </span>
                    {c.tenant?.fullName || c.tenant || 'Chưa cập nhật'}
                  </p>
                </div>

                <div className="flex-1 text-right">
                  <p className="text-emerald-400 font-bold mb-1">
                    {Number(c.rentPrice || c.amount || 0).toLocaleString('vi-VN')} VND / tháng
                  </p>
                  <p className="text-gray-500 text-xs">
                    {(c.startDate || '').substring(0, 10)} - {(c.endDate || '').substring(0, 10)}
                  </p>
                </div>

                <div className="flex-shrink-0 flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${c.contractStatus === 'Active' || c.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' :
                    c.contractStatus === 'Draft' || c.status === 'pending' ? 'bg-amber-500/20 text-amber-400' :
                      c.contractStatus === 'Expired' || c.status === 'expired' ? 'bg-red-500/20 text-red-400' :
                        'bg-gray-500/20 text-gray-400'
                    }`}>
                    {c.contractStatus || c.status || 'Khác'}
                  </span>

                  {role === 'tenant' && c.contractStatus === 'PendingTenantSignature' && (
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={async () => {
                          try {
                            await apiService.confirmOfflineRentalAndActivateAccount(c.id);
                            window.location.reload();
                          } catch (e: any) { alert(e.message); }
                        }}
                        className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-400 rounded-lg text-xs font-bold"
                      >
                        Xác nhận ký
                      </button>
                      <button
                        onClick={async () => {
                          try {
                            await apiService.tenantRejectContract(c.id);
                            window.location.reload();
                          } catch (e: any) { alert(e.message); }
                        }}
                        className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/40 text-red-400 rounded-lg text-xs font-bold"
                      >
                        Từ chối
                      </button>
                    </div>
                  )}

                  {role === 'owner' && c.contractStatus === 'Draft' && (
                    <button
                      onClick={async () => {
                        try {
                          await apiService.sendContractToTenant(c.id);
                          alert('Đã gửi hợp đồng cho người thuê!');
                          window.location.reload();
                        } catch (e: any) { alert(e.message); }
                      }}
                      className="px-3 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-400 rounded-lg text-xs font-bold"
                    >
                      Gửi cho người thuê
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
