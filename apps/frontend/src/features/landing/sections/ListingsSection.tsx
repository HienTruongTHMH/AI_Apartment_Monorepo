import { useState, useEffect, type RefObject } from "react";
import { motion } from "motion/react";
import type { MotionValue } from "motion/react";
import { Star, MapPin, ArrowRight, ChevronRight, Home } from "lucide-react";
import { LazyImage } from "@shared/components/LazyImage";
import { SocialProofBadge } from "../components";
import { REAL_LISTINGS, FEATURED_REAL } from "../data";
import { api } from "@/lib/api";

type FeaturedListing = typeof FEATURED_REAL[number];

interface ListingsSectionProps {
  listingsRef: RefObject<HTMLElement | null>;
  listingsDrift: MotionValue<number>;
  listingFilter: "all" | "hc" | "tk" | "st" | "lc";
  setListingFilter: (f: "all" | "hc" | "tk" | "st" | "lc") => void;
  selectedListings: string[];
  toggleCompare: (id: string) => void;
  onContactListing: (apt: any) => void;
  onGetStarted: () => void;
  t: (vi: string, en: string) => string;
}

interface Listings {
  id: string,
  title: string,
  description: string,
  pricePerMonth: number,
  images: {
    imageUrl: string;
    isPrimary: boolean;
  } [],
  apartment: {
    district: string,
    area: number,
    floor: number,
    room_number: number,
    type: string,
    note: string,
    fullAddress: string
    bedroom: string,
    livingroom: string,
    kitchen: string,
    bathroom: string,
  }

}

