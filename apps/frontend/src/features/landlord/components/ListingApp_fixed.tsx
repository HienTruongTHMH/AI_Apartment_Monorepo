import { useState, useEffect, useRef } from "react";
import {
    CheckCircle2, Sparkles, RefreshCw, UploadCloud,
    X, Building, FileText, AlertCircle, Bot,
    Plus,
    Eye,
    Send,
    Edit
} from 'lucide-react'
import { createClient } from "@supabase/supabase-js";
import { api } from "@/lib/api";

// Gọi Supabase
const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
)

// Interface bài đăng căn hộ
interface OwnerApartmentPosted {
    id: string;
    name: string;
    phone: string;
    room_number: string;
    floor: number;
    area: number;
    bedroom: number;
    kitchen: number;
    livingroom: number;
    bathroom: number;
    district: string;
    fullAddress: string;
    type: string;
    listingStatus: "Published" | "Draft" | "None";
    pricePerMonth: string;
    title?: string | undefined;
    description?: string;
    images?: { id: string; url: string; isPrimary: boolean }[];
    listingId?: string;

}

export default function ListingApp_fixed() {
    // Các state về căn hộ
    const [apartments, setApartments] = useState<OwnerApartmentPosted[]>([]); // Trả về danh sách có kiểu OwnerApartmentPosted
    const [selectedApartmentId, setSelectedApartmentId] = useState<string | null>(null)
    const [isLoadingApartments, setIsLoadingApartments] = useState(true);

    // State cho form
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        pricePerMonth: "",
        room_number: "",
        floor: "",
        area: "",
        district: "",
        fullAddress: "",
        bedroom: 1,
        bathroom: 1,
        livingroom: 1,
        kitchen: 1,
        type: "Normal"
    });

    // State Upload ảnh
    const [uploadedImages, setUploadedImages] = useState<{ id: string, url: string, isPrimary: boolean }[]>([])
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // State của AI
    const [isVerifying, setIsVerifying] = useState(false);
    const [aiResult, setAiResult] = useState<any>(null);

    const ownerId = '33a3dd4a-0efb-4739-b5f3-d0b699a42ebf';

    const isFormValid =
        formData.title.trim() !== "" &&
        formData.pricePerMonth !== "" &&
        formData.fullAddress.trim() !== "" &&
        formData.type !== "" &&
        formData.area !== "" &&
        formData.bedroom > 0 &&
        formData.bathroom > 0 &&
        uploadedImages.length >= 3;

    const currentApt = apartments.find(apt => apt.id === selectedApartmentId);
    const isEditing = selectedApartmentId !== "NEW_DRAFT" && currentApt?.listingId;

    const fetchOnwerApartmentsList = async () => {
        setIsLoadingApartments(true)
        try {
            const res = await api.get(`/listing/?ownerId=${ownerId}`);
            console.log("Đang thử kết nối API")
            console.log(res.data)

            if (res.data && Array.isArray(res.data)) {
                const mappedData = res.data.map((item: any) => ({
                    id: item.apartment.id, // Lấy ID căn hộ
                    room_number: item.apartment.room_number.toString(),
                    name: item.apartment.id,
                    phone: item.apartment.id,
                    floor: item.apartment.floor,
                    area: item.apartment.area,
                    bedroom: item.apartment.bedroom,
                    livingroom: item.apartment.livingroom,
                    kitchen: item.apartment.kitchen,
                    bathroom: item.apartment.bathroom,
                    district: item.apartment.district,
                    fullAddress: item.apartment.fullAddress,
                    type: item.apartment.type,
                    listingStatus: item.listingStatus, // Từ bảng Listing
                    pricePerMonth: item.pricePerMonth, // Từ bảng Listing
                    title: item.title,
                    description: item.description,
                    listingId: item.id,
                    images: item.images ? item.images.map((img: any) => ({
                        id: img.id || img.imageUrl,
                        url: img.imageUrl,
                        isPrimary: img.isPrimary
                    })) : []
                }))
                setApartments(mappedData);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoadingApartments(false);
        }
    }
    // Hàm tạo form cho bài viết mới..
    const handleCreateNew = async () => {
        setSelectedApartmentId("NEW_DRAFT");
        setFormData({
            title: "",
            description: "",
            pricePerMonth: "",
            floor: "",
            area: "",
            district: "",
            fullAddress: "",
            room_number: "",
            bedroom: 1,
            bathroom: 1,
            livingroom: 1,
            kitchen: 1,
            type: "Normal"
        });
        setUploadedImages([]);

    };

    // Hàm upload bài viết.
    const handleUploadListing = async () => {
        try {
            const payload: any = {
                title: formData.title.trim(),
                description: formData.description.trim(),
                pricePerMonth: Number(formData.pricePerMonth),
                listingStatus: "Published"
            };
            // Check bài viết có đang chỉnh sửa không ? 
            if (isEditing) {
                payload.images = {
                    deleteMany: {},
                    create: uploadedImages.map(img => ({
                        imageUrl: img.url,
                        isPrimary: img.isPrimary
                    }))
                }

                const res = await api.patch(`/listing/${currentApt?.listingId}`, payload);
                alert("Cập nhập thành công!");
            } else {
                payload.images = {
                    create: uploadedImages.map(img => ({
                        imageUrl: img.url,
                        isPrimary: img.isPrimary
                    }))
                }

                if (selectedApartmentId === "NEW_DRAFT") {
                    // Trường hợp A: Tạo CĂN HỘ MỚI hoàn toàn
                    payload.apartment = {
                        type: formData.type,
                        floor: Number(formData.floor),
                        area: Number(formData.area),
                        district: formData.district,
                        fullAddress: formData.fullAddress,
                        room_number: Number(formData.room_number), // Xử lý nếu mã căn là chữ (vd: A101) thì Prisma phải để là String
                        bedroom: Number(formData.bedroom),
                        bathroom: Number(formData.bathroom),
                        livingroom: Number(formData.livingroom),
                        kitchen: Number(formData.kitchen),
                        ownerId: ownerId
                    };
                } else {
                    // Trường hợp B: Đăng tin cho CĂN HỘ ĐÃ CÓ SẴN
                    payload.apartmentId = selectedApartmentId;
                }
            }

            const res = await api.post('/listing', payload);

            if (res.status === 201 || res.status === 200) {
                // alert("🎉 Đăng tin thành công!");
                console.log("Data lưu DB thành công: ", res.data);
                alert("Đăng thành công")
            }

            fetchOnwerApartmentsList();
            setFormData({
                title: "",
                description: "",
                pricePerMonth: "",
                room_number: "",
                floor: "",
                area: "",
                district: "",
                fullAddress: "",
                bedroom: 1,
                bathroom: 1,
                livingroom: 1,
                kitchen: 1,
                type: "Normal"
            })
        } catch (error: any) {
            console.error("Lỗi khi gửi lên Backend: ", error);
            if (error.response && error.response.data) {
                alert("Lỗi Backend: " + JSON.stringify(error.response.data.message));
            } else {
                alert("Có lỗi xảy ra khi lưu dữ liệu.");
            }
        }
    }

    // Hàm chọn căn hộ từ danh sách.
    const handleSelectedApartment = (apt: OwnerApartmentPosted) => {
        setSelectedApartmentId(apt.id);
        setFormData({
            title: apt.title || "",
            description: apt.description || "",
            pricePerMonth: apt.pricePerMonth || "",
            room_number: apt.room_number || "",
            floor: apt.floor ? apt.floor.toString() : "",
            area: apt.area ? apt.area.toString() : "",
            district: apt.district || "",
            fullAddress: apt.fullAddress || "",
            bedroom: apt.bedroom || 1,
            bathroom: apt.bathroom || 1,
            livingroom: apt.livingroom || 0,
            kitchen: apt.kitchen || 0,
            type: apt.type || "Normal"
        });
        setUploadedImages(apt.images || []);
        setAiResult(null);
    }

    // Hàm đăng ảnh.
    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        setIsUploading(true);
        const newImages = [...uploadedImages];

        try {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                // 1. Xin vé từ NestJS
                const response = await api.post('/listing/upload/get-presigned-url', { fileName: file.name });
                const { token, path } = response.data;

                // 2. Bắn lên Supabase
                const { error } = await supabase.storage.from('uploads').uploadToSignedUrl(path, token, file);
                if (error) throw error;

                // 3. Lấy public URL hiển thị ngay
                const { data: publicUrlData } = supabase.storage.from('/uploads').getPublicUrl(path);

                newImages.push({
                    id: path,
                    url: publicUrlData.publicUrl,
                    isPrimary: newImages.length === 0
                });
                setUploadedImages(newImages);
            }
        } catch (error) {
            console.error('Lỗi Upload:', error);
            alert("Upload thất bại, vui lòng thử lại!");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const removeImage = (idToRemove: string) => {
        setUploadedImages(prev => prev.filter(img => img.id !== idToRemove));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const triggerAIVerification = async () => {
        setIsVerifying(true);
        setAiResult(null);
        try {
            const imageUrlsToVerify = uploadedImages.map(img => img.url);

            // Gửi MỘT CỤC data nguyên bản
            const payload: any = {
                ownerId: ownerId,
                title: formData.title,
                description: formData.description,
                // Ép kiểu các trường số ngay từ Frontend để an toàn gấp đôi
                pricePerMonth: Number(formData.pricePerMonth),
                room_number: Number(formData.room_number),
                floor: Number(formData.floor),
                area: Number(formData.area),
                district: formData.district,
                fullAddress: formData.fullAddress,
                bedroom: Number(formData.bedroom),
                bathroom: Number(formData.bathroom),
                livingroom: Number(formData.livingroom),
                kitchen: Number(formData.kitchen),
                type: formData.type,
                imageUrls: imageUrlsToVerify
            };

            if (selectedApartmentId !== "NEW_DRAFT") {
                payload.apartmentId = selectedApartmentId;
            }

            console.log("📦 Đang gửi Payload SẠCH sang NestJS:", payload);

            const res = await api.post('/ai-agents/verify', payload);

            const returnedData = res.data?.data;
            console.log("Dữ liệu từ AI là: ", returnedData);
            setAiResult(returnedData);
        } catch (error) {
            console.error("Error at triggerAIVerification func: ", error);
        }
        // Chờ phản hồi và nhét vào State Cột 3
        setTimeout(() => { setIsVerifying(false); }, 2000);
    };

    // Hàm helper để map màu sắc trạng thái
    const getStatusStyles = (status: "Published" | "Draft" | "None") => {
        switch (status) {
            case "Published": return "bg-emerald-50 border-emerald-500 text-emerald-700 shadow-emerald-100";
            case "Draft": return "bg-amber-50 border-amber-500 text-amber-700 shadow-amber-100";
            case "None": return "bg-gray-100 border-gray-300 text-gray-500 shadow-gray-100";
        }
    };

    const getStatusText = (status: "Published" | "Draft" | "None") => {
        switch (status) {
            case "Published": return "Đã có bài viết";
            case "Draft": return "Bản nháp";
            case "None": return "Chưa có bài viết";
        }
    };

    useEffect(() => {
        fetchOnwerApartmentsList();
    }, []);

    return (
        // RESPONSIVE ROOT: Xếp dọc trên mobile (flex-col), xếp ngang trên màn hình lớn xl (xl:flex-row)
        <div className="flex flex-col h-full w-full bg-white overflow-x-hidden text-gray-800 relative">
            <div className="flex-1 flex flex-col xl:flex-row overflow-x-hidden xl:overflow-hidden min-h-0">

                {/* =========================================================================
                CỘT 1: DANH SÁCH CĂN HỘ 
            ========================================================================= */}
                <div className="w-full xl:w-1/4 xl:min-w-[280px] xl:max-w-[320px] border-b xl:border-b-0 xl:border-r border-gray-200 flex flex-col xl:h-full bg-gray-50 flex-shrink-0">
                    <div className="h-[72px] px-4 border-b border-gray-200 bg-white shadow-sm flex flex-row z-10 flex-shrink-0 justify-between items-center">
                        <div className="flex flex-col justify-center">
                            <h2 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                                <Building size={18} className="text-violet-600" />
                                Tài sản của bạn
                            </h2>
                            <p className="text-xs text-gray-500 mt-1">Chọn căn hộ để tạo/sửa tin đăng</p>
                        </div>

                        <button
                            onClick={handleCreateNew}
                            title="Thêm căn hộ mới"
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-violet-50 text-violet-600 hover:bg-violet-100 transition-colors border border-violet-100"
                        >
                            <Plus size={18} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto max-h-[35vh] xl:max-h-none p-4 space-y-3 custom-scrollbar">
                        {isLoadingApartments ? (
                            <div className="flex justify-center py-10"><RefreshCw className="animate-spin text-gray-400" /></div>
                        ) : (
                            apartments.map((apt) => {
                                const isSelected = selectedApartmentId === apt.id;
                                return (
                                    <div
                                        key={apt.id}
                                        onClick={() => handleSelectedApartment(apt)}
                                        className={`cursor-pointer rounded-xl border-2 p-4 transition-all duration-200 ${getStatusStyles(apt.listingStatus)} ${isSelected ? 'ring-4 ring-violet-200 ring-offset-1 scale-[1.02]' : 'hover:scale-[1.02] hover:shadow-md'}`}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-lg">P. {apt.room_number}</h3>
                                            <span className="text-[0.65rem] font-bold px-2 py-1 rounded-full bg-white/60 backdrop-blur-sm border border-current/20">
                                                {apt.listingStatus === "Published" ? "Đã xuất bản" : (apt.listingStatus === "Draft" ? "Bản nháp" : "Chưa có tin")}
                                            </span>
                                        </div>
                                        <div className="text-xs space-y-1 opacity-80 font-medium">
                                            <p>Tầng {apt.floor} • {apt.area}m² • {apt.type}</p>
                                            {apt.pricePerMonth && <p className="font-bold">Giá: {Number(apt.pricePerMonth).toLocaleString()} ₫</p>}
                                        </div>
                                    </div>
                                )
                            })
                        )}
                    </div>
                </div>

                {/* =========================================================================
                CỘT 2: FORM NHẬP DỮ LIỆU & ẢNH
            ========================================================================= */}
                <div className="flex-1 border-b xl:border-b-0 xl:border-r border-gray-200 flex flex-col xl:h-full relative min-w-0">
                    <div className="h-[72px] px-4 border-b border-gray-200 bg-white shadow-sm z-10 flex flex-wrap gap-3 justify-between items-center flex-shrink-0">
                        <div className="flex flex-col justify-center">
                            <h2 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                                <FileText size={20} className="text-violet-600" />
                                Thông tin chi tiết
                            </h2>
                            <p className="text-xs text-gray-500 mt-0.5">
                                {selectedApartmentId === "NEW_DRAFT" ? "Tạo tài sản & tin đăng mới" : "Chỉnh sửa nội dung"}
                            </p>
                        </div>
                        <button
                            onClick={triggerAIVerification}
                            disabled={!selectedApartmentId || isVerifying}
                            className="px-4 py-2 rounded-xl font-bold flex items-center gap-2 text-white bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 disabled:opacity-50 transition-all shadow-md text-sm md:text-base whitespace-nowrap"
                        >
                            {isVerifying ? <RefreshCw size={16} className="animate-spin" /> : <Sparkles size={16} />}
                            Duyệt qua AI
                        </button>
                    </div>

                    {!selectedApartmentId ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-6 text-center min-h-[30vh]">
                            <AlertCircle size={48} className="mb-4 opacity-50" />
                            <p>Vui lòng chọn một căn hộ ở cột bên trái</p>
                        </div>
                    ) : (
                        <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
                            <div className="max-w-2xl mx-auto space-y-6 md:space-y-8 pb-10">

                                {/* Hiển thị badge báo trạng thái tạo mới */}
                                {selectedApartmentId === "NEW_DRAFT" && (
                                    <div className="bg-violet-50 border border-violet-200 text-violet-700 px-4 py-3 rounded-xl flex items-center gap-2 text-sm font-medium">
                                        <Sparkles size={16} className="text-violet-500" />
                                        Bạn đang tạo một Hồ sơ căn hộ và Tin đăng hoàn toàn mới.
                                    </div>
                                )}

                                {isEditing && (
                                    <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-xl flex items-center gap-2 text-sm font-medium">
                                        <Edit size={16} className="text-blue-500" />
                                        Chế độ chỉnh sửa: Bạn đang cập nhật nội dung cho tài sản này.
                                    </div>
                                )}

                                {/* BLOCK 1: VỊ TRÍ BẤT ĐỘNG SẢN */}
                                <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6 shadow-sm">
                                    <h3 className="font-bold mb-4 text-gray-800 border-b pb-2">Vị trí bất động sản</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-gray-700 text-sm font-semibold mb-1">Địa chỉ chính xác <span className="text-red-500">*</span></label>
                                            <input type="string" name="fullAddress" value={formData.fullAddress} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 bg-gray-50 rounded-xl focus:bg-white focus:ring-2 focus:ring-violet-200 outline-none transition-all" placeholder="VD: Số 123 Đường Nguyễn Văn Linh..." />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-gray-700 text-sm font-semibold mb-1">Quận/Huyện</label>
                                                <input type="string" name="district" value={formData.district} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 bg-gray-50 rounded-xl focus:bg-white focus:ring-2 focus:ring-violet-200 outline-none transition-all" placeholder="VD: Hải Châu" />
                                            </div>
                                            <div>
                                                <label className="block text-gray-700 text-sm font-semibold mb-1">Số phòng</label>
                                                <input type="number" name="room_number" value={formData.room_number} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 bg-gray-50 rounded-xl focus:bg-white focus:ring-2 focus:ring-violet-200 outline-none transition-all" placeholder="VD: A101" />
                                            </div>
                                            <div>
                                                <label className="block text-gray-700 text-sm font-semibold mb-1">Tầng số</label>
                                                <input type="number" name="floor" value={formData.floor} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 bg-gray-50 rounded-xl focus:bg-white focus:ring-2 focus:ring-violet-200 outline-none transition-all" placeholder="VD: 15" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* BLOCK 2: ĐẶC ĐIỂM BẤT ĐỘNG SẢN */}
                                <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6 shadow-sm">
                                    <h3 className="font-bold mb-4 text-gray-800 border-b pb-2">Đặc điểm bất động sản</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-gray-700 text-sm font-semibold mb-1">Loại hình <span className="text-red-500">*</span></label>
                                            <select name="type" value={formData.type} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 bg-gray-50 rounded-xl focus:bg-white focus:ring-2 focus:ring-violet-200 outline-none transition-all appearance-none cursor-pointer">
                                                <option value="Normal">Căn hộ chung cư</option>
                                                <option value="Studio">Studio</option>
                                                <option value="Officetel">Officetel</option>
                                                <option value="Duplex">Duplex</option>
                                                <option value="Penthouse">Penthouse</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 text-sm font-semibold mb-1">Diện tích (m²) <span className="text-red-500">*</span></label>
                                            <input type="number" name="area" value={formData.area} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 bg-gray-50 rounded-xl focus:bg-white focus:ring-2 focus:ring-violet-200 outline-none transition-all" placeholder="VD: 65" />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 text-sm font-semibold mb-1">Số phòng ngủ <span className="text-red-500">*</span></label>
                                            <input type="number" min="1" name="bedroom" value={formData.bedroom} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 bg-gray-50 rounded-xl focus:bg-white focus:ring-2 focus:ring-violet-200 outline-none transition-all" />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 text-sm font-semibold mb-1">Số phòng vệ sinh <span className="text-red-500">*</span></label>
                                            <input type="number" min="1" name="bathroom" value={formData.bathroom} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 bg-gray-50 rounded-xl focus:bg-white focus:ring-2 focus:ring-violet-200 outline-none transition-all" />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 text-sm font-semibold mb-1">Số phòng khách</label>
                                            <input type="number" min="0" name="livingroom" value={formData.livingroom} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 bg-gray-50 rounded-xl focus:bg-white focus:ring-2 focus:ring-violet-200 outline-none transition-all" />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 text-sm font-semibold mb-1">Số phòng bếp</label>
                                            <input type="number" min="0" name="kitchen" value={formData.kitchen} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 bg-gray-50 rounded-xl focus:bg-white focus:ring-2 focus:ring-violet-200 outline-none transition-all" />
                                        </div>
                                    </div>
                                </div>

                                {/* BLOCK 3: NỘI DUNG TIN ĐĂNG & HÌNH ẢNH */}
                                <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6 shadow-sm">
                                    <h3 className="font-bold mb-4 text-gray-800 border-b pb-2">Nội dung tin đăng</h3>

                                    <div className="space-y-6">
                                        {/* Khung upload ảnh đưa lên đầu phần nội dung */}
                                        <div>
                                            <label className="block text-gray-700 text-sm font-semibold mb-2">Hình ảnh/Video <span className="text-red-500">*</span></label>
                                            <div
                                                onClick={() => fileInputRef.current?.click()}
                                                className="w-full border-2 border-dashed border-violet-300 bg-amber-50/50 rounded-2xl py-8 flex flex-col items-center gap-2 hover:bg-amber-100/50 cursor-pointer transition-all"
                                            >
                                                <input type="file" multiple accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
                                                {isUploading ? <RefreshCw size={32} className="text-amber-500 animate-spin" /> : <UploadCloud size={32} className="text-amber-500" />}
                                                <p className="text-gray-800 font-bold text-sm text-center px-4">
                                                    {isUploading ? "Đang tải ảnh..." : "Thêm ảnh/video"}
                                                </p>
                                                <p className="text-red-400 text-xs mt-1">Vui lòng tải lên ít nhất 3 hình ảnh</p>
                                            </div>

                                            {uploadedImages.length > 0 && (
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                                                    {uploadedImages.map((img) => (
                                                        <div key={img.id} className="relative group rounded-xl overflow-hidden border shadow-sm h-24 bg-gray-100">
                                                            <img src={img.url} className="w-full h-full object-cover" />
                                                            <button onClick={(e) => { e.stopPropagation(); removeImage(img.id); }} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <X size={12} />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 text-sm font-semibold mb-1">Tiêu đề tin đăng <span className="text-red-500">*</span></label>
                                            {/* Thêm id "title-input" để chớp hiệu ứng */}
                                            <input id="title-input" type="text" name="title" value={formData.title} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 bg-gray-50 rounded-xl focus:bg-white focus:ring-2 focus:ring-violet-200 outline-none transition-colors duration-500" placeholder="VD: Cho thuê căn hộ cao cấp 2PN..." />
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 text-sm font-semibold mb-1">Giá thuê (VND/tháng) <span className="text-red-500">*</span></label>
                                            <div className="relative">
                                                {/* Đổi type thành 'text' tạm thời để có thể nhập số lớn có dấu phẩy cho đẹp (nếu muốn) hoặc giữ nguyên 'number' */}
                                                <input type="number" name="pricePerMonth" value={formData.pricePerMonth} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 bg-gray-50 rounded-xl focus:bg-white focus:ring-2 focus:ring-violet-200 outline-none transition-all pr-10" placeholder="VD: 8000000" />
                                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">₫</span>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 text-sm font-semibold mb-1">Mô tả chi tiết <span className="text-red-500">*</span></label>
                                            <textarea name="description" value={formData.description} onChange={handleChange} rows={6} className="w-full px-4 py-3 border border-gray-200 bg-gray-50 rounded-xl focus:bg-white focus:ring-2 focus:ring-violet-200 outline-none transition-all resize-none" placeholder="Nhập mô tả chi tiết về tiện ích, tình trạng nội thất, các chi phí điện nước phát sinh..." />
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    )}
                </div>

                {/* =========================================================================
                CỘT 3: BẢNG TĨNH AI VERIFIER 
            ========================================================================= */}
                <div className="w-full xl:w-1/4 xl:min-w-[280px] xl:max-w-[320px] bg-slate-50 flex flex-col xl:h-full flex-shrink-0 min-h-[50vh]">
                    <div className="h-[72px] p-4 border-b border-slate-200 bg-white shadow-sm z-10 flex-shrink-0">
                        <div className="flex flex-col justify-center">
                            <h2 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                                <Bot size={20} className="text-emerald-600" />
                                AI Verifier
                            </h2>
                            <p className="text-xs text-slate-500 mt-1">Báo cáo đánh giá tự động</p>
                        </div>
                    </div>
                    {/* kiểm tra đang kích hoạt AI hay sao ?  */}
                    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar pb-24">
                        {isVerifying ? (
                        <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                            <RefreshCw size={40} className="animate-spin text-emerald-500 mb-4" />
                            <p className="font-medium animate-pulse">AI đang phân tích và đối soát...</p>
                        </div>
                    ) : aiResult ? (
                        /* NẾU ĐÃ CÓ KẾT QUẢ AI */
                        <div className="space-y-4">
                            {/* Khối Điểm số và Trạng thái */}
                            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                                <h4 className="text-xs font-bold text-slate-400 mb-3 tracking-wider">KẾT QUẢ KIỂM DUYỆT</h4>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-12 h-12 rounded-full border-4 flex items-center justify-center font-bold text-lg
                                            ${aiResult.validation.score >= 70 ? 'border-emerald-200 text-emerald-600' : 'border-red-200 text-red-600'}
                                        `}>
                                            {aiResult.validation.score}
                                        </div>
                                        <div className="text-sm">
                                            <p className="text-slate-500">Điểm chất lượng</p>
                                            <p className={`font-bold ${aiResult.listing.status === 'published' ? 'text-emerald-600' : 'text-amber-600'}`}>
                                                {aiResult.listing.status.toUpperCase()}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Hiển thị Feedback nếu bị đánh rớt hoặc trừ điểm */}
                                {aiResult.validation.issues?.length > 0 && (
                                    <div className="mt-4 p-3 bg-red-50 rounded-lg text-sm border border-red-100">
                                        <p className="font-bold text-red-700 mb-1">⚠️ Cần khắc phục:</p>
                                        <ul className="list-disc pl-4 text-red-600 space-y-1">
                                            {aiResult.validation.issues.map((issue: string, idx: number) => (
                                                <li key={idx}>{issue}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            {/* Khối Nội dung Chuẩn hoá */}
                            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm relative overflow-hidden group">
                                <h4 className="text-xs font-bold text-slate-400 mb-2 tracking-wider">BẢN NHÁP TỐI ƯU BỞI AI</h4>
                                <h5 className="font-bold text-slate-800 text-sm mb-2">{aiResult.listing.title}</h5>
                                <div className="text-sm text-slate-600 whitespace-pre-wrap bg-slate-50 p-3 rounded-lg border border-slate-100 max-h-40 overflow-y-auto custom-scrollbar">
                                    {aiResult.listing.description}
                                </div>

                                {/* Nút Áp dụng - Nổi bật hơn khi hover */}
                                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-white via-white to-transparent pt-12 opacity-0 group-hover:opacity-100 transition-opacity flex justify-center">
                                    <button
                                        onClick={() => {
                                            // 1. Cập nhật FormData
                                            setFormData(prev => ({
                                                ...prev,
                                                title: aiResult.listing.title,
                                                description: aiResult.listing.description,
                                                // Nếu AI trả về giá được tối ưu (có thể em cấu hình cho AI) thì cập nhật luôn
                                                pricePerMonth: aiResult.listing.price_per_month?.toString() || prev.pricePerMonth
                                            }));

                                            // 2. Tạo hiệu ứng Feedback nhẹ nhàng thay vì alert()
                                            const titleInput = document.querySelector('input[name="title"]') as HTMLInputElement;
                                            if (titleInput) {
                                                titleInput.style.backgroundColor = '#e0e7ff'; // Màu xanh nhạt chớp sáng
                                                setTimeout(() => titleInput.style.backgroundColor = '', 1000);
                                            }

                                            // 3. Clear kết quả AI để Cột 3 trở về trạng thái chờ
                                            setAiResult(null);
                                        }}
                                        className="w-full shadow-lg py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 hover:from-emerald-600 hover:to-teal-600 transition-all transform hover:scale-105"
                                    >
                                        <Sparkles size={16} /> Áp dụng nội dung này
                                    </button>
                                </div>
                            </div>

                            {/* Khối Trích xuất & Đối soát Database */}
                            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                                <div className="flex justify-between items-center mb-3">
                                    <h4 className="text-xs font-bold text-slate-400 tracking-wider">TRÍCH XUẤT THỰC THỂ</h4>
                                    {aiResult.validation.is_verified_by_db && (
                                        <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded flex items-center gap-1">
                                            <CheckCircle2 size={10} /> Khớp DB
                                        </span>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm border-b border-slate-50 pb-1">
                                        <span className="text-slate-400">Giá AI hiểu</span>
                                        <span className="text-slate-700 font-bold">{aiResult.listing.price_per_month.toLocaleString()} ₫</span>
                                    </div>
                                    <div className="flex justify-between text-sm border-b border-slate-50 pb-1">
                                        <span className="text-slate-400">Diện tích</span>
                                        <span className="text-slate-700 font-bold">{aiResult.apartment_meta.area_m2} m²</span>
                                    </div>
                                    <div className="flex justify-between text-sm pb-1">
                                        <span className="text-slate-400">Tiện ích</span>
                                        <span className="text-slate-700 font-bold truncate max-w-[120px] text-right" title={aiResult.apartment_meta.amenities.join(', ')}>
                                            {aiResult.apartment_meta.amenities.length} mục
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Tag ảnh gợi ý */}
                            {aiResult.image_tags_suggested?.length > 0 && (
                                <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                                    <h4 className="text-xs font-bold text-slate-400 mb-2 tracking-wider">GỢI Ý TỪ KHÓA TÌM KIẾM</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {aiResult.image_tags_suggested.map((tag: string, idx: number) => (
                                            <span key={idx} className="bg-violet-50 text-violet-600 text-xs px-2 py-1 rounded-md border border-violet-100">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (<div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                        <div className="space-y-4 opacity-40 select-none pointer-events-none">
                            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                                <h4 className="text-xs font-bold text-slate-400 mb-3 tracking-wider">ĐIỂM CHUẨN SEO</h4>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full border-4 border-slate-200 flex items-center justify-center font-bold text-slate-300">--</div>
                                    <div className="text-sm text-slate-400">Chờ dữ liệu...</div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                                <h4 className="text-xs font-bold text-slate-400 mb-3 tracking-wider">TRÍCH XUẤT THỰC THỂ</h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm border-b border-slate-50 pb-1">
                                        <span className="text-slate-400">Loại BĐS</span><span className="text-slate-300 font-medium truncate max-w-[120px] text-right">---</span>
                                    </div>
                                    <div className="flex justify-between text-sm border-b border-slate-50 pb-1">
                                        <span className="text-slate-400">Giá thuê</span><span className="text-slate-300 font-medium truncate max-w-[120px] text-right">---</span>
                                    </div>
                                    <div className="flex justify-between text-sm pb-1">
                                        <span className="text-slate-400">Diện tích</span><span className="text-slate-300 font-medium truncate max-w-[120px] text-right">---</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                                <h4 className="text-xs font-bold text-slate-400 mb-2 tracking-wider">GỢI Ý TỪ GEMINI</h4>
                                <div className="h-16 bg-slate-100 rounded-lg animate-pulse" />
                            </div>
                        </div>

                        <div className="mt-6 text-center text-sm text-slate-400 font-medium px-4 pb-10">
                            Hoàn thành cột nội dung và bấm <span className="text-violet-500">"Duyệt qua AI"</span> để hiển thị kết quả tại đây.
                        </div>
                    </div>)}
                    </div>
                    
                </div>
            </div>

            {/* 
                Bottom stick
            */}
            <div className="flex-shrink-0 border-t border-gray-200 bg-white px-4 md:px-6 py-4 flex flex-col md:flex-row items-center justify-between z-20 shadow-[0_-10px_20px_-5px_rgba(0,0,0,0.05)] w-full">
                <div className="hidden md:flex flex-col">
                    {isFormValid ? (
                        <span className="text-emerald-600 text-sm font-semibold flex items-center gap-1.5">
                            <CheckCircle2 size={16} /> Thông tin đã đầy đủ, có thể Duyệt AI hoặc Đăng tin!
                        </span>
                    ) : (
                        <span className="text-amber-600 text-sm font-semibold flex items-center gap-1.5">
                            <AlertCircle size={16} /> Vui lòng điền các trường bắt buộc (*) và tải lên ít nhất 3 ảnh
                        </span>
                    )}
                </div>

                <div className="flex w-full md:w-auto items-center gap-3">
                    <button
                        onClick={triggerAIVerification}
                        disabled={isVerifying}
                        className="flex-1 md:flex-none px-4 md:px-6 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 text-violet-700 bg-violet-100 hover:bg-violet-200 transition-all text-sm whitespace-nowrap"
                    >
                        {isVerifying ? <RefreshCw size={16} className="animate-spin" /> : <Sparkles size={16} />}
                        Duyệt qua AI
                    </button>

                    <button
                        disabled={!isFormValid}
                        className="flex-1 md:flex-none px-4 md:px-6 py-2.5 rounded-xl font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm flex items-center justify-center gap-2 whitespace-nowrap"
                    >
                        <Eye size={16} /> <span className="hidden sm:inline">Xem trước</span>
                    </button>

                    <button onClick={handleUploadListing} disabled={!isFormValid}
                        // 5. THAY ĐỔI MÀU NÚT THEO TRẠNG THÁI (UPDATE = MÀU XANH BLUE, TẠO MỚI = MÀU VÀNG)
                        className={`flex-1 md:flex-none px-6 md:px-8 py-2.5 rounded-xl font-bold transition-all text-sm shadow-md flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed
                                ${isEditing
                                ? "bg-blue-500 hover:bg-blue-600 text-white"
                                : "bg-yellow-400 hover:bg-yellow-500 text-yellow-900"}`
                        }
                    >
                        {isEditing ? <Edit size={16} /> : <Send size={16} />}
                        {isEditing ? "Cập nhật bài" : "Đăng tin"}
                    </button>
                </div>
            </div>
        </div>
    );
}