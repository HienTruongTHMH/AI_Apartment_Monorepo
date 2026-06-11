import { motion } from "motion/react";
import { X, MessageSquare, Building2, ChevronRight } from "lucide-react";

export interface ContactListing {
  id: string | number;
  title: string;
  price: string;
  area: string;
  district: string;
  description: string;
  type?: string;
}

interface ContactListingModalProps {
  listing: ContactListing;
  onClose: () => void;
  onAskAI: (listing: ContactListing) => void;
  onGetStarted: () => void;
  t: (vi: string, en: string) => string;
}

export default function ContactListingModal({ listing, onClose, onAskAI, onGetStarted, t }: ContactListingModalProps) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[999] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(16px)" }}
      onClick={onClose}>
      <motion.div initial={{ opacity: 0, scale: 0.92, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 12 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-md rounded-3xl overflow-hidden border border-white/10"
        style={{ background: "rgba(5,10,24,0.97)", backdropFilter: "blur(24px)" }}>
        <div className="p-6 border-b border-white/7">
          <div className="flex items-start justify-between gap-3 mb-1">
            <h3 className="text-white font-bold" style={{ fontSize: "1rem", lineHeight: 1.4 }}>{listing.title}</h3>
            <button onClick={onClose} className="text-white/30 hover:text-white/60 transition-colors flex-shrink-0"><X size={18} /></button>
          </div>
          <p className="text-emerald-400 font-bold" style={{ fontSize: "1.05rem" }}>{listing.price}</p>
          <p className="text-white/38 mt-0.5" style={{ fontSize: "0.78rem" }}>{listing.area} · {listing.district}</p>
        </div>
        <div className="p-6 space-y-3">
          <p className="text-white/50 text-sm mb-4" style={{ lineHeight: 1.65 }}>{listing.description}</p>
          {[
            {
              icon: MessageSquare,
              label: t("Hỏi AI Super Broker","Ask AI Super Broker"),
              sub: t("Tư vấn 24/7 · Phản hồi trong 1.2s","24/7 advisory · Response in 1.2s"),
              color: "#22d3ee",
              action: () => onAskAI(listing),
            },
            {
              icon: Building2,
              label: t("Đăng ký để liên hệ chủ nhà","Register to contact landlord"),
              sub: t("Miễn phí · Bảo mật thông tin","Free · Privacy protected"),
              color: "#a78bfa",
              action: () => { onClose(); onGetStarted(); },
            },
          ].map(({ icon: Icon, label, sub, color, action }) => (
            <motion.button key={label} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={action}
              className="w-full flex items-center gap-4 p-4 rounded-2xl border text-left transition-all"
              style={{ background: `${color}0a`, borderColor: `${color}22` }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${color}44`; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = `${color}22`; }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}18` }}>
                <Icon size={18} style={{ color }} />
              </div>
              <div>
                <p className="text-white font-semibold" style={{ fontSize: "0.88rem" }}>{label}</p>
                <p className="text-white/38 mt-0.5" style={{ fontSize: "0.72rem" }}>{sub}</p>
              </div>
              <ChevronRight size={15} className="ml-auto text-white/20" />
            </motion.button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
