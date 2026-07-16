'use client';

import React, { useState } from 'react';
import { FileText, Search, CheckCircle, XCircle, X } from 'lucide-react';
import { useRentalRequests, useContracts } from '@/lib/api-hooks';
import { apiService } from '@/lib/api';
import { toast } from 'sonner';

interface RentalRequestManagerProps {
  role: 'tenant' | 'owner';
}

export default function RentalRequestManager({ role }: RentalRequestManagerProps) {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  
  const { data: requests, isLoading, error, refetch } = useRentalRequests(role);
  const { data: contracts } = useContracts(role);

  const filtered = requests.filter((r) =>
    (filterStatus === 'all' || r.status === filterStatus) &&
    (r.apartment?.fullAddress?.toLowerCase().includes(search.toLowerCase()) ||
     r.account?.fullName?.toLowerCase().includes(search.toLowerCase()))
  );

  const checkHasContract = (r: any) => {
    if (!contracts) return false;
    return contracts.some((c: any) => {
      const matchApartment = c.apartmentId === r.apartmentId || (c.apartment && c.apartment.id === r.apartmentId);
      const matchTenant = c.tenantId === r.accountId || c.tenant === r.accountId || (c.tenant && c.tenant.accountId === r.accountId);
      const status = c.contractStatus || c.status;
      const isActiveOrDraft = ['Draft', 'PendingTenantSignature', 'Active', 'active', 'pending'].includes(status);
      return matchApartment && matchTenant && isActiveOrDraft;
    });
  };

  const handleAction = async (id: string, action: 'accept' | 'reject') => {
    try {
      setActionLoading(true);
      if (action === 'accept') {
        await apiService.acceptRentalRequest(id);
        toast.success('Đã duyệt yêu cầu thuê!');
      } else {
        await apiService.rejectRentalRequest(id);
        toast.success('Đã từ chối yêu cầu thuê!');
      }
      await refetch();
      window.dispatchEvent(new Event('RENTAL_REQUEST_UPDATED'));
    } catch (err) {
      console.error(err);
      toast.error('Có lỗi xảy ra khi thực hiện hành động');
    } finally {
      setActionLoading(false);
    }
  };

  const parseMessageData = (messageStr: string | null | undefined) => {
    if (!messageStr) return null;
    try {
      const cleaned = messageStr.trim();
      if (cleaned.startsWith('{')) {
        const parsed = JSON.parse(cleaned);
        if (parsed && parsed.isMetadata) {
          return parsed;
        }
      }
    } catch (e) {
      // ignore
    }
    return null;
  };

  const handleCreateDraftContract = async (r: any) => {
    try {
      setActionLoading(true);

      const meta = parseMessageData(r.message);
      
      // Auto-extract values or fallback
      const rentPrice = meta && typeof meta.price === 'number' ? meta.price : 5000000;
      const deposit = rentPrice; // deposit matches the rent price
      const terms = meta && meta.title ? `Hợp đồng cho thuê căn hộ: ${meta.title}` : 'Hợp đồng tạo tự động từ yêu cầu thuê';

      const startDate = new Date();
      const endDate = new Date();
      endDate.setFullYear(endDate.getFullYear() + 1);

      await apiService.createDraftContract({
        tenantId: r.accountId,
        apartmentId: r.apartmentId,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        rentPrice: rentPrice,
        deposit: deposit,
        terms: terms
      });
      
      toast.success('Đã tạo hợp đồng nháp thành công! Vui lòng vào Quản lý Hợp Đồng để xem.');
      setSelectedRequest(null);
    } catch (e: any) {
      toast.error(e.message || 'Lỗi tạo hợp đồng');
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
              <div 
                key={r.id} 
                onClick={() => setSelectedRequest(r)}
                className="p-4 bg-white border-b border-[#E8E8E8] flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <div className="flex-1">
                  <p className="text-[#2C2C2C] font-semibold mb-1 truncate max-w-md">
                    {r.apartment?.fullAddress || parseMessageData(r.message)?.address || 'Không rõ địa chỉ'}
                  </p>
                  {parseMessageData(r.message)?.title && (
                    <p className="text-[#E03C3D] font-bold text-xs mb-1">
                      {parseMessageData(r.message)?.title}
                    </p>
                  )}
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
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAction(r.id, 'accept');
                        }}
                        className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors"
                        title="Duyệt yêu cầu"
                      >
                        <CheckCircle size={16} />
                      </button>
                      <button 
                        disabled={actionLoading}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAction(r.id, 'reject');
                        }}
                        className="p-2 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded-lg transition-colors"
                        title="Từ chối yêu cầu"
                      >
                        <XCircle size={16} />
                      </button>
                    </div>
                  )}

                  {role === 'owner' && r.status === 'Accepted' && (
                    checkHasContract(r) ? (
                      <span className="px-3 py-1.5 bg-slate-100 text-[#5A5A5A] rounded-lg text-xs font-bold border border-slate-200">
                        Đã tạo HĐ
                      </span>
                    ) : (
                      <button
                        disabled={actionLoading}
                        onClick={async (e) => {
                          e.stopPropagation();
                          await handleCreateDraftContract(r);
                        }}
                        className="px-3 py-1.5 bg-[#E03C3D] hover:bg-[#C92F30] text-white rounded-lg text-xs font-bold transition-colors"
                      >
                        Tạo Hợp Đồng Nháp
                      </button>
                    )
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Request Details Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#E8E8E8] rounded-2xl shadow-xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-6 py-4 border-b border-[#E8E8E8] flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#2C2C2C]">Chi Tiết Yêu Cầu Thuê</h3>
              <button 
                onClick={() => setSelectedRequest(null)}
                className="text-[#5A5A5A] hover:text-[#2C2C2C] transition-colors p-1 rounded-lg hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Body */}
            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-sm text-[#2C2C2C]">
              {/* Status & ID */}
              <div className="flex items-center justify-between pb-3 border-b border-dashed border-[#E8E8E8]">
                <div>
                  <p className="text-[#5A5A5A] text-xs uppercase tracking-wider font-semibold">Mã yêu cầu</p>
                  <p className="text-sm font-mono font-semibold">{selectedRequest.id}</p>
                </div>
                <div>
                  <p className="text-[#5A5A5A] text-xs uppercase tracking-wider font-semibold mb-1">Trạng thái</p>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                    selectedRequest.status === 'Accepted' ? 'bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]' :
                    selectedRequest.status === 'Pending' ? 'bg-[#FFF9E6] text-[#B7791F] border-[#FEEBC8]' :
                    selectedRequest.status === 'Rejected' ? 'bg-[#FEF2F2] text-[#991B1B] border-[#FEE2E2]' :
                    'bg-slate-50 text-slate-600 border-[#E8E8E8]'
                  }`}>
                    {selectedRequest.status === 'Accepted' ? 'Đã duyệt' : selectedRequest.status === 'Pending' ? 'Chờ duyệt' : selectedRequest.status === 'Rejected' ? 'Đã từ chối' : selectedRequest.status}
                  </span>
                </div>
              </div>

              {/* Apartment details */}
              <div className="space-y-2">
                <h4 className="font-bold text-[#E03C3D] flex items-center gap-1.5 text-xs uppercase tracking-wider">Thông Tin Căn Hộ</h4>
                <div className="bg-slate-50 border border-[#E8E8E8] rounded-xl p-3 space-y-2">
                  {parseMessageData(selectedRequest.message)?.title && (
                    <div>
                      <span className="text-[#5A5A5A] text-xs block">Tên căn hộ</span>
                      <span className="font-semibold text-base text-[#2C2C2C]">{parseMessageData(selectedRequest.message)?.title}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-[#5A5A5A] text-xs block">Địa chỉ căn hộ</span>
                    <span className="font-semibold">{selectedRequest.apartment?.fullAddress || parseMessageData(selectedRequest.message)?.address || 'Không rõ địa chỉ'}</span>
                  </div>
                  {parseMessageData(selectedRequest.message)?.price && (
                    <div>
                      <span className="text-[#5A5A5A] text-xs block">Giá thuê niêm yết</span>
                      <span className="font-bold text-[#E03C3D]">
                        {Number(parseMessageData(selectedRequest.message)?.price).toLocaleString('vi-VN')} VND / tháng
                      </span>
                    </div>
                  )}
                  <div>
                    <span className="text-[#5A5A5A] text-xs block">Mã căn hộ (apartmentId)</span>
                    <span className="font-mono text-xs">{selectedRequest.apartmentId}</span>
                  </div>
                </div>
              </div>

              {/* Tenant details */}
              <div className="space-y-2">
                <h4 className="font-bold text-[#E03C3D] flex items-center gap-1.5 text-xs uppercase tracking-wider">Thông Tin Người Thuê</h4>
                <div className="bg-slate-50 border border-[#E8E8E8] rounded-xl p-3 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[#5A5A5A] text-xs block">Họ tên</span>
                      <span className="font-semibold">{selectedRequest.account?.fullName || 'Chưa cập nhật'}</span>
                    </div>
                    <div>
                      <span className="text-[#5A5A5A] text-xs block">Số điện thoại</span>
                      <span className="font-semibold">{selectedRequest.account?.phone || 'Chưa cập nhật'}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-[#5A5A5A] text-xs block">Email</span>
                    <span className="font-semibold">{selectedRequest.account?.email || 'Chưa cập nhật'}</span>
                  </div>
                </div>
              </div>

              {/* Request Details */}
              <div className="grid grid-cols-2 gap-4 pb-3 border-b border-dashed border-[#E8E8E8]">
                <div>
                  <span className="text-[#5A5A5A] text-xs block">Ngày gửi yêu cầu</span>
                  <span className="font-semibold">{new Date(selectedRequest.createdAt).toLocaleString('vi-VN')}</span>
                </div>
              </div>

              <div>
                <span className="text-[#5A5A5A] text-xs block mb-1">Lời nhắn từ khách thuê</span>
                <p className="bg-slate-50 border border-[#E8E8E8] rounded-xl p-3 italic text-slate-700 min-h-[60px]">
                  {parseMessageData(selectedRequest.message)?.userMessage || (parseMessageData(selectedRequest.message) ? 'Không có lời nhắn' : (selectedRequest.message || 'Không có lời nhắn'))}
                </p>
              </div>

              {/* Note about contract creation */}
              <div className="bg-[#FFF9E6] border border-[#FEEBC8] rounded-xl p-4 flex items-start gap-2.5">
                <span className="text-xl">⚠️</span>
                <div>
                  <h5 className="font-bold text-[#B7791F] text-xs uppercase tracking-wider mb-1">Lưu ý về Hợp đồng</h5>
                  <p className="text-xs text-[#B7791F] leading-relaxed">
                    Hợp đồng cho yêu cầu thuê này phải được tạo trực tiếp từ chính yêu cầu này.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-[#E8E8E8] flex justify-end gap-3">
              <button 
                onClick={() => setSelectedRequest(null)}
                className="px-4 py-2 border border-[#E8E8E8] bg-white text-[#2C2C2C] hover:bg-slate-50 transition-colors rounded-xl text-xs font-semibold"
              >
                Đóng
              </button>
              
              {role === 'owner' && selectedRequest.status === 'Pending' && (
                <div className="flex gap-2">
                  <button 
                    disabled={actionLoading}
                    onClick={async () => {
                      await handleAction(selectedRequest.id, 'reject');
                      setSelectedRequest(null);
                    }}
                    className="px-4 py-2 bg-red-50 text-red-650 hover:bg-red-100 border border-red-200 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1"
                  >
                    Từ chối
                  </button>
                  <button 
                    disabled={actionLoading}
                    onClick={async () => {
                      await handleAction(selectedRequest.id, 'accept');
                      setSelectedRequest(null);
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1"
                  >
                    Duyệt
                  </button>
                </div>
              )}

              {role === 'owner' && selectedRequest.status === 'Accepted' && (
                checkHasContract(selectedRequest) ? (
                  <span className="px-4 py-2 bg-slate-100 text-[#5A5A5A] rounded-xl text-xs font-bold border border-slate-200 flex items-center justify-center">
                    Đã tạo Hợp Đồng
                  </span>
                ) : (
                  <button
                    disabled={actionLoading}
                    onClick={() => handleCreateDraftContract(selectedRequest)}
                    className="px-4 py-2 bg-[#E03C3D] hover:bg-[#C92F30] text-white rounded-xl text-xs font-bold transition-colors"
                  >
                    Tạo Hợp Đồng Nháp
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

