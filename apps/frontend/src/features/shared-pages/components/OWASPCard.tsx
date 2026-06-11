import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, ChevronDown } from "lucide-react";
import { type OWASP_ITEMS } from "@features/shared-pages/components/SecurityData";

interface OWASPCardProps {
  item: typeof OWASP_ITEMS[number];
  index: number;
}

export default function OWASPCard({ item, index }: OWASPCardProps) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.04 }}
      className="rounded-xl border border-white/8 overflow-hidden"
      style={{ background: "var(--nv-surface)" }}
    >
      <button onClick={() => setOpen((o) => !o)} className="w-full flex items-center gap-3 px-4 py-3 text-left">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="font-mono font-bold flex-shrink-0" style={{ fontSize: "0.72rem", color: item.riskColor }}>{item.id}</span>
          <CheckCircle2 size={13} className="text-emerald-400 flex-shrink-0" />
          <span className="text-white font-semibold truncate" style={{ fontSize: "0.85rem" }}>{item.name}</span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="px-2 py-0.5 rounded-full font-semibold" style={{ fontSize: "0.6rem", background: `${item.riskColor}20`, color: item.riskColor }}>
            {item.risk}
          </span>
          <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown size={14} className="text-white/30" />
          </motion.div>
        </div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 border-t border-white/6 pt-3 space-y-2">
              <p className="text-white/60" style={{ fontSize: "0.8rem", lineHeight: 1.6 }}>
                <span className="text-red-400 font-semibold">Mô tả: </span>{item.desc}
              </p>
              <p className="text-white/60" style={{ fontSize: "0.8rem", lineHeight: 1.6 }}>
                <span className="text-emerald-400 font-semibold">Biện pháp: </span>{item.fix}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
