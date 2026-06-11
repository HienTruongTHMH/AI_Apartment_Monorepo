import { ImageIcon } from "lucide-react";

interface ListingImageGalleryProps {
  images: string[];
  activeIndex: number;
  onSelect: (i: number) => void;
}

export function ListingImageGallery({ images, activeIndex, onSelect }: ListingImageGalleryProps) {
  if (images.length === 0) {
    return (
      <div className="w-full h-80 lg:h-[440px] rounded-2xl border border-white/8 flex flex-col items-center justify-center gap-3 mb-4"
        style={{ background: "rgba(255,255,255,0.03)" }}>
        <ImageIcon size={40} className="text-white/15" />
        <p className="text-white/25" style={{ fontSize: "0.82rem" }}>Chưa có ảnh</p>
      </div>
    );
  }

  return (
    <div className="mb-4">
      {/* Main image */}
      <div className="relative w-full h-80 lg:h-[440px] rounded-2xl overflow-hidden mb-3 border border-white/8">
        <img src={images[activeIndex]} alt={`Ảnh ${activeIndex + 1}`}
          className="w-full h-full object-cover" />
        <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg text-white/70"
          style={{ background: "rgba(0,0,0,0.55)", fontSize: "0.72rem", backdropFilter: "blur(8px)" }}>
          {activeIndex + 1}/{images.length}
        </div>
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {images.map((src, i) => (
          <button key={i} onClick={() => onSelect(i)}
            className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
              i === activeIndex ? "border-cyan-400" : "border-transparent opacity-55 hover:opacity-80"
            }`}>
            <img src={src} alt={`Thumb ${i + 1}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
