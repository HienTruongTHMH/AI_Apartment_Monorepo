import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Bell, Bot, Receipt, FileText, AlertTriangle } from "lucide-react";

interface NvNotif {
  id: string;
  type: "invoice" | "agent" | "alert" | "info";
  title: string;
  msg: string;
  time: string;
  read: boolean;
}

export interface NotificationCenterProps {
  isDark: boolean;
}

const TENANT_NOTIFS: NvNotif[] = [
  { id: "t1", type: "invoice", title: "Hóa đơn T4/2025",   msg: "12.500.000 ₫ — Hạn thanh toán 25/04/2025",       time: "Hôm nay",   read: false },
  { id: "t2", type: "agent",   title: "Smart Concierge",   msg: "Ticket T001 đang xử lý — ETA 2h nữa",             time: "30p trước", read: false },
  { id: "t3", type: "alert",   title: "Hợp đồng sắp hết", msg: "Còn 245 ngày — hạn 31/12/2025. Cần gia hạn sớm", time: "1h trước",  read: false },
  { id: "t4", type: "info",    title: "Super Broker AI",   msg: "3 căn hộ mới phù hợp yêu cầu của bạn",           time: "3h trước",  read: true  },
  { id: "t5", type: "agent",   title: "Listing Verifier",  msg: "Phòng bạn quan tâm (a3) vừa được cập nhật giá",  time: "5h trước",  read: true  },
];

export function NotificationCenter({ isDark }: NotificationCenterProps) {
  const [notifs, setNotifs] = useState<NvNotif[]>(TENANT_NOTIFS);
  const [open, setOpen] = useState(false);
  const unread = notifs.filter((n) => !n.read).length;
  const markAllRead = () => setNotifs((ns) => ns.map((n) => ({ ...n, read: true })));

  const typeStyle: Record<NvNotif["type"], { cls: string; Icon: React.ElementType }> = {
    invoice: { cls: "bg-amber-100 text-amber-600",     Icon: Receipt       },
    agent:   { cls: "bg-emerald-100 text-emerald-600", Icon: Bot           },
    alert:   { cls: "bg-red-100 text-red-600",         Icon: AlertTriangle },
    info:    { cls: "bg-blue-100 text-blue-600",        Icon: FileText      },
  };

  return (
    <div className="relative">
      <button
        onClick={() => { setOpen((o) => !o); if (!open && unread > 0) markAllRead(); }}
        className="relative w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
      >
        <Bell size={16} className="text-gray-600" />
        {unread > 0 && (
          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center"
            style={{ fontSize: "0.55rem", fontWeight: 700 }}>
            {unread}
          </motion.span>
        )}
      </button>
      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.16 }}
              className={`absolute right-0 top-11 w-80 rounded-2xl shadow-2xl border z-50 overflow-hidden ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-100"}`}
            >
              <div className={`flex items-center justify-between px-4 py-3 border-b ${isDark ? "border-slate-700" : "border-gray-100"}`}>
                <p className="font-bold" style={{ fontSize: "0.875rem", color: isDark ? "#f1f5f9" : "#111827" }}>Thông báo</p>
                <button onClick={markAllRead} className="text-emerald-600 hover:text-emerald-700" style={{ fontSize: "0.72rem" }}>Đọc tất cả</button>
              </div>
              <div className={`divide-y max-h-72 overflow-y-auto ${isDark ? "divide-slate-700" : "divide-gray-50"}`}>
                {notifs.map((n, i) => {
                  const { cls, Icon } = typeStyle[n.type];
                  return (
                    <motion.div key={n.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className={`flex gap-3 px-4 py-3 ${n.read ? "opacity-50" : ""}`}>
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${cls}`}>
                        <Icon size={13} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold" style={{ fontSize: "0.78rem", color: isDark ? "#e2e8f0" : "#1f2937" }}>{n.title}</p>
                        <p style={{ fontSize: "0.72rem", lineHeight: 1.4, color: isDark ? "#64748b" : "#6b7280" }}>{n.msg}</p>
                        <p style={{ fontSize: "0.65rem", color: isDark ? "#475569" : "#9ca3af", marginTop: 2 }}>{n.time}</p>
                      </div>
                      {!n.read && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
