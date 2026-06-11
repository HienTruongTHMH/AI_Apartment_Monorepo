import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "motion/react";
import {
  CheckCircle2, ChevronLeft,
  Sparkles, RefreshCw, Bot,
  Camera, UploadCloud, X
} from "lucide-react";
import { verifyListing, buildRawText, checkAgentHealth } from "@features/ai-service/listingVerifier";
import { VerificationPanel, type ExtractedData } from "@features/landlord/components/VerificationPanel";
import { ImageUploadStep, type ImageItem } from "@features/landlord/components/ImageUploadStep";
import { createClient } from "@supabase/supabase-js"
import { api } from "@/lib/api";

type ValidationError = { field: string; type: string; message: string; suggestion?: string };

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

export default function ListingTab() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    room_number: "",
    pricePerMonth: "",
    type: "Normal", // Thuộc enum ApartmentTypes
    floor: "",
    area: "",
    district: "",
    fullAddress: "",
    bedroom: 1,
    bathroom: 1,
    livingroom: 1,
    kitchen: 1,
  });
  const [images, setImages] = useState<ImageItem[]>([]);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationDone, setVerificationDone] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [agentOnline, setAgentOnline] = useState<boolean | null>(null);

  const [uploadedImages, setUploadedImages] = useState<{ id: string, url: string, isPrimary: boolean }[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    checkAgentHealth().then(setAgentOnline);
  }, []);

  const runSimulation = useCallback((fd: typeof formData) => {
    const mockErrors: ValidationError[] = [];
    if (fd.title.length < 15) mockErrors.push({ field: "title", type: "warning", message: "Tiêu đề quá ngắn — AI gợi ý thêm chi tiết", suggestion: `${fd.title || "Căn hộ"} 2PN full nội thất, view đẹp, Quận 7` });
    if (fd.pricePerMonth && parseInt(fd.pricePerMonth) < 5000) mockErrors.push({ field: "pricePerMonth", type: "error", message: "Giá có vẻ quá thấp so với thị trường khu vực này" });
    if (fd.description.length < 50) mockErrors.push({ field: "description", type: "warning", message: "Mô tả quá ngắn — cần ít nhất 50 từ để tối ưu tìm kiếm", suggestion: "Căn hộ 2 phòng ngủ, 2 vệ sinh, đầy đủ nội thất cao cấp. Tầng cao view thoáng. Có hồ bơi, gym, bảo vệ 24/7..." });
    const genTitle = fd.title.length >= 15 ? fd.title : `Cho thuê ${fd.room_number || "2"}PN ${fd.area ? fd.area + "m² " : ""}– ${fd.fullAddress?.split(",").slice(-2).join(",").trim() || "TP.HCM"} – Full nội thất cao cấp`;
    const genDesc = fd.description.length >= 80 ? fd.description : `Căn hộ ${fd.room_number || "2"} phòng ngủ, diện tích ${fd.area || "65"}m², đầy đủ nội thất cao cấp. Tọa lạc tại ${fd.fullAddress || "trung tâm TP.HCM"}, thuận tiện di chuyển, gần tiện ích. Hợp đồng linh hoạt 12–24 tháng.`;
    let score = 45;
    if (fd.title.length >= 15) score += 15;
    if (fd.description.length >= 80) score += 20;
    if (fd.pricePerMonth) score += 8;
    if (fd.area) score += 7;
    if (mockErrors.length === 0) score += 5;
    setExtractedData({
      entities: [
        { label: "Loại BĐS", value: "Căn hộ chung cư", confidence: 98 },
        { label: "Số phòng ngủ", value: `${fd.room_number || "2"} PN`, confidence: 96 },
        { label: "Diện tích", value: fd.area ? `${fd.area}m²` : "Chưa phát hiện", confidence: fd.area ? 93 : 28 },
        { label: "Giá thuê", value: fd.pricePerMonth ? `${Number(fd.pricePerMonth).toLocaleString()} ₫/th` : "Chưa rõ", confidence: fd.pricePerMonth ? 95 : 22 },
        { label: "Trạng thái NT", value: fd.description.includes("nội thất") ? "Full nội thất" : "Chưa xác định", confidence: fd.description.includes("nội thất") ? 84 : 40 },
        { label: "Chính sách thú cưng", value: "Không đề cập", confidence: 45 },
      ],
      seoTitle: genTitle, seoDescription: genDesc, seoScore: Math.min(score, 95), isReal: false,
    });
    setValidationErrors(mockErrors);
  }, []);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return; // Nếu chưa gửi file 

    setIsUploading(true);
    const newImages = [...uploadedImages];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Gửi request truy cập supabase đến BackEnd
        const respone = await api.post('/listing/upload/get-signed-url', { fileName: file.name })
        const { token, path } = respone.data;

        // Gửi file lên Bucket của Supabase:
        const { error } = await supabase.storage
          .from('uploads')
          .uploadToSignedUrl(path, token, file);

        if (error) {
          throw `Error from handleImageUpload: ${error}`
        }

        const { data: publicUrlData } = supabase.storage.from('uploads').getPublicUrl(path);

        newImages.push({
          id: path,
          url: publicUrlData.publicUrl,
          isPrimary: newImages.length === 0
        });

        setUploadedImages(newImages)
      }
    } catch (error) {
      console.error('Error HandleImageUpload Func: ', error);
      alert("Upload thất bại, vui lòng thử lại!");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }

  }

  const removeImage = (idToRemove: string) => {
    setUploadedImages(prev => prev.filter(img => img.id !== idToRemove));
    // Ở hệ thống thật, bạn có thể gọi thêm API xóa ảnh khỏi Supabase Storage để dọn rác
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }; 

  const triggerAIVerification = async () => {
    setIsVerifying(true);
    setVerificationDone(false);
    setExtractedData(null);

    const rawText = buildRawText(formData);
    const result = await verifyListing({ rawText, owner_id: `landlord-${Date.now()}` });

    if (result && result.success && result.data) {
      const { listing, apartment_meta, image_tags_suggested, validation } = result.data;
      const apiErrors: ValidationError[] = [];
      if (validation.missing_fields.includes("price"))
        apiErrors.push({ field: "price", type: "error", message: "Gemini: Chưa phát hiện giá thuê trong mô tả" });
      if (validation.missing_fields.includes("area"))
        apiErrors.push({ field: "area", type: "warning", message: "Gemini: Chưa phát hiện diện tích" });
      if (validation.issues.length > 0)
        apiErrors.push({ field: "description", type: "warning", message: validation.issues[0], suggestion: validation.feedback_to_owner });

      setExtractedData({
        entities: [
          { label: "Loại BĐS", value: "Căn hộ chung cư", confidence: 98 },
          { label: "Số phòng ngủ", value: apartment_meta.room_number ? `${apartment_meta.room_number} PN` : `${formData.bathroom || "2"} PN`, confidence: 94 },
          { label: "Diện tích", value: apartment_meta.area_m2 ? `${apartment_meta.area_m2}m²` : "Chưa phát hiện", confidence: apartment_meta.area_m2 ? 93 : 25 },
          { label: "Giá thuê", value: listing.price_per_month ? `${listing.price_per_month.toLocaleString()} ₫/th` : "Chưa rõ", confidence: listing.price_per_month ? 96 : 20 },
          { label: "Tiện ích", value: `${apartment_meta.amenities.length} mục`, confidence: apartment_meta.amenities.length > 0 ? 92 : 30 },
          { label: "Trạng thái", value: listing.status === "Published" ? "Sẵn sàng đăng" : "Bản nháp", confidence: 90 },
        ],
        seoTitle: listing.title,
        seoDescription: listing.description,
        seoScore: validation.score,
        amenities: apartment_meta.amenities,
        imageTags: image_tags_suggested,
        validationStatus: validation.status,
        feedback: validation.feedback_to_owner,
        issues: validation.issues,
        missingFields: validation.missing_fields,
        isReal: true,
      });
      setValidationErrors(apiErrors);
      setAgentOnline(true);
    } else {
      setAgentOnline(false);
      setTimeout(() => runSimulation(formData), 800);
    }

    setIsVerifying(false);
    setVerificationDone(true);
  };

  const addMockImages = () => {
    setImages([
      { id: "img1", name: "phong-ngu.jpg", status: "ok" },
      { id: "img2", name: "phong-khach-toi.jpg", status: "error", errorMsg: "Ảnh quá tối (độ sáng < 30%) — AI khuyên chụp lại" },
      { id: "img3", name: "nha-bep.jpg", status: "warning", errorMsg: "Ảnh hơi mờ — cân nhắc chụp lại" },
      { id: "img4", name: "bathroom.jpg", status: "ok" },
    ]);
  };

  const errorForField = (field: string) => validationErrors.find(e => e.field === field);
  const applyAISuggestion = (field: string, suggestion: string) => {
    setFormData(f => ({ ...f, [field]: suggestion }));
    setValidationErrors(e => e.filter(v => v.field !== field));
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      <div className="bg-white border-b border-gray-100 px-6 py-4">
        <h2 className="text-gray-900 font-bold" style={{ fontSize: "1.1rem" }}>Đăng tin cho thuê</h2>
        <p className="text-gray-400" style={{ fontSize: "0.75rem" }}>Listing Verifier AI kiểm duyệt tự động</p>
      </div>
      <div className="p-6 max-w-2xl">
        {/* Progress */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-700 font-semibold" style={{ fontSize: "0.875rem" }}>Bước {step}/3</p>
            <span className="text-violet-600" style={{ fontSize: "0.75rem" }}>{step === 1 ? "Thông tin cơ bản" : step === 2 ? "Tải ảnh" : "Xem lại"}</span>
          </div>
          <div className="flex gap-2">
            {[1, 2, 3].map(s => <div key={s} className={`h-1.5 flex-1 rounded-full transition-colors ${step >= s ? "bg-violet-500" : "bg-gray-200"}`} />)}
          </div>
        </div>

        <div className="p-6 max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-6">

            {/* === THÔNG TIN LISTING === */}
            <div>
              <h3 className="text-gray-900 font-bold mb-4 border-b pb-2">1. Thông tin quảng cáo (Listing)</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-1">Tiêu đề tin *</label>
                  <input name="title" value={formData.title} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl" placeholder="VD: Căn hộ 2PN view biển..." />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-1">Giá thuê (VND/tháng) *</label>
                  <input type="number" name="pricePerMonth" value={formData.pricePerMonth} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl" placeholder="8000000" />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-1">Mô tả chi tiết *</label>
                  <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full px-4 py-2 border rounded-xl resize-none" placeholder="Mô tả tiện ích, tình trạng..." />
                </div>
              </div>
            </div>

            {/* === THÔNG TIN VẬT LÝ CĂN HỘ === */}
            <div>
              <h3 className="text-gray-900 font-bold mb-4 border-b pb-2">2. Thông số kỹ thuật (Apartment)</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-1">Loại hình</label>
                  <select name="type" value={formData.type} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl">
                    <option value="Normal">Chung cư</option>
                    <option value="Studio">Studio</option>
                    <option value="Duplex">Duplex</option>
                    <option value="Penthouse">Penthouse</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-1">Diện tích (m²)</label>
                  <input type="number" name="area" value={formData.area} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl" />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-1">Tầng số</label>
                  <input type="number" name="floor" value={formData.floor} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl" />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-1">Phòng ngủ</label>
                  <input type="number" name="bedroom" value={formData.bedroom} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-1">Quận/Huyện</label>
                  <input name="district" value={formData.district} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl" placeholder="Hải Châu, Sơn Trà..." />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-1">Địa chỉ chính xác</label>
                  <input name="fullAddress" value={formData.fullAddress} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl" placeholder="Số 123 đường ABC..." />
                </div>
              </div>
            </div>

            {/* === UPLOAD ẢNH (GỘP CHUNG VÀO FORM) === */}
            <div>
              <h3 className="text-gray-900 font-bold mb-4 border-b pb-2">3. Hình ảnh căn hộ</h3>

              {/* Nút chọn ảnh */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-violet-300 rounded-2xl py-6 flex flex-col items-center gap-2 hover:bg-violet-50 cursor-pointer transition-all"
              >
                <input type="file" multiple accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
                {isUploading ? (
                  <RefreshCw size={24} className="text-violet-400 animate-spin" />
                ) : (
                  <UploadCloud size={24} className="text-violet-400" />
                )}
                <p className="text-gray-700 font-semibold text-sm">
                  {isUploading ? "Đang đẩy ảnh thẳng lên Supabase..." : "Nhấn để chọn hoặc kéo thả ảnh vào đây"}
                </p>
              </div>

              {/* Grid Preview Ảnh */}
              {uploadedImages.length > 0 && (
                <div className="grid grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                  {uploadedImages.map((img) => (
                    <div key={img.id} className="relative group rounded-xl overflow-hidden border">
                      <img src={img.url} alt="Preview" className="w-full h-32 object-cover" />
                      <button
                        onClick={() => removeImage(img.id)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={14} />
                      </button>
                      {img.isPrimary && (
                        <span className="absolute bottom-0 left-0 right-0 bg-violet-600 text-white text-xs text-center py-1 font-semibold">
                          Ảnh bìa
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* NÚT KIỂM DUYỆT AI */}
            <button
              className="w-full py-4 mt-6 rounded-xl font-bold flex items-center justify-center gap-2 text-white shadow-md bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 transition-all"
            >
              <Sparkles size={18} />
              Giao cho AI Agent kiểm duyệt toàn bộ
            </button>

          </div>
        </div>

        {/* Step 3 — Review & publish */}
        {step === 3 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <button onClick={() => setStep(2)} className="text-gray-400 hover:text-gray-600"><ChevronLeft size={18} /></button>
              <p className="text-gray-600 font-medium" style={{ fontSize: "0.85rem" }}>Xem lại & Xuất bản</p>
            </div>
            <div className="space-y-3">
              {[["Tiêu đề", formData.title || "—"], ["Địa chỉ", formData.fullAddress || "—"], ["Giá thuê", formData.pricePerMonth ? `${Number(formData.pricePerMonth).toLocaleString()} ₫/tháng` : "—"], ["Diện tích", formData.area ? `${formData.area}m²` : "—"]].map(([l, v]) => (
                <div key={l} className="flex justify-between py-2.5 border-b border-gray-100">
                  <span className="text-gray-500" style={{ fontSize: "0.82rem" }}>{l}</span>
                  <span className="text-gray-900 font-semibold" style={{ fontSize: "0.82rem" }}>{v}</span>
                </div>
              ))}
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center gap-2">
              <CheckCircle2 size={15} className="text-emerald-500" />
              <p className="text-emerald-700" style={{ fontSize: "0.78rem" }}>{images.filter(i => i.status === "ok").length} ảnh đạt chuẩn • Listing Verifier đã duyệt</p>
            </div>
            <button onClick={() => setStep(1)} className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-4 rounded-2xl font-bold shadow-md" style={{ fontSize: "1rem" }}>
              🚀 Đăng tin ngay
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
