'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiService, ListingItem } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import {
  MapPin,
  Bed,
  Bath,
  Maximize2,
  Building2,
  ShieldCheck,
  FileCheck,
  Sparkles,
  ArrowLeft,
  User,
  CheckCircle2,
  Bot,
  AlertTriangle,
  FileText,
  X
} from 'lucide-react';

export default function ApartmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { user, isLoggedIn, toggleAiPanel } = useAuthStore();
  const [listing, setListing] = useState<ListingItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [showRentalModal, setShowRentalModal] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [ownerContact, setOwnerContact] = useState<{ name: string, phoneNumber: string, email: string } | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    apiService.getListingById(resolvedParams.id).then((data) => {
      setListing(data);
      setLoading(false);
    });
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-emerald-400 text-xs gap-2">
        <Sparkles className="w-5 h-5 animate-spin" />
        <span>Đang tải thông tin chi tiết căn hộ...</span>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Không tìm thấy căn hộ</h2>
        <Link href="/search" className="text-emerald-400 underline text-xs font-bold">
          Quay lại danh sách tìm kiếm
        </Link>
      </div>
    );
  }

  const primaryImg = listing.images.find((i) => i.isPrimary)?.imageUrl || listing.images[0]?.imageUrl || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80';

  const handleRequestRent = async () => {
    if (!isLoggedIn) {
      router.push('/auth/login');
      return;
    }
    try {
      setIsRequesting(true);
      setErrorMsg('');
      const res = await apiService.createRentalRequest(listing.apartmentId);
      setOwnerContact(res.ownerContact);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || err.message || 'Có lỗi xảy ra');
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Back Link */}
      <Link
        href="/search"
        className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-emerald-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Quay lại danh sách căn hộ
      </Link>

      {/* Title & Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
              {listing.apartment.type}
            </span>
            <span className="px-3 py-1 rounded-lg bg-slate-900 border border-white/10 text-gray-300 text-xs font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> AI Verified Listing
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight">{listing.title}</h1>
          <p className="text-xs sm:text-sm text-gray-400 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
            {listing.apartment.fullAddress}
          </p>
        </div>

        {/* Pricing & CTA Console */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-amber-500/30 glass-panel-amber shrink-0 space-y-3 min-w-[280px]">
          <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Giá Thuê Niêm Yết</div>
          <div className="text-3xl font-black text-amber-400">
            {listing.pricePerMonth.toLocaleString('vi-VN')} <span className="text-sm font-normal text-gray-300">đ/tháng</span>
          </div>
          {user?.role === 'OWNER' ? (
            <div className="w-full py-3.5 rounded-xl bg-slate-800 border border-slate-700 text-center font-bold text-sm text-gray-300 flex items-center justify-center gap-2">
              <span>
                {listing.apartment.apartmentStatus === 'Available'
                  ? 'Trống'
                  : `Khách Thuê : ${listing.apartment.contracts?.[0]?.tenant?.fullName || 'Đã Thuê'}`
                }
              </span>
            </div>
          ) : (
            <button
              onClick={() => {
                setOwnerContact(null);
                setErrorMsg('');
                setShowRentalModal(true);
              }}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
              <FileCheck className="w-4.5 h-4.5" />
              <span>Yêu Cầu Thuê Ngay</span>
            </button>
          )}
        </div>
      </div>

      {/* Image Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 rounded-3xl overflow-hidden border border-white/10">
        <div className="md:col-span-2 h-[420px] bg-slate-950 overflow-hidden">
          <img src={primaryImg} alt={listing.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
        </div>
        <div className="grid grid-rows-2 gap-4 h-[420px]">
          {listing.images.slice(1, 3).map((img, idx) => (
            <div key={img.id || idx} className="h-full bg-slate-950 overflow-hidden">
              <img src={img.imageUrl} alt="Sub view" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
          ))}
          {listing.images.length <= 1 && (
            <div className="h-full bg-slate-900 border border-white/5 flex items-center justify-center text-gray-500 text-xs">
              Hình ảnh căn hộ chuẩn AI
            </div>
          )}
        </div>
      </div>

      {/* Core Specifications & Description */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          {/* Specs Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-slate-900/60 border border-white/10 glass-panel">
            <div className="space-y-1">
              <span className="text-[11px] text-gray-400 uppercase font-semibold">Phòng ngủ</span>
              <div className="text-lg font-bold text-white flex items-center gap-2">
                <Bed className="w-5 h-5 text-emerald-400" /> {listing.apartment.bedroom} PN
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-[11px] text-gray-400 uppercase font-semibold">Phòng vệ sinh</span>
              <div className="text-lg font-bold text-white flex items-center gap-2">
                <Bath className="w-5 h-5 text-emerald-400" /> {listing.apartment.bathroom} WC
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-[11px] text-gray-400 uppercase font-semibold">Diện tích</span>
              <div className="text-lg font-bold text-white flex items-center gap-2">
                <Maximize2 className="w-5 h-5 text-emerald-400" /> {listing.apartment.area} m²
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-[11px] text-gray-400 uppercase font-semibold">Vị trí phòng</span>
              <div className="text-lg font-bold text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-400" /> P.{listing.apartment.room_number} - Tầng {listing.apartment.floor}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3 p-6 rounded-2xl bg-slate-900/60 border border-white/10 glass-panel">
            <h3 className="text-lg font-bold text-white">Mô Tả Căn Hộ</h3>
            <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">
              {listing.description}
            </p>
          </div>

          {/* Business Process Transparency Box */}
          <div className="p-6 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 glass-panel-emerald space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-emerald-400">
              <ShieldCheck className="w-5 h-5" /> Quy Trình Thuê & Ký Hợp Đồng
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">
              * **Bảo mật thông tin:** Nhấn "Yêu Cầu Thuê Ngay" để hệ thống chia sẻ thông tin liên lạc của Chủ nhà. Chủ nhà cũng sẽ nhận được yêu cầu của bạn.<br />
              * **Thương lượng trực tiếp:** Hai bên tự thương lượng và ký kết hợp đồng ngoài đời thực.<br />
              * **Xác nhận trên hệ thống:** Sau khi ký hợp đồng, Chủ nhà sẽ cập nhật trạng thái hợp đồng, và bạn cần xác nhận để hoàn tất thủ tục lưu trú trên hệ thống.
            </p>
          </div>
        </div>

        {/* Owner Info & AI Agent Assistant Sidebar */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-white/10 glass-panel space-y-4">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Thông Tin Chủ Nhà</div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold text-lg">
                {listing.apartment.owner?.fullName?.charAt(0) || 'O'}
              </div>
              <div>
                <div className="text-sm font-bold text-white">{listing.apartment.owner?.fullName || 'Chủ Nhà Xác Nhận'}</div>
                <div className="text-[11px] text-gray-400">Đã đăng ký MST doanh nghiệp / chính chủ</div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/90 border border-emerald-500/40 space-y-4 glass-panel">
            <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold">
              <Bot className="w-5 h-5" /> Có Thắc Mắc Về Căn Hộ?
            </div>
            <p className="text-xs text-gray-300">
              Bạn có thể hỏi AI Broker Agent về chi phí quản lý, tiện ích dịch vụ hoặc thời gian đi chuyển tới các quận trung tâm.
            </p>
            <button
              onClick={toggleAiPanel}
              className="w-full py-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-xs hover:bg-emerald-500/30 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Trò Chuyện Với AI Broker</span>
            </button>
          </div>
        </div>
      </div>

      {/* RENTAL CONFIRMATION MODAL */}
      {showRentalModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-slate-900 border border-amber-500/40 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl glass-panel relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowRentalModal(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2 border-b border-white/10 pb-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold">
                <FileText className="w-4 h-4" /> Xác Nhận Gửi Yêu Cầu Thuê
              </div>
              <h2 className="text-2xl font-bold text-white">Yêu Cầu Thông Tin Liên Lạc</h2>
            </div>

            {!ownerContact ? (
              <>
                <div className="space-y-4 text-xs text-gray-300">
                  <div className="p-4 rounded-xl bg-slate-950 border border-white/10 space-y-2">
                    <div className="font-bold text-white text-sm">{listing.title}</div>
                    <div>Địa chỉ: {listing.apartment.fullAddress}</div>
                    <div>Giá thuê: <span className="text-amber-400 font-bold">{listing.pricePerMonth.toLocaleString('vi-VN')} đ/tháng</span></div>
                  </div>

                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 space-y-2">
                    <div className="font-bold flex items-center gap-2 text-amber-400">
                      <AlertTriangle className="w-4 h-4" /> QUY TRÌNH THUÊ
                    </div>
                    <p className="text-[11px] leading-relaxed">
                      Nhấn "Gửi Yêu Cầu" để gửi thông báo cho Chủ nhà và nhận thông tin liên lạc của Chủ nhà. Sau đó hai bên tự đàm phán offline. Hệ thống không thu phí trung gian.
                    </p>
                  </div>

                  {errorMsg && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 font-medium">
                      {errorMsg}
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={handleRequestRent}
                    disabled={isRequesting}
                    className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/20 hover:scale-[1.02] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isRequesting ? 'Đang gửi yêu cầu...' : 'Gửi Yêu Cầu Ngay'}
                  </button>
                  <button
                    onClick={() => setShowRentalModal(false)}
                    disabled={isRequesting}
                    className="px-6 py-3.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 font-semibold text-sm hover:text-white disabled:opacity-50"
                  >
                    Hủy
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-6">
                <div className="text-center space-y-2 pt-4">
                  <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/40">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Yêu Cầu Đã Được Gửi!</h3>
                  <p className="text-sm text-gray-400">Chủ nhà đã nhận được thông báo về yêu cầu của bạn.</p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/60 border border-emerald-500/30 space-y-4">
                  <div className="text-sm font-bold text-emerald-400 uppercase tracking-wider text-center border-b border-emerald-500/20 pb-3">
                    Thông Tin Liên Lạc Chủ Nhà
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Họ và tên:</span>
                      <span className="text-white font-semibold">{ownerContact.name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Số điện thoại:</span>
                      <span className="text-amber-400 font-bold text-lg">{ownerContact.phoneNumber}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Email:</span>
                      <span className="text-white">{ownerContact.email}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setShowRentalModal(false)}
                  className="w-full py-3.5 rounded-xl bg-white/5 border border-white/10 text-white font-semibold text-sm hover:bg-white/10 transition-colors"
                >
                  Đóng
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
