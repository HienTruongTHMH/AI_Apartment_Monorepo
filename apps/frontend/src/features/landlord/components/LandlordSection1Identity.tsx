import { useState } from "react";
import { motion } from "motion/react";
import { User, Phone, Mail, Lock, Eye, EyeOff, AlertCircle, Hash } from "lucide-react";
import {
  type LandlordFormData,
  capitalizeWords, digitsOnly, formatPhone,
} from "@features/landlord/components/LandlordRegisterTypes";
import { Field, InfoBox, inputCls, inputStyle } from "@features/landlord/components/LandlordRegisterHelpers";

interface Props {
  form: LandlordFormData;
  set: (key: keyof LandlordFormData, val: string) => void;
  attempted: boolean;
  errors: string[];
}

export default function LandlordSection1Identity({ form, set, attempted, errors }: Props) {
  const [showPass, setShowPass] = useState(false);

  return (
    <div className="space-y-5">
      <p className="text-white font-semibold" style={{ fontSize: "1rem" }}>Thông tin chủ sở hữu / người đại diện</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Họ và tên *" icon={User}>
          <input type="text" placeholder="Nguyễn Văn An" value={form.fullName}
            onChange={(e) => set("fullName", e.target.value)}
            onBlur={(e) => set("fullName", capitalizeWords(e.target.value))}
            autoComplete="name"
            className={inputCls} style={inputStyle} />
        </Field>
        <Field label="Số CCCD / CMND *" icon={Hash}>
          <input type="text" inputMode="numeric" placeholder="079xxxxxxxxx" value={form.idNumber}
            onChange={(e) => set("idNumber", digitsOnly(e.target.value, 12))}
            className={inputCls} style={inputStyle} />
        </Field>
        <Field label="Số điện thoại *" icon={Phone}>
          <input type="tel" inputMode="numeric" placeholder="0901 234 567" value={form.phone}
            onChange={(e) => set("phone", formatPhone(e.target.value))}
            autoComplete="tel"
            className={inputCls} style={inputStyle} />
        </Field>
        <Field label="Email *" icon={Mail}>
          <input type="email" placeholder="email@example.com" value={form.email}
            onChange={(e) => set("email", e.target.value)}
            className={inputCls} style={inputStyle} />
        </Field>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Mật khẩu * (tối thiểu 8 ký tự)" icon={Lock}>
          <div className="relative">
            <input type={showPass ? "text" : "password"} placeholder="Mật khẩu mạnh..."
              value={form.password} onChange={(e) => set("password", e.target.value)}
              className={inputCls + " pr-9"} style={inputStyle} />
            <button type="button" onClick={() => setShowPass((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
              {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </Field>
        <Field label="Xác nhận mật khẩu *" icon={Lock}>
          <input type={showPass ? "text" : "password"} placeholder="Nhập lại mật khẩu"
            value={form.confirmPassword} onChange={(e) => set("confirmPassword", e.target.value)}
            className={`${inputCls} ${form.confirmPassword && form.confirmPassword !== form.password ? "border-red-500/60" : ""}`}
            style={inputStyle} />
        </Field>
      </div>
      <InfoBox>
        Thông tin xác minh danh tính được sử dụng để tuân thủ quy định pháp luật về cho thuê bất động sản và ngăn chặn gian lận.
      </InfoBox>
      {attempted && errors.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-3 bg-red-500/10 border border-red-500/25 rounded-xl px-4 py-3"
        >
          <AlertCircle size={15} className="text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-400 font-semibold mb-1" style={{ fontSize: "0.8rem" }}>Cần bổ sung:</p>
            <ul className="space-y-0.5">
              {errors.map((e) => (
                <li key={e} className="text-red-400/80" style={{ fontSize: "0.75rem" }}>• {e}</li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}
    </div>
  );
}
