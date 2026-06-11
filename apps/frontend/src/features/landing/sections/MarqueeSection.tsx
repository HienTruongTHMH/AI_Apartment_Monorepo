import { MARQUEE_ITEMS } from "../data";

export default function MarqueeSection() {
  return (
    <div className="border-y overflow-hidden relative select-none" style={{ borderColor: "rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.018)" }}>
      <div className="absolute left-0 top-0 bottom-0 w-24 pointer-events-none z-10" style={{ background: "linear-gradient(90deg, #030B14 0%, transparent 100%)" }} />
      <div className="absolute right-0 top-0 bottom-0 w-24 pointer-events-none z-10" style={{ background: "linear-gradient(270deg, #030B14 0%, transparent 100%)" }} />
      <div className="flex py-4 nv-marquee-track">
        {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
          <div key={i} className="flex items-center gap-3 flex-shrink-0 px-7">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: item.dot }} />
            <span className="text-white/40 whitespace-nowrap font-medium" style={{ fontSize: "0.82rem" }}>{item.text}</span>
            <span className="text-white/12 ml-2">✦</span>
          </div>
        ))}
      </div>
      <div className="flex pb-4 nv-marquee-track" style={{ animationDirection: "reverse", animationDuration: "35s" }}>
        {[...MARQUEE_ITEMS.slice(5), ...MARQUEE_ITEMS, ...MARQUEE_ITEMS.slice(0, 5)].map((item, i) => (
          <div key={i} className="flex items-center gap-3 flex-shrink-0 px-7">
            <div className="w-1 h-1 rounded-full" style={{ background: item.dot, opacity: 0.7 }} />
            <span className="text-white/22 whitespace-nowrap" style={{ fontSize: "0.74rem" }}>{item.text}</span>
            <span className="text-white/8 ml-2">·</span>
          </div>
        ))}
      </div>
    </div>
  );
}
