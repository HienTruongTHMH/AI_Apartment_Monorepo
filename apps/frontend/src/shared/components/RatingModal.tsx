import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Star, X, CheckCircle2, ThumbsUp, Building2, User } from "lucide-react";

interface RatingModalProps {
  targetName: string;
  targetRole: "landlord" | "tenant";
  onClose: () => void;
  onSubmit?: (rating: number, review: string) => void;
}

const CATEGORIES = [
  { key: "clean", label: "Vệ sinh" },
  { key: "response", label: "Phản hồi nhanh" },
  { key: "accurate", label: "Đúng mô tả" },
  { key: "value", label: "Giá trị" },
];

const TENANT_CATEGORIES = [
  { key: "payment", label: "Thanh toán đúng hạn" },
  { key: "care", label: "Giữ gìn tài sản" },
  { key: "behavior", label: "Cư xử tốt" },
  { key: "communicate", label: "Liên lạc tốt" },
];

export function RatingModal({ targetName, targetRole, onClose, onSubmit }: RatingModalProps) {
  const [overallRating, setOverallRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [catRatings, setCatRatings] = useState<Record<string, number>>({});
  const [review, setReview] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const cats = targetRole === "landlord" ? CATEGORIES : TENANT_CATEGORIES;

  const handleSubmit = async () => {
    if (overallRating === 0) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
    onSubmit?.(overallRating, review);
    setTimeout(onClose, 2200);
  };

  const displayRating = hoverRating || overallRating;
  const ratingLabels = ["", "Tệ", "Không tốt", "Bình thường", "Tốt", "Xuất sắc"];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[999] flex items-center justify-center p-4"
        style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 16 }}
          transition={{ type: "spring", stiffness: 300, damping: 26 }}
          className="w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {submitted ? (
            <div className="p-8 text-center">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 18 }}>
                <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-5">
                  <CheckCircle2 size={36} className="text-emerald-500" />
                </div>
              </motion.div>
              <h3 className="text-gray-900 font-bold mb-2" style={{ fontSize: "1.2rem" }}>Cảm ơn đánh giá của bạn!</h3>
              <p className="text-gray-500 mb-1" style={{ fontSize: "0.875rem" }}>
                Đánh giá của bạn giúp xây dựng cộng đồng NestaVietAI tin cậy hơn.
              </p>
              <div className="flex justify-center mt-3">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={20} fill={s <= overallRating ? "#fbbf24" : "none"}
                    stroke={s <= overallRating ? "#fbbf24" : "#d1d5db"} />
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${targetRole === "landlord" ? "bg-violet-100" : "bg-emerald-100"}`}>
                    {targetRole === "landlord" ? <Building2 size={18} className="text-violet-600" /> : <User size={18} className="text-emerald-600" />}
                  </div>
                  <div>
                    <p className="text-gray-900 font-bold" style={{ fontSize: "0.9rem" }}>
                      Đánh giá {targetRole === "landlord" ? "chủ nhà" : "cư dân"}
                    </p>
                    <p className="text-gray-500" style={{ fontSize: "0.72rem" }}>{targetName}</p>
                  </div>
                </div>
                <button onClick={onClose} className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors">
                  <X size={14} />
                </button>
              </div>

              <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
                {/* Overall stars */}
                <div className="text-center">
                  <p className="text-gray-500 mb-3" style={{ fontSize: "0.82rem" }}>Đánh giá tổng thể</p>
                  <div className="flex justify-center gap-2 mb-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <motion.button key={s}
                        whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}
                        onMouseEnter={() => setHoverRating(s)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setOverallRating(s)}>
                        <Star size={32}
                          fill={s <= displayRating ? "#fbbf24" : "none"}
                          stroke={s <= displayRating ? "#fbbf24" : "#d1d5db"}
                          className="transition-all" />
                      </motion.button>
                    ))}
                  </div>
                  <AnimatePresence mode="wait">
                    {displayRating > 0 && (
                      <motion.p key={displayRating} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="text-amber-600 font-bold" style={{ fontSize: "0.875rem" }}>
                        {ratingLabels[displayRating]}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Category ratings */}
                <div>
                  <p className="text-gray-700 font-bold mb-3" style={{ fontSize: "0.82rem" }}>Đánh giá từng tiêu chí</p>
                  <div className="space-y-3">
                    {cats.map(({ key, label }) => {
                      const val = catRatings[key] || 0;
                      return (
                        <div key={key} className="flex items-center justify-between">
                          <span className="text-gray-600" style={{ fontSize: "0.8rem" }}>{label}</span>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <button key={s} onClick={() => setCatRatings((r) => ({ ...r, [key]: s }))}>
                                <Star size={16}
                                  fill={s <= val ? "#fbbf24" : "none"}
                                  stroke={s <= val ? "#fbbf24" : "#d1d5db"}
                                  className="transition-all hover:scale-110" />
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Review text */}
                <div>
                  <p className="text-gray-700 font-bold mb-2" style={{ fontSize: "0.82rem" }}>Nhận xét</p>
                  <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="Chia sẻ trải nghiệm của bạn… (không bắt buộc)"
                    rows={3}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-800 placeholder-gray-400 outline-none focus:border-violet-400 transition-colors resize-none"
                    style={{ fontSize: "0.84rem" }}
                  />
                  <p className="text-gray-400 text-right mt-1" style={{ fontSize: "0.65rem" }}>{review.length}/500</p>
                </div>

                {/* Submit */}
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleSubmit}
                  disabled={overallRating === 0 || loading}
                  className="w-full py-3.5 rounded-2xl text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
                  style={{ background: "linear-gradient(135deg,#8b5cf6,#6366f1)", fontSize: "0.9rem" }}>
                  {loading
                    ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-4 h-4 rounded-full border-2 border-white border-t-transparent" />
                    : <><ThumbsUp size={16} />Gửi đánh giá</>}
                </motion.button>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
