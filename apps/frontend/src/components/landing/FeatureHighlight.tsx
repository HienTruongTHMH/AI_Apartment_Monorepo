import React from 'react';
import { Sparkles, Quote, CheckCircle2, Bot } from 'lucide-react';

const SEARCH_FEATURES = [
  'Tìm kiếm nhanh chóng qua mô tả nhu cầu tự nhiên',
  'Đề xuất căn hộ thực tế, thông tin minh bạch đã xác thực',
  'Tối ưu hóa thời gian tìm kiếm lên đến 80%'
];

interface FeatureHighlightProps {
  onCtaClick: () => void;
}

export default function FeatureHighlight({ onCtaClick }: FeatureHighlightProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="rounded-xl bg-white border border-[#E8E8E8] p-8 md:p-12 relative overflow-hidden shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center relative z-10">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[6px] bg-[#FFF5F5] text-[#E03C3D] text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 fill-[#E03C3D]" /> Giải Pháp Tìm Kiếm Đột Phá
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-bold text-[#2C2C2C] leading-tight">
              Tìm Kiếm Bằng Trải Nghiệm Hội Thoại <br />
              <span className="text-[#E03C3D]">&ldquo;Tìm Đúng Nhà - Thuê Đúng Giá&rdquo;</span>
            </h2>

            <div className="relative pl-6 border-l-4 border-[#E03C3D] my-4">
              <Quote className="absolute -top-3 -left-2 w-8 h-8 text-[#E03C3D]/10 -z-10" />
              <p className="text-[#5A5A5A] text-sm italic leading-relaxed">
                &ldquo;Chúng tôi tin rằng việc tìm nhà không nên là một chuỗi ngày dài sàng lọc hàng trăm tin đăng rác. Nền tảng hướng tới việc lắng nghe nhu cầu thực tế của bạn như một người môi giới tận tâm, tìm ra không gian sống phù hợp nhất chỉ qua vài câu hội thoại tự nhiên.&rdquo;
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {SEARCH_FEATURES.map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm text-[#2C2C2C]">
                  <CheckCircle2 className="w-4 h-4 text-[#E03C3D] shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            
            <div className="pt-4">
              <button
                onClick={onCtaClick}
                className="px-6 py-3 rounded-[8px] bg-[#E03C3D] hover:bg-[#C92F30] border-0 text-white font-semibold text-sm transition-colors duration-200 flex items-center gap-2"
              >
                <span>Trò Chuyện Với Trợ Lý Ngay</span>
              </button>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-[#F9F9F9] border border-[#E8E8E8] space-y-4">
            <div className="flex items-center justify-between border-b border-[#E8E8E8] pb-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#2C2C2C]">
                <Bot className="w-4 h-4 text-[#E03C3D]" /> Trợ lý hỗ trợ tìm kiếm căn hộ
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#F2F2F2] text-[#5A5A5A]">Trực tuyến</span>
            </div>
            <div className="p-3 rounded-md bg-white border border-[#E8E8E8] text-sm text-[#2C2C2C]">
              <span className="font-semibold text-[#5A5A5A]">Khách thuê:</span> &quot;Tôi muốn tìm căn hộ Studio tại quận Bình Thạnh tầm giá dưới 15 triệu, ban công rộng thoáng mát.&quot;
            </div>
            <div className="p-3.5 rounded-md bg-[#FFF5F5] border border-red-100 text-sm text-[#2C2C2C] space-y-2">
              <div className="font-bold flex items-center gap-1.5 text-[#E03C3D]">
                <Sparkles className="w-3.5 h-3.5" /> Gợi ý từ hệ thống:
              </div>
              <p>Tôi tìm thấy 2 căn Studio đáp ứng yêu cầu của bạn tại đường Nguyễn Hữu Cảnh, có ban công hướng Đông Nam thoáng mát, giá từ 13.5 triệu/tháng. Bạn có muốn xem chi tiết hình ảnh không?</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
