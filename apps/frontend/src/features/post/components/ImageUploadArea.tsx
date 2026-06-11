import { useRef, useState } from "react";
import { Camera, X, Star, RefreshCw } from "lucide-react";

interface ImageUploadAreaProps {
  images: (File | null)[];
  onImageChange: (index: number, file: File | null) => void;
}

export default function ImageUploadArea({ images, onImageChange }: ImageUploadAreaProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-3 gap-3">
        {images.map((file, index) => {
          const isCover = index === 0;
          const isHovered = hovered === index;

          return (
            <div key={index} className="flex flex-col gap-1.5">
              <div
                className="relative flex items-center justify-center rounded-xl overflow-hidden cursor-pointer transition-all group"
                style={{
                  width: "100%",
                  height: "130px",
                  border: file
                    ? "1px solid rgba(34,211,238,0.35)"
                    : isCover
                      ? "1.5px dashed rgba(34,211,238,0.4)"
                      : "1px dashed rgba(255,255,255,0.12)",
                  background: file ? "transparent" : isCover ? "rgba(34,211,238,0.04)" : "rgba(255,255,255,0.025)",
                }}
                onClick={() => !file && inputRefs.current[index]?.click()}
                onMouseEnter={() => setHovered(index)}
                onMouseLeave={() => setHovered(null)}
              >
                {file ? (
                  <>
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`preview-${index}`}
                      className="w-full h-full object-cover"
                    />
                    {/* Hover overlay */}
                    <div
                      className="absolute inset-0 flex items-center justify-center gap-2 transition-opacity"
                      style={{ background: "rgba(0,0,0,0.55)", opacity: isHovered ? 1 : 0 }}>
                      <button
                        onClick={(e) => { e.stopPropagation(); inputRefs.current[index]?.click(); }}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-white"
                        style={{ background: "rgba(34,211,238,0.25)", border: "1px solid rgba(34,211,238,0.4)", fontSize: "0.7rem" }}>
                        <RefreshCw size={11} />Đổi
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); onImageChange(index, null); }}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-white"
                        style={{ background: "rgba(239,68,68,0.25)", border: "1px solid rgba(239,68,68,0.4)", fontSize: "0.7rem" }}>
                        <X size={11} />Xoá
                      </button>
                    </div>
                    {/* Cover badge on filled slot */}
                    {isCover && (
                      <div className="absolute top-1.5 left-1.5 flex items-center gap-0.5 px-1.5 py-0.5 rounded-md"
                        style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)" }}>
                        <Star size={9} className="text-amber-400 fill-amber-400" />
                        <span className="text-white" style={{ fontSize: "0.6rem", fontWeight: 600 }}>Bìa</span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-1.5">
                    {isCover
                      ? <Star size={20} className="text-cyan-400/40" />
                      : <Camera size={18} className="text-white/20" />
                    }
                    <span style={{ fontSize: "0.72rem", color: isCover ? "rgba(34,211,238,0.5)" : "rgba(255,255,255,0.2)", fontWeight: isCover ? 500 : 400 }}>
                      {isCover ? "Ảnh bìa" : "Thêm ảnh"}
                    </span>
                    <span style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.15)" }}>Click để chọn</span>
                  </div>
                )}
              </div>

              <input
                ref={(el) => { inputRefs.current[index] = el; }}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) onImageChange(index, f);
                  e.target.value = "";
                }}
              />
            </div>
          );
        })}
      </div>
      <p className="text-white/20" style={{ fontSize: "0.7rem" }}>
        Ảnh bìa sẽ hiển thị đầu tiên trong kết quả tìm kiếm · Tối đa 6 ảnh
      </p>
    </div>
  );
}
