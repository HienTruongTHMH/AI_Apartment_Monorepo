'use client';

import React, { useState } from 'react';
import { CreditCard, Search, Download, Check, Copy, X, ExternalLink, RefreshCw } from 'lucide-react';
import { usePayments } from '@/lib/api-hooks';
import { apiService } from '@/lib/api';

interface PaymentManagerProps {
  role: 'tenant' | 'owner';
}

export default function PaymentManager({ role }: PaymentManagerProps) {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<any | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const { data: payments = [], isLoading, refetch } = usePayments(role);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleConfirmPayment = async (paymentId: string) => {
    try {
      setIsConfirming(paymentId);
      await apiService.confirmPayment(paymentId);
      showToast('success', 'Xác nhận thanh toán thành công!');
      await refetch();
    } catch (err: any) {
      console.error(err);
      showToast('error', err.response?.data?.message || 'Có lỗi xảy ra khi xác nhận thanh toán.');
    } finally {
      setIsConfirming(null);
    }
  };

  const filtered = (payments || []).filter((p: any) => {
    const statusLower = (p.status || '').toLowerCase();
    const matchesFilter =
      filterStatus === 'all' ||
      statusLower === filterStatus ||
      (filterStatus === 'pending' && statusLower === 'overdue');

    const address = p.contract?.apartment?.fullAddress || '';
    const id = p.id || '';
    const tenantName = p.contract?.tenant?.fullName || '';
    const tenantPhone = p.contract?.tenant?.account?.phone || '';

    const matchesSearch =
      id.toLowerCase().includes(search.toLowerCase()) ||
      address.toLowerCase().includes(search.toLowerCase()) ||
      tenantName.toLowerCase().includes(search.toLowerCase()) ||
      tenantPhone.includes(search);

    return matchesFilter && matchesSearch;
  });

  // Parse owner bank account: format "BANKNAME ACCOUNTNUMBER" or default to MB
  const getQRDetails = (payment: any) => {
    const owner = payment?.contract?.owner;
    const bankAccountStr = owner?.bankAccount || '';
    const fullName = owner?.fullName || 'CHỦ NHÀ';
    const amount = Math.round(Number(payment?.amount || 0));
    const description = `THANH TOAN TIEN NHA DH${payment?.id?.substring(0, 8).toUpperCase()}`;

    let bankId = 'MB';
    let accountNo = bankAccountStr;

    if (bankAccountStr) {
      const parts = bankAccountStr.split(/[\s-]/);
      if (parts.length > 1) {
        bankId = parts[0].trim().toUpperCase();
        accountNo = parts.slice(1).join('').trim();
      }
    }

    const qrUrl = `https://img.vietqr.io/image/${bankId}-${accountNo}-print.png?amount=${amount}&addInfo=${encodeURIComponent(description)}&accountName=${encodeURIComponent(fullName)}`;

    return {
      bankId,
      accountNo,
      fullName,
      amount,
      description,
      qrUrl,
    };
  };

  return (
    <div className="w-full min-h-full bg-[#F9FAFB] py-8 px-4 sm:px-6 font-sans">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border transition-all duration-300 transform translate-y-0 ${
            toast.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          {toast.type === 'success' ? (
            <span className="p-1 rounded-full bg-emerald-100 text-emerald-600">
              <Check size={16} />
            </span>
          ) : (
            <span className="p-1 rounded-full bg-rose-100 text-rose-600">
              <X size={16} />
            </span>
          )}
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111827] mb-1">
            Quản lý Thanh toán
          </h1>
          <p className="text-[#4B5563] text-sm max-w-xl">
            {role === 'owner'
              ? 'Theo dõi dòng tiền, hóa đơn đã xuất và xác nhận thanh toán từ khách thuê.'
              : 'Xem lịch sử thanh toán, hóa đơn đến hạn và quét mã chuyển khoản nhanh.'}
          </p>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isLoading}
          className="flex items-center gap-2 self-start sm:self-center px-3.5 py-2 border border-[#E5E7EB] bg-[#FFFFFF] hover:bg-[#F9FAFB] active:bg-[#F3F4F6] text-[#4B5563] rounded-lg text-sm font-medium transition-all shadow-sm cursor-pointer disabled:opacity-50"
        >
          <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
          <span>Tải lại</span>
        </button>
      </div>

      {/* Main Card Panel */}
      <div className="bg-[#FFFFFF] rounded-2xl border border-[#E5E7EB] shadow-sm p-6">
        {/* Panel Header Flex */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 mb-6 border-b border-[#E5E7EB]">
          <h2 className="text-lg font-semibold text-[#111827]">
            Lịch sử giao dịch
          </h2>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="flex items-center gap-2 bg-[#FFFFFF] border border-[#E5E7EB] rounded-lg px-3 py-1.5 w-full sm:w-[260px] focus-within:ring-2 focus-within:ring-[#111827]/10 focus-within:border-[#111827] transition-all">
              <Search size={16} className="text-[#9CA3AF] shrink-0" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm mã giao dịch, căn hộ..."
                className="flex-1 bg-transparent outline-none text-[#111827] placeholder-[#9CA3AF] text-sm"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-[#F9FAFB] p-1 rounded-full border border-[#E5E7EB]">
              {[
                { v: 'all', l: 'Tất cả' },
                { v: 'paid', l: 'Thành công' },
                { v: 'pending', l: 'Chưa thanh toán' },
              ].map((f) => {
                const isActive = filterStatus === f.v;
                return (
                  <button
                    key={f.v}
                    onClick={() => setFilterStatus(f.v)}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#111827] text-[#FFFFFF] shadow-sm'
                        : 'bg-transparent text-[#4B5563] hover:text-[#111827] hover:bg-gray-200/40'
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
            <CreditCard size={48} className="text-[#9CA3AF] mb-4" strokeWidth={1.5} />
            <p className="text-[#4B5563] text-[14px] mb-4 font-normal text-center">
              Chưa có lịch sử giao dịch nào phù hợp
            </p>
          </div>
        ) : (
          /* Data State - Table */
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E5E7EB]">
                  <th className="py-3 px-4 text-xs font-semibold text-[#4B5563] uppercase tracking-wider first:pl-2">
                    Mã hóa đơn
                  </th>
                  <th className="py-3 px-4 text-xs font-semibold text-[#4B5563] uppercase tracking-wider">
                    Căn hộ
                  </th>
                  {role === 'owner' && (
                    <>
                      <th className="py-3 px-4 text-xs font-semibold text-[#4B5563] uppercase tracking-wider">
                        Người thuê
                      </th>
                      <th className="py-3 px-4 text-xs font-semibold text-[#4B5563] uppercase tracking-wider">
                        Sđt người thuê
                      </th>
                    </>
                  )}
                  <th className="py-3 px-4 text-xs font-semibold text-[#4B5563] uppercase tracking-wider">
                    Hạn thanh toán
                  </th>
                  <th className="py-3 px-4 text-xs font-semibold text-[#4B5563] uppercase tracking-wider">
                    Số tiền
                  </th>
                  <th className="py-3 px-4 text-xs font-semibold text-[#4B5563] uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="py-3 px-4 text-xs font-semibold text-[#4B5563] uppercase tracking-wider text-right last:pr-2">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {filtered.map((p: any) => {
                  const statusLower = (p.status || '').toLowerCase();
                  const isPaid = statusLower === 'paid';
                  const isOverdue = statusLower === 'overdue';
                  const isPending = statusLower === 'pending';

                  return (
                    <tr
                      key={p.id}
                      className="border-b border-[#E5E7EB] hover:bg-[#F9FAFB]/60 transition-colors text-sm"
                    >
                      <td className="py-4 px-4 first:pl-2 font-mono font-medium text-[#111827]">
                        {p.id ? p.id.substring(0, 8).toUpperCase() : 'N/A'}
                      </td>
                      <td className="py-4 px-4 font-medium text-[#111827]">
                        <div>
                          {p.contract?.apartment?.room_number ? (
                            <span className="font-semibold text-gray-900 block">
                              Phòng {p.contract.apartment.room_number}
                            </span>
                          ) : null}
                          <span className="text-xs text-gray-500 block max-w-[200px] truncate" title={p.contract?.apartment?.fullAddress}>
                            {p.contract?.apartment?.fullAddress || 'N/A'}
                          </span>
                        </div>
                      </td>
                      {role === 'owner' && (
                        <>
                          <td className="py-4 px-4 text-[#111827] font-medium">
                            {p.contract?.tenant?.fullName || 'N/A'}
                          </td>
                          <td className="py-4 px-4 text-[#4B5563] font-mono">
                            {p.contract?.tenant?.account?.phone || 'N/A'}
                          </td>
                        </>
                      )}
                      <td className="py-4 px-4 text-[#4B5563]">
                        {p.dueDate ? new Date(p.dueDate).toLocaleDateString('vi-VN') : 'N/A'}
                      </td>
                      <td className="py-4 px-4 font-semibold text-[#111827]">
                        {Number(p.amount || 0).toLocaleString('vi-VN')} ₫
                      </td>
                      <td className="py-4 px-4">
                        {isPaid ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#DEF7EC] text-[#03543F] border border-[#DEF7EC]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#03543F]" />
                            Đã thanh toán
                          </span>
                        ) : isOverdue ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 animate-pulse">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
                            Quá hạn
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            Chờ thanh toán
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-right last:pr-2">
                        {role === 'owner' && (isPending || isOverdue) && (
                          <button
                            onClick={() => handleConfirmPayment(p.id)}
                            disabled={isConfirming === p.id}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#111827] text-white hover:bg-black active:scale-95 disabled:opacity-50 text-xs font-semibold rounded-lg transition-all shadow-sm cursor-pointer"
                          >
                            {isConfirming === p.id ? (
                              <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Check size={14} />
                            )}
                            Xác nhận đã nhận
                          </button>
                        )}

                        {role === 'tenant' && (isPending || isOverdue) && (
                          <button
                            onClick={() => setSelectedPayment(p)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#111827] text-white hover:bg-black active:scale-95 text-xs font-semibold rounded-lg transition-all shadow-sm cursor-pointer"
                          >
                            <CreditCard size={14} />
                            Thanh toán (QR)
                          </button>
                        )}

                        {isPaid && (
                          <span className="text-xs font-medium text-[#9CA3AF]">
                            Giao dịch hoàn tất
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

      {/* QR Modal for Tenant */}
      {selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity duration-300">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transform scale-100 transition-transform duration-300">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
                <CreditCard className="text-[#111827]" size={20} />
                Thanh toán chuyển khoản VietQR
              </h3>
              <button
                onClick={() => setSelectedPayment(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 flex flex-col md:flex-row gap-6 items-center md:items-start max-h-[75vh] overflow-y-auto">
              {/* QR Code Column */}
              <div className="flex flex-col items-center shrink-0 w-full md:w-[220px]">
                <div className="p-3 border border-gray-200 rounded-xl bg-white shadow-inner">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getQRDetails(selectedPayment).qrUrl}
                    alt="VietQR Chuyển khoản"
                    className="w-[180px] h-[180px] object-contain rounded-lg"
                  />
                </div>
                <span className="mt-2.5 text-[11px] font-medium text-gray-500 text-center flex items-center gap-1">
                  Quét mã bằng App ngân hàng (VietQR)
                  <ExternalLink size={10} />
                </span>
              </div>

              {/* Bank Details Column */}
              <div className="flex-1 w-full space-y-4 text-sm">
                <div>
                  <span className="text-xs text-gray-400 block mb-0.5">Căn hộ</span>
                  <span className="font-semibold text-gray-900">
                    {selectedPayment.contract?.apartment?.fullAddress || 'N/A'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs text-gray-400 block mb-0.5">Ngân hàng</span>
                    <span className="font-bold text-gray-800">
                      {getQRDetails(selectedPayment).bankId}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 block mb-0.5">Số tài khoản</span>
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-gray-900">
                        {getQRDetails(selectedPayment).accountNo}
                      </span>
                      <button
                        onClick={() =>
                          handleCopy(
                            getQRDetails(selectedPayment).accountNo,
                            'accountNo'
                          )
                        }
                        className="text-gray-400 hover:text-gray-700 cursor-pointer"
                        title="Sao chép"
                      >
                        {copiedField === 'accountNo' ? (
                          <Check size={14} className="text-emerald-600" />
                        ) : (
                          <Copy size={14} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <span className="text-xs text-gray-400 block mb-0.5">Chủ tài khoản</span>
                  <span className="font-bold text-gray-900 uppercase">
                    {getQRDetails(selectedPayment).fullName}
                  </span>
                </div>

                <div>
                  <span className="text-xs text-gray-400 block mb-0.5">Số tiền chuyển khoản</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-lg font-bold text-gray-900">
                      {getQRDetails(selectedPayment).amount.toLocaleString('vi-VN')} ₫
                    </span>
                    <button
                      onClick={() =>
                        handleCopy(
                          getQRDetails(selectedPayment).amount.toString(),
                          'amount'
                        )
                      }
                      className="text-gray-400 hover:text-gray-700 cursor-pointer"
                      title="Sao chép"
                    >
                      {copiedField === 'amount' ? (
                        <Check size={14} className="text-emerald-600" />
                      ) : (
                        <Copy size={14} />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <span className="text-xs text-gray-400 block mb-0.5">Nội dung chuyển khoản</span>
                  <div className="p-2 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-between">
                    <span className="font-mono text-xs font-semibold text-gray-800">
                      {getQRDetails(selectedPayment).description}
                    </span>
                    <button
                      onClick={() =>
                        handleCopy(
                          getQRDetails(selectedPayment).description,
                          'description'
                        )
                      }
                      className="text-gray-400 hover:text-gray-700 cursor-pointer"
                      title="Sao chép"
                    >
                      {copiedField === 'description' ? (
                        <Check size={14} className="text-emerald-600" />
                      ) : (
                        <Copy size={14} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end items-center gap-3 px-6 py-4 bg-gray-50/50 border-t border-gray-100">
              <span className="text-xs text-gray-500 italic mr-auto">
                * Vui lòng điền chính xác nội dung chuyển khoản.
              </span>
              <button
                onClick={() => setSelectedPayment(null)}
                className="px-4 py-2 text-sm font-semibold border border-gray-200 bg-white hover:bg-gray-50 rounded-lg shadow-xs cursor-pointer text-gray-700 transition-all"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
