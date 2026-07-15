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
    <div className="w-full text-white">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold mb-2 text-white">
            Quản lý Yêu Cầu Thuê
          </h1>
          <p className="text-gray-400 text-sm max-w-xl">
            {role === 'owner' 
              ? 'Duyệt hoặc từ chối các yêu cầu thuê từ khách hàng tiềm năng.' 
              : 'Theo dõi các yêu cầu thuê nhà bạn đã gửi cho chủ nhà.'}
          </p>
        </div>
      </div>

      {/* List */}
      <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <h2 className="text-white font-bold text-lg">Danh sách yêu cầu</h2>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-950 border border-white/10 rounded-xl px-3 py-2 min-w-[220px]">
              <Search size={16} className="text-gray-400" />
              <input 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
                placeholder="Tìm địa chỉ, người thuê..."
                className="flex-1 bg-transparent outline-none text-white placeholder-gray-500 text-sm" 
              />
            </div>
            <div className="flex items-center gap-2">
              {[{ v: 'all', l: 'Tất cả' }, { v: 'Pending', l: 'Chờ duyệt' }, { v: 'Accepted', l: 'Đã duyệt' }, { v: 'Rejected', l: 'Đã từ chối' }].map((f) => (
                <button 
                  key={f.v} 
                  onClick={() => setFilterStatus(f.v)}
                  className={`px-3 py-1.5 rounded-lg border transition-all text-xs font-medium ${
                    filterStatus === f.v 
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
              <p className="text-sm">Không tìm thấy yêu cầu nào</p>
            </div>
          ) : (
            filtered.map((r: any) => (
              <div key={r.id} className="p-4 rounded-xl border border-white/10 bg-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-white/10 transition-colors">
                <div className="flex-1">
                  <p className="text-white font-medium mb-1 truncate max-w-md">
                    {r.apartment?.fullAddress || 'Không rõ địa chỉ'}
                  </p>
                  <p className="text-gray-400 text-xs">Mã YC: {r.id}</p>
                </div>
                
                <div className="flex-1">
                  {role === 'owner' ? (
                    <p className="text-sm text-gray-300">
                      <span className="text-gray-500">Người thuê: </span> 
                      {r.account?.fullName || r.account?.email || 'Chưa cập nhật'}
                      <br/>
                      <span className="text-gray-500">SĐT: </span>
                      {r.account?.phone || 'Chưa cập nhật'}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-300">
                      <span className="text-gray-500">Ngày gửi: </span> 
                      {new Date(r.createdAt).toLocaleString('vi-VN')}
                    </p>
                  )}
                </div>

                <div className="flex-shrink-0 flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    r.status === 'Accepted' ? 'bg-emerald-500/20 text-emerald-400' :
                    r.status === 'Pending' ? 'bg-amber-500/20 text-amber-400' :
                    r.status === 'Rejected' ? 'bg-red-500/20 text-red-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {r.status}
                  </span>

                  {role === 'owner' && r.status === 'Pending' && (
                    <div className="flex items-center gap-2">
                      <button 
                        disabled={actionLoading}
                        onClick={() => handleAction(r.id, 'accept')}
                        className="p-2 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/40 rounded-lg transition-colors"
                        title="Duyệt yêu cầu"
                      >
                        <CheckCircle size={16} />
                      </button>
                      <button 
                        disabled={actionLoading}
                        onClick={() => handleAction(r.id, 'reject')}
                        className="p-2 bg-red-500/20 text-red-400 hover:bg-red-500/40 rounded-lg transition-colors"
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
                      className="px-3 py-1.5 bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/40 rounded-lg text-xs font-bold transition-colors"
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
