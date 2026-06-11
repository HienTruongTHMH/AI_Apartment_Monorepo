import { motion } from "motion/react";
import {
  Users, Shield, Mail, Phone, Building2,
  Moon, Sun, ChevronRight,
} from "lucide-react";

export interface SettingsTabProps {
  landlordName: string;
  landlordEmail: string;
  isDark: boolean;
  toggleDark: () => void;
}

export default function SettingsTab({ landlordName, landlordEmail, isDark, toggleDark }: SettingsTabProps) {
  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      <div className="bg-white border-b border-gray-100 px-6 py-4">
        <h2 className="text-gray-900 font-bold" style={{ fontSize: "1.1rem" }}>Cài đặt</h2>
        <p className="text-gray-400" style={{ fontSize: "0.75rem" }}>Quản lý tài khoản và cấu hình hệ thống</p>
      </div>
      <div className="p-6 max-w-2xl space-y-5">
        {/* Profile */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <p className="text-gray-700 font-semibold mb-4" style={{ fontSize: "0.9rem" }}>Thông tin tài khoản</p>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center">
              <Users size={22} className="text-white" />
            </div>
            <div>
              <p className="text-gray-900 font-bold" style={{ fontSize: "1rem" }}>{landlordName}</p>
              <p className="text-gray-400" style={{ fontSize: "0.8rem" }}>{landlordEmail || "—"}</p>
              <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full mt-1" style={{ fontSize: "0.65rem", fontWeight: 600 }}>
                <Shield size={10} />Verified
              </span>
            </div>
          </div>
          <div className="space-y-2">
            {[{ icon: Mail, label: "Email", value: landlordEmail || "—" }, { icon: Phone, label: "Điện thoại", value: "—" }, { icon: Building2, label: "Toà nhà", value: "—" }].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center justify-between py-2 border-b border-gray-50">
                <div className="flex items-center gap-2 text-gray-500"><Icon size={14} /><span style={{ fontSize: "0.82rem" }}>{label}</span></div>
                <span className="text-gray-700 font-medium" style={{ fontSize: "0.82rem" }}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Dark mode toggle */}
        <div className="bg-white rounded-2xl border border-gray-100 px-5 py-4 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-3">
            {isDark ? <Moon size={16} className="text-violet-500" /> : <Sun size={16} className="text-amber-500" />}
            <div>
              <p className="text-gray-800 font-medium" style={{ fontSize: "0.875rem" }}>Giao diện tối</p>
              <p className="text-gray-400" style={{ fontSize: "0.72rem" }}>{isDark ? "Đang bật — dark mode" : "Đang tắt — light mode"}</p>
            </div>
          </div>
          <motion.button whileTap={{ scale: 0.9 }} onClick={toggleDark}
            className={`w-12 h-6 rounded-full relative transition-colors ${isDark ? "bg-violet-500" : "bg-gray-200"}`}>
            <motion.div animate={{ x: isDark ? 24 : 2 }}
              className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm" />
          </motion.button>
        </div>

        {/* Settings items */}
        {[
          { label: "Cài đặt thông báo", desc: "Nhận alert qua email / SMS" },
          { label: "Kết nối ngân hàng", desc: "Nhận thanh toán tự động" },
          { label: "API & Webhooks", desc: "Tích hợp hệ thống bên ngoài" },
          { label: "Bảo mật 2FA", desc: "Xác thực hai yếu tố" },
        ].map(({ label, desc }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 px-5 py-4 flex justify-between items-center cursor-pointer hover:border-violet-200 transition-colors shadow-sm">
            <div>
              <p className="text-gray-800 font-medium" style={{ fontSize: "0.875rem" }}>{label}</p>
              <p className="text-gray-400" style={{ fontSize: "0.72rem" }}>{desc}</p>
            </div>
            <ChevronRight size={16} className="text-gray-400" />
          </div>
        ))}
      </div>
    </div>
  );
}
