import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ChevronRight, ChevronLeft, Sparkles } from "lucide-react";

interface OnboardingTourProps {
  onComplete: () => void;
  role: "tenant" | "landlord";
}

const TENANT_STEPS = [
  { emoji: "🏙️", title: "Chào mừng đến NestaVietAI!", desc: "Nền tảng tìm nhà & quản lý căn hộ thông minh nhất TP.HCM. Hãy để chúng tôi dẫn bạn qua các tính năng chính.", grad: "from-cyan-500 to-blue-500" },
  { emoji: "🤖", title: "AI Super Broker — Tìm nhà bằng tiếng Việt", desc: 'Nhắn tin tự nhiên: "tìm 2PN gần Q1 dưới 12M, có thú cưng" — AI tự hiểu và gợi ý chính xác 24/7.', grad: "from-emerald-500 to-teal-500" },
  { emoji: "🗺️", title: "Bản đồ căn hộ TP.HCM", desc: "Xem toàn bộ căn hộ trên bản đồ tương tác. Lọc theo quận, giá, tiện ích. Click vào pin để xem chi tiết.", grad: "from-violet-500 to-purple-500" },
  { emoji: "💰", title: "AI Ước tính giá thuê", desc: "Nhập địa chỉ và số phòng ngủ — AI phân tích market data TP.HCM và gợi ý mức giá hợp lý nhất.", grad: "from-amber-500 to-orange-500" },
  { emoji: "✅", title: "Sẵn sàng khám phá!", desc: "Bạn có thể quay lại hướng dẫn này bất cứ lúc nào trong Hồ sơ → Trợ giúp. Chúc bạn tìm được ngôi nhà ưng ý!", grad: "from-pink-500 to-rose-500" },
];

const LANDLORD_STEPS = [
  { emoji: "🏢", title: "Chào mừng đến bảng quản lý!", desc: "4 AI Agents tự động hóa toàn bộ quy trình cho thuê — từ kiểm duyệt tin đăng đến xuất hóa đơn.", grad: "from-violet-500 to-purple-500" },
  { emoji: "🤖", title: "Listing Verifier AI", desc: "Đăng tin bằng ngôn ngữ tự nhiên. AI kiểm duyệt, tạo SEO title & description, gắn tag ảnh tự động.", grad: "from-blue-500 to-cyan-500" },
  { emoji: "📅", title: "Lịch bảo trì thông minh", desc: "Quản lý lịch bảo trì toà nhà, phân công kỹ thuật viên, theo dõi SLA real-time với Smart Concierge AI.", grad: "from-amber-500 to-orange-500" },
  { emoji: "📊", title: "Dashboard & Báo cáo", desc: "Doanh thu real-time, tỷ lệ lấp đầy, phân tích xu hướng và xuất báo cáo PDF/Excel.", grad: "from-emerald-500 to-teal-500" },
  { emoji: "🚀", title: "Sẵn sàng quản lý!", desc: "4 AI Agents đang hoạt động 24/7. Kiểm tra tab AI Agents để theo dõi từng agent theo thời gian thực.", grad: "from-pink-500 to-rose-500" },
];

export function OnboardingTour({ onComplete, role }: OnboardingTourProps) {
  const [step, setStep] = useState(0);
  const steps = role === "tenant" ? TENANT_STEPS : LANDLORD_STEPS;
  const current = steps[step];
  const isLast = step === steps.length - 1;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center p-6"
        style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(10px)" }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 28, scale: 0.93 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="w-full max-w-md rounded-3xl border border-white/12 shadow-2xl overflow-hidden"
            style={{ background: "rgba(10,16,30,0.96)", backdropFilter: "blur(28px)" }}
          >
            {/* Gradient strip */}
            <div className={`h-1.5 bg-gradient-to-r ${current.grad}`} />

            {/* Close button */}
            <div className="flex justify-between items-center px-6 pt-5 pb-1">
              <div className={`text-xs font-bold px-2.5 py-1 rounded-full bg-gradient-to-r ${current.grad} bg-opacity-15`}
                style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.65rem", letterSpacing: "0.1em" }}>
                BƯỚC {step + 1} / {steps.length}
              </div>
              <button onClick={onComplete}
                className="w-7 h-7 rounded-full bg-white/8 hover:bg-white/15 flex items-center justify-center text-white/40 hover:text-white/70 transition-colors">
                <X size={13} />
              </button>
            </div>

            {/* Content */}
            <div className="px-8 pb-8 pt-2 text-center">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.08, type: "spring", stiffness: 400, damping: 20 }}
                className="text-5xl mb-5"
              >
                {current.emoji}
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 }}
                className="text-white font-bold mb-3"
                style={{ fontSize: "1.25rem", lineHeight: 1.3 }}
              >
                {current.title}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.16 }}
                className="text-white/50 mb-7"
                style={{ fontSize: "0.875rem", lineHeight: 1.75 }}
              >
                {current.desc}
              </motion.p>

              {/* Progress dots */}
              <div className="flex justify-center gap-1.5 mb-7">
                {steps.map((_, i) => (
                  <motion.button
                    key={i}
                    onClick={() => setStep(i)}
                    animate={{
                      width: i === step ? 24 : 6,
                      background: i === step ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.18)",
                    }}
                    transition={{ duration: 0.25 }}
                    className="h-1.5 rounded-full cursor-pointer"
                  />
                ))}
              </div>

              {/* Navigation */}
              <div className="flex gap-3">
                {step > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    onClick={() => setStep((s) => s - 1)}
                    className="flex-none w-12 py-3 rounded-2xl border border-white/12 text-white/50 hover:border-white/25 hover:text-white/80 transition-all flex items-center justify-center"
                  >
                    <ChevronLeft size={16} />
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  onClick={() => (isLast ? onComplete() : setStep((s) => s + 1))}
                  className={`flex-1 py-3 rounded-2xl text-white font-semibold flex items-center justify-center gap-2 transition-all bg-gradient-to-r ${current.grad}`}
                  style={{ fontSize: "0.9rem", boxShadow: "0 4px 20px rgba(0,0,0,0.3)" }}
                >
                  {isLast ? <><Sparkles size={15} />Bắt đầu!</> : <>Tiếp theo <ChevronRight size={15} /></>}
                </motion.button>
              </div>

              <button onClick={onComplete} className="mt-4 text-white/25 hover:text-white/50 transition-colors" style={{ fontSize: "0.75rem" }}>
                Bỏ qua hướng dẫn
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}
