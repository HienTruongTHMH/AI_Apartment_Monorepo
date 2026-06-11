import { motion } from "motion/react";
import { CheckCircle } from "lucide-react";

interface PostSubmitButtonProps {
  submitted: boolean;
  onSubmit: () => void;
  disabled: boolean;
}

export default function PostSubmitButton({ submitted, onSubmit, disabled }: PostSubmitButtonProps) {
  if (submitted) {
    return (
      <div
        className="w-full flex items-center justify-center gap-3 py-4 rounded-xl"
        style={{
          border: "1px solid rgba(52,211,153,0.3)",
          background: "rgba(52,211,153,0.08)",
        }}
      >
        <CheckCircle size={20} className="text-emerald-400" />
        <span className="text-emerald-400 font-semibold" style={{ fontSize: "0.88rem" }}>
          Tin đăng đã được gửi! Đang chờ xét duyệt.
        </span>
      </div>
    );
  }

  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.01 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      onClick={onSubmit}
      disabled={disabled}
      className="w-full py-3.5 rounded-xl text-white font-semibold transition-all"
      style={{
        fontSize: "0.9rem",
        background: disabled
          ? "rgba(255,255,255,0.08)"
          : "linear-gradient(135deg,#22d3ee,#3b82f6)",
        boxShadow: disabled ? "none" : "0 0 20px rgba(34,211,238,0.25)",
        color: disabled ? "rgba(255,255,255,0.3)" : "white",
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      Đăng tin
    </motion.button>
  );
}
