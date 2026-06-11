import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Network, FileText, Bot, Wrench, DollarSign,
} from "lucide-react";

const AGENT_DEFS = [
  {
    name: "Listing Verifier", desc: "Kiểm duyệt tin đăng bằng NLP & CV",
    gradient: "from-blue-500 to-cyan-500", color: "#3b82f6",
    Icon: FileText,
    metrics: [{ k: "Hôm nay", v: "234 tin" }, { k: "Chính xác", v: "98.2%" }, { k: "Tốc độ", v: "1.8s" }],
    logs: ["Duyệt #L-2204 — NLP OK, 4/4 ảnh đạt", "Từ chối #L-2205 — thiếu ảnh toilet", "Đang xử lý #L-2206..."],
  },
  {
    name: "Super Broker", desc: "Tư vấn tìm nhà bằng RAG + Semantic",
    gradient: "from-emerald-500 to-teal-500", color: "#10b981",
    Icon: Bot,
    metrics: [{ k: "Phiên hôm nay", v: "1,204" }, { k: "Chốt HĐ", v: "62%" }, { k: "Reply", v: "1.2s" }],
    logs: ["Tư vấn 2PN Q7 → 3 gợi ý RAG", "Chốt lịch hẹn T7 cho Nguyễn An", "Query: pet-friendly <12M/tháng"],
  },
  {
    name: "Smart Concierge", desc: "Xử lý sự cố & ticket vận hành 24/7",
    gradient: "from-violet-500 to-purple-500", color: "#8b5cf6",
    Icon: Wrench,
    metrics: [{ k: "Hôm nay", v: "89 tickets" }, { k: "SLA đạt", v: "97.8%" }, { k: "Chờ", v: "3" }],
    logs: ["T001: Gán kỹ thuật Minh — ETA 2h", "T002: Điện thoại xác nhận", "SLA alert: T003 còn 30p"],
  },
  {
    name: "Contract Agent", desc: "Quản lý HĐ, hóa đơn & VietQR",
    gradient: "from-amber-500 to-orange-500", color: "#f59e0b",
    Icon: DollarSign,
    metrics: [{ k: "HĐ tháng", v: "156" }, { k: "Đã TT", v: "142" }, { k: "Lỗi", v: "0" }],
    logs: ["Xuất INV-0425 → 156 hóa đơn", "VietQR gửi email xong 100%", "HĐ phòng 805 hết hạn 30 ngày"],
  },
];

