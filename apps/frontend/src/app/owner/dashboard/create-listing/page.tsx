'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Upload, CheckCircle, AlertTriangle, Image as ImageIcon, Loader2 } from 'lucide-react';
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

  const [formData, setFormData] = useState({
    title: '',
    description: '', // raw text input
    pricePerMonth: '',
    room_number: '',
    floor: '',
    area: '',
    district: '',
    fullAddress: '',
    bedroom: '1',
    bathroom: '1',
    livingroom: '1',
    kitchen: '1',
    type: ''
  });

  const [images, setImages] = useState<UploadedImage[]>([]);
  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [publishing, setPublishing] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setError('');
    const newImages: UploadedImage[] = [];

    Array.from(files).forEach((file, index) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const base64Data = base64String.split(',')[1];
        
        newImages.push({
          image_id: `img_${Date.now()}_${index}`,
          url: '',
          media_type: file.type || 'image/jpeg',
          base64_data: base64Data
        });

        if (newImages.length === files.length) {
          setImages((prev) => [...prev, ...newImages]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleVerify = async () => {
    if (!formData.description || formData.description.length < 20) {
      setError('Vui lòng nhập mô tả thô (tối thiểu 20 ký tự).');
      return;
    }

    if (!formData.type) {
      setError('Vui lòng chọn phân loại căn hộ.');
      return;
    }

    setVerifying(true);
    setError('');
    setResult(null);

    const payload = {
      ownerId: user?.ownerProfileId || '',
      title: formData.title || 'Căn hộ mới',
      description: formData.description,
      pricePerMonth: Number(formData.pricePerMonth) || 0,
      room_number: Number(formData.room_number) || 0,
      floor: Number(formData.floor) || 0,
      area: Number(formData.area) || 0,
      district: formData.district || '',
      fullAddress: formData.fullAddress || '',
      bedroom: Number(formData.bedroom) || 1,
      bathroom: Number(formData.bathroom) || 1,
      livingroom: Number(formData.livingroom) || 1,
      kitchen: Number(formData.kitchen) || 1,
      type: formData.type || 'Normal',
      imageUrls: images.map(img => `data:${img.media_type};base64,${img.base64_data}`)
    };

    try {
      const response = await apiService.verifyListing(payload);
      if (response) {
        setResult(response);
      } else {
        setError('Không nhận được phản hồi hợp lệ từ AI Verifier.');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Lỗi kết nối với AI Agent.');
    } finally {
      setVerifying(false);
    }
  };

  const handlePublish = async () => {
    if (!result) return;
    setPublishing(true);
    setError('');

    try {
      const publishPayload = {
        title: result.standardizedTitle || formData.title,
        description: result.suggestedDescription || formData.description,
        pricePerMonth: Number(formData.pricePerMonth) || 0,
        listingStatus: 'Published',
        images: {
          create: images.map((img, idx) => ({
            imageUrl: `data:${img.media_type};base64,${img.base64_data}`,
            isPrimary: idx === 0
          }))
        },
        apartment: {
          ownerId: user?.ownerProfileId || '',
          floor: Number(formData.floor) || 1,
          area: Number(formData.area) || 50,
          district: formData.district || 'Sơn Trà',
          fullAddress: formData.fullAddress || 'Đà Nẵng',
          room_number: Number(formData.room_number) || 101,
          bedroom: Number(formData.bedroom) || 1,
          bathroom: Number(formData.bathroom) || 1,
          livingroom: Number(formData.livingroom) || 1,
          kitchen: Number(formData.kitchen) || 1,
          type: formData.type || 'Normal'
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
    <div className="p-6 text-[#2C2C2C] w-full max-w-5xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold mb-3 text-[#2C2C2C] flex items-center justify-center gap-2">
          Đăng tin thông minh với AI <Sparkles className="text-[#FF8E15] font-bold" size={24} />
        </h1>
        <p className="text-[#5A5A5A] text-sm max-w-xl mx-auto">
          Nhập các thông số cơ bản và để AI viết tiêu đề, mô tả cực thu hút cho căn hộ của bạn.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form panel */}
        <div className="lg:col-span-2 bg-white border border-[#E8E8E8] rounded-xl p-6 shadow-sm space-y-6">

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#2C2C2C] mb-2">Phân loại căn hộ:</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full bg-white border border-[#E8E8E8] rounded-xl p-3 text-[#2C2C2C] focus:outline-none focus:border-[#999999] transition-colors"
              >
                <option value="">-- Chọn --</option>
                <option value="Normal">Căn hộ thường</option>
                <option value="Studio">Studio</option>
                <option value="Officetel">Officetel</option>
                <option value="Shophouse">Shophouse</option>
                <option value="Penthouse">Penthouse</option>
                <option value="Duplex">Duplex</option>
                <option value="SkyVilla">Sky Villa</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2C2C2C] mb-2">Giá thuê (VND/tháng):</label>
              <input
                type="number"
                name="pricePerMonth"
                value={formData.pricePerMonth}
                onChange={handleChange}
                className="w-full bg-white border border-[#E8E8E8] rounded-xl p-3 text-[#2C2C2C] focus:outline-none focus:border-[#999999] transition-colors"
                placeholder="VD: 5000000"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#2C2C2C] mb-2">Diện tích (m2):</label>
              <input type="number" name="area" value={formData.area} onChange={handleChange} className="w-full bg-white border border-[#E8E8E8] rounded-xl p-3 text-[#2C2C2C] focus:outline-none focus:border-[#999999] transition-colors" placeholder="VD: 50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2C2C2C] mb-2">Số Tầng:</label>
              <input type="number" name="floor" value={formData.floor} onChange={handleChange} className="w-full bg-white border border-[#E8E8E8] rounded-xl p-3 text-[#2C2C2C] focus:outline-none focus:border-[#999999] transition-colors" placeholder="VD: 3" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2C2C2C] mb-2">Mã phòng:</label>
              <input type="number" name="room_number" value={formData.room_number} onChange={handleChange} className="w-full bg-white border border-[#E8E8E8] rounded-xl p-3 text-[#2C2C2C] focus:outline-none focus:border-[#999999] transition-colors" placeholder="VD: 301" />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#2C2C2C] mb-2">P. Ngủ:</label>
              <input type="number" name="bedroom" value={formData.bedroom} onChange={handleChange} className="w-full bg-white border border-[#E8E8E8] rounded-xl p-3 text-[#2C2C2C] focus:outline-none focus:border-[#999999] transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2C2C2C] mb-2">P. Tắm:</label>
              <input type="number" name="bathroom" value={formData.bathroom} onChange={handleChange} className="w-full bg-white border border-[#E8E8E8] rounded-xl p-3 text-[#2C2C2C] focus:outline-none focus:border-[#999999] transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2C2C2C] mb-2">P. Khách:</label>
              <input type="number" name="livingroom" value={formData.livingroom} onChange={handleChange} className="w-full bg-white border border-[#E8E8E8] rounded-xl p-3 text-[#2C2C2C] focus:outline-none focus:border-[#999999] transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2C2C2C] mb-2">P. Bếp:</label>
              <input type="number" name="kitchen" value={formData.kitchen} onChange={handleChange} className="w-full bg-white border border-[#E8E8E8] rounded-xl p-3 text-[#2C2C2C] focus:outline-none focus:border-[#999999] transition-colors" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#2C2C2C] mb-2">Quận/Huyện:</label>
              <input type="text" name="district" value={formData.district} onChange={handleChange} className="w-full bg-white border border-[#E8E8E8] rounded-xl p-3 text-[#2C2C2C] focus:outline-none focus:border-[#999999] transition-colors" placeholder="VD: Hải Châu" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2C2C2C] mb-2">Địa chỉ chi tiết:</label>
              <input type="text" name="fullAddress" value={formData.fullAddress} onChange={handleChange} className="w-full bg-white border border-[#E8E8E8] rounded-xl p-3 text-[#2C2C2C] focus:outline-none focus:border-[#999999] transition-colors" placeholder="VD: 123 Nguyễn Văn Linh..." />
            </div>
          </div>

          {/* Raw Text Input */}
          <div>
            <label className="block text-sm font-medium text-[#2C2C2C] mb-2">Mô tả bổ sung (AI sẽ dùng làm tư liệu viết bài):</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full h-24 bg-white border border-[#E8E8E8] rounded-xl p-4 text-[#2C2C2C] placeholder-gray-400 focus:outline-none focus:border-[#999999] transition-colors resize-none text-sm"
              placeholder="VD: Căn hộ nằm gần siêu thị Lotte, nội thất cơ bản nhập khẩu, có ban công hướng Đông Nam mát mẻ..."
            ></textarea>
          </div>

          {/* Image Uploader */}
          <div>
            <label className="block text-sm font-medium text-[#2C2C2C] mb-2">Đính kèm hình ảnh thực tế:</label>
            <div className="border border-dashed border-[#E8E8E8] rounded-xl p-6 text-center hover:bg-[#F9F9F9] transition-colors relative cursor-pointer group">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <Upload size={32} className="mx-auto mb-2 text-[#777777] group-hover:text-[#E03C3D] transition-colors" />
              <p className="text-xs text-[#5A5A5A]">Kéo thả tệp vào đây hoặc nhấn để chọn tệp ảnh</p>
            </div>

            {/* Image Preview List */}
            {images.length > 0 && (
              <div className="grid grid-cols-4 gap-3 mt-4">
                {images.map((img, idx) => (
                  <div key={img.image_id} className="relative aspect-video rounded-lg overflow-hidden border border-[#E8E8E8] group bg-[#F2F2F2]">
                    <img src={`data:${img.media_type};base64,${img.base64_data}`} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      onClick={() => setImages((prev) => prev.filter((_, i) => i !== idx))}
                      className="absolute top-1 right-1 bg-[#E03C3D] text-white rounded-full p-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {error && <p className="text-xs text-[#E03C3D]">{error}</p>}

          <div className="flex justify-end">
            <button
              onClick={handleVerify}
              disabled={verifying}
              className="flex items-center gap-2 px-6 py-3 rounded-[8px] font-bold text-white bg-[#E03C3D] hover:bg-[#C92F30] disabled:opacity-50 transition-all border-0 shadow-sm"
            >
              {verifying ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  AI Đang phân tích...
                </>
              ) : (
                <>
                  <Sparkles size={16} /> Phân tích & Kiểm duyệt AI
                </>
              )}
            </button>
          </div>
        </div>

        {/* Info panel / Results */}
        <div className="bg-[#F9F9F9] border border-[#E8E8E8] rounded-xl p-6 shadow-sm flex flex-col justify-between text-[#5A5A5A]">
          <div>
            <h3 className="text-lg font-bold text-[#2C2C2C] mb-4">Kết Quả Kiểm Duyệt AI</h3>
            
            {!result && !verifying && (
              <div className="py-12 text-center text-[#777777]">
                <ImageIcon size={32} className="mx-auto mb-2 opacity-30" />
                <p className="text-xs">Vui lòng điền thông tin và bấm phân tích để AI viết nội dung hoàn chỉnh cho bạn.</p>
              </div>
            )}

            {verifying && (
              <div className="py-12 text-center text-[#FF8E15] space-y-3">
                <Loader2 className="w-8 h-8 animate-spin mx-auto" />
                <p className="text-xs text-[#5A5A5A]">Gemini AI đang chấm điểm, phát hiện lỗi chính tả, đối chiếu cơ sở dữ liệu và viết bài mô tả hấp dẫn...</p>
              </div>
            )}

            {result && (
              <div className="space-y-4">
                {/* Score */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#E8E8E8]">
                  <span className="text-xs text-[#5A5A5A]">Điểm chất lượng:</span>
                  <span className={`text-xl font-extrabold ${result.score >= 70 ? 'text-green-600' : 'text-[#FF8E15]'}`}>
                    {result.score || 0} / 100
                  </span>
                </div>

                {/* Status */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#E8E8E8]">
                  <span className="text-xs text-[#5A5A5A]">Trạng thái duyệt:</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    result.verified ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {result.verified ? 'Sẵn sàng đăng' : 'Cần sửa đổi'}
                  </span>
                </div>

                {/* Title suggest */}
                {result.standardizedTitle && (
                  <div className="space-y-1">
                    <span className="text-xs text-[#5A5A5A] font-semibold block">Tiêu đề chuẩn SEO:</span>
                    <p className="text-sm font-bold text-[#E03C3D] leading-relaxed">{result.standardizedTitle}</p>
                  </div>
                )}

                {/* Description suggest */}
                {result.suggestedDescription && (
                  <div className="space-y-1">
                    <span className="text-xs text-[#5A5A5A] font-semibold block">Bài viết mô tả do AI tạo:</span>
                    <p className="text-xs text-[#2C2C2C] bg-white p-3 rounded-xl border border-[#E8E8E8] leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap">{result.suggestedDescription}</p>
                  </div>
                )}

                {/* Suggestions feedback */}
                {result.insights && result.insights.length > 0 && (
                  <div className="p-3.5 rounded-xl bg-green-50 border border-green-100 text-green-800 text-xs space-y-2">
                    <div className="font-bold flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-green-600" />
                      Nhận xét từ AI:
                    </div>
                    <ul className="list-disc list-inside space-y-1">
                      {result.insights.map((insight: string, idx: number) => (
                        <li key={idx} className="text-[11px] leading-relaxed text-[#5A5A5A]">{insight}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {result && (
            <div className="pt-4 border-t border-[#E8E8E8] mt-6 space-y-2">
              <button
                onClick={handlePublish}
                disabled={publishing}
                className="w-full py-3 rounded-[8px] bg-[#E03C3D] hover:bg-[#C92F30] disabled:opacity-50 text-white font-bold text-sm transition-colors border-0 flex items-center justify-center gap-2 shadow-sm"
              >
                {publishing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Đang lưu dữ liệu...
                  </>
                ) : (
                  <>
                    <CheckCircle size={16} /> Lưu Căn Hộ & Đăng Tin
                  </>
                )}
              </button>
              {error && <p className="text-xs text-[#E03C3D] text-center mt-2">{error}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
