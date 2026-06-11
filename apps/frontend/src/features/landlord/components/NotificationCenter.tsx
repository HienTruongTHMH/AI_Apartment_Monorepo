import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Bell, Bot, Users, FileText, AlertTriangle } from "lucide-react";

interface NvNotif {
  id: string;
  type: "agent" | "tenant" | "invoice" | "alert";
  title: string;
  msg: string;
  time: string;
  read: boolean;
}

const LANDLORD_NOTIFS: NvNotif[] = [
  { id: "n1", type: "alert",   title: "Smart Concierge",  msg: "Ticket T001 chưa phân công — SLA còn 1h30p",     time: "2p trước",  read: false },
  { id: "n2", type: "tenant",  title: "Cư dân mới",       msg: "Phạm Quốc Tuấn đăng ký phòng 703 — chờ duyệt",   time: "15p trước", read: false },
  { id: "n3", type: "agent",   title: "Listing Verifier", msg: "Duyệt tin #L-2204 thành công — đã đăng lên sàn", time: "1h trước",  read: false },
  { id: "n4", type: "invoice", title: "Contract Agent",   msg: "Xuất 156 hóa đơn T4 hoàn tất — 0 sai sót",       time: "3h trước",  read: true  },
  { id: "n5", type: "agent",   title: "Super Broker",     msg: "8 phiên tư vấn hôm nay — tỷ lệ chốt 62%",        time: "5h trước",  read: true  },
];

export function NotificationCenter() {
  const [notifs, setNotifs] = useState<NvNotif[]>(LANDLORD_NOTIFS);
  const [open, setOpen] = useState(false);
  const unread = notifs.filter((n) => !n.read).length;
  const markAllRead = () => setNotifs((ns) => ns.map((n) => ({ ...n, read: true })));

  const typeStyle: Record<NvNotif["type"], { cls: string; Icon: React.ElementType }> = {
    agent:   { cls: "bg-blue-100 text-blue-600",        Icon: Bot           },
    tenant:  { cls: "bg-amber-100 text-amber-600",      Icon: Users         },
    invoice: { cls: "bg-emerald-100 text-emerald-600",  Icon: FileText      },
    alert:   { cls: "bg-red-100 text-red-600",          Icon: AlertTriangle },
  };

  return (
    <div className="relative">
      <button
        onClick={() => { setOpen((o) => !o); if (!open && unread > 0) markAllRead(); }}
        className="relative w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
      >
        <Bell size={16} className="text-gray-600" />
        {unread > 0 && (
          <motion.span
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center"
            style={{ fontSize: "0.55rem", fontWeight: 700 }}
          >{unread}</motion.span>
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
              className="absolute right-0 top-11 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <p className="font-bold text-gray-900" style={{ fontSize: "0.875rem" }}>Thông báo</p>
                <button onClick={markAllRead} className="text-violet-600 hover:text-violet-700" style={{ fontSize: "0.72rem" }}>Đọc tất cả</button>
              </div>
              <div className="divide-y divide-gray-50 max-h-72 overflow-y-auto">
                {notifs.map((n, i) => {
                  const { cls, Icon } = typeStyle[n.type];
                  return (
                    <motion.div
                      key={n.id}
                      initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className={`flex gap-3 px-4 py-3 ${n.read ? "opacity-50" : ""}`}
                    >
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${cls}`}>
                        <Icon size={13} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800" style={{ fontSize: "0.78rem" }}>{n.title}</p>
                        <p className="text-gray-500" style={{ fontSize: "0.72rem", lineHeight: 1.4 }}>{n.msg}</p>
                        <p className="text-gray-400 mt-0.5" style={{ fontSize: "0.65rem" }}>{n.time}</p>
                      </div>
                      {!n.read && <div className="w-1.5 h-1.5 rounded-full bg-violet-500 mt-1.5 flex-shrink-0" />}
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
