import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Upload, FileText, CheckCircle2, RefreshCw, ScanLine, User, Mail, MapPin, Hash, Calendar, Shield, Download, Eye } from "lucide-react";

interface OcrField { label: string; value: string; confidence: number; icon: React.ElementType }

const MOCK_CCCD: OcrField[] = [
  { label: "Họ và tên", value: "NGUYỄN VĂN AN", confidence: 99, icon: User },
  { label: "Số CCCD", value: "079 203 012 345", confidence: 99, icon: Hash },
  { label: "Ngày sinh", value: "15/03/1992", confidence: 97, icon: Calendar },
  { label: "Giới tính", value: "Nam", confidence: 99, icon: User },
  { label: "Quê quán", value: "Hà Nội", confidence: 96, icon: MapPin },
  { label: "Thường trú", value: "127 Nguyễn Thị Minh Khai, Q.3, TP.HCM", confidence: 93, icon: MapPin },
  { label: "Hạn sử dụng", value: "15/03/2032", confidence: 98, icon: Calendar },
  { label: "Email (form)", value: "van.an@email.com", confidence: 87, icon: Mail },
];

const MOCK_CONTRACT: OcrField[] = [
  { label: "Số hợp đồng", value: "HD-2025-001", confidence: 99, icon: Hash },
  { label: "Tên bên thuê", value: "Nguyễn Văn An", confidence: 98, icon: User },
  { label: "Địa chỉ thuê", value: "Phòng 1204, Vinhomes Grand Park, TP.HCM", confidence: 95, icon: MapPin },
  { label: "Tiền thuê/tháng", value: "10,500,000 VNĐ", confidence: 99, icon: Hash },
  { label: "Ngày bắt đầu", value: "01/01/2025", confidence: 98, icon: Calendar },
  { label: "Ngày kết thúc", value: "31/12/2025", confidence: 98, icon: Calendar },
  { label: "Tiền đặt cọc", value: "21,000,000 VNĐ (2 tháng)", confidence: 96, icon: Shield },
  { label: "Liên hệ chủ nhà", value: "0901 234 567", confidence: 94, icon: Mail },
];

type DocType = "cccd" | "contract" | "other";
type Phase = "idle" | "uploading" | "scanning" | "done";

const DOC_OPTIONS: { type: DocType; label: string; desc: string; icon: React.ElementType }[] = [
  { type: "cccd", label: "CCCD / Hộ chiếu", desc: "Trích xuất thông tin cá nhân", icon: User },
  { type: "contract", label: "Hợp đồng thuê", desc: "Phân tích điều khoản & dữ liệu", icon: FileText },
  { type: "other", label: "Tài liệu khác", desc: "Hoá đơn, giấy tờ nhà đất", icon: Shield },
];

