import { motion } from "motion/react";
import { Bot, CheckCircle2, AlertTriangle, Info } from "lucide-react";
import type { VerifyListingData } from "@features/ai-service/listingVerifier";

export interface ExtractedData {
  entities: { label: string; value: string; confidence: number }[];
  seoTitle: string;
  seoDescription: string;
  seoScore: number;
  amenities?: VerifyListingData["apartment_meta"]["amenities"];
  imageTags?: string[];
  validationStatus?: "Pass" | "Fail";
  feedback?: string;
  issues?: string[];
  missingFields?: string[];
  isReal?: boolean;
}

export interface VerificationPanelProps {
  extractedData: ExtractedData;
  onApplySuggestion: (field: string, value: string) => void;
}

export function VerificationPanel({ extractedData, onApplySuggestion }: VerificationPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-violet-200 overflow-hidden"
      style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.04), rgba(99,102,241,0.02))" }}
    >
      {/* Header */}
      <div className="px-5 py-3 border-b border-violet-100 flex items-center justify-between"
        style={{ background: "rgba(139,92,246,0.06)" }}>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-violet-100 flex items-center justify-center">
            <Bot size={12} className="text-violet-600" />
          </div>
          <span className="text-violet-700 font-bold" style={{ fontSize: "0.8rem" }}>
            Listing Verifier — NLP Extraction
          </span>
          <span
            className="px-2 py-0.5 rounded-full font-bold"
            style={{
              fontSize: "0.6rem",
              background: extractedData.isReal ? "linear-gradient(90deg,#7c3aed,#4f46e5)" : "#e5e7eb",
              color: extractedData.isReal ? "#fff" : "#6b7280",
            }}
          >
            {extractedData.isReal ? "✦ AI Thật • Gemini 2.5-Flash" : "Demo Mode"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {extractedData.validationStatus && (
            <span
              className="px-2 py-0.5 rounded-full font-bold flex items-center gap-1"
              style={{
                fontSize: "0.65rem",
                background: extractedData.validationStatus === "Pass" ? "#dcfce7" : "#fee2e2",
                color: extractedData.validationStatus === "Pass" ? "#166534" : "#991b1b",
              }}
            >
              {extractedData.validationStatus === "Pass" ? <CheckCircle2 size={10} /> : <AlertTriangle size={10} />}
              {extractedData.validationStatus === "Pass" ? "Hợp lệ" : "Cần sửa"}
            </span>
          )}
          <span className="text-violet-500" style={{ fontSize: "0.65rem" }}>SEO</span>
          <span
            className="px-2 py-0.5 rounded-full font-bold"
            style={{
              fontSize: "0.72rem",
              background: extractedData.seoScore >= 80 ? "#dcfce7" : extractedData.seoScore >= 60 ? "#fef9c3" : "#fee2e2",
              color: extractedData.seoScore >= 80 ? "#166534" : extractedData.seoScore >= 60 ? "#854d0e" : "#991b1b",
            }}
          >
            {extractedData.seoScore}/100
          </span>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Feedback banner */}
        {extractedData.feedback && (
          <div className="rounded-xl border px-4 py-3 flex items-start gap-3"
            style={{
              background: extractedData.validationStatus === "Pass" ? "rgba(16,185,129,0.05)" : "rgba(245,158,11,0.05)",
              borderColor: extractedData.validationStatus === "Pass" ? "#a7f3d0" : "#fde68a",
            }}>
            <Info size={14} className="flex-shrink-0 mt-0.5"
              style={{ color: extractedData.validationStatus === "Pass" ? "#059669" : "#d97706" }} />
            <p style={{ fontSize: "0.78rem", lineHeight: 1.6, color: extractedData.validationStatus === "Pass" ? "#065f46" : "#92400e" }}>
              <span className="font-bold">Gemini: </span>{extractedData.feedback}
            </p>
          </div>
        )}

        {/* Entities grid */}
        <div>
          <p className="text-gray-400 font-bold mb-2" style={{ fontSize: "0.65rem", letterSpacing: "0.08em" }}>
            THỰC THỂ TRÍCH XUẤT (NLP)
          </p>
          <div className="grid grid-cols-2 gap-2">
            {extractedData.entities.map(({ label, value, confidence }) => (
              <div key={label} className="rounded-xl bg-white border border-gray-100 px-3 py-2.5 shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-gray-400" style={{ fontSize: "0.62rem" }}>{label}</span>
                  <span
                    className="font-bold"
                    style={{
                      fontSize: "0.6rem",
                      color: confidence >= 80 ? "#10b981" : confidence >= 50 ? "#f59e0b" : "#ef4444",
                    }}
                  >
                    {confidence}%
                  </span>
                </div>
                <p className="text-gray-800 font-semibold" style={{ fontSize: "0.78rem" }}>{value}</p>
                <div className="mt-1.5 h-1 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-1 rounded-full transition-all"
                    style={{
                      width: `${confidence}%`,
                      background: confidence >= 80
                        ? "linear-gradient(90deg,#10b981,#34d399)"
                        : confidence >= 50
                        ? "linear-gradient(90deg,#f59e0b,#fbbf24)"
                        : "linear-gradient(90deg,#ef4444,#f87171)",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Amenities */}
        {extractedData.amenities && extractedData.amenities.length > 0 && (
          <div>
            <p className="text-gray-400 font-bold mb-2" style={{ fontSize: "0.65rem", letterSpacing: "0.08em" }}>
              TIỆN ÍCH PHÁT HIỆN (GEMINI)
            </p>
            {(["Furniture", "Building", "Policy"] as const).map((cat) => {
              const items = extractedData.amenities!.filter((a) => a.category === cat);
              if (!items.length) return null;
              const catLabel = cat === "Furniture" ? "Nội thất" : cat === "Building" ? "Toà nhà" : "Chính sách";
              const catColor = cat === "Furniture" ? "#7c3aed" : cat === "Building" ? "#0284c7" : "#059669";
              const catBg = cat === "Furniture" ? "rgba(124,58,237,0.08)" : cat === "Building" ? "rgba(2,132,199,0.08)" : "rgba(5,150,105,0.08)";
              return (
                <div key={cat} className="mb-2">
                  <span className="inline-flex items-center gap-1 mb-1.5 px-2 py-0.5 rounded-full font-semibold"
                    style={{ fontSize: "0.6rem", background: catBg, color: catColor }}>
                    {catLabel}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {items.map((a) => (
                      <span key={a.amenities_name}
                        className="px-2.5 py-1 rounded-lg bg-white border text-gray-700 font-medium"
                        style={{ fontSize: "0.72rem", borderColor: `${catColor}30` }}>
                        {a.amenities_name}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Image tags */}
        {extractedData.imageTags && extractedData.imageTags.length > 0 && (
          <div>
            <p className="text-gray-400 font-bold mb-2" style={{ fontSize: "0.65rem", letterSpacing: "0.08em" }}>
              GỢI Ý TAG ẢNH (AI)
            </p>
            <div className="flex flex-wrap gap-1.5">
              {extractedData.imageTags.map((tag) => (
                <span key={tag}
                  className="px-2.5 py-1 rounded-lg font-medium"
                  style={{ fontSize: "0.7rem", background: "rgba(139,92,246,0.1)", color: "#5b21b6" }}>
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* SEO Title */}
        <div>
          <p className="text-gray-400 font-bold mb-2" style={{ fontSize: "0.65rem", letterSpacing: "0.08em" }}>
            TIÊU ĐỀ SEO TỰ ĐỘNG
          </p>
          <div className="rounded-xl bg-white border border-emerald-200 px-4 py-3 flex items-center justify-between gap-3">
            <p className="text-gray-800 font-semibold flex-1" style={{ fontSize: "0.82rem", lineHeight: 1.4 }}>
              {extractedData.seoTitle}
            </p>
            <button
              onClick={() => onApplySuggestion("title", extractedData.seoTitle)}
              className="flex-shrink-0 text-emerald-600 hover:text-emerald-700 font-semibold px-2.5 py-1 rounded-lg hover:bg-emerald-50 transition-colors"
              style={{ fontSize: "0.7rem" }}
            >
              Dùng ngay
            </button>
          </div>
        </div>

        {/* SEO Description */}
        <div>
          <p className="text-gray-400 font-bold mb-2" style={{ fontSize: "0.65rem", letterSpacing: "0.08em" }}>
            MÔ TẢ SEO TỰ ĐỘNG
          </p>
          <div className="rounded-xl bg-white border border-emerald-200 px-4 py-3 flex items-start justify-between gap-3">
            <p className="text-gray-700 flex-1" style={{ fontSize: "0.78rem", lineHeight: 1.65 }}>
              {extractedData.seoDescription}
            </p>
            <button
              onClick={() => onApplySuggestion("description", extractedData.seoDescription)}
              className="flex-shrink-0 text-emerald-600 hover:text-emerald-700 font-semibold px-2.5 py-1 rounded-lg hover:bg-emerald-50 transition-colors mt-0.5"
              style={{ fontSize: "0.7rem" }}
            >
              Dùng ngay
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
