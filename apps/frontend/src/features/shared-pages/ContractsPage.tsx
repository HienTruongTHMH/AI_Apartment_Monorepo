import { useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { FileText, ChevronLeft, Search, Filter, Plus } from "lucide-react";
import { type ContractRecord, INITIAL_CONTRACTS, FEATURES } from "@features/shared-pages/components/ContractsData";
import ContractCard from "@features/shared-pages/components/ContractCard";
import ContractGenerator from "@features/shared-pages/components/ContractGenerator";

export function ContractsPage() {
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [showGenerator, setShowGenerator] = useState(false);
  const [contracts, setContracts] = useState<ContractRecord[]>(INITIAL_CONTRACTS);

  const filtered = contracts.filter((c) =>
    (filterStatus === "all" || c.status === filterStatus) &&
    (c.tenant.toLowerCase().includes(search.toLowerCase()) ||
     c.property.toLowerCase().includes(search.toLowerCase()) ||
     c.id.toLowerCase().includes(search.toLowerCase()))
  );

  const addContract = (c: ContractRecord) => {
    setContracts((prev) => [c, ...prev]);
    setShowGenerator(false);
  };

  return (
    <div className="min-h-screen text-white" style={{ background: "linear-gradient(135deg, #070e1c 0%, #0a0f1e 50%, #07101c 100%)" }}>
      <div className="fixed inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(rgba(148,163,184,0.03) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
      <div className="fixed inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 40% at 30% 20%, rgba(16,185,129,0.06) 0%, transparent 60%), radial-gradient(ellipse 50% 50% at 70% 80%, rgba(34,211,238,0.04) 0%, transparent 55%)" }} />

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12">

        <button onClick={() => navigate("/")} className="flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors mb-8" style={{ fontSize: "0.82rem" }}>
          <ChevronLeft size={16} />Trang chủ
        </button>

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/8 mb-6">
            <FileText size={13} className="text-emerald-400" />
            <span className="text-emerald-400 font-semibold" style={{ fontSize: "0.75rem" }}>Hợp đồng điện tử</span>
          </div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-white mb-4" style={{ fontSize: "clamp(2rem,5vw,3rem)", fontWeight: 800, lineHeight: 1.15 }}>
                Ký hợp đồng thuê nhà<br />
                <span style={{ background: "linear-gradient(90deg,#10b981,#22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>an toàn & hợp pháp</span>
              </h1>
              <p className="text-white/50 max-w-xl" style={{ fontSize: "1rem", lineHeight: 1.75 }}>
                Hệ thống hợp đồng điện tử tích hợp eKYC — ký số ngay trên app, lưu trữ bảo mật AES-256, tự động nhắc hạn và hợp lệ theo pháp luật Việt Nam.
              </p>
            </div>
            <button
              onClick={() => setShowGenerator(true)}
              className="flex-shrink-0 flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-white hover:opacity-90 transition-opacity"
              style={{ background: "linear-gradient(135deg,#10b981,#22d3ee)", fontSize: "0.85rem" }}>
              <Plus size={16} />Tạo hợp đồng mới
            </button>
          </div>
        </motion.div>

        {/* Feature cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {FEATURES.map((f, i) => (
            <motion.div key={f.title} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 + i * 0.07 }}
              className="rounded-2xl p-4 border border-white/8" style={{ background: "rgba(15,24,41,0.7)" }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: f.color + "18" }}>
                <f.icon size={20} style={{ color: f.color }} />
              </div>
              <p className="text-white font-semibold mb-1" style={{ fontSize: "0.82rem" }}>{f.title}</p>
              <p className="text-white/40" style={{ fontSize: "0.7rem", lineHeight: 1.6 }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
          className="grid grid-cols-3 gap-4 mb-10 rounded-2xl p-5 border border-emerald-500/12"
          style={{ background: "rgba(16,185,129,0.05)" }}>
          {[
            { value: `${contracts.length}`, label: "Hợp đồng trong hệ thống" },
            { value: "100%", label: "Hợp lệ pháp lý" },
            { value: "<2 phút", label: "Thời gian tạo HĐ" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-emerald-400 font-bold mb-1" style={{ fontSize: "1.6rem" }}>{s.value}</p>
              <p className="text-white/45" style={{ fontSize: "0.75rem" }}>{s.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Contract list */}
        <div className="mb-6">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <h2 className="text-white font-bold" style={{ fontSize: "1.1rem" }}>Danh sách hợp đồng</h2>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2 min-w-[180px]">
                <Search size={14} className="text-white/35" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Tìm hợp đồng..."
                  className="flex-1 bg-transparent outline-none text-white placeholder-white/25" style={{ fontSize: "0.8rem" }} />
              </div>
              <div className="flex items-center gap-2">
                <Filter size={14} className="text-white/35" />
                {[{ v: "all", l: "Tất cả" }, { v: "active", l: "Hiệu lực" }, { v: "pending", l: "Chờ ký" }, { v: "expired", l: "Hết hạn" }].map((f) => (
                  <button key={f.v} onClick={() => setFilterStatus(f.v)}
                    className="px-3 py-1.5 rounded-xl border transition-all"
                    style={{ fontSize: "0.75rem", borderColor: filterStatus === f.v ? "rgba(16,185,129,0.4)" : "rgba(255,255,255,0.1)", background: filterStatus === f.v ? "rgba(16,185,129,0.1)" : "transparent", color: filterStatus === f.v ? "#10b981" : "rgba(255,255,255,0.4)" }}>
                    {f.l}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-3">
            {filtered.map((c, i) => <ContractCard key={c.id} c={c} index={i} />)}
            {filtered.length === 0 && (
              <div className="py-16 text-center text-white/30 rounded-2xl border border-white/8" style={{ background: "rgba(15,24,41,0.4)" }}>
                <FileText size={32} className="mx-auto mb-3 opacity-30" />
                <p style={{ fontSize: "0.88rem" }}>Không tìm thấy hợp đồng phù hợp</p>
                <button onClick={() => setShowGenerator(true)} className="mt-4 flex items-center gap-2 mx-auto px-4 py-2 rounded-xl text-emerald-400 border border-emerald-500/25 hover:bg-emerald-500/8 transition-all" style={{ fontSize: "0.8rem" }}>
                  <Plus size={14} />Tạo hợp đồng mới
                </button>
              </div>
            )}
          </div>
        </div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="rounded-2xl p-8 border border-emerald-500/15 text-center"
          style={{ background: "linear-gradient(135deg,rgba(16,185,129,0.08),rgba(34,211,238,0.05))" }}>
          <p className="text-white font-bold mb-2" style={{ fontSize: "1.2rem" }}>Sẵn sàng ký hợp đồng?</p>
          <p className="text-white/45 mb-5" style={{ fontSize: "0.88rem" }}>Đăng ký tài khoản, tìm căn hộ và ký ngay trong 2 phút.</p>
          <button onClick={() => navigate("/tenant/register")} className="px-6 py-3 rounded-full text-white font-semibold hover:opacity-90 transition-opacity" style={{ background: "linear-gradient(135deg,#10b981,#22d3ee)", fontSize: "0.9rem" }}>
            Bắt đầu ngay
          </button>
        </motion.div>
      </div>

      {/* Generator Modal */}
      <AnimatePresence>
        {showGenerator && (
          <ContractGenerator
            onClose={() => setShowGenerator(false)}
            onAdd={addContract}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
