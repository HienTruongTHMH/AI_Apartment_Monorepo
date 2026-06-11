import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, Wrench, CheckCircle2, Clock, AlertTriangle, Plus, X, User, Building2 } from "lucide-react";

interface CalendarEvent {
  id: string;
  day: number;
  title: string;
  type: "maintenance" | "inspection" | "repair" | "cleaning";
  status: "scheduled" | "in_progress" | "done";
  time: string;
  assignee: string;
  unit?: string;
  priority: "low" | "medium" | "high";
}

const TYPE_COLOR: Record<CalendarEvent["type"], string> = {
  maintenance: "#8b5cf6",
  inspection: "#3b82f6",
  repair: "#f59e0b",
  cleaning: "#10b981",
};
const TYPE_LABEL: Record<CalendarEvent["type"], string> = {
  maintenance: "Bảo trì", inspection: "Kiểm tra", repair: "Sửa chữa", cleaning: "Vệ sinh",
};
const STATUS_ICON: Record<CalendarEvent["status"], React.ElementType> = {
  scheduled: Clock, in_progress: Wrench, done: CheckCircle2,
};

const EVENTS: CalendarEvent[] = [
  { id: "e1", day: 3, title: "Kiểm tra hệ thống PCCC", type: "inspection", status: "done", time: "09:00–11:00", assignee: "Nguyễn Kỹ Thuật", unit: "Toàn toà", priority: "high" },
  { id: "e2", day: 7, title: "Bảo trì thang máy #2", type: "maintenance", status: "done", time: "08:00–12:00", assignee: "Công ty Schindler", unit: "Block B", priority: "high" },
  { id: "e3", day: 12, title: "Vệ sinh hồ bơi tháng 5", type: "cleaning", status: "in_progress", time: "07:00–09:00", assignee: "Đội vệ sinh", unit: "Tầng hầm", priority: "low" },
  { id: "e4", day: 14, title: "Sửa điều hòa phòng 805", type: "repair", status: "scheduled", time: "14:00–16:00", assignee: "Phạm Điện Lạnh", unit: "P.805", priority: "medium" },
  { id: "e5", day: 18, title: "Kiểm tra đường điện tổng", type: "inspection", status: "scheduled", time: "08:30–10:30", assignee: "Điện lực Q.7", unit: "Toàn toà", priority: "high" },
  { id: "e6", day: 21, title: "Bảo trì máy bơm nước", type: "maintenance", status: "scheduled", time: "09:00–13:00", assignee: "Nguyễn Kỹ Thuật", unit: "Tầng hầm 2", priority: "medium" },
  { id: "e7", day: 25, title: "Vệ sinh sân thượng & mái", type: "cleaning", status: "scheduled", time: "07:00–11:00", assignee: "Đội vệ sinh", unit: "Tầng 20", priority: "low" },
  { id: "e8", day: 28, title: "Kiểm tra hệ thống camera", type: "inspection", status: "scheduled", time: "14:00–17:00", assignee: "VTech Security", unit: "Toàn toà", priority: "medium" },
];

const WEEKDAYS = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

