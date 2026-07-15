'use client';

import React, { useState } from 'react';
import { FileText, Search, CheckCircle, XCircle } from 'lucide-react';
import { useRentalRequests } from '@/lib/api-hooks';
import { apiService } from '@/lib/api';

interface RentalRequestManagerProps {
  role: 'tenant' | 'owner';
}

export default function RentalRequestManager({ role }: RentalRequestManagerProps) {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  
  const { data: requests, isLoading, error, refetch } = useRentalRequests(role);

  const filtered = requests.filter((r) =>
    (filterStatus === 'all' || r.status === filterStatus) &&
    (r.apartment?.fullAddress?.toLowerCase().includes(search.toLowerCase()) ||
     r.account?.fullName?.toLowerCase().includes(search.toLowerCase()))
  );

  const handleAction = async (id: string, action: 'accept' | 'reject') => {
    try {
      setActionLoading(true);
      if (action === 'accept') {
        await apiService.acceptRentalRequest(id);
      } else {
        await apiService.rejectRentalRequest(id);
      }
      await refetch();
    } catch (err) {
      console.error(err);
      alert('Có lỗi xảy ra khi thực hiện hành động');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="w-full text-[#2C2C2C]">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold mb-2 text-[#2C2C2C]">
            Quản lý Yêu Cầu Thuê
          </h1>
          <p className="text-[#5A5A5A] text-sm max-w-xl">
            {role === 'owner' 
              ? 'Duyệt hoặc từ chối các yêu cầu thuê từ khách hàng tiềm năng.' 
              : 'Theo dõi các yêu cầu thuê nhà bạn đã gửi cho chủ nhà.'}
          </p>
        </div>
      </div>

      {/* List */}
      <div className="bg-white border border-[#E8E8E8] rounded-2xl p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <h2 className="text-[#2C2C2C] font-bold text-lg">Danh sách yêu cầu</h2>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-50 border border-[#E8E8E8] rounded-xl px-3 py-2 min-w-[220px]">
              <Search size={16} className="text-[#5A5A5A]" />
              <input 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
                placeholder="Tìm địa chỉ, người thuê..."
                className="flex-1 bg-transparent outline-none text-[#2C2C2C] placeholder-slate-400 text-sm" 
              />
            </div>
            <div className="flex items-center gap-2">
              {[{ v: 'all', l: 'Tất cả' }, { v: 'Pending', l: 'Chờ duyệt' }, { v: 'Accepted', l: 'Đã duyệt' }, { v: 'Rejected', l: 'Đã từ chối' }].map((f) => (
                <button 
                  key={f.v} 
                  onClick={() => setFilterStatus(f.v)}
                  className={`px-3 py-1.5 rounded-lg border transition-all text-xs font-medium ${
                    filterStatus === f.v 
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
              <p className="text-sm">Không tìm thấy yêu cầu nào</p>
            </div>
          ) : (
            filtered.map((r: any) => (
              <div key={r.id} className="p-4 bg-white border-b border-[#E8E8E8] flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                <div className="flex-1">
                  <p className="text-[#2C2C2C] font-semibold mb-1 truncate max-w-md">
                    {r.apartment?.fullAddress || 'Không rõ địa chỉ'}
                  </p>
                  <p className="text-[#5A5A5A] text-xs">Mã YC: {r.id}</p>
                </div>
                
                <div className="flex-1">
                  {role === 'owner' ? (
                    <p className="text-sm text-[#5A5A5A]">
                      <span className="text-[#5A5A5A] font-medium">Người thuê: </span> 
                      <span className="text-[#2C2C2C] font-semibold">{r.account?.fullName || r.account?.email || 'Chưa cập nhật'}</span>
                      <br/>
                      <span className="text-[#5A5A5A] font-medium">SĐT: </span>
                      <span className="text-[#2C2C2C] font-semibold">{r.account?.phone || 'Chưa cập nhật'}</span>
                    </p>
                  ) : (
                    <p className="text-sm text-[#5A5A5A]">
                      <span className="text-[#5A5A5A] font-medium">Ngày gửi: </span> 
                      <span className="text-[#2C2C2C] font-semibold">{new Date(r.createdAt).toLocaleString('vi-VN')}</span>
                    </p>
                  )}
                </div>

                <div className="flex-shrink-0 flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                    r.status === 'Accepted' ? 'bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]' :
                    r.status === 'Pending' ? 'bg-[#FFF9E6] text-[#B7791F] border-[#FEEBC8]' :
                    r.status === 'Rejected' ? 'bg-[#FEF2F2] text-[#991B1B] border-[#FEE2E2]' :
                    'bg-slate-50 text-slate-600 border-[#E8E8E8]'
                  }`}>
                    {r.status === 'Accepted' ? 'Đã duyệt' : r.status === 'Pending' ? 'Chờ duyệt' : r.status === 'Rejected' ? 'Đã từ chối' : r.status}
                  </span>

                  {role === 'owner' && r.status === 'Pending' && (
                    <div className="flex items-center gap-2">
                      <button 
                        disabled={actionLoading}
                        onClick={() => handleAction(r.id, 'accept')}
                        className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors"
                        title="Duyệt yêu cầu"
                      >
                        <CheckCircle size={16} />
                      </button>
                      <button 
                        disabled={actionLoading}
                        onClick={() => handleAction(r.id, 'reject')}
                        className="p-2 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded-lg transition-colors"
                        title="Từ chối yêu cầu"
                      >
                        <XCircle size={16} />
                      </button>
                    </div>
                  )}

                  {role === 'owner' && r.status === 'Accepted' && (
                    <button
                      disabled={actionLoading}
                      onClick={async () => {
                        try {
                          setActionLoading(true);
                          const rentPriceStr = prompt('Nhập giá thuê (VND/tháng):', '5000000');
                          if (!rentPriceStr) return;
                          
                          const depositStr = prompt('Nhập tiền cọc (VND):', '5000000');
                          if (!depositStr) return;

                          const terms = prompt('Nhập điều khoản bổ sung (tùy chọn):', 'Không có');

                          const startDate = new Date();
                          const endDate = new Date();
                          endDate.setFullYear(endDate.getFullYear() + 1);

                          await apiService.createDraftContract({
                            tenantId: r.accountId,
                            apartmentId: r.apartmentId,
                            startDate: startDate.toISOString(),
                            endDate: endDate.toISOString(),
                            rentPrice: parseInt(rentPriceStr),
                            deposit: parseInt(depositStr),
                            terms: terms || ''
                          });
                          
                          alert('Đã tạo hợp đồng nháp thành công! Vui lòng vào Quản lý Hợp Đồng để xem.');
                        } catch (e: any) {
                          alert(e.message || 'Lỗi tạo hợp đồng');
                        } finally {
                          setActionLoading(false);
                        }
                      }}
                      className="px-3 py-1.5 bg-[#E03C3D] hover:bg-[#C92F30] text-white rounded-lg text-xs font-bold transition-colors"
                    >
                      Tạo Hợp Đồng Nháp
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