export default function AgentsTab() {
  const [aiTick, setAiTick] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    const t = setInterval(() => setAiTick((i) => i + 1), 2200);
    return () => clearInterval(t);
  }, []);

  const activeIdx = aiTick % 4;

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      <div className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
            <Network size={16} className="text-white" />
          </div>
          <div>
            <h2 className="text-gray-900 font-bold" style={{ fontSize: "1.1rem" }}>Multi-Agent System</h2>
            <p className="text-gray-400" style={{ fontSize: "0.75rem" }}>4 AI Agents — LangGraph + Agent SDK</p>
          </div>
          <div className="ml-auto flex items-center gap-2 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full">
            <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 1.4 }}
              className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-emerald-700" style={{ fontSize: "0.68rem", fontWeight: 600 }}>ALL SYSTEMS OPERATIONAL</span>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-5">
        {/* Agent cards 2×2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {AGENT_DEFS.map((ag, i) => {
            const { Icon } = ag;
            const isActive = activeIdx === i;
            const isSelected = selected === i;
            return (
              <motion.div key={ag.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.09, type: "spring", stiffness: 200, damping: 22 }}
                whileHover={{ y: -4, transition: { duration: 0.18 } }}
                onClick={() => setSelected(isSelected ? null : i)}
                className="bg-white rounded-2xl border shadow-sm cursor-pointer overflow-hidden"
                style={{ borderColor: isSelected ? ag.color : undefined, borderWidth: isSelected ? 2 : 1 }}
              >
                {/* Gradient header */}
                <div className={`bg-gradient-to-br ${ag.gradient} p-5`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <motion.div
                        className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center"
                        animate={isActive ? { boxShadow: [`0 0 0px ${ag.color}00`, `0 0 18px ${ag.color}99`, `0 0 0px ${ag.color}00`] } : {}}
                        transition={{ repeat: Infinity, duration: 2 }}
                      >
                        <Icon size={18} className="text-white" />
                      </motion.div>
                      <div>
                        <p className="text-white font-bold" style={{ fontSize: "0.95rem" }}>{ag.name}</p>
                        <p className="text-white/70" style={{ fontSize: "0.7rem" }}>{ag.desc}</p>
                      </div>
                    </div>
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${isActive ? "bg-white/30" : "bg-white/15"}`}
                      style={{ fontSize: "0.62rem", color: "white", fontWeight: 600 }}>
                      <motion.div className="w-1.5 h-1.5 rounded-full bg-white"
                        animate={isActive ? { opacity: [1, 0.2, 1] } : {}}
                        transition={{ repeat: Infinity, duration: 0.8 }} />
                      {isActive ? "PROC..." : "ONLINE"}
                    </div>
                  </div>
                </div>

                {/* Metrics */}
                <div className="p-4">
                  <div className="grid grid-cols-3 gap-3 mb-2">
                    {ag.metrics.map(({ k, v }) => (
                      <div key={k} className="text-center">
                        <p className="font-bold" style={{ fontSize: "0.9rem", color: isActive ? ag.color : "#111827" }}>{v}</p>
                        <p className="text-gray-400" style={{ fontSize: "0.62rem" }}>{k}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-gray-400 text-center" style={{ fontSize: "0.68rem" }}>
                    {isSelected ? "Nhấn để thu gọn" : "Nhấn để xem live log"}
                  </p>

                  {/* Live log (expanded) */}
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }} className="overflow-hidden mt-3"
                      >
                        <div className="bg-gray-950 rounded-xl p-3 space-y-1.5">
                          <p style={{ fontSize: "0.58rem", fontFamily: "monospace", color: "#4b5563", marginBottom: 6 }}>▶ LIVE LOG</p>
                          {ag.logs.map((log, li) => (
                            <motion.p key={li} initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1 - li * 0.25, x: 0 }}
                              transition={{ delay: li * 0.08 }}
                              style={{ fontSize: "0.68rem", fontFamily: "monospace", color: `${ag.color}${li === 0 ? "ff" : li === 1 ? "cc" : "66"}` }}>
                              [{["08:12", "08:09", "08:04"][li]}] {log}
                            </motion.p>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Global event stream terminal */}
        <div className="bg-gray-950 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex gap-1.5">
              {["#ef4444", "#f59e0b", "#10b981"].map((c) => (
                <div key={c} className="w-3 h-3 rounded-full" style={{ background: c }} />
              ))}
            </div>
            <p style={{ fontSize: "0.72rem", fontFamily: "monospace", color: "#6b7280" }}>
              NestaVietAI — Multi-Agent Event Stream
            </p>
          </div>
          <div className="space-y-1.5">
            {Array.from({ length: 6 }, (_, i) => {
              const agIdx = (aiTick + i) % 4;
              const logIdx = (Math.floor((aiTick + i) / 2)) % 3;
              const ag = AGENT_DEFS[agIdx];
              const log = ag.logs[logIdx % ag.logs.length];
              const hr = 8 + ((aiTick + i) % 12);
              const mn = ((aiTick * 3 + i * 7) % 60).toString().padStart(2, "0");
              return (
                <motion.p key={`${aiTick}-${i}`}
                  initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1 - i * 0.13, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  style={{ fontSize: "0.7rem", fontFamily: "monospace", color: `${ag.color}${i < 2 ? "ee" : i < 4 ? "88" : "33"}` }}>
                  [0{hr}:{mn}] <span style={{ color: "#6b7280" }}>{ag.name} »</span> {log}
                </motion.p>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