export default function ListingsSection({
  listingsRef, listingsDrift, listingFilter, setListingFilter,
  selectedListings, toggleCompare, onContactListing, onGetStarted, t,
}: ListingsSectionProps) {

  const [listings, setListings] = useState<Listings[]>([]);
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await api.get('/listing');
        const result = await res.data;

        console.log("Đang kết nối đến API Lisitng: ");
        console.log("Kết quả nhận được: \n", result );

        if(result){
          setListings(result);
        } 

      } catch (error) {
        console.error("Không thể gọi API Listings: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  const countHC = listings.filter((apt) => apt.apartment?.district?.includes("Hải Châu") ).length;
  const countTK = listings.filter((apt) => apt.apartment?.district?.includes("Thanh Khê") ).length;
  const countST = listings.filter((apt) => apt.apartment?.district?.includes("Sơn Trà") ).length;
  const countLC = listings.filter((apt) => apt.apartment?.district?.includes("Liên Chiểu") ).length;


  if (loading) {
    return (
      <section className="py-28 px-6 flex justify-center items-center">
        <div className="animate-pulse text-cyan-400 font-bold">Đang tải danh sách căn hộ...</div>
      </section>
    );
  }

  return (
    <section ref={listingsRef} className="py-28 px-6" style={{ background: "rgba(255,255,255,0.015)" }}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-3" style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.18)" }}>
              <Home size={12} className="text-emerald-400" />
              <span className="text-emerald-400" style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.08em" }}>{t("TIN THUÊ NHÀ THỰC TẾ","REAL RENTAL LISTINGS")}</span>
            </div>
            <h2 className="text-white" style={{ fontSize: "clamp(1.6rem,3vw,2.4rem)", fontWeight: 900, letterSpacing: "-0.04em" }}>
              {t("Tin thuê nhà thực tế","Live rental listings")}
            </h2>
            <p className="text-white/35 mt-1" style={{ fontSize: "0.85rem" }}>
              {t(`${listings.length} căn hộ & phòng trọ thực tế · nhiều tỉnh thành`,`${listings.length} real rentals · multiple cities`)}
            </p>
          </div>
          <div className="flex flex-col items-end gap-3">
            <button onClick={onGetStarted} className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors" style={{ fontSize: "0.875rem" }}>
              {t("Xem tất cả","View all")}<ArrowRight size={15} />
            </button>
            <SocialProofBadge t={t} />
          </div>
        </motion.div>

        {/* Province filter tabs */}
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          {([
            { key: "all",   label: t("Tất cả","All"),       count: listings.length },
            { key: "hc",   label: "Hải Châu",       count: countHC },
            { key: "tk",    label: "Thanh Khê",                 count:  countTK },
            { key: "st",    label: "Sơn Trà",                 count: countST },
            { key: "lc",    label: "Liên Chiểu",                 count: countLC },
          ] as { key: "all"|"hc"|"tk"|"st"|"lc"; label: string; count: number }[]).map(tab => (
            <button key={tab.key} onClick={() => setListingFilter(tab.key)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border transition-all"
              style={{
                fontSize: "0.75rem", fontWeight: 600,
                background: listingFilter === tab.key ? "rgba(34,211,238,0.15)" : "rgba(255,255,255,0.04)",
                borderColor: listingFilter === tab.key ? "rgba(34,211,238,0.5)" : "rgba(255,255,255,0.1)",
                color: listingFilter === tab.key ? "#22d3ee" : "rgba(255,255,255,0.45)",
              }}>
              {tab.label}
              <span className="px-1.5 py-0.5 rounded-full text-white/40"
                style={{ fontSize: "0.6rem", background: "rgba(255,255,255,0.08)" }}>{tab.count}</span>
            </button>
          ))}
        </div>

        <div className="overflow-x-auto pb-4 -mx-6 px-6 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
          <motion.div className="flex gap-5" style={{ minWidth: "max-content", x: listingsDrift }}>
            {listings.length === 0 ? (
              <div className="text-white/50 py-10 w-full text-center">Chưa có bài đăng nào phù hợp...</div>
            ) : (
              listings
                .filter((item) => {
                  const addr = item.apartment?.district || "";
                  if (listingFilter === "all") return true;
                  if (listingFilter === "hc") return addr.includes("Hải Châu");
                  if (listingFilter === "tk") return addr.includes("Thanh Khê");
                  if (listingFilter === "st") return addr.includes("Sơn Trà");
                  if (listingFilter === "lc") return addr.includes("Liên Chiểu");
                  return !addr.includes("Hải Châu") && !addr.includes("Thanh Khê")  && !addr.includes("Sơn Trà")  && !addr.includes("Liên Chiểu");
                })
                .map((item, i) => {
                  // Xử lý logic hiển thị từng Card
                  const isCompared = selectedListings.includes(item.id);
                  const badgeHex = "#22d3ee"; // Màu chủ đạo Cyan
                  const priceM = (item.pricePerMonth / 1000000).toFixed(1); // Format 8500000 -> 8.5M
                  const coverImage = item.images[0]?.imageUrl || "https://xzwpyzamhyevocaqmyhn.supabase.co/storage/v1/object/public/apartment-listings/imageError.png";
                  const district = item.apartment?.district || "Đà Nẵng";
                  
                  const tickerMsgs = [`1 trống`, `${2 + (i % 4)} đang xem`, "Vừa được quan tâm"];
                  const tickerIdx = Math.floor(Date.now() / 4000 + i) % tickerMsgs.length;

                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: Math.min(i, 3) * 0.08 }}
                      whileHover={{ y: -10, scale: 1.015 }}
                      onClick={() => onContactListing(item)}
                      className="rounded-3xl overflow-hidden cursor-pointer flex-shrink-0 group relative"
                      style={{
                        width: "280px",
                        background: isCompared ? `${badgeHex}0d` : "rgba(255,255,255,0.04)",
                        border: `1px solid ${isCompared ? badgeHex + "50" : "rgba(255,255,255,0.09)"}`,
                        boxShadow: "0 4px 24px rgba(0,0,0,0.25)",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.boxShadow = `0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px ${badgeHex}60`;
                        if (!isCompared) (e.currentTarget as HTMLElement).style.borderColor = `${badgeHex}44`;
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 24px rgba(0,0,0,0.25)";
                        if (!isCompared) (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.09)";
                      }}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleCompare(item.id);
                        }}
                        className="absolute top-3 left-3 z-10 w-7 h-7 rounded-full flex items-center justify-center transition-all"
                        style={{
                          background: isCompared ? badgeHex : "rgba(0,0,0,0.55)",
                          backdropFilter: "blur(8px)",
                          border: `1px solid ${isCompared ? badgeHex : "rgba(255,255,255,0.2)"}`,
                          boxShadow: isCompared ? `0 0 12px ${badgeHex}80` : "none",
                        }}
                      >
                        <span className="text-white font-bold" style={{ fontSize: "0.85rem", lineHeight: 1 }}>
                          {isCompared ? "✓" : "+"}
                        </span>
                      </button>

                      <div className="relative h-48 overflow-hidden bg-gray-800">
                        <LazyImage
                          src={coverImage}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        <span
                          className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-white uppercase tracking-wider"
                          style={{ fontSize: "0.6rem", fontWeight: 700, background: badgeHex, boxShadow: `0 0 10px ${badgeHex}80` }}
                        >
                          CHO THUÊ
                        </span>
                        <div
                          className="absolute top-12 right-3 rounded-full px-2 py-1 flex items-center gap-1"
                          style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)" }}
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span className="text-white" style={{ fontSize: "0.58rem", fontWeight: 600 }}>
                            {tickerMsgs[tickerIdx]}
                          </span>
                        </div>
                        <div className="absolute bottom-3 left-3 right-3">
                          <h3 className="text-white font-bold truncate" style={{ fontSize: "0.9rem" }}>{item.title}</h3>
                          <p className="text-white/70 flex items-center gap-1 mt-1" style={{ fontSize: "0.75rem" }}>
                            <MapPin size={10} /> {district}
                          </p>
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <div className="flex items-baseline gap-1 mb-3">
                          <span className="text-cyan-400 font-bold" style={{ fontSize: "1.2rem" }}>{priceM}</span>
                          <span className="text-cyan-400 font-bold" style={{ fontSize: "1rem" }}>Triệu</span>
                          <span className="text-white/40 ml-1" style={{ fontSize: "0.7rem" }}>/tháng</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          <span className="text-white/60 px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[0.65rem]">
                            {item.apartment?.bedroom || 1} PN
                          </span>
                          <span className="text-white/60 px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[0.65rem]">
                            {item.apartment?.bathroom || 1} WC
                          </span>
                          <span className="text-white/60 px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[0.65rem]">
                            Tầng {item.apartment?.floor || 1}
                          </span>
                        </div>
                        <div className="flex items-center justify-between pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                          <div className="flex items-center gap-1">
                            <Star size={11} className="text-yellow-400" style={{ fill: "#facc15" }} />
                            <span className="text-white/60" style={{ fontSize: "0.75rem" }}>5.0</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-white/40 font-medium" style={{ fontSize: "0.75rem" }}>
                              {item.apartment?.area || 0} m²
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
            )}
          </motion.div>
        </div>

        <div className="flex items-center justify-center gap-4 mt-10">
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onGetStarted}
            className="flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-white hover:opacity-90 transition-opacity"
            style={{ fontSize: "0.9rem", background: "linear-gradient(135deg,#34d399,#22d3ee)", boxShadow: "0 0 24px rgba(52,211,153,0.2)" }}>
            {t("Đăng ký vào hệ thống","Create an account")}<ArrowRight size={16} />
          </motion.button>
          <button onClick={onGetStarted} className="flex items-center gap-1.5 text-white/40 hover:text-white/70 transition-colors" style={{ fontSize: "0.875rem" }}>
            {t("Duyệt tất cả","Browse all")}<ChevronRight size={14} />
          </button>
        </div>
      </div>
    </section>
  );
}
