'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Upload, Building2, CheckCircle, AlertTriangle, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { apiService } from '@/lib/api';

interface UploadedImage {
  image_id: string;
  url: string;
  media_type: string;
  base64_data: string;
}

export default function CreateListingPage() {
  const { user } = useAuthStore();
  const router = useRouter();

  const [apartmentType, setApartmentType] = useState('');
  const [rawText, setRawText] = useState('');
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  // Handle image selection and base64 conversion
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setError('');
    const newImages: UploadedImage[] = [];

    Array.from(files).forEach((file, index) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Extract raw base64 data without metadata header
        const base64Data = base64String.split(',')[1];
        
        newImages.push({
          image_id: `img_${Date.now()}_${index}`,
          url: '',
          media_type: file.type || 'image/jpeg',
          base64_data: base64Data
        });

        // Update state when all files are processed
        if (newImages.length === files.length) {
          setImages((prev) => [...prev, ...newImages]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleVerify = async () => {
    if (!rawText || rawText.length < 20) {
      setError('Vui lòng nhập mô tả thô dài ít nhất 20 ký tự.');
      return;
    }

    if (!apartmentType) {
      setError('Vui lòng chọn phân loại căn hộ.');
      return;
    }

    setVerifying(true);
    setError('');
    setResult(null);

    const payload = {
      rawText,
      images: images.map((img, index) => ({
        image_id: `image_${index + 1}`,
        url: img.url || undefined,
        media_type: img.media_type,
        base64_data: img.base64_data
      })),
      owner_id: user?.id || '',
      db_apartment_data: null
    };

    console.log('[CreateListing] Sending payload images:', payload.images);

    try {
      const response = await apiService.verifyListingDirect(payload);
      if (response && response.data) {
        setResult(response.data);
      } else {
        setError('Không nhận được phản hồi hợp lệ từ AI Verifier.');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || 'Lỗi kết nối với AI Agent.');
    } finally {
      setVerifying(false);
    }
  };

  const [publishing, setPublishing] = useState(false);

  const handlePublish = async () => {
    if (!result) return;
    setPublishing(true);
    setError('');

    try {
      const publishPayload = {
        title: result.listing?.title || 'Căn Hộ Đăng Tin',
        description: result.listing?.description || rawText,
        pricePerMonth: Number(result.listing?.pricePerMonth || 0),
        listingStatus: 'Published',
        images: {
          create: images.map((img, idx) => ({
            imageUrl: `data:${img.media_type};base64,${img.base64_data}`,
            isPrimary: idx === 0
          }))
        },
        apartment: {
          ownerId: user?.ownerProfileId || '',
          floor: Number(result.apartment_meta?.floor) || 1,
          area: Number(result.apartment_meta?.area_m2) || 50,
          district: result.apartment_meta?.district || 'Sơn Trà',
          fullAddress: result.apartment_meta?.fullAddress || 'Đà Nẵng',
          room_number: Number(result.apartment_meta?.roomNumber) || 101,
          bedroom: Number(result.apartment_meta?.bedroom) || 1,
          bathroom: Number(result.apartment_meta?.bathroom) || 1,
          livingroom: Number(result.apartment_meta?.livingroom) || 1,
          kitchen: Number(result.apartment_meta?.kitchen) || 1,
          type: apartmentType || result.apartment_meta?.type || 'Normal'
        }
      };

      await apiService.createListing(publishPayload);
      alert('Đăng tin thành công! Đang chuyển hướng đến trang tìm kiếm căn hộ...');
      router.push('/search');
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi lưu tin đăng vào cơ sở dữ liệu.');
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="p-6 text-white w-full max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold mb-3 text-white flex items-center justify-center gap-2">
          Đăng tin thông minh với AI <Sparkles className="text-amber-400 font-bold" size={24} />
        </h1>
        <p className="text-gray-400 text-sm max-w-xl mx-auto">
          Phân tích hình ảnh & thông tin mô tả thô của bạn bằng AI Verifier để tự động tối ưu hóa và kiểm duyệt tin đăng.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Form panel */}
        <div className="md:col-span-2 bg-slate-900/50 border border-white/10 rounded-2xl p-6 backdrop-blur-sm shadow-xl space-y-6">

          {/* Apartment Type Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Phân loại căn hộ:</label>
            <select
              value={apartmentType}
              onChange={(e) => setApartmentType(e.target.value)}
              className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500/50 transition-colors"
            >
              <option value="">-- Chọn loại căn hộ --</option>
              <option value="Normal">Căn hộ thường (Normal)</option>
              <option value="Studio">Studio</option>
              <option value="Officetel">Officetel</option>
              <option value="Shophouse">Shophouse</option>
              <option value="Penthouse">Penthouse</option>
              <option value="Duplex">Duplex</option>
              <option value="SkyVilla">Sky Villa</option>
            </select>
          </div>

          {/* Raw Text Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Nhập mô tả thô (AI sẽ tự động tối ưu hóa):</label>
            <textarea
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              className="w-full h-36 bg-slate-950 border border-white/10 rounded-xl p-4 text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/50 transition-colors resize-none text-sm"
              placeholder="Ví dụ: Cho thuê nhà nguyên căn hoặc phòng chung cư quận Hải Châu Đà Nẵng, diện tích khoảng 60m2, có 2 phòng ngủ, nội thất cơ bản..."
            ></textarea>
            <p className="text-xs text-gray-500 mt-1">Tối thiểu 20 ký tự để AI phân tích chính xác.</p>
          </div>

          {/* Image Uploader */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Đính kèm hình ảnh thực tế:</label>
            <div className="border border-dashed border-white/10 rounded-xl p-6 text-center hover:bg-white/5 transition-colors relative cursor-pointer group">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <Upload size={32} className="mx-auto mb-2 text-gray-500 group-hover:text-amber-400 transition-colors" />
              <p className="text-xs text-gray-400">Kéo thả tệp vào đây hoặc nhấn để chọn tệp ảnh</p>
            </div>

            {/* Image Preview List */}
            {images.length > 0 && (
              <div className="grid grid-cols-4 gap-3 mt-4">
                {images.map((img, idx) => (
                  <div key={img.image_id} className="relative aspect-video rounded-lg overflow-hidden border border-white/10 group bg-slate-950">
                    <img src={`data:${img.media_type};base64,${img.base64_data}`} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      onClick={() => setImages((prev) => prev.filter((_, i) => i !== idx))}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {error && <p className="text-xs text-red-400">{error}</p>}

          <div className="flex justify-end">
            <button
              onClick={handleVerify}
              disabled={verifying}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-slate-900 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 disabled:opacity-50 transition-all shadow-lg shadow-amber-500/20"
            >
              {verifying ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Đang phân tích...
                </>
              ) : (
                <>
                  <Sparkles size={16} /> Phân tích & Kiểm duyệt
                </>
              )}
            </button>
          </div>
        </div>

        {/* Info panel / Results */}
        <div className="bg-slate-900/30 border border-white/10 rounded-2xl p-6 backdrop-blur-sm shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Kết Quả Kiểm Duyệt AI</h3>
            
            {!result && !verifying && (
              <div className="py-12 text-center text-gray-500">
                <ImageIcon size={32} className="mx-auto mb-2 opacity-20" />
                <p className="text-xs">Vui lòng điền thông tin và bấm phân tích để nhận kết quả tự động từ AI Agent.</p>
              </div>
            )}

            {verifying && (
              <div className="py-12 text-center text-amber-400 space-y-3">
                <Loader2 className="w-8 h-8 animate-spin mx-auto" />
                <p className="text-xs">Gemini AI đang chấm điểm, phát hiện lỗi chính tả, đối chiếu cơ sở dữ liệu và phân tích hình ảnh...</p>
              </div>
            )}

            {result && (
              <div className="space-y-4">
                {/* Score */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-xs text-gray-400">Điểm chất lượng:</span>
                  <span className={`text-xl font-extrabold ${result.validation?.score >= 70 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {result.validation?.score || 0} / 100
                  </span>
                </div>

                {/* Status */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-xs text-gray-400">Trạng thái duyệt:</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    result.validation?.status === 'pass' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {result.validation?.status === 'pass' ? 'Published' : 'Draft'}
                  </span>
                </div>

                {/* Title suggest */}
                {result.listing?.title && (
                  <div className="space-y-1">
                    <span className="text-xs text-gray-400 font-semibold block">Tiêu đề chuẩn hóa gợi ý:</span>
                    <p className="text-xs text-gray-200 bg-slate-950 p-2.5 rounded-xl border border-white/5 leading-relaxed">{result.listing.title}</p>
                  </div>
                )}

                {/* Suggestions feedback */}
                {result.validation?.feedback_to_owner && (
                  <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs space-y-1">
                    <div className="font-bold flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Phản hồi từ AI:
                    </div>
                    <p className="text-[11px] leading-relaxed text-gray-300">{result.validation.feedback_to_owner}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {result && (
            <div className="pt-4 border-t border-white/10 mt-6 space-y-2">
              <button
                onClick={handlePublish}
                disabled={publishing}
                className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                {publishing ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Đang đăng tin...
                  </>
                ) : (
                  <>
                    <CheckCircle size={14} /> Chấp nhận & Đăng tin
                  </>
                )}
              </button>
              {error && <p className="text-xs text-red-400 text-center">{error}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