export function MaintenanceCalendar({ isDark }: { isDark?: boolean }) {
  const [month, setMonth] = useState(4); // May = 4 (0-indexed)
  const [year] = useState(2025);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const firstDow = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = new Date(year, month, 1).toLocaleDateString("vi-VN", { month: "long", year: "numeric" });

  const eventsForDay = (day: number) => EVENTS.filter((e) => e.day === day);

  const bg = isDark ? "bg-slate-900" : "bg-white";
  const border = isDark ? "border-slate-700" : "border-gray-100";
  const tp = isDark ? "text-slate-100" : "text-gray-900";
  const ts = isDark ? "text-slate-400" : "text-gray-500";

  const upcomingEvents = EVENTS.filter((e) => e.status === "scheduled")
    .sort((a, b) => a.day - b.day)
    .slice(0, 5);

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      {/* Header */}
      <div className={`${bg} border-b ${border} px-6 py-4 flex items-center justify-between flex-shrink-0`}>
        <div>
          <h2 className={`font-bold ${tp}`} style={{ fontSize: "1.1rem" }}>Lịch bảo trì</h2>
          <p className={ts} style={{ fontSize: "0.75rem" }}>Quản lý lịch bảo trì & kỹ thuật toà nhà</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 text-white font-semibold hover:bg-violet-700 transition-colors" style={{ fontSize: "0.8rem" }}>
          <Plus size={14} /> Thêm lịch
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <div className={`${bg} rounded-2xl border ${border} overflow-hidden shadow-sm`}>
              {/* Month nav */}
              <div className={`flex items-center justify-between px-5 py-4 border-b ${border}`}>
                <button onClick={() => setMonth((m) => (m - 1 + 12) % 12)}
                  className={`w-8 h-8 rounded-xl flex items-center justify-center ${isDark ? "hover:bg-slate-800 text-slate-400" : "hover:bg-gray-100 text-gray-500"} transition-colors`}>
                  <ChevronLeft size={16} />
                </button>
                <p className={`font-bold capitalize ${tp}`} style={{ fontSize: "0.9rem" }}>{monthName}</p>
                <button onClick={() => setMonth((m) => (m + 1) % 12)}
                  className={`w-8 h-8 rounded-xl flex items-center justify-center ${isDark ? "hover:bg-slate-800 text-slate-400" : "hover:bg-gray-100 text-gray-500"} transition-colors`}>
                  <ChevronRight size={16} />
                </button>
              </div>

              {/* Weekday headers */}
              <div className="grid grid-cols-7 border-b" style={{ borderColor: isDark ? "#1e293b" : "#f1f5f9" }}>
                {WEEKDAYS.map((d) => (
                  <div key={d} className={`py-2 text-center font-bold ${ts}`} style={{ fontSize: "0.68rem", letterSpacing: "0.04em" }}>{d}</div>
                ))}
              </div>

              {/* Days grid */}
              <div className="grid grid-cols-7">
                {Array.from({ length: firstDow }, (_, i) => <div key={`empty-${i}`} className="h-16" />)}
                {Array.from({ length: daysInMonth }, (_, i) => {
                  const day = i + 1;
                  const dayEvents = eventsForDay(day);
                  const isSelected = selectedDay === day;
                  const isToday = day === 30;
                  return (
                    <motion.button key={day} whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedDay(isSelected ? null : day)}
                      className={`relative h-16 border-b border-r flex flex-col items-start p-1.5 transition-colors ${
                        isSelected ? (isDark ? "bg-violet-900/30" : "bg-violet-50") : isDark ? "hover:bg-slate-800 border-slate-800" : "hover:bg-gray-50 border-gray-50"
                      }`}>
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold mb-0.5 ${
                        isToday ? "bg-violet-600 text-white" : isSelected ? "text-violet-600 font-bold" : tp
                      }`} style={{ fontSize: "0.75rem" }}>
                        {day}
                      </span>
                      <div className="flex flex-wrap gap-0.5">
                        {dayEvents.slice(0, 2).map((e) => (
                          <div key={e.id} className="w-1.5 h-1.5 rounded-full" style={{ background: TYPE_COLOR[e.type] }} />
                        ))}
                        {dayEvents.length > 2 && <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Selected day events */}
            <AnimatePresence>
              {selectedDay && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className={`mt-4 ${bg} rounded-2xl border ${border} overflow-hidden shadow-sm`}>
                  <div className={`px-5 py-3.5 border-b ${border} flex items-center justify-between`}>
                    <p className={`font-bold ${tp}`} style={{ fontSize: "0.875rem" }}>Ngày {selectedDay} tháng {month + 1}</p>
                    <button onClick={() => setSelectedDay(null)} className={`w-6 h-6 rounded-full ${isDark ? "hover:bg-slate-700 text-slate-400" : "hover:bg-gray-100 text-gray-400"} flex items-center justify-center transition-colors`}>
                      <X size={12} />
                    </button>
                  </div>
                  {eventsForDay(selectedDay).length === 0 ? (
                    <p className={`px-5 py-4 ${ts}`} style={{ fontSize: "0.82rem" }}>Không có lịch ngày này.</p>
                  ) : (
                    <div className="divide-y" style={{ borderColor: isDark ? "#1e293b" : "#f1f5f9" }}>
                      {eventsForDay(selectedDay).map((e) => {
                        const StatusIcon = STATUS_ICON[e.status];
                        return (
                          <div key={e.id} className="flex items-center gap-3 px-5 py-3.5 cursor-pointer hover:bg-gray-50/50"
                            onClick={() => setSelectedEvent(selectedEvent?.id === e.id ? null : e)}>
                            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: TYPE_COLOR[e.type] }} />
                            <div className="flex-1 min-w-0">
                              <p className={`font-semibold truncate ${tp}`} style={{ fontSize: "0.84rem" }}>{e.title}</p>
                              <p className={ts} style={{ fontSize: "0.68rem" }}>{e.time} · {e.unit}</p>
                            </div>
                            <StatusIcon size={14} className={e.status === "done" ? "text-emerald-500" : e.status === "in_progress" ? "text-amber-500" : isDark ? "text-slate-500" : "text-gray-400"} />
                          </div>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right sidebar */}
          <div className="space-y-4">
            {/* Legend */}
            <div className={`${bg} rounded-2xl border ${border} p-4 shadow-sm`}>
              <p className={`font-bold mb-3 ${tp}`} style={{ fontSize: "0.82rem" }}>Loại lịch</p>
              <div className="space-y-2">
                {Object.entries(TYPE_COLOR).map(([type, color]) => (
                  <div key={type} className="flex items-center gap-2.5">
                    <div className="w-3 h-3 rounded-full" style={{ background: color }} />
                    <span className={ts} style={{ fontSize: "0.78rem" }}>{TYPE_LABEL[type as CalendarEvent["type"]]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming events */}
            <div className={`${bg} rounded-2xl border ${border} overflow-hidden shadow-sm`}>
              <div className={`px-4 py-3 border-b ${border}`}>
                <p className={`font-bold ${tp}`} style={{ fontSize: "0.82rem" }}>Sắp tới ({upcomingEvents.length})</p>
              </div>
              <div className="divide-y" style={{ borderColor: isDark ? "#1e293b" : "#f1f5f9" }}>
                {upcomingEvents.map((e) => (
                  <div key={e.id} className="px-4 py-3">
                    <div className="flex items-start gap-2.5">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ background: `${TYPE_COLOR[e.type]}18`, color: TYPE_COLOR[e.type] }}>
                        <Wrench size={13} />
                      </div>
                      <div className="min-w-0">
                        <p className={`font-semibold truncate ${tp}`} style={{ fontSize: "0.78rem" }}>{e.title}</p>
                        <p className={ts} style={{ fontSize: "0.65rem" }}>Ngày {e.day}/{month + 1} · {e.time}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <User size={10} className={ts} />
                          <span className={ts} style={{ fontSize: "0.62rem" }}>{e.assignee}</span>
                        </div>
                      </div>
                      {e.priority === "high" && (
                        <AlertTriangle size={13} className="text-red-500 flex-shrink-0 mt-0.5" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className={`${bg} rounded-2xl border ${border} p-4 shadow-sm`}>
              <p className={`font-bold mb-3 ${tp}`} style={{ fontSize: "0.82rem" }}>Tháng này</p>
              {[
                { label: "Hoàn thành", count: EVENTS.filter((e) => e.status === "done").length, color: "#10b981" },
                { label: "Đang xử lý", count: EVENTS.filter((e) => e.status === "in_progress").length, color: "#f59e0b" },
                { label: "Lên lịch", count: EVENTS.filter((e) => e.status === "scheduled").length, color: "#8b5cf6" },
              ].map(({ label, count, color }) => (
                <div key={label} className="flex items-center justify-between py-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                    <span className={ts} style={{ fontSize: "0.75rem" }}>{label}</span>
                  </div>
                  <span className="font-bold" style={{ fontSize: "0.82rem", color }}>{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
