import { useState, useMemo } from "react";
import { motion } from "motion/react";
import { User, Phone, Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { type PersonalInfo, capitalizeWords, formatPhone } from "@features/tenant/components/TenantRegisterData";

interface PersonalInfoStepProps {
  info: PersonalInfo;
  onChange: (updates: Partial<PersonalInfo>) => void;
  attempted: boolean;
}

export default function PersonalInfoStep({ info, onChange, attempted }: PersonalInfoStepProps) {
  const [showPass, setShowPass] = useState(false);

  const errors = useMemo(() => {
    const e: string[] = [];
    if (!info.fullName.trim()) e.push("Họ và tên không được để trống");
    if (!info.phone.trim()) e.push("Số điện thoại không được để trống");
    if (!info.email.trim()) e.push("Email không được để trống");
    if (info.password.length < 6) e.push(`Mật khẩu cần ít nhất 6 ký tự`);
    if (info.password && info.confirmPassword && info.password !== info.confirmPassword)
      e.push("Mật khẩu xác nhận không khớp");
    return e;
  }, [info]);

  const fields = [
    { key: "fullName" as const, label: "Họ và tên", icon: User, type: "text", placeholder: "Nguyễn Văn An", autoComplete: "name", capitalize: true },
    { key: "phone" as const, label: "Số điện thoại", icon: Phone, type: "tel", placeholder: "0901 234 567", autoComplete: "tel" },
    { key: "email" as const, label: "Email", icon: Mail, type: "email", placeholder: "email@example.com", autoComplete: "email" },
  ];

  return (
    <div className="space-y-4">
      {fields.map(({ key, label, icon: Icon, type, placeholder, autoComplete, capitalize }) => (
        <div key={key}>
          <label className="block text-white/70 mb-2" style={{ fontSize: "0.85rem", fontWeight: 600 }}>
            {label} <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <Icon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type={type}
              inputMode={type === "tel" ? "numeric" : undefined}
              placeholder={placeholder}
              value={info[key]}
              onChange={(e) => onChange({ [key]: key === "phone" ? formatPhone(e.target.value) : e.target.value })}
              onBlur={capitalize ? (e) => onChange({ [key]: capitalizeWords(e.target.value) }) : undefined}
              className="w-full bg-white/5 border border-white/15 rounded-xl py-3 pl-9 pr-4 text-white placeholder-white/25 outline-none focus:border-cyan-500/50 transition-colors"
              style={{ fontSize: "0.875rem" }}
              autoComplete={autoComplete}
            />
          </div>
        </div>
      ))}

      {(["password", "confirmPassword"] as const).map((key) => (
        <div key={key}>
          <label className="block text-white/70 mb-2" style={{ fontSize: "0.85rem", fontWeight: 600 }}>
            {key === "password" ? "Mật khẩu" : "Xác nhận mật khẩu"} <span className="text-red-400">*</span>
            {key === "password" && <span className="text-white/35 font-normal ml-1">(tối thiểu 6 ký tự)</span>}
          </label>
          <div className="relative">
            <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type={showPass ? "text" : "password"}
              placeholder={key === "password" ? "••••••" : "Nhập lại mật khẩu"}
              value={info[key]}
              onChange={(e) => onChange({ [key]: e.target.value })}
              className={`w-full bg-white/5 border rounded-xl py-3 pl-9 pr-10 text-white placeholder-white/25 outline-none transition-colors ${
                key === "confirmPassword" && info.confirmPassword && info.confirmPassword !== info.password
                  ? "border-red-500/60"
                  : "border-white/15 focus:border-cyan-500/50"
              }`}
              style={{ fontSize: "0.875rem" }}
            />
            {key === "password" && (
              <button type="button" onClick={() => setShowPass((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            )}
          </div>
          {key === "password" && info.password.length > 0 && info.password.length < 6 && (
            <p className="mt-1 text-amber-400" style={{ fontSize: "0.72rem" }}>Còn {6 - info.password.length} ký tự nữa</p>
          )}
          {key === "confirmPassword" && info.confirmPassword && info.confirmPassword !== info.password && (
            <p className="mt-1 text-red-400" style={{ fontSize: "0.72rem" }}>Mật khẩu không khớp</p>
          )}
        </div>
      ))}

      {attempted && errors.length > 0 && (
        <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/10 border border-red-500/25 rounded-xl px-4 py-3">
          <p className="text-red-400 font-semibold mb-1.5 flex items-center gap-1.5" style={{ fontSize: "0.8rem" }}>
            <AlertCircle size={14} />Cần hoàn thiện:
          </p>
          <ul className="space-y-0.5">
            {errors.map((e) => <li key={e} className="text-red-400/80" style={{ fontSize: "0.75rem" }}>• {e}</li>)}
          </ul>
        </motion.div>
      )}

      <p className="text-white/35" style={{ fontSize: "0.75rem", lineHeight: 1.6 }}>
        Bằng cách đăng ký, bạn đồng ý với{" "}
        <button className="text-cyan-400 underline">Điều khoản dịch vụ</button> và{" "}
        <button className="text-cyan-400 underline">Chính sách bảo mật</button>.
      </p>
    </div>
  );
}