export function DocScanner({ isDark }: { isDark?: boolean }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [docType, setDocType] = useState<DocType>("cccd");
  const [fileName, setFileName] = useState("");
  const [scanProgress, setScanProgress] = useState(0);
  const [result, setResult] = useState<OcrField[] | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const startScan = async (name: string) => {
    setFileName(name);
    setResult(null);
    setPhase("uploading");
    await tick(800);
    setPhase("scanning");
    for (let i = 0; i <= 100; i += 8) {
      setScanProgress(i);
      await tick(120);
    }
    setScanProgress(100);
    await tick(300);
    setResult(docType === "contract" ? MOCK_CONTRACT : MOCK_CCCD);
    setPhase("done");
  };

  const bg = isDark ? "bg-slate-900" : "bg-white";
  const border = isDark ? "border-slate-700" : "border-gray-100";
  const tp = isDark ? "text-slate-100" : "text-gray-900";
  const ts = isDark ? "text-slate-400" : "text-gray-500";

  return (
    <div className="flex-1 overflow-y-auto">
      <div className={`${bg} border-b ${border} px-6 py-4`}>
        <h2 className={`font-bold ${tp}`} style={{ fontSize: "1.1rem" }}>Quét tài liệu AI (OCR)</h2>
        <p className={ts} style={{ fontSize: "0.75rem" }}>Upload CCCD, hợp đồng, giấy tờ — AI trích xuất thông tin tự động</p>
      </div>

      <div className="p-6 max-w-2xl mx-auto space-y-5">
        {/* Doc type selector */}
        <div className="grid grid-cols-3 gap-3">
          {DOC_OPTIONS.map(({ type, label, desc, icon: Icon }) => (
            <button key={type} onClick={() => { setDocType(type); setPhase("idle"); setResult(null); }}
              className={`rounded-2xl border p-4 text-left transition-all ${docType === type ? "border-violet-400 bg-violet-50" : isDark ? `border-slate-700 ${bg} hover:border-slate-500` : `border-gray-200 ${bg} hover:border-violet-300`}`}>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-2 ${docType === type ? "bg-violet-100" : isDark ? "bg-slate-800" : "bg-gray-100"}`}>
                <Icon size={15} className={docType === type ? "text-violet-600" : ts} />
              </div>
              <p className={`font-semibold ${docType === type ? "text-violet-700" : tp}`} style={{ fontSize: "0.78rem" }}>{label}</p>
              <p className={docType === type ? "text-violet-500" : ts} style={{ fontSize: "0.65rem" }}>{desc}</p>
            </button>
          ))}
        </div>

        {/* Upload zone */}
        {phase === "idle" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <input ref={fileRef} type="file" accept="image/*,.pdf" className="hidden"
              onChange={(e) => e.target.files?.[0] && startScan(e.target.files[0].name)} />
            <button onClick={() => fileRef.current?.click()}
              className={`w-full rounded-2xl border-2 border-dashed py-10 flex flex-col items-center gap-3 transition-all ${isDark ? "border-slate-600 hover:border-violet-500 bg-slate-800/30" : "border-gray-300 hover:border-violet-400 hover:bg-violet-50/30"}`}>
              <div className="w-14 h-14 rounded-2xl bg-violet-100 flex items-center justify-center">
                <Upload size={24} className="text-violet-500" />
              </div>
              <div className="text-center">
                <p className={`font-semibold ${tp}`} style={{ fontSize: "0.9rem" }}>Kéo thả hoặc click để upload</p>
                <p className={ts} style={{ fontSize: "0.75rem" }}>PNG, JPG, PDF — tối đa 10MB</p>
              </div>
              <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-600 text-white" style={{ fontSize: "0.8rem", fontWeight: 600 }}>
                <ScanLine size={14} /> Chọn tài liệu
              </div>
            </button>

            {/* Demo button */}
            <button onClick={() => startScan(docType === "contract" ? "hop-dong-thue-2025.pdf" : "cccd-nguyen-van-an.jpg")}
              className={`mt-3 w-full py-2.5 rounded-xl border font-medium transition-colors ${isDark ? "border-slate-600 text-slate-400 hover:border-violet-500 hover:text-violet-400" : "border-gray-200 text-gray-500 hover:border-violet-400 hover:text-violet-600"}`}
              style={{ fontSize: "0.82rem" }}>
              ✦ Dùng tài liệu mẫu để xem demo
            </button>
          </motion.div>
        )}

        {/* Scanning progress */}
        <AnimatePresence>
          {(phase === "uploading" || phase === "scanning") && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className={`${bg} rounded-2xl border ${border} p-6 space-y-4`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center flex-shrink-0">
                  <FileText size={18} className="text-violet-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold truncate ${tp}`} style={{ fontSize: "0.875rem" }}>{fileName}</p>
                  <p className="text-violet-600" style={{ fontSize: "0.72rem" }}>
                    {phase === "uploading" ? "Đang tải lên…" : "AI đang quét & trích xuất…"}
                  </p>
                </div>
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}>
                  <RefreshCw size={16} className="text-violet-500" />
                </motion.div>
              </div>

              {phase === "scanning" && (
                <>
                  {/* Scan line animation */}
                  <div className={`relative h-24 rounded-xl overflow-hidden ${isDark ? "bg-slate-800" : "bg-gray-100"}`}>
                    <motion.div
                      animate={{ y: ["0%", "400%"] }}
                      transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
                      className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-violet-500 to-transparent"
                      style={{ boxShadow: "0 0 12px rgba(139,92,246,0.8)" }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <ScanLine size={28} className="text-violet-300/30" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className={ts} style={{ fontSize: "0.72rem" }}>Tiến độ OCR</span>
                      <span className="text-violet-600 font-bold" style={{ fontSize: "0.72rem" }}>{scanProgress}%</span>
                    </div>
                    <div className={`h-2 rounded-full overflow-hidden ${isDark ? "bg-slate-700" : "bg-gray-200"}`}>
                      <motion.div animate={{ width: `${scanProgress}%` }} transition={{ ease: "easeOut" }}
                        className="h-2 rounded-full bg-gradient-to-r from-violet-500 to-purple-400" />
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* OCR results */}
        <AnimatePresence>
          {phase === "done" && result && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              {/* Success banner */}
              <div className="rounded-2xl p-4 flex items-center gap-3" style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.25)" }}>
                <CheckCircle2 size={20} className="text-emerald-500 flex-shrink-0" />
                <div>
                  <p className="font-bold text-emerald-700" style={{ fontSize: "0.875rem" }}>Trích xuất thành công!</p>
                  <p className="text-emerald-600" style={{ fontSize: "0.72rem" }}>{result.length} trường dữ liệu · Độ chính xác trung bình {Math.round(result.reduce((a, b) => a + b.confidence, 0) / result.length)}%</p>
                </div>
                <div className="ml-auto flex gap-2">
                  <button className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-700 font-medium flex items-center gap-1.5 hover:bg-emerald-200 transition-colors" style={{ fontSize: "0.75rem" }}>
                    <Eye size={12} /> Xem
                  </button>
                  <button className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-medium flex items-center gap-1.5 hover:bg-emerald-700 transition-colors" style={{ fontSize: "0.75rem" }}>
                    <Download size={12} /> Xuất
                  </button>
                </div>
              </div>

              {/* Fields table */}
              <div className={`${bg} rounded-2xl border ${border} overflow-hidden shadow-sm`}>
                <div className={`px-5 py-3 border-b ${border}`}>
                  <p className={`font-bold ${tp}`} style={{ fontSize: "0.85rem" }}>Dữ liệu trích xuất</p>
                </div>
                <div className="divide-y" style={{ borderColor: isDark ? "#1e293b" : "#f1f5f9" }}>
                  {result.map(({ label, value, confidence, icon: Icon }, i) => (
                    <motion.div key={label} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                      className="flex items-center gap-4 px-5 py-3">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${isDark ? "bg-slate-800" : "bg-gray-100"}`}>
                        <Icon size={13} className="text-violet-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={ts} style={{ fontSize: "0.68rem" }}>{label}</p>
                        <p className={`font-semibold truncate ${tp}`} style={{ fontSize: "0.84rem" }}>{value}</p>
                      </div>
                      <div className="flex flex-col items-end gap-0.5">
                        <span className="font-bold" style={{ fontSize: "0.65rem", color: confidence >= 95 ? "#10b981" : confidence >= 85 ? "#f59e0b" : "#ef4444" }}>
                          {confidence}%
                        </span>
                        <div className="w-12 h-1 rounded-full overflow-hidden bg-gray-200">
                          <div className="h-1 rounded-full" style={{ width: `${confidence}%`, background: confidence >= 95 ? "#10b981" : confidence >= 85 ? "#f59e0b" : "#ef4444" }} />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <button onClick={() => { setPhase("idle"); setResult(null); }}
                className={`w-full py-2.5 rounded-xl border font-medium transition-colors ${isDark ? "border-slate-600 text-slate-400 hover:border-slate-500" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}
                style={{ fontSize: "0.82rem" }}>
                Quét tài liệu khác
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function tick(ms: number) { return new Promise((r) => setTimeout(r, ms)); }
