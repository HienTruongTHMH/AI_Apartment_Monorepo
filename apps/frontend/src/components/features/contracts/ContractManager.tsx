'use client';

import React, { useState } from 'react';
import { FileText, Search, Filter, X } from 'lucide-react';
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
  const [selectedContract, setSelectedContract] = useState<any | null>(null);

  const { data: contracts, isLoading, error } = useContracts(role);

  const filtered = contracts.filter((c) => {
    let statusMatch = false;
    if (filterStatus === 'all') {
      statusMatch = true;
    } else if (filterStatus === 'active') {
      statusMatch = c.contractStatus === 'Active' || c.status === 'active';
    } else if (filterStatus === 'pending') {
      statusMatch = c.contractStatus === 'PendingTenantSignature' || c.contractStatus === 'Draft' || c.status === 'pending';
    } else if (filterStatus === 'expired') {
      statusMatch = c.contractStatus === 'Expired' || c.contractStatus === 'Terminated' || c.status === 'expired';
    }
    
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
    <div className="w-full text-[#2C2C2C]">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold mb-2 text-[#2C2C2C]">
            Quản lý Hợp đồng
          </h1>
          <p className="text-[#5A5A5A] text-sm max-w-xl">
            {role === 'owner'
              ? 'Quản lý các hợp đồng cho thuê, theo dõi trạng thái.'
              : 'Xem danh sách các hợp đồng thuê nhà của bạn, kiểm tra hiệu lực pháp lý và gia hạn.'}
          </p>
        </div>
      </div>

      {/* Contract list */}
      <div className="bg-white border border-[#E8E8E8] rounded-2xl p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <h2 className="text-[#2C2C2C] font-bold text-lg">Danh sách hợp đồng</h2>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-50 border border-[#E8E8E8] rounded-xl px-3 py-2 min-w-[220px]">
              <Search size={16} className="text-[#5A5A5A]" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm hợp đồng, mã HĐ..."
                className="flex-1 bg-transparent outline-none text-[#2C2C2C] placeholder-slate-400 text-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-[#5A5A5A]" />
              {[{ v: 'all', l: 'Tất cả' }, { v: 'active', l: 'Hiệu lực' }, { v: 'pending', l: 'Chờ ký' }, { v: 'expired', l: 'Hết hạn' }].map((f) => (
                <button
                  key={f.v}
                  onClick={() => setFilterStatus(f.v)}
                  className={`px-3 py-1.5 rounded-lg border transition-all text-xs font-medium ${filterStatus === f.v
                    ? 'border-[#E03C3D] bg-[#E03C3D] text-white'
                    : 'border-[#E8E8E8] bg-transparent text-[#5A5A5A] hover:text-[#E03C3D] hover:border-[#E03C3D]'
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
            <div className="py-16 text-center text-[#5A5A5A] rounded-xl border border-[#E8E8E8] bg-slate-50/50">
              <FileText size={32} className="mx-auto mb-3 opacity-30 text-[#5A5A5A]" />
              <p className="text-sm">Không tìm thấy hợp đồng phù hợp</p>
            </div>
          ) : (
            filtered.map((c: any) => (
              <div 
                key={c.id} 
                onClick={() => setSelectedContract(c)}
                className="p-4 bg-white border-b border-[#E8E8E8] flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <div className="flex-1">
                  <p className="text-[#2C2C2C] font-semibold mb-1 truncate max-w-md">
                    {c.apartment?.fullAddress || c.property || 'Không rõ địa chỉ'}
                  </p>
                  <p className="text-[#5A5A5A] text-xs">Mã HĐ: {c.id}</p>
                </div>

                <div className="flex-1">
                  <p className="text-sm text-[#5A5A5A]">
                    <span className="text-[#5A5A5A] font-medium">Người thuê: </span>
                    <span className="text-[#2C2C2C] font-semibold">{c.tenant?.account?.fullName || c.tenant?.fullName || c.tenant || 'Chưa cập nhật'}</span>
                  </p>
                </div>

                <div className="flex-1 text-right">
                  <p className="text-[#2C2C2C] font-bold mb-1">
                    {Number(c.rentPrice || c.amount || 0).toLocaleString('vi-VN')} VND / tháng
                  </p>
                  <p className="text-[#5A5A5A] text-xs">
                    {(c.startDate || '').substring(0, 10)} - {(c.endDate || '').substring(0, 10)}
                  </p>
                </div>

                <div className="flex-shrink-0 flex items-center gap-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                    c.contractStatus === 'Active' || c.status === 'active' ? 'bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]' :
                    c.contractStatus === 'Draft' || c.status === 'pending' || c.contractStatus === 'PendingTenantSignature' ? 'bg-[#FFF9E6] text-[#B7791F] border-[#FEEBC8]' :
                    c.contractStatus === 'Expired' || c.status === 'expired' ? 'bg-[#FEF2F2] text-[#991B1B] border-[#FEE2E2]' :
                    'bg-slate-50 text-slate-600 border-[#E8E8E8]'
                  }`}>
                    {c.contractStatus === 'Active' || c.status === 'active' ? 'Hiệu lực' :
                     c.contractStatus === 'Draft' || c.status === 'pending' || c.contractStatus === 'PendingTenantSignature' ? 'Chờ ký' :
                     c.contractStatus === 'Expired' || c.status === 'expired' ? 'Hết hạn' :
                     (c.contractStatus || c.status || 'Khác')}
                  </span>

                  {role === 'tenant' && c.contractStatus === 'PendingTenantSignature' && (
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={async (e) => {
                          e.stopPropagation();
                          try {
                            await apiService.confirmOfflineRentalAndActivateAccount(c.id);
                            window.location.reload();
                          } catch (e: any) { alert(e.message); }
                        }}
                        className="px-3 py-1.5 bg-[#ECFDF5] hover:bg-[#D1FAE5] text-[#065F46] border border-[#A7F3D0] rounded-lg text-xs font-bold transition-colors"
                      >
                        Xác nhận ký
                      </button>
                      <button
                        onClick={async (e) => {
                          e.stopPropagation();
                          try {
                            await apiService.tenantRejectContract(c.id);
                            window.location.reload();
                          } catch (e: any) { alert(e.message); }
                        }}
                        className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-650 border border-red-200 rounded-lg text-xs font-bold transition-colors"
                      >
                        Từ chối
                      </button>
                    </div>
                  )}

                  {role === 'owner' && c.contractStatus === 'Draft' && (
                    <button
                      onClick={async (e) => {
                        e.stopPropagation();
                        try {
                          await apiService.sendContractToTenant(c.id);
                          alert('Đã gửi hợp đồng cho người thuê!');
                          window.location.reload();
                        } catch (e: any) { alert(e.message); }
                      }}
                      className="px-3 py-1.5 bg-[#E03C3D] hover:bg-[#C92F30] text-white rounded-lg text-xs font-bold transition-colors"
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

      {/* Contract Details Modal */}
      {selectedContract && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#E8E8E8] rounded-2xl shadow-xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-6 py-4 border-b border-[#E8E8E8] flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#2C2C2C]">Chi Tiết Hợp Đồng</h3>
              <button 
                onClick={() => setSelectedContract(null)}
                className="text-[#5A5A5A] hover:text-[#2C2C2C] transition-colors p-1 rounded-lg hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-sm text-[#2C2C2C]">
              {/* ID & Status */}
              <div className="flex items-center justify-between pb-3 border-b border-dashed border-[#E8E8E8]">
                <div>
                  <p className="text-[#5A5A5A] text-xs uppercase tracking-wider font-semibold">Mã hợp đồng</p>
                  <p className="text-sm font-mono font-semibold">{selectedContract.id}</p>
                </div>
                <div>
                  <p className="text-[#5A5A5A] text-xs uppercase tracking-wider font-semibold mb-1">Trạng thái</p>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                    selectedContract.contractStatus === 'Active' || selectedContract.status === 'active' ? 'bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]' :
                    selectedContract.contractStatus === 'Draft' || selectedContract.status === 'pending' || selectedContract.contractStatus === 'PendingTenantSignature' ? 'bg-[#FFF9E6] text-[#B7791F] border-[#FEEBC8]' :
                    selectedContract.contractStatus === 'Expired' || selectedContract.status === 'expired' ? 'bg-[#FEF2F2] text-[#991B1B] border-[#FEE2E2]' :
                    'bg-slate-50 text-slate-600 border-[#E8E8E8]'
                  }`}>
                    {selectedContract.contractStatus === 'Active' || selectedContract.status === 'active' ? 'Hiệu lực' :
                     selectedContract.contractStatus === 'Draft' || selectedContract.status === 'pending' || selectedContract.contractStatus === 'PendingTenantSignature' ? 'Chờ ký' :
                     selectedContract.contractStatus === 'Expired' || selectedContract.status === 'expired' ? 'Hết hạn' :
                     (selectedContract.contractStatus || selectedContract.status || 'Khác')}
                  </span>
                </div>
              </div>

              {/* Apartment Address */}
              <div className="space-y-2">
                <h4 className="font-bold text-[#E03C3D] flex items-center gap-1.5 text-xs uppercase tracking-wider">Thông Tin Căn Hộ</h4>
                <div className="bg-slate-50 border border-[#E8E8E8] rounded-xl p-3">
                  <span className="text-[#5A5A5A] text-xs block">Địa chỉ căn hộ</span>
                  <span className="font-semibold">{selectedContract.apartment?.fullAddress || selectedContract.property || 'Không rõ địa chỉ'}</span>
                </div>
              </div>

              {/* Tenant Name */}
              <div className="space-y-2">
                <h4 className="font-bold text-[#E03C3D] flex items-center gap-1.5 text-xs uppercase tracking-wider">Thông Tin Khách Thuê</h4>
                <div className="bg-slate-50 border border-[#E8E8E8] rounded-xl p-3">
                  <span className="text-[#5A5A5A] text-xs block">Họ và tên</span>
                  <span className="font-semibold">{selectedContract.tenant?.account?.fullName || selectedContract.tenant?.fullName || selectedContract.tenant || 'Chưa cập nhật'}</span>
                </div>
              </div>

              {/* Pricing & Deposit */}
              <div className="grid grid-cols-2 gap-4 pb-3 border-b border-dashed border-[#E8E8E8]">
                <div>
                  <span className="text-[#5A5A5A] text-xs block">Giá thuê hằng tháng</span>
                  <span className="font-semibold text-base text-[#E03C3D]">
                    {Number(selectedContract.rentPrice || selectedContract.amount || 0).toLocaleString('vi-VN')} VND / tháng
                  </span>
                </div>
                <div>
                  <span className="text-[#5A5A5A] text-xs block">Tiền đặt cọc</span>
                  <span className="font-semibold text-base">
                    {Number(selectedContract.deposit || 0).toLocaleString('vi-VN')} VND
                  </span>
                </div>
              </div>

              {/* Start Date & End Date */}
              <div className="grid grid-cols-2 gap-4 pb-3 border-b border-dashed border-[#E8E8E8]">
                <div>
                  <span className="text-[#5A5A5A] text-xs block">Ngày bắt đầu</span>
                  <span className="font-semibold">{(selectedContract.startDate || '').substring(0, 10)}</span>
                </div>
                <div>
                  <span className="text-[#5A5A5A] text-xs block">Ngày kết thúc</span>
                  <span className="font-semibold">{(selectedContract.endDate || '').substring(0, 10)}</span>
                </div>
              </div>

              {/* Terms */}
              <div>
                <span className="text-[#5A5A5A] text-xs block mb-1">Các điều khoản hợp đồng</span>
                <p className="bg-slate-50 border border-[#E8E8E8] rounded-xl p-3 text-[#2C2C2C] min-h-[60px] whitespace-pre-wrap">
                  {selectedContract.terms || 'Không có điều khoản bổ sung'}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-[#E8E8E8] flex justify-end gap-3">
              <button 
                onClick={() => setSelectedContract(null)}
                className="px-4 py-2 border border-[#E8E8E8] bg-white text-[#2C2C2C] hover:bg-slate-50 transition-colors rounded-xl text-xs font-semibold"
              >
                Đóng
              </button>

              {role === 'tenant' && selectedContract.contractStatus === 'PendingTenantSignature' && (
                <div className="flex gap-2">
                  <button
                    onClick={async () => {
                      try {
                        await apiService.tenantRejectContract(selectedContract.id);
                        window.location.reload();
                      } catch (e: any) { alert(e.message); }
                    }}
                    className="px-4 py-2 bg-red-50 text-red-655 border border-red-200 rounded-xl text-xs font-semibold transition-colors"
                  >
                    Từ chối
                  </button>
                  <button
                    onClick={async () => {
                      try {
                        await apiService.confirmOfflineRentalAndActivateAccount(selectedContract.id);
                        window.location.reload();
                      } catch (e: any) { alert(e.message); }
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition-colors"
                  >
                    Xác nhận ký
                  </button>
                </div>
              )}

              {role === 'owner' && selectedContract.contractStatus === 'Draft' && (
                <button
                  onClick={async () => {
                    try {
                      await apiService.sendContractToTenant(selectedContract.id);
                      alert('Đã gửi hợp đồng cho người thuê!');
                      window.location.reload();
                    } catch (e: any) { alert(e.message); }
                  }}
                  className="px-4 py-2 bg-[#E03C3D] hover:bg-[#C92F30] text-white rounded-xl text-xs font-bold transition-colors"
                >
                  Gửi cho người thuê
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
