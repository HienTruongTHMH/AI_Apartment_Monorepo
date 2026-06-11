import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  FileText, ChevronDown, Download, Eye, PenLine,
  DollarSign, Calendar, User, Building2, Mail, Phone,
} from "lucide-react";
import { type ContractRecord, statusMeta } from "@features/shared-pages/components/ContractsData";

interface ContractCardProps {
  c: ContractRecord;
  index: number;
}

export default function ContractCard({ c, index }: ContractCardProps) {
  const [open, setOpen] = useState(false);
  const meta = statusMeta[c.status];

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: index * 0.07 }}
      className="rounded-2xl border border-white/8 overflow-hidden"
      style={{ background: "rgba(15,24,41,0.8)" }}
    >
      <div className="p-5 flex items-center gap-4 cursor-pointer hover:bg-white/3 transition-colors" onClick={() => setOpen(!open)}>
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: meta.bg }}>
          <FileText size={22} style={{ color: meta.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <p className="text-white font-semibold" style={{ fontSize: "0.88rem" }}>{c.tenant}</p>
            <span className="px-2 py-0.5 rounded-full font-bold" style={{ background: meta.bg, color: meta.color, fontSize: "0.6rem" }}>
              {meta.label.toUpperCase()}
            </span>
          </div>
          <p className="text-white/45" style={{ fontSize: "0.75rem" }}>{c.id} · {c.property} · Căn {c.unit}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-white font-bold" style={{ fontSize: "0.9rem" }}>{(c.rent / 1e6).toFixed(1)}M<span className="text-white/35 font-normal" style={{ fontSize: "0.72rem" }}>/tháng</span></p>
          <p className="text-white/35" style={{ fontSize: "0.68rem" }}>{c.start} → {c.end}</p>
        </div>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={16} className="text-white/30" />
        </motion.div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="border-t border-white/8"
          >
            <div className="p-5 grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {[
                { icon: DollarSign, label: "Tiền cọc",        value: `${(c.deposit / 1e6).toFixed(0)}M VND`  },
                { icon: Calendar,   label: "Ngày thanh toán",  value: `Ngày ${c.payDay} hàng tháng`           },
                { icon: User,       label: "Ký kết lúc",       value: c.signed ?? "Chưa ký"                   },
                { icon: Building2,  label: "Bất động sản",     value: c.property                              },
              ].map((d) => (
                <div key={d.label} className="bg-white/5 rounded-xl p-3">
                  <d.icon size={13} className="text-white/35 mb-1" />
                  <p className="text-white/45" style={{ fontSize: "0.65rem" }}>{d.label}</p>
                  <p className="text-white font-semibold" style={{ fontSize: "0.78rem" }}>{d.value}</p>
                </div>
              ))}
            </div>
            {(c.email || c.phone) && (
              <div className="px-5 pb-4 flex gap-4">
                {c.email && <span className="flex items-center gap-1.5 text-white/40" style={{ fontSize: "0.72rem" }}><Mail size={11} />{c.email}</span>}
                {c.phone && <span className="flex items-center gap-1.5 text-white/40" style={{ fontSize: "0.72rem" }}><Phone size={11} />{c.phone}</span>}
              </div>
            )}
            <div className="px-5 pb-5 flex gap-3">
              {c.status === "pending" ? (
                <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-semibold hover:opacity-90 transition-opacity" style={{ background: "linear-gradient(135deg,#10b981,#22d3ee)", fontSize: "0.82rem" }}>
                  <PenLine size={15} />Ký hợp đồng ngay
                </button>
              ) : (
                <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/12 text-white/65 hover:text-white hover:border-white/25 transition-all" style={{ fontSize: "0.82rem" }}>
                  <Download size={14} />Tải PDF
                </button>
              )}
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/12 text-white/65 hover:text-white hover:border-white/25 transition-all" style={{ fontSize: "0.82rem" }}>
                <Eye size={14} />Xem chi tiết
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
