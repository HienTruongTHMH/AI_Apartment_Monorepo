'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Upload, CheckCircle, AlertTriangle, Image as ImageIcon, Loader2, ArrowLeft, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import { apiService, ListingItem } from '@/lib/api';

export default function EditListingPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { user } = useAuthStore();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    pricePerMonth: '',
    type: '',
    floor: '',
    area: '',
    bedroom: '',
    bathroom: '',
    livingroom: '',
    kitchen: '',
    room_number: '',
    fullAddress: '',
  });

  // To keep track of old images that user decides to keep
  const [keptImageUrls, setKeptImageUrls] = useState<string[]>([]);
  // Files to upload
  const [newFiles, setNewFiles] = useState<{ file: File, previewUrl: string }[]>([]);

  useEffect(() => {
    apiService.getListingById(resolvedParams.id).then((data) => {
      if (data) {
        setFormData({
          title: data.title || '',
          description: data.description || '',
          pricePerMonth: data.pricePerMonth?.toString() || '',
          type: data.apartment?.type || '',
          floor: data.apartment?.floor?.toString() || '',
          area: data.apartment?.area?.toString() || '',
          bedroom: data.apartment?.bedroom?.toString() || '',
          bathroom: data.apartment?.bathroom?.toString() || '',
          livingroom: data.apartment?.livingroom?.toString() || '',
          kitchen: data.apartment?.kitchen?.toString() || '',
          room_number: data.apartment?.room_number?.toString() || '',
          fullAddress: data.apartment?.fullAddress || '',
        });
        
        if (data.images && data.images.length > 0) {
          setKeptImageUrls(data.images.map((img: any) => img.imageUrl));
        }
      }
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setError('Lỗi khi tải thông tin căn hộ');
      setLoading(false);
    });
  }, [resolvedParams.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const addedFiles = Array.from(files).map(file => ({
      file,
      previewUrl: URL.createObjectURL(file)
    }));
    
    setNewFiles(prev => [...prev, ...addedFiles]);
  };

  const removeKeptImage = (index: number) => {
    setKeptImageUrls(prev => prev.filter((_, i) => i !== index));
  };

  const removeNewFile = (index: number) => {
    setNewFiles(prev => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].previewUrl);
      updated.splice(index, 1);
      return updated;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      // 1. Upload new files to Supabase
      const uploadedUrls: string[] = [];
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xzwpyzamhyevocaqmyhn.supabase.co';
      
      for (const item of newFiles) {
        // Get presigned URL
        const ext = item.file.name.split('.').pop();
        const safeName = `img_${Date.now()}.${ext}`;
        const presigned = await apiService.getPresignedUrl(safeName);
        
        // Upload
        const publicUrl = await apiService.uploadToSupabase(item.file, presigned.path, presigned.token, supabaseUrl);
        uploadedUrls.push(publicUrl);
      }

      // Combine old kept URLs with newly uploaded URLs
      const finalImageUrls = [...keptImageUrls, ...uploadedUrls];

      // 2. Prepare Payload
      const updatePayload = {
        title: formData.title,
        description: formData.description,
        pricePerMonth: Number(formData.pricePerMonth),
        imageUrls: finalImageUrls.length > 0 ? finalImageUrls : undefined,
        apartment: {
          type: formData.type,
          floor: Number(formData.floor),
          area: Number(formData.area),
          bedroom: Number(formData.bedroom),
          bathroom: Number(formData.bathroom),
          livingroom: Number(formData.livingroom),
          kitchen: Number(formData.kitchen),
          room_number: Number(formData.room_number),
          fullAddress: formData.fullAddress,
        }
      };

      // 3. Call API
      await apiService.updateListing(resolvedParams.id, updatePayload);
      setSuccess('Cập nhật tin đăng thành công!');
      
      // Cleanup new files state
      setKeptImageUrls(finalImageUrls);
      setNewFiles([]);
      
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Có lỗi xảy ra khi lưu thay đổi');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/owner/dashboard/apartments" className="p-2 rounded-xl bg-slate-900 border border-white/10 text-gray-400 hover:text-white hover:bg-slate-800 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-black text-white">Chỉnh Sửa Căn Hộ</h1>
          <p className="text-gray-400 text-sm mt-1">Cập nhật thông tin chi tiết và hình ảnh thực tế</p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-3">
          <CheckCircle className="w-5 h-5" />
          <p className="text-sm font-semibold">{success}</p>
        </div>
      )}

      <div className="p-8 rounded-3xl bg-slate-900/80 border border-white/10 glass-panel space-y-8">
        
        {/* Basic Info */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white border-b border-white/10 pb-2">Thông Tin Chung</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1">
              <label className="text-xs text-gray-400 font-bold uppercase">Tiêu đề bài đăng</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-amber-500 outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-400 font-bold uppercase">Giá Thuê (VND/Tháng)</label>
              <input type="number" name="pricePerMonth" value={formData.pricePerMonth} onChange={handleChange} className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-amber-500 outline-none" />
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="text-xs text-gray-400 font-bold uppercase">Địa chỉ chi tiết</label>
              <input type="text" name="fullAddress" value={formData.fullAddress} onChange={handleChange} className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-amber-500 outline-none" />
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="text-xs text-gray-400 font-bold uppercase">Mô tả chi tiết</label>
              <textarea name="description" rows={5} value={formData.description} onChange={handleChange} className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-amber-500 outline-none" />
            </div>
          </div>
        </div>

        {/* Physical Specs */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white border-b border-white/10 pb-2">Thông Số Kỹ Thuật</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            <div className="space-y-1">
              <label className="text-xs text-gray-400 font-bold uppercase">Loại Căn</label>
              <select name="type" value={formData.type} onChange={handleChange} className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-amber-500 outline-none">
                <option value="Normal">Normal</option>
                <option value="Studio">Studio</option>
                <option value="Officetel">Officetel</option>
                <option value="Penthouse">Penthouse</option>
                <option value="Duplex">Duplex</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-400 font-bold uppercase">Diện Tích (m2)</label>
              <input type="number" name="area" value={formData.area} onChange={handleChange} className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-400 font-bold uppercase">Số Phòng</label>
              <input type="number" name="room_number" value={formData.room_number} onChange={handleChange} className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-400 font-bold uppercase">Tầng</label>
              <input type="number" name="floor" value={formData.floor} onChange={handleChange} className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-400 font-bold uppercase">Phòng Ngủ</label>
              <input type="number" name="bedroom" value={formData.bedroom} onChange={handleChange} className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-400 font-bold uppercase">Phòng Tắm</label>
              <input type="number" name="bathroom" value={formData.bathroom} onChange={handleChange} className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-400 font-bold uppercase">Phòng Khách</label>
              <input type="number" name="livingroom" value={formData.livingroom} onChange={handleChange} className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-400 font-bold uppercase">Bếp</label>
              <input type="number" name="kitchen" value={formData.kitchen} onChange={handleChange} className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white outline-none" />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <h2 className="text-xl font-bold text-white flex items-center gap-2"><ImageIcon className="w-5 h-5 text-amber-500" /> Quản Lý Hình Ảnh</h2>
            
            <label className="cursor-pointer bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-lg text-sm font-bold border border-emerald-500/30 hover:bg-emerald-500/20 transition-all flex items-center gap-2">
              <Upload className="w-4 h-4" /> Tải Ảnh Mới
              <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
            </label>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {keptImageUrls.map((url, idx) => (
              <div key={`kept-${idx}`} className="relative aspect-video rounded-xl overflow-hidden border border-white/10 group">
                <img src={url} alt="Kept Image" className="w-full h-full object-cover" />
                <button onClick={() => removeKeptImage(idx)} className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-500">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}

            {newFiles.map((item, idx) => (
              <div key={`new-${idx}`} className="relative aspect-video rounded-xl overflow-hidden border-2 border-dashed border-emerald-500/50 group">
                <img src={item.previewUrl} alt="New Image" className="w-full h-full object-cover opacity-80" />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <span className="text-[10px] bg-emerald-500 text-white px-2 py-1 rounded-full font-bold">Mới</span>
                </div>
                <button onClick={() => removeNewFile(idx)} className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-500">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}

            {keptImageUrls.length === 0 && newFiles.length === 0 && (
              <div className="col-span-full py-8 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-gray-500 space-y-2">
                <ImageIcon className="w-8 h-8 opacity-30" />
                <p className="text-sm">Chưa có hình ảnh nào</p>
              </div>
            )}
          </div>
        </div>

        {/* Action */}
        <div className="pt-6 border-t border-white/10">
          <button 
            onClick={handleSave}
            disabled={saving}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-lg shadow-xl shadow-amber-500/20 hover:scale-[1.01] transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
            {saving ? 'Đang Lưu...' : 'Lưu Thay Đổi'}
          </button>
        </div>

      </div>
    </div>
  );
}
