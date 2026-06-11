import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Bot, Wrench, Plus, CheckCircle2, Clock, X, Camera,
} from "lucide-react";

const TICKETS = [
  { id: "T001", title: "Máy lạnh không hoạt động", status: "in_progress", date: "20/04/2025", priority: "high", agent: "Smart Concierge" },
  { id: "T002", title: "Bóng đèn hành lang hỏng", status: "resolved", date: "15/04/2025", priority: "low", agent: "Smart Concierge" },
  { id: "T003", title: "Vòi nước rò rỉ phòng tắm", status: "pending", date: "22/04/2025", priority: "medium", agent: "Smart Concierge" },
];

export default function ServicesTab() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: "", category: "", desc: "", photo: false });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => { setShowForm(false); setSubmitted(false); setFormData({ title: "", category: "", desc: "", photo: false }); }, 2000);
  };

  const statusConfig = {
    pending: { label: "Chờ xử lý", cls: "bg-amber-100 text-amber-700", icon: Clock },
    in_progress: { label: "Đang xử lý", cls: "bg-blue-100 text-blue-700", icon: Wrench },
    resolved: { label: "Đã xong", cls: "bg-emerald-100 text-emerald-700", icon: CheckCircle2 },
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      <div className="bg-white border-b border-gray-100 px-6 py-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-gray-900 font-bold" style={{ fontSize: "1.1rem" }}>Yêu cầu dịch vụ</h2>
            <p className="text-gray-400" style={{ fontSize: "0.78rem" }}>Smart Concierge AI xử lý 24/7</p>
          </div>
          <motion.button whileTap={{ scale: 0.95 }} onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-violet-500 text-white px-4 py-2.5 rounded-xl shadow-md"
            style={{ fontSize: "0.85rem", fontWeight: 600 }}>
            <Plus size={16} />Tạo yêu cầu mới
          </motion.button>
        </div>
      </div>

      <div className="p-6 space-y-5">
        {/* AI status */}
        <div className="bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-100 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow">
            <Bot size={20} className="text-white" />
          </div>
          <div className="flex-1">
            <p className="text-violet-900 font-bold" style={{ fontSize: "0.875rem" }}>Smart Concierge AI</p>
            <p className="text-violet-600" style={{ fontSize: "0.78rem" }}>Đang phân công kỹ thuật viên cho ticket T001 — ETA 2h nữa</p>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
            <span className="text-violet-600" style={{ fontSize: "0.7rem" }}>Hoạt động</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Tổng ticket", value: "3", color: "bg-white border border-gray-100" },
            { label: "Đang xử lý", value: "1", color: "bg-blue-50 border border-blue-100" },
            { label: "Đã giải quyết", value: "1", color: "bg-emerald-50 border border-emerald-100" },
          ].map((s) => (
            <div key={s.label} className={`${s.color} rounded-2xl p-4 text-center shadow-sm`}>
              <p className="text-gray-900 font-bold" style={{ fontSize: "1.4rem" }}>{s.value}</p>
              <p className="text-gray-500" style={{ fontSize: "0.72rem" }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Ticket list */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50">
            <p className="text-gray-900 font-bold" style={{ fontSize: "0.9rem" }}>Danh sách yêu cầu</p>
          </div>
          <div className="divide-y divide-gray-50">
            {TICKETS.map((ticket) => {
              const s = statusConfig[ticket.status as keyof typeof statusConfig];
              return (
                <motion.div key={ticket.id} whileHover={{ backgroundColor: "#f9fafb" }}
                  className="flex items-center gap-4 px-5 py-4 cursor-pointer transition-colors">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${s.cls.split(" ")[0]}`}>
                    <s.icon size={16} className={s.cls.split(" ")[1]} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-gray-900 font-semibold" style={{ fontSize: "0.875rem" }}>{ticket.title}</p>
                      {ticket.priority === "high" && (
                        <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-600" style={{ fontSize: "0.6rem", fontWeight: 700 }}>Ưu tiên cao</span>
                      )}
                    </div>
                    <p className="text-gray-400" style={{ fontSize: "0.72rem" }}>#{ticket.id} • {ticket.date} • {ticket.agent}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full flex-shrink-0 ${s.cls}`} style={{ fontSize: "0.7rem", fontWeight: 600 }}>{s.label}</span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Create form modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6" onClick={() => setShowForm(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
              {submitted ? (
                <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-center py-10">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 size={32} className="text-emerald-500" />
                  </div>
                  <p className="text-gray-900 font-bold" style={{ fontSize: "1rem" }}>Đã gửi yêu cầu!</p>
                  <p className="text-gray-500" style={{ fontSize: "0.85rem" }}>Smart Concierge AI đang tiếp nhận</p>
                </motion.div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-gray-900 font-bold" style={{ fontSize: "1.05rem" }}>Tạo yêu cầu mới</h3>
                    <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"><X size={16} /></button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-gray-700 block mb-1.5 font-semibold" style={{ fontSize: "0.8rem" }}>Tiêu đề sự cố *</label>
                      <input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-violet-400 transition-colors"
                        style={{ fontSize: "0.875rem" }} placeholder="VD: Điều hòa không lạnh..." />
                    </div>
                    <div>
                      <label className="text-gray-700 block mb-1.5 font-semibold" style={{ fontSize: "0.8rem" }}>Danh mục</label>
                      <div className="grid grid-cols-3 gap-2">
                        {[{ v: "electric", l: "Điện", e: "⚡" }, { v: "plumbing", l: "Nước", e: "🚿" }, { v: "ac", l: "Điều hòa", e: "❄️" }, { v: "internet", l: "Internet", e: "📡" }, { v: "security", l: "An ninh", e: "🔒" }, { v: "other", l: "Khác", e: "🔧" }].map((cat) => (
                          <button key={cat.v} onClick={() => setFormData({ ...formData, category: cat.v })}
                            className={`py-2.5 px-3 rounded-xl border text-center transition-all ${formData.category === cat.v ? "bg-violet-50 border-violet-400 text-violet-700" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}
                            style={{ fontSize: "0.78rem" }}>
                            <div className="text-lg">{cat.e}</div>
                            <div style={{ fontWeight: formData.category === cat.v ? 600 : 400 }}>{cat.l}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-gray-700 block mb-1.5 font-semibold" style={{ fontSize: "0.8rem" }}>Mô tả chi tiết</label>
                      <textarea value={formData.desc} onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-violet-400 transition-colors resize-none"
                        style={{ fontSize: "0.875rem" }} rows={3} placeholder="Mô tả chi tiết sự cố..." />
                    </div>
                    <button onClick={() => setFormData({ ...formData, photo: !formData.photo })}
                      className={`w-full border-2 border-dashed rounded-xl py-3.5 flex items-center justify-center gap-2 transition-colors ${formData.photo ? "border-violet-400 bg-violet-50 text-violet-600" : "border-gray-300 text-gray-500 hover:border-gray-400"}`}>
                      {formData.photo ? <><CheckCircle2 size={18} />Đã thêm ảnh</> : <><Camera size={18} />Thêm ảnh sự cố</>}
                    </button>
                    <motion.button whileTap={{ scale: 0.97 }} onClick={handleSubmit}
                      className="w-full bg-gradient-to-r from-violet-500 to-purple-600 text-white py-3.5 rounded-xl shadow"
                      style={{ fontSize: "0.95rem", fontWeight: 600 }}>
                      Gửi đến Smart Concierge AI
                    </motion.button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
