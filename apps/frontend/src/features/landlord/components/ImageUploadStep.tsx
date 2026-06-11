import { motion } from "motion/react";
import { Upload, CheckCircle2, Camera, ChevronLeft, Sparkles } from "lucide-react";

export interface ImageItem {
  id: string;
  name: string;
  status: string;
  errorMsg?: string;
}

export interface ImageUploadStepProps {
  images: ImageItem[];
  onAddMockImages: () => void;
  onBack: () => void;
  onNext: () => void;
}

export function ImageUploadStep({ images, onAddMockImages, onBack, onNext }: ImageUploadStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4"
    >
      <div className="flex items-center gap-2 mb-2">
        <button onClick={onBack} className="text-gray-400 hover:text-gray-600">
          <ChevronLeft size={18} />
        </button>
        <p className="text-gray-600 font-medium" style={{ fontSize: "0.85rem" }}>
          Tải ảnh — AI kiểm duyệt theo thời gian thực
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-center gap-3">
        <Sparkles size={15} className="text-blue-500 flex-shrink-0" />
        <p className="text-blue-700" style={{ fontSize: "0.78rem" }}>AI kiểm tra độ sáng, độ nét và nội dung ảnh</p>
      </div>

      <button
        onClick={onAddMockImages}
        className="w-full border-2 border-dashed border-violet-300 rounded-2xl py-8 flex flex-col items-center gap-2 hover:border-violet-400 hover:bg-violet-50/50 transition-all"
      >
        <Upload size={24} className="text-violet-400" />
        <p className="text-gray-700 font-semibold" style={{ fontSize: "0.875rem" }}>Chọn ảnh từ máy</p>
        <p className="text-gray-400" style={{ fontSize: "0.72rem" }}>JPG, PNG — Tối đa 10 ảnh</p>
      </button>

      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {images.map((img) => (
            <div
              key={img.id}
              className={`relative rounded-xl overflow-hidden border-2 ${
                img.status === "ok" ? "border-emerald-400"
                : img.status === "error" ? "border-red-400"
                : img.status === "warning" ? "border-amber-400"
                : "border-gray-200"
              }`}
            >
              <div className="aspect-square bg-gray-100 flex items-center justify-center">
                <Camera size={22} className="text-gray-400" />
              </div>
              {img.status === "ok" && (
                <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                  <CheckCircle2 size={12} className="text-white" />
                </div>
              )}
              {(img.status === "error" || img.status === "warning") && img.errorMsg && (
                <div
                  className={`absolute bottom-0 left-0 right-0 p-2 text-white ${img.status === "error" ? "bg-red-500/90" : "bg-amber-500/90"}`}
                  style={{ fontSize: "0.6rem" }}
                >
                  {img.errorMsg}
                </div>
              )}
              <p className="absolute top-2 left-2 bg-black/50 text-white px-1.5 py-0.5 rounded"
                style={{ fontSize: "0.6rem" }}>
                {img.name.split(".")[0]}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 py-2.5 rounded-xl border border-gray-300 text-gray-600"
          style={{ fontSize: "0.875rem" }}
        >
          Quay lại
        </button>
        <button
          onClick={onNext}
          className="flex-1 bg-gradient-to-r from-violet-500 to-purple-600 text-white py-2.5 rounded-xl font-semibold"
          style={{ fontSize: "0.875rem" }}
        >
          Tiếp theo
        </button>
      </div>
    </motion.div>
  );
}
