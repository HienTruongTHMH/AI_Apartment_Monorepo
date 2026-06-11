import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  User, Mail, Phone, Shield, Building2, MapPin,
  FileText, Calendar, Bell, Settings, ChevronRight,
  AlertTriangle, X, LogOut, CheckCircle2, Bot,
  Moon, Sun,
} from "lucide-react";

export interface ProfileTabProps {
  onLogout: () => void;
  isDark: boolean;
  toggleDark: () => void;
}

function getTenantUser() {
  try { return JSON.parse(localStorage.getItem("nv-tenant-user") || "{}"); } catch { return {}; }
}
function getBuildingTenants() {
  try { return JSON.parse(localStorage.getItem("nv-building-tenants") || "[]"); } catch { return []; }
}
function getListingsBoard() {
  try { return JSON.parse(localStorage.getItem("nv-listings-board") || "[]"); } catch { return []; }
}

export default function ProfileTab({ onLogout, isDark, toggleDark }: ProfileTabProps) {
  const tenantUser = getTenantUser();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelStep, setCancelStep] = useState<"confirm" | "reason" | "done">("confirm");
  const [reason, setReason] = useState("");

  const handleCancelResidence = () => {
    const tenants = getBuildingTenants() as { email?: string; status: string; unit?: string; buildingName?: string }[];
    const updatedTenants = tenants.map((t) =>
      t.email === tenantUser.email ? { ...t, status: "cancelled" } : t
    );
    localStorage.setItem("nv-building-tenants", JSON.stringify(updatedTenants));

    const listings = getListingsBoard() as object[];
    const newListing = {
      id: `L-AUTO-${Date.now()}`,
      title: `Phòng trống: ${tenantUser.unit || "1204"} tại ${tenantUser.buildingName || "Sunrise City North"}`,
      price: "11.5M/tháng",
      area: "65m²",
      district: tenantUser.district || "Quận 7",
      description: `Phòng vừa được trả lại. AI đã tự động đăng tin tìm cư dân mới. Lý do trả: ${reason || "Cư dân hủy hợp đồng"}`,
      type: "ai",
      postedAt: new Date().toLocaleDateString("vi-VN"),
    };
    localStorage.setItem("nv-listings-board", JSON.stringify([...listings, newListing]));
    setCancelStep("done");
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      <div className="bg-white border-b border-gray-100 px-6 py-5">
        <h2 className="text-gray-900 font-bold" style={{ fontSize: "1.1rem" }}>Hồ sơ cư dân</h2>
        <p className="text-gray-400" style={{ fontSize: "0.78rem" }}>Thông tin tài khoản & hợp đồng</p>
      </div>

      <div className="p-6 max-w-3xl space-y-5">
        {/* User card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center flex-shrink-0 shadow-lg">
            <User size={28} className="text-white" />
          </div>
          <div className="flex-1">
            <p className="text-gray-900 font-bold" style={{ fontSize: "1.1rem" }}>{tenantUser.name || "Nguyễn Văn An"}</p>
            <p className="text-gray-500 flex items-center gap-1.5 mt-0.5" style={{ fontSize: "0.82rem" }}>
              <Mail size={13} />{tenantUser.email || "tenant@example.com"}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5 text-gray-500" style={{ fontSize: "0.78rem" }}>
              <Building2 size={13} />
              {tenantUser.unit ? `Phòng ${tenantUser.unit}` : "Phòng 1204"} • {tenantUser.buildingName || "Sunrise City North"}
            </div>
          </div>
          <span className="px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 font-semibold" style={{ fontSize: "0.78rem" }}>
            ✓ Đang thuê
          </span>
        </div>

        {/* Info sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Personal info */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-50">
              <p className="text-gray-900 font-bold" style={{ fontSize: "0.9rem" }}>Thông tin cá nhân</p>
            </div>
            <div className="divide-y divide-gray-50">
              {[
                { icon: User, label: "Họ và tên", value: tenantUser.name || "Nguyễn Văn An" },
                { icon: Mail, label: "Email", value: tenantUser.email || "tenant@example.com" },
                { icon: Phone, label: "Điện thoại", value: "0901 234 567" },
                { icon: Shield, label: "CCCD", value: "079 *** *** 001" },
              ].map((row) => (
                <div key={row.label} className="flex items-center gap-3 px-5 py-3.5">
                  <row.icon size={15} className="text-gray-400 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-gray-400" style={{ fontSize: "0.68rem" }}>{row.label}</p>
                    <p className="text-gray-900 font-semibold" style={{ fontSize: "0.875rem" }}>{row.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contract */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-50">
              <p className="text-gray-900 font-bold" style={{ fontSize: "0.9rem" }}>Hợp đồng thuê</p>
            </div>
            <div className="divide-y divide-gray-50">
              {[
                { icon: FileText, label: "Số hợp đồng", value: "HD-2025-001" },
                { icon: Building2, label: "Tòa nhà", value: tenantUser.buildingName || "Sunrise City North" },
                { icon: MapPin, label: "Phòng", value: tenantUser.unit ? `Phòng ${tenantUser.unit}` : "Phòng 1204" },
                { icon: Calendar, label: "Hiệu lực", value: "01/01/2025 – 31/12/2025" },
              ].map((row) => (
                <div key={row.label} className="flex items-center gap-3 px-5 py-3.5">
                  <row.icon size={15} className="text-gray-400 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-gray-400" style={{ fontSize: "0.68rem" }}>{row.label}</p>
                    <p className="text-gray-900 font-semibold" style={{ fontSize: "0.875rem" }}>{row.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50">
            <p className="text-gray-900 font-bold" style={{ fontSize: "0.9rem" }}>Cài đặt tài khoản</p>
          </div>
          <div className="divide-y divide-gray-50">
            {/* Dark mode toggle */}
            <div className="flex items-center gap-3 px-5 py-3.5">
              {isDark ? <Moon size={15} className="text-violet-500" /> : <Sun size={15} className="text-amber-500" />}
              <span className="flex-1 text-gray-700" style={{ fontSize: "0.875rem" }}>Giao diện tối</span>
              <motion.button whileTap={{ scale: 0.9 }} onClick={toggleDark}
                className={`w-12 h-6 rounded-full relative transition-colors ${isDark ? "bg-emerald-500" : "bg-gray-200"}`}>
                <motion.div animate={{ x: isDark ? 24 : 2 }} className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm" />
              </motion.button>
            </div>
            {[
              { label: "Đổi mật khẩu", icon: Shield },
              { label: "Thông báo & nhắc nhở", icon: Bell },
              { label: "Ngôn ngữ: Tiếng Việt", icon: Settings },
              { label: "Điều khoản sử dụng", icon: FileText },
            ].map(({ label, icon: Icon }) => (
              <button key={label} className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 transition-colors text-left">
                <Icon size={15} className="text-gray-400" />
                <span className="flex-1 text-gray-700" style={{ fontSize: "0.875rem" }}>{label}</span>
                <ChevronRight size={15} className="text-gray-400" />
              </button>
            ))}
          </div>
        </div>

        {/* Cancel residence — danger zone */}
        <div className="bg-white rounded-2xl border border-red-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-red-50">
            <p className="text-red-700 font-bold" style={{ fontSize: "0.9rem" }}>Vùng nguy hiểm</p>
          </div>
          <div className="p-5 space-y-3">
            <div className="bg-red-50 rounded-xl p-4 flex items-start gap-3">
              <AlertTriangle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-800 font-semibold" style={{ fontSize: "0.875rem" }}>Hủy chỗ ở</p>
                <p className="text-red-600" style={{ fontSize: "0.78rem" }}>Khi hủy, AI sẽ tự động thông báo quản lý và đăng tin tìm cư dân mới. Hành động này không thể hoàn tác.</p>
              </div>
            </div>
            <button onClick={() => { setShowCancelModal(true); setCancelStep("confirm"); }}
              className="w-full flex items-center justify-center gap-2 bg-red-500 text-white py-3 rounded-xl hover:bg-red-600 transition-colors"
              style={{ fontSize: "0.9rem", fontWeight: 600 }}>
              <X size={17} />Hủy chỗ ở & kết thúc hợp đồng
            </button>
            <button onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 text-gray-600 border border-gray-200 py-3 rounded-xl hover:bg-gray-50 transition-colors"
              style={{ fontSize: "0.875rem" }}>
              <LogOut size={16} />Đăng xuất
            </button>
          </div>
        </div>
      </div>

      {/* Cancel modal */}
      <AnimatePresence>
        {showCancelModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6" onClick={() => setShowCancelModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md bg-white rounded-3xl p-7 shadow-2xl" onClick={(e) => e.stopPropagation()}>
              {cancelStep === "confirm" && (
                <>
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-4">
                      <AlertTriangle size={30} className="text-red-500" />
                    </div>
                    <h3 className="text-gray-900 font-bold" style={{ fontSize: "1.05rem" }}>Xác nhận hủy chỗ ở?</h3>
                    <p className="text-gray-500 mt-2" style={{ fontSize: "0.85rem", lineHeight: 1.6 }}>
                      AI sẽ tự động thông báo tới quản lý tòa nhà và tạo tin đăng tìm cư dân mới. Hợp đồng hiện tại sẽ được kết thúc sớm.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setShowCancelModal(false)} className="flex-1 border border-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors" style={{ fontSize: "0.9rem" }}>Giữ lại</button>
                    <button onClick={() => setCancelStep("reason")} className="flex-1 bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600 transition-colors" style={{ fontSize: "0.9rem" }}>Tiếp tục</button>
                  </div>
                </>
              )}
              {cancelStep === "reason" && (
                <>
                  <div className="mb-5">
                    <h3 className="text-gray-900 font-bold mb-1" style={{ fontSize: "1.05rem" }}>Lý do hủy</h3>
                    <p className="text-gray-500" style={{ fontSize: "0.82rem" }}>Thông tin này giúp AI cải thiện dịch vụ</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {["Chuyển thành phố", "Mua nhà riêng", "Giá tăng cao", "Thay đổi công việc", "Sự cố chưa giải quyết", "Lý do khác"].map((r) => (
                      <button key={r} onClick={() => setReason(r)}
                        className={`py-2.5 px-3 rounded-xl border text-left transition-all ${reason === r ? "border-red-400 bg-red-50 text-red-700" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}
                        style={{ fontSize: "0.78rem", fontWeight: reason === r ? 600 : 400 }}>{r}</button>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setCancelStep("confirm")} className="flex-1 border border-gray-200 text-gray-700 py-3 rounded-xl font-semibold" style={{ fontSize: "0.9rem" }}>Quay lại</button>
                    <button onClick={handleCancelResidence} className="flex-1 bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600 transition-colors" style={{ fontSize: "0.9rem" }}>Xác nhận hủy</button>
                  </div>
                </>
              )}
              {cancelStep === "done" && (
                <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-center py-4">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={30} className="text-emerald-500" />
                  </div>
                  <h3 className="text-gray-900 font-bold mb-2" style={{ fontSize: "1.05rem" }}>Đã hủy thành công</h3>
                  <p className="text-gray-500" style={{ fontSize: "0.85rem", lineHeight: 1.6 }}>
                    AI đã thông báo tới quản lý và tự động đăng tin tìm cư dân mới. Chúc bạn may mắn trên hành trình mới!
                  </p>
                  <div className="mt-4 bg-violet-50 border border-violet-100 rounded-xl p-3 text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <Bot size={13} className="text-violet-600" />
                      <span className="text-violet-700 font-semibold" style={{ fontSize: "0.75rem" }}>AI Listing Verifier</span>
                    </div>
                    <p className="text-violet-600" style={{ fontSize: "0.72rem" }}>Đã tạo tin đăng tự động và đang kiểm duyệt. Phòng sẽ được hiển thị trên sàn trong vài phút.</p>
                  </div>
                  <button onClick={() => setShowCancelModal(false)} className="mt-5 w-full bg-gray-900 text-white py-3 rounded-xl font-semibold" style={{ fontSize: "0.9rem" }}>
                    Đóng
                  </button>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
