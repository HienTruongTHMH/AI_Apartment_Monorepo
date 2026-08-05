'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Upload, CheckCircle, AlertTriangle, Image as ImageIcon, Loader2, Trash2, HelpCircle, Send, FileText, Check } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { apiService } from '@/lib/api';
import { toast } from 'sonner';

interface UploadedImage {
  image_id: string;
  url: string;
  media_type: string;
  base64_data: string;
}

export default function CreateListingPage() {
  const { user } = useAuthStore();
  const router = useRouter();

  // Tab State: 'ai' for Automatic AI Flow, 'manual' for Manual Form Entry
  const [activeTab, setActiveTab] = useState<'ai' | 'manual'>('ai');

  // Raw text input for Automatic AI Flow
  const [rawText, setRawText] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
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
    type: 'Normal'
  });

  const [images, setImages] = useState<UploadedImage[]>([]);
  const [verifying, setVerifying] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
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

  // 1) Automatic AI Flow: Analyze raw text and autofill form
  const handleAutoFill = async () => {
    if (!rawText || rawText.length < 20) {
      setError('Vui lòng nhập mô tả thô (tối thiểu 20 ký tự).');
      return;
    }

    setVerifying(true);
    setError('');
    setResult(null);

    const payload = {
      ownerId: user?.ownerProfileId || '',
      title: 'Tin đăng tự động',
      description: rawText,
      pricePerMonth: 0,
      room_number: 0,
      floor: 0,
      area: 0,
      district: '',
      fullAddress: '',
      bedroom: 1,
      bathroom: 1,
      livingroom: 1,
      kitchen: 1,
      type: 'Normal',
      imageUrls: images.map(img => `data:${img.media_type};base64,${img.base64_data}`)
    };

    try {
      const response = await apiService.verifyListing(payload);
      if (response) {
        setResult(response);
        
        // Extract meta fields and autofill standard form
        const meta = response.apartmentMeta || {};
        setFormData({
          title: response.standardizedTitle || '',
          description: response.suggestedDescription || rawText,
          pricePerMonth: response.pricePerMonth ? String(response.pricePerMonth) : '',
          room_number: meta.roomNumber ? String(meta.roomNumber) : '',
          floor: meta.floor ? String(meta.floor) : '',
          area: meta.area_m2 ? String(meta.area_m2) : '',
          district: meta.district || '',
          fullAddress: meta.fullAddress || '',
          bedroom: meta.bedroom ? String(meta.bedroom) : '1',
          bathroom: meta.bathroom ? String(meta.bathroom) : '1',
          livingroom: meta.livingroom ? String(meta.livingroom) : '1',
          kitchen: meta.kitchen ? String(meta.kitchen) : '1',
          type: meta.type || 'Normal'
        });

        // Switch to manual tab so owner can inspect and edit the results
        setActiveTab('manual');
      } else {
        setError('Không nhận được phản hồi từ mô hình AI.');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Lỗi kết nối với AI Agent.');
    } finally {
      setVerifying(false);
    }
  };

  // Optional AI Helper: Optimize Title & Description in Manual Flow
  const handleAIOptimize = async () => {
    if (!formData.description || formData.description.length < 20) {
      setError('Vui lòng nhập mô tả chi tiết để AI có cơ sở tối ưu (tối thiểu 20 ký tự).');
      return;
    }

    setOptimizing(true);
    setError('');

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
        setFormData(prev => ({
          ...prev,
          title: response.standardizedTitle || prev.title,
          description: response.suggestedDescription || prev.description
        }));
      } else {
        setError('Không thể tối ưu hóa thông tin bằng AI.');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Lỗi kết nối với AI Agent.');
    } finally {
      setOptimizing(false);
    }
  };

  // Verify Listing via AI Verifier Flow
  const handleVerify = async () => {
    if (!formData.title) {
      setError('Vui lòng nhập tiêu đề căn hộ.');
      return;
    }
    if (!formData.description || formData.description.length < 20) {
      setError('Vui lòng nhập mô tả chi tiết (tối thiểu 20 ký tự).');
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
      title: formData.title,
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
        setError('Không nhận được phản hồi từ AI Verifier.');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Lỗi kết nối với AI Agent.');
    } finally {
      setVerifying(false);
    }
  };

  // Publish Listing (Used for AI-Approved flow)
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
      toast.success('Đăng tin thành công!');
      router.push('/owner/dashboard');
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi lưu tin đăng.');
    } finally {
      setPublishing(false);
    }
  };

  // 2) Manual Entry Flow: Publish directly without requiring AI Verification
  const handleManualPublish = async () => {
    if (!formData.title) {
      setError('Vui lòng điền tiêu đề căn hộ.');
      return;
    }
    if (!formData.pricePerMonth) {
      setError('Vui lòng nhập giá thuê.');
      return;
    }
    if (!formData.area) {
      setError('Vui lòng nhập diện tích căn hộ.');
      return;
    }
    if (!formData.type) {
      setError('Vui lòng chọn loại căn hộ.');
      return;
    }

    setPublishing(true);
    setError('');

    try {
      const publishPayload = {
        title: formData.title,
        description: formData.description || 'Căn hộ tiện nghi cho thuê đầy đủ nội thất.',
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
      toast.success('Đăng tin trực tiếp thành công!');
      router.push('/owner/dashboard');
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi đăng tin trực tiếp.');
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#F9FAFB] py-10 px-4 sm:px-6 font-sans text-gray-900">
      {/* Header Block */}
      <div className="max-w-6xl mx-auto text-center space-y-3 mb-10">
        {/* <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#FFF1E6] text-[#FF8E15]">
          <Sparkles size={12} /> Powered by Gemini 3.5 AI
        </div> */}
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-gray-950">
          Đăng Tin Căn Hộ Thông Minh
        </h1>
        <p className="text-gray-500 text-sm max-w-xl mx-auto">
          Chọn đăng nhanh bằng trợ lý ảo hoặc tự nhập biểu mẫu thủ công để đưa căn hộ của bạn tiếp cận khách thuê lập tức.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Creation Panel */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Tab Selector */}
          <div className="flex bg-white p-1.5 rounded-2xl border border-gray-200/80 shadow-xs">
            <button
              onClick={() => {
                setActiveTab('ai');
                setError('');
              }}
              className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                activeTab === 'ai'
                  ? 'bg-gray-950 text-white shadow-xs'
                  : 'bg-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              <Sparkles size={16} className={activeTab === 'ai' ? 'text-[#FF8E15]' : ''} />
              <span>Trợ Lý Ảo</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('manual');
                setError('');
              }}
              className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                activeTab === 'manual'
                  ? 'bg-gray-950 text-white shadow-xs'
                  : 'bg-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              <FileText size={16} />
              <span>Nhập Thủ Công</span>
            </button>
          </div>

          {/* Form and Input Section */}
          <div className="bg-white border border-gray-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            {activeTab === 'ai' ? (
              // AUTOMATIC AI FLOW VIEW
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
                    Mô tả thô của căn hộ (AI sẽ phân tích & trích xuất toàn bộ):
                  </label>
                  <textarea
                    value={rawText}
                    onChange={(e) => setRawText(e.target.value)}
                    className="w-full h-40 bg-gray-50 border border-gray-200 focus:bg-white focus:border-gray-950 focus:ring-2 focus:ring-gray-950/10 rounded-2xl p-4 text-sm text-gray-950 placeholder-gray-400 outline-none transition-all resize-none"
                    placeholder="VD: Căn hộ studio 35m2 ở Tầng 5 phòng 502 quận Sơn Trà cần cho thuê. Giá thuê 6 triệu một tháng. Bố trí gồm 1 phòng ngủ, 1 vệ sinh, phòng bếp riêng. Có sẵn tủ lạnh, máy lạnh, máy giặt, sofa chất lượng cao, ban công thoáng..."
                  />
                </div>

                {/* File Uploader */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600">
                    Đính kèm hình ảnh thực tế (Giúp AI hiểu rõ không gian căn hộ):
                  </label>
                  <div className="border border-dashed border-gray-200 hover:border-gray-900 rounded-2xl p-6 text-center hover:bg-gray-50/50 transition-all relative cursor-pointer group">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <Upload size={32} className="mx-auto mb-2 text-gray-400 group-hover:text-gray-800 transition-colors" />
                    <p className="text-xs text-gray-500">Kéo thả tệp hoặc click vào đây để tải lên hình ảnh</p>
                  </div>

                  {images.length > 0 && (
                    <div className="grid grid-cols-4 gap-3 mt-4">
                      {images.map((img, idx) => (
                        <div key={img.image_id} className="relative aspect-video rounded-xl overflow-hidden border border-gray-200/80 group bg-gray-50">
                          <img src={`data:${img.media_type};base64,${img.base64_data}`} alt="Preview" className="w-full h-full object-cover" />
                          <button
                            onClick={() => setImages((prev) => prev.filter((_, i) => i !== idx))}
                            className="absolute top-1.5 right-1.5 bg-rose-600 text-white rounded-full p-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:scale-105 cursor-pointer shadow-xs border-0"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {error && <p className="text-xs font-semibold text-rose-600">{error}</p>}

                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleAutoFill}
                    disabled={verifying}
                    className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-white bg-gray-950 hover:bg-gray-900 active:scale-98 disabled:opacity-50 transition-all border-0 shadow-sm cursor-pointer"
                  >
                    {verifying ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-[#FF8E15]" />
                        <span>AI Đang phân tích dữ liệu...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={16} className="text-[#FF8E15]" />
                        <span>Phân tích & Tự động điền</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              // MANUAL FORM ENTRY VIEW
              <div className="space-y-6">
                
                {/* Custom AI optimization quick tip */}
                <div className="bg-[#F8F9FA] border border-gray-200/50 rounded-2xl p-4 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-gray-800 flex items-center gap-1">
                      <Sparkles size={13} className="text-[#FF8E15]" />
                      Trợ lý Tối ưu hóa Tiêu đề & Mô tả
                    </h4>
                    <p className="text-[11px] text-gray-500">
                      Tự động chuyển đổi thông tin thô của bạn thành tiêu đề chuẩn SEO và mô tả chuyên nghiệp.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAIOptimize}
                    disabled={optimizing}
                    className="px-3.5 py-2 text-xs font-bold text-gray-800 bg-white border border-gray-200 hover:border-gray-800 rounded-lg active:scale-95 transition-all cursor-pointer flex items-center gap-1 shadow-xs shrink-0"
                  >
                    {optimizing ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Đang tối ưu...
                      </>
                    ) : (
                      <>
                        <Sparkles size={13} className="text-[#FF8E15]" />
                        Tối ưu tiêu đề/mô tả
                      </>
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">Tiêu đề căn hộ:</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-gray-950 focus:ring-2 focus:ring-gray-950/10 rounded-xl p-3 text-sm text-gray-950 placeholder-gray-400 outline-none transition-all"
                      placeholder="VD: Căn hộ studio full nội thất trung tâm Sơn Trà"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">Phân loại căn hộ:</label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-gray-950 focus:ring-2 focus:ring-gray-950/10 rounded-xl p-3 text-sm text-gray-950 outline-none transition-all cursor-pointer"
                    >
                      <option value="Normal">Căn hộ thường (Normal)</option>
                      <option value="Studio">Studio</option>
                      <option value="Officetel">Officetel</option>
                      <option value="Shophouse">Shophouse</option>
                      <option value="Penthouse">Penthouse</option>
                      <option value="Duplex">Duplex</option>
                      <option value="SkyVilla">Sky Villa</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">Giá thuê (VND/tháng):</label>
                    <input
                      type="number"
                      name="pricePerMonth"
                      value={formData.pricePerMonth}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-gray-950 focus:ring-2 focus:ring-gray-950/10 rounded-xl p-3 text-sm text-gray-950 outline-none transition-all"
                      placeholder="VD: 6000000"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">Diện tích (m2):</label>
                    <input
                      type="number"
                      name="area"
                      value={formData.area}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-gray-950 focus:ring-2 focus:ring-gray-950/10 rounded-xl p-3 text-sm text-gray-950 outline-none transition-all"
                      placeholder="VD: 45"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">Mã phòng:</label>
                    <input
                      type="text"
                      name="room_number"
                      value={formData.room_number}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-gray-950 focus:ring-2 focus:ring-gray-950/10 rounded-xl p-3 text-sm text-gray-950 outline-none transition-all"
                      placeholder="VD: 502"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">Số Tầng:</label>
                    <input
                      type="number"
                      name="floor"
                      value={formData.floor}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-gray-950 focus:ring-2 focus:ring-gray-950/10 rounded-xl p-3 text-sm text-gray-950 outline-none transition-all"
                      placeholder="VD: 5"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">P. Ngủ:</label>
                    <input type="number" name="bedroom" value={formData.bedroom} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-gray-950 focus:ring-2 focus:ring-gray-950/10 rounded-xl p-3 text-sm text-gray-950 outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">P. Tắm:</label>
                    <input type="number" name="bathroom" value={formData.bathroom} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-gray-950 focus:ring-2 focus:ring-gray-950/10 rounded-xl p-3 text-sm text-gray-950 outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">P. Khách:</label>
                    <input type="number" name="livingroom" value={formData.livingroom} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-gray-950 focus:ring-2 focus:ring-gray-950/10 rounded-xl p-3 text-sm text-gray-950 outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">P. Bếp:</label>
                    <input type="number" name="kitchen" value={formData.kitchen} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-gray-950 focus:ring-2 focus:ring-gray-950/10 rounded-xl p-3 text-sm text-gray-950 outline-none transition-all" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">Quận/Huyện:</label>
                    <input
                      type="text"
                      name="district"
                      value={formData.district}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-gray-950 focus:ring-2 focus:ring-gray-950/10 rounded-xl p-3 text-sm text-gray-950 outline-none transition-all"
                      placeholder="VD: Sơn Trà"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">Địa chỉ chi tiết:</label>
                    <input
                      type="text"
                      name="fullAddress"
                      value={formData.fullAddress}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-gray-950 focus:ring-2 focus:ring-gray-950/10 rounded-xl p-3 text-sm text-gray-950 outline-none transition-all"
                      placeholder="VD: 54 Lê Thước, Phước Mỹ..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">Nội dung bài viết mô tả:</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full h-32 bg-gray-50 border border-gray-200 focus:bg-white focus:border-gray-950 focus:ring-2 focus:ring-gray-950/10 rounded-xl p-4 text-sm text-gray-950 placeholder-gray-400 outline-none transition-all resize-none"
                    placeholder="VD: Cho thuê căn hộ studio đầy đủ tiện nghi nhập khẩu, ban công hướng mát mẻ, gần biển Mỹ Khê..."
                  />
                </div>

                {/* Upload Image Section */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600">Ảnh thực tế căn hộ:</label>
                  <div className="border border-dashed border-gray-200 hover:border-gray-900 rounded-2xl p-6 text-center hover:bg-gray-50/50 transition-all relative cursor-pointer group">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <Upload size={32} className="mx-auto mb-2 text-gray-400 group-hover:text-gray-800 transition-colors" />
                    <p className="text-xs text-gray-500">Tải lên thêm hình ảnh thực tế</p>
                  </div>

                  {images.length > 0 && (
                    <div className="grid grid-cols-4 gap-3 mt-4">
                      {images.map((img, idx) => (
                        <div key={img.image_id} className="relative aspect-video rounded-xl overflow-hidden border border-gray-200/80 group bg-gray-50">
                          <img src={`data:${img.media_type};base64,${img.base64_data}`} alt="Preview" className="w-full h-full object-cover" />
                          <button
                            onClick={() => setImages((prev) => prev.filter((_, i) => i !== idx))}
                            className="absolute top-1.5 right-1.5 bg-rose-600 text-white rounded-full p-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:scale-105 cursor-pointer shadow-xs border-0"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {error && <p className="text-xs font-semibold text-rose-600">{error}</p>}

                {/* Action Row for Manual Flow */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    onClick={handleVerify}
                    disabled={verifying || publishing}
                    className="px-5 py-3 rounded-xl text-xs sm:text-sm font-bold text-gray-800 bg-white border border-gray-300 hover:border-gray-800 active:scale-98 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {verifying ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-[#FF8E15]" />
                        <span>AI Đang kiểm duyệt...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={15} className="text-[#FF8E15]" />
                        <span>Kiểm Duyệt & Tạo Tin Bằng AI</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleManualPublish}
                    disabled={publishing || verifying}
                    className="px-6 py-3.5 rounded-xl font-bold text-white bg-gray-950 hover:bg-gray-900 active:scale-98 disabled:opacity-50 transition-all border-0 shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {publishing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Đang lưu tin đăng...</span>
                      </>
                    ) : (
                      <>
                        <Send size={15} />
                        <span>Đăng Tin</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* AI Results / Quality Grading Panel */}
        <div className="bg-[#FFFFFF] border border-gray-200/80 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between text-gray-500 h-fit">
          <div className="space-y-6">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-1.5 pb-3 border-b border-gray-100">
              <Sparkles size={18} className="text-[#FF8E15]" />
              Kết Quả Đánh Giá Từ AI
            </h3>
            
            {!result && !verifying && (
              <div className="py-16 text-center space-y-3">
                <ImageIcon size={40} className="mx-auto text-gray-300 animate-pulse" strokeWidth={1.5} />
                <p className="text-xs text-gray-400 leading-relaxed max-w-[200px] mx-auto">
                  Hãy nhập thông tin hoặc thô sơ mô tả căn hộ để AI tiến hành chấm điểm và tối ưu nội dung.
                </p>
              </div>
            )}

            {verifying && (
              <div className="py-16 text-center space-y-4">
                <Loader2 className="w-10 h-10 animate-spin text-gray-950 mx-auto" />
                <p className="text-xs text-gray-500 leading-relaxed max-w-[200px] mx-auto">
                  Gemini AI đang trích xuất thông số, đối chiếu dữ liệu và tạo tiêu đề chuẩn SEO...
                </p>
              </div>
            )}

            {result && (
              <div className="space-y-5">
                {/* Circular Style Score display */}
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <div className="relative flex items-center justify-center shrink-0 w-16 h-16 rounded-full bg-white border-2 border-gray-950 shadow-xs">
                    <span className="text-lg font-black text-gray-900">{result.score || 0}</span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Điểm chất lượng tin</span>
                    <h4 className="text-xs font-bold text-gray-800">
                      {result.score >= 70 ? '✨ Đạt tiêu chuẩn phân loại' : '⚠️ Cần cập nhật thêm'}
                    </h4>
                  </div>
                </div>

                {/* Status indicator */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-gray-50 border border-gray-100 text-xs">
                  <span className="font-semibold text-gray-600">Trạng thái duyệt:</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    result.verified ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {result.verified ? 'Sẵn sàng đăng' : 'Cần chỉnh sửa'}
                  </span>
                </div>

                {/* AI generated SEO Title */}
                {result.standardizedTitle && (
                  <div className="space-y-1 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Tiêu đề chuẩn SEO:</span>
                    <p className="text-xs sm:text-sm font-bold text-gray-900 leading-snug">{result.standardizedTitle}</p>
                  </div>
                )}

                {/* AI generated Description */}
                {result.suggestedDescription && (
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Mô tả chuẩn hoá bởi AI:</span>
                    <p className="text-xs text-gray-700 bg-gray-50 p-4 rounded-2xl border border-gray-100 leading-relaxed max-h-56 overflow-y-auto whitespace-pre-wrap">
                      {result.suggestedDescription}
                    </p>
                  </div>
                )}

                {/* AI Insights & Feedback */}
                {result.insights && result.insights.length > 0 && (
                  <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100 text-xs space-y-2.5">
                    <div className="font-bold flex items-center gap-1.5 text-amber-800">
                      <AlertTriangle size={14} className="text-amber-600 shrink-0" />
                      Góp ý kiểm duyệt từ AI:
                    </div>
                    <ul className="list-disc list-inside space-y-1.5 text-[11px] text-gray-600">
                      {result.insights.map((insight: string, idx: number) => (
                        <li key={idx} className="leading-relaxed">{insight}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {result && (
            <div className="pt-6 border-t border-gray-100 mt-8 space-y-2">
              <button
                onClick={handlePublish}
                disabled={publishing}
                className="w-full py-3.5 rounded-xl bg-gray-950 hover:bg-gray-900 active:scale-98 disabled:opacity-50 text-white font-bold text-sm transition-all border-0 flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
              >
                {publishing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#FF8E15]" />
                    <span>Đang lưu tin đăng...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle size={16} className="text-[#FF8E15]" />
                    <span>Lưu Dữ Liệu & Đăng Tin (Dùng AI)</span>
                  </>
                )}
              </button>
              {error && <p className="text-xs text-rose-600 font-semibold text-center mt-2">{error}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
