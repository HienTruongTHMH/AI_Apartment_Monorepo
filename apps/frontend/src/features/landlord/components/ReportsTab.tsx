import { Download } from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";

const REVENUE_DATA = [
  { month: "T10", revenue: 38.5, target: 40 },
  { month: "T11", revenue: 41.2, target: 42 },
  { month: "T12", revenue: 43.8, target: 42 },
  { month: "T1", revenue: 39.1, target: 43 },
  { month: "T2", revenue: 44.5, target: 43 },
  { month: "T3", revenue: 46.2, target: 45 },
  { month: "T4", revenue: 45.2, target: 45 },
];

const OCCUPANCY_DATA = [
  { month: "T10", rate: 83 },
  { month: "T11", rate: 88 },
  { month: "T12", rate: 91 },
  { month: "T1", rate: 87 },
  { month: "T2", rate: 92 },
  { month: "T3", rate: 94 },
  { month: "T4", rate: 92 },
];

export default function ReportsTab() {
  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      <div className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-gray-900 font-bold" style={{ fontSize: "1.1rem" }}>Báo cáo tài chính</h2>
            <p className="text-gray-400" style={{ fontSize: "0.75rem" }}>Tổng hợp doanh thu & hiệu suất</p>
          </div>
          <button className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50" style={{ fontSize: "0.8rem" }}>
            <Download size={14} />Xuất báo cáo
          </button>
        </div>
      </div>
      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <p className="text-gray-900 font-bold mb-4" style={{ fontSize: "0.9rem" }}>Doanh thu theo tháng</p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={REVENUE_DATA}>
              <defs>
                <linearGradient id="revenueGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v: number) => [`${v}M ₫`]} />
              <Area type="monotone" dataKey="revenue" stroke="#7c3aed" fill="url(#revenueGrad2)" />
              <Area type="monotone" dataKey="target" stroke="#d1d5db" strokeDasharray="5 5" fill="none" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <p className="text-gray-900 font-bold mb-4" style={{ fontSize: "0.9rem" }}>Tỷ lệ lấp đầy (%)</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={OCCUPANCY_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} domain={[70, 100]} />
              <Tooltip formatter={(v: number) => [`${v}%`]} />
              <Bar dataKey="rate" fill="#7c3aed" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <p className="text-gray-900 font-bold mb-3" style={{ fontSize: "0.9rem" }}>Tóm tắt tháng 4/2025</p>
          <div className="space-y-3">
            {[["Doanh thu thực", "45.200.000 ₫", "text-emerald-600"], ["Mục tiêu", "45.000.000 ₫", "text-gray-600"], ["Chênh lệch", "+200.000 ₫ (+0.4%)", "text-emerald-600"], ["Số căn đang thuê", "11 / 12 căn", "text-gray-900"], ["Tỷ lệ lấp đầy", "91.7%", "text-violet-600"]].map(([l, v, cls]) => (
              <div key={l} className="flex items-center justify-between py-2 border-b border-gray-50">
                <span className="text-gray-500" style={{ fontSize: "0.82rem" }}>{l}</span>
                <span className={`font-semibold ${cls}`} style={{ fontSize: "0.85rem" }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
