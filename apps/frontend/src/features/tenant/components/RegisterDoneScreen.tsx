import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { CheckCircle2, Mail, AlertCircle, ArrowRight, Bot } from "lucide-react";
import { type PersonalInfo, BUILDINGS } from "@features/tenant/components/TenantRegisterData";

interface RegisterDoneScreenProps {
  mode: "ai" | "building";
  info: PersonalInfo;
  building?: typeof BUILDINGS[number];
  unit?: string;
}

export default function RegisterDoneScreen({ mode, info, building, unit }: RegisterDoneScreenProps) {
  const navigate = useNavigate();
  const tempPass = info.email
    ? btoa(info.email.split("@")[0] + "2025").replace(/[^A-Za-z0-9]/g, "").slice(0, 10)
    : "Nv2025Abc!";

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12" style={{ backgroundColor: "#030B14" }}>
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center mx-auto mb-5 shadow-2xl shadow-emerald-500/30">
            <CheckCircle2 size={40} className="text-white" />
          </div>
          <h2 className="text-white mb-2" style={{ fontSize: "1.8rem", fontWeight: 800 }}>Đăng ký thành công!</h2>
          {mode === "building" && building ? (
            <p className="text-white/55" style={{ fontSize: "0.9rem", lineHeight: 1.7 }}>
              Yêu cầu vào phòng <strong className="text-white">{unit}</strong> tại{" "}
              <strong className="text-white">{building.name}</strong> đã được gửi tới quản lý.
            </p>
          ) : (
            <p className="text-white/55" style={{ fontSize: "0.9rem", lineHeight: 1.7 }}>
              AI Super Broker sẽ tìm căn hộ phù hợp và gửi về{" "}
              <strong className="text-white">{info.email}</strong> trong vài phút.
            </p>
          )}
        </div>

        <div className="rounded-2xl border border-white/10 overflow-hidden mb-6" style={{ background: "rgba(15,24,41,0.9)" }}>
          <div className="px-5 py-3.5 border-b border-white/8 flex items-center gap-3" style={{ background: "rgba(34,211,238,0.06)" }}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <Mail size={15} className="text-white" />
            </div>
            <div>
              <p className="text-white font-semibold" style={{ fontSize: "0.82rem" }}>NestaVietAI · noreply@nestaviet.vn</p>
              <p className="text-white/40" style={{ fontSize: "0.7rem" }}>Gửi đến: {info.email}</p>
            </div>
          </div>
          <div className="p-5">
            <p className="text-white font-bold mb-4" style={{ fontSize: "0.9rem" }}>Chào {info.fullName || "bạn"}, tài khoản đã sẵn sàng!</p>
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-2.5">
                <span className="text-white/50" style={{ fontSize: "0.78rem" }}>Email đăng nhập</span>
                <span className="text-cyan-400 font-mono font-semibold" style={{ fontSize: "0.78rem" }}>{info.email}</span>
              </div>
              <div className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-2.5">
                <span className="text-white/50" style={{ fontSize: "0.78rem" }}>Mật khẩu tạm thời</span>
                <span className="text-emerald-400 font-mono font-bold" style={{ fontSize: "0.82rem" }}>{tempPass}</span>
              </div>
              {mode === "building" && building && (
                <div className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-2.5">
                  <span className="text-white/50" style={{ fontSize: "0.78rem" }}>Trạng thái</span>
                  <span className="text-amber-400 font-semibold" style={{ fontSize: "0.78rem" }}>⏳ Chờ quản lý xét duyệt</span>
                </div>
              )}
            </div>
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 flex gap-2">
              <AlertCircle size={14} className="text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-amber-300" style={{ fontSize: "0.72rem", lineHeight: 1.6 }}>
                Bắt buộc đổi mật khẩu tạm thời trong lần đăng nhập đầu tiên.
              </p>
            </div>
          </div>
        </div>

        {mode === "building" && (
          <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl p-4 mb-5 flex items-start gap-3">
            <Bot size={16} className="text-violet-400 flex-shrink-0 mt-0.5" />
            <p className="text-violet-300" style={{ fontSize: "0.78rem", lineHeight: 1.6 }}>
              <strong>AI Agent</strong> đã gửi thông báo tới quản lý tòa nhà. Bạn sẽ nhận được xác nhận trong 1–2 ngày làm việc.
            </p>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <button onClick={() => navigate("/tenant/login")}
            className="flex items-center gap-2 justify-center px-8 py-3.5 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold hover:opacity-90 transition-opacity"
            style={{ fontSize: "0.9rem" }}>
            Đăng nhập ngay <ArrowRight size={17} />
          </button>
          <button onClick={() => navigate("/")} className="text-white/35 hover:text-white/60 transition-colors text-center" style={{ fontSize: "0.82rem" }}>
            Về trang chủ
          </button>
        </div>
      </motion.div>
    </div>
  );
}
