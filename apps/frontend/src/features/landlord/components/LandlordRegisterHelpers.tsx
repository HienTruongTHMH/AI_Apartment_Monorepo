import { Info } from "lucide-react";

export const inputCls =
  "w-full bg-white/5 border border-white/15 rounded-xl py-2.5 pl-9 pr-4 text-white placeholder-white/25 outline-none focus:border-violet-500/50 transition-colors";
export const inputStyle = { fontSize: "0.875rem" };

export function Field({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-white/60 mb-1.5" style={{ fontSize: "0.8rem", fontWeight: 600 }}>
        {label}
      </label>
      <div className="relative">
        <Icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25 z-10" />
        {children}
      </div>
    </div>
  );
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-white font-semibold flex items-center gap-2" style={{ fontSize: "1rem" }}>
      {children}
    </p>
  );
}

export function InfoBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3 bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
      <Info size={15} className="text-blue-400 flex-shrink-0 mt-0.5" />
      <p className="text-blue-300/80" style={{ fontSize: "0.8rem", lineHeight: 1.65 }}>
        {children}
      </p>
    </div>
  );
}
