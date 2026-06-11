import { motion } from "motion/react";
import { MapPin, Search, ArrowRight, Bot } from "lucide-react";
import { REAL_LISTINGS } from "../data";

interface Props {
  query: string;
  onGetStarted: () => void;
  t: (vi: string, en: string) => string;
}

export function SearchResultsSection({ query, onGetStarted, t }: Props) {
  const q = query.trim().toLowerCase();
  const results = REAL_LISTINGS.filter(l =>
    l.title.toLowerCase().includes(q) ||
    l.district.toLowerCase().includes(q) ||
    l.province.toLowerCase().includes(q) ||
    l.amenities.some(a => a.toLowerCase().includes(q))
  ).slice(0, 9);

  return (
    <section className="py-16 px-6 border-t border-white/5" style={{ background: "rgba(255,255,255,0.012)" }}>
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="text-white/40 mb-1" style={{ fontSize: "0.75rem", letterSpacing: "0.1em" }}>
                {t("KẾT QUẢ TÌM KIẾM","SEARCH RESULTS")}
              </p>
              <h2 className="text-white font-bold" style={{ fontSize: "clamp(1.2rem,2.5vw,1.8rem)", letterSpacing: "-0.03em" }}>
                {results.length > 0
                  ? t(`${results.length} kết quả cho "${query}"`, `${results.length} results for "${query}"`)
                  : t(`Không tìm thấy kết quả cho "${query}"`, `No results for "${query}"`)}
              </h2>
            </div>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={onGetStarted}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-white font-semibold"
              style={{ fontSize: "0.85rem", background: "linear-gradient(135deg,#22d3ee,#3b82f6)", boxShadow: "0 0 18px rgba(34,211,238,0.2)" }}>
              <Bot size={14} />{t("Hỏi AI Super Broker","Ask AI Super Broker")}<ArrowRight size={13} />
            </motion.button>
          </div>
        </motion.div>

        {results.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {results.map((apt, i) => (
              <motion.div key={apt.id}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -6 }}
                onClick={onGetStarted}
                className="rounded-2xl overflow-hidden cursor-pointer group"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="relative h-40 overflow-hidden">
                  <img src={apt.image} alt={apt.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-white font-semibold"
                    style={{ fontSize: "0.6rem", background: "rgba(34,211,238,0.85)" }}>{apt.type}</span>
                  <div className="absolute bottom-2 left-3 right-3">
                    <p className="text-white font-bold truncate" style={{ fontSize: "0.82rem" }}>{apt.title}</p>
                    <p className="text-white/60 flex items-center gap-1 mt-0.5" style={{ fontSize: "0.68rem" }}>
                      <MapPin size={9} />{apt.district}
                    </p>
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-cyan-400 font-bold" style={{ fontSize: "0.95rem" }}>{apt.price}</p>
                  <p className="text-white/35 mt-0.5" style={{ fontSize: "0.7rem" }}>{apt.area}</p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center rounded-2xl"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
            <Search size={32} className="text-white/12 mb-4" />
            <p className="text-white/35" style={{ fontSize: "0.95rem" }}>
              {t("Không tìm thấy kết quả phù hợp","No matching listings found")}
            </p>
            <p className="text-white/20 mt-1 mb-6" style={{ fontSize: "0.8rem" }}>
              {t("Thử từ khóa khác hoặc hỏi AI Super Broker","Try different keywords or ask AI Super Broker")}
            </p>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={onGetStarted}
              className="flex items-center gap-2 px-6 py-3 rounded-full text-white font-semibold"
              style={{ fontSize: "0.85rem", background: "linear-gradient(135deg,#22d3ee,#3b82f6)" }}>
              <Bot size={14} />{t("Hỏi AI Super Broker","Ask AI Super Broker")}<ArrowRight size={13} />
            </motion.button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
