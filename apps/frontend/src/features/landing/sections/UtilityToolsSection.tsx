import { BarChart3, HandCoins, BookOpen } from "lucide-react";
import { motion } from "motion/react";

const TOOLS = [
  {
    icon: BarChart3,
    label: "Biểu đồ giá",
    grad: "from-cyan-500 to-blue-600",
    glow: "rgba(34,211,238,0.18)",
  },
  {
    icon: HandCoins,
    label: "Vay mua nhà",
    grad: "from-emerald-500 to-teal-600",
    glow: "rgba(52,211,153,0.18)",
  },
  {
    icon: BookOpen,
    label: "Kinh nghiệm",
    grad: "from-violet-500 to-purple-700",
    glow: "rgba(139,92,246,0.18)",
  },
];

export default function UtilityToolsSection() {
  return (
    <section className="py-14 px-6">
      <div className="max-w-3xl mx-auto">
        <p className="text-white font-semibold mb-6" style={{ fontSize: "1rem" }}>
          Công cụ tiện ích
        </p>
        <div className="grid grid-cols-3 gap-4">
          {TOOLS.map(({ icon: Icon, label, grad, glow }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="flex flex-col items-center gap-4 py-8 px-4 rounded-2xl border border-white/8 hover:bg-white/[0.06] transition-colors cursor-default"
              style={{ background: "rgba(255,255,255,0.03)" }}
            >
              <div
                className={`w-14 h-14 rounded-xl bg-gradient-to-br ${grad} flex items-center justify-center`}
                style={{ boxShadow: `0 8px 24px ${glow}` }}
              >
                <Icon size={24} className="text-white" />
              </div>
              <span className="text-white/70 font-medium text-center" style={{ fontSize: "0.85rem" }}>
                {label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
