import { useState } from "react";
import { motion } from "motion/react";
import {
  Bot, MapPin, Heart, Star, Calendar,
  Search, Filter, Grid, List,
  CheckCircle2, Clock, PawPrint, Dumbbell, Wifi,
} from "lucide-react";

interface ApartmentCard {
  id: string;
  name: string;
  address: string;
  price: string;
  area: string;
  rooms: string;
  rating: number;
  tags: string[];
  img: string;
  distance: string;
}

const MOCK_APARTMENTS: ApartmentCard[] = [
  { id: "a1", name: "Sunrise City North", address: "Quận 7, TP.HCM", price: "11.5M/tháng", area: "65m²", rooms: "2PN - 2WC", rating: 4.8, tags: ["Cách Q1 18p", "Pet-friendly", "Hồ bơi"], img: "https://images.unsplash.com/photo-1638454795595-0a0abf68614d?w=400", distance: "3.2km từ Q1" },
  { id: "a2", name: "Vinhomes Grand Park", address: "TP. Thủ Đức, TP.HCM", price: "9.8M/tháng", area: "58m²", rooms: "2PN - 1WC", rating: 4.6, tags: ["Cách Q1 25p", "Gym", "An ninh 24/7"], img: "https://images.unsplash.com/photo-1585128792103-0b591f96512e?w=400", distance: "8.1km từ Q1" },
  { id: "a3", name: "The River Thủ Thiêm", address: "Quận 2, TP.HCM", price: "14.2M/tháng", area: "72m²", rooms: "2PN - 2WC", rating: 4.9, tags: ["View sông", "Trung tâm", "Nội thất cao cấp"], img: "https://images.unsplash.com/photo-1763401929055-43fd29000be3?w=400", distance: "1.5km từ Q1" },
  { id: "a4", name: "Masteri Centre Point", address: "TP. Thủ Đức, TP.HCM", price: "10.5M/tháng", area: "55m²", rooms: "1PN - 1WC", rating: 4.5, tags: ["Cách Q1 20p", "Hồ bơi", "Trung tâm thương mại"], img: "https://images.unsplash.com/photo-1774716925810-e923c8206ed5?w=400", distance: "6.2km từ Q1" },
  { id: "a5", name: "Landmark 81 Residences", address: "Quận Bình Thạnh, TP.HCM", price: "18.9M/tháng", area: "90m²", rooms: "3PN - 2WC", rating: 5.0, tags: ["View sông", "Sky pool", "Penthouse"], img: "https://images.unsplash.com/photo-1638454795595-0a0abf68614d?w=400", distance: "2.8km từ Q1" },
  { id: "a6", name: "D'Edge Thảo Điền", address: "Quận 2, TP.HCM", price: "13.0M/tháng", area: "68m²", rooms: "2PN - 2WC", rating: 4.7, tags: ["Cách Q1 12p", "Gym", "Pet-friendly"], img: "https://images.unsplash.com/photo-1585128792103-0b591f96512e?w=400", distance: "4.1km từ Q1" },
];

const TAG_ICONS: Record<string, React.ElementType> = {
  "Pet-friendly": PawPrint, "Gym": Dumbbell, "Hồ bơi": Wifi, "Trung tâm": MapPin,
  "Nội thất cao cấp": Star, "An ninh 24/7": CheckCircle2, "Cách Q1 18p": Clock,
  "Cách Q1 25p": Clock, "View sông": MapPin, "Cách Q1 12p": Clock, "Cách Q1 20p": Clock,
};

function getListingsBoard() {
  try { return JSON.parse(localStorage.getItem("nv-listings-board") || "[]"); } catch { return []; }
}

export default function ExploreTab() {
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedDistrict, setSelectedDistrict] = useState("Tất cả");
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const listings = getListingsBoard() as { id: string; title: string; price: string; area: string; district: string; description: string; type: string; postedAt: string }[];

  const districts = ["Tất cả", "Quận 1", "Quận 2", "Quận 7", "Quận 9", "Bình Thạnh", "TP. Thủ Đức"];
  const filtered = MOCK_APARTMENTS.filter((apt) => {
    const matchSearch = apt.name.toLowerCase().includes(search.toLowerCase()) || apt.address.toLowerCase().includes(search.toLowerCase());
    const matchDistrict = selectedDistrict === "Tất cả" || apt.address.includes(selectedDistrict);
    return matchSearch && matchDistrict;
  });

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-gray-900 font-bold" style={{ fontSize: "1.1rem" }}>Khám phá căn hộ</h2>
            <p className="text-gray-400" style={{ fontSize: "0.78rem" }}>Tìm kiếm & lọc theo nhu cầu</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setViewMode("grid")} className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${viewMode === "grid" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
              <Grid size={16} />
            </button>
            <button onClick={() => setViewMode("list")} className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${viewMode === "list" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
              <List size={16} />
            </button>
          </div>
        </div>
        <div className="relative mb-3">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên, địa chỉ, quận..."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-gray-800 outline-none focus:border-emerald-400 transition-colors"
            style={{ fontSize: "0.875rem" }} />
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {districts.map((d) => (
            <button key={d} onClick={() => setSelectedDistrict(d)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full transition-colors ${selectedDistrict === d ? "bg-emerald-500 text-white shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              style={{ fontSize: "0.75rem", fontWeight: selectedDistrict === d ? 600 : 400 }}>{d}</button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {/* AI Listings from board */}
        {listings.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Bot size={15} className="text-violet-600" />
              <p className="text-gray-900 font-bold" style={{ fontSize: "0.9rem" }}>Tin đăng mới từ AI & Quản lý</p>
              <span className="px-2 py-0.5 rounded-full bg-violet-100 text-violet-700" style={{ fontSize: "0.65rem", fontWeight: 700 }}>Mới</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {listings.slice(0, 3).map((listing) => (
                <motion.div key={listing.id} whileHover={{ y: -2 }}
                  className="bg-white rounded-2xl border border-violet-100 shadow-sm p-4 cursor-pointer">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded-full bg-violet-100 text-violet-700" style={{ fontSize: "0.65rem", fontWeight: 600 }}>
                      {listing.type === "ai" ? "🤖 AI Đăng" : "🏢 Quản lý đăng"}
                    </span>
                    <span className="text-gray-400" style={{ fontSize: "0.65rem" }}>{listing.postedAt}</span>
                  </div>
                  <p className="text-gray-900 font-bold" style={{ fontSize: "0.9rem" }}>{listing.title}</p>
                  <p className="text-gray-500 mt-1 line-clamp-2" style={{ fontSize: "0.78rem" }}>{listing.description}</p>
                  <div className="flex items-center justify-between mt-3">
                    <div>
                      <p className="text-emerald-600 font-bold" style={{ fontSize: "0.95rem" }}>{listing.price}</p>
                      <p className="text-gray-400" style={{ fontSize: "0.68rem" }}>{listing.area} • {listing.district}</p>
                    </div>
                    <button className="bg-emerald-500 text-white px-3 py-1.5 rounded-xl" style={{ fontSize: "0.75rem", fontWeight: 600 }}>Liên hệ</button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-3">
          <p className="text-gray-700 font-bold" style={{ fontSize: "0.9rem" }}>Căn hộ nổi bật ({filtered.length})</p>
          <div className="flex items-center gap-1 text-gray-500" style={{ fontSize: "0.75rem" }}>
            <Filter size={13} />Lọc nâng cao
          </div>
        </div>

        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((apt) => (
              <motion.div key={apt.id} whileHover={{ y: -3 }} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer">
                <div className="relative h-44">
                  <img src={apt.img} alt={apt.name} className="w-full h-full object-cover" />
                  <button onClick={() => setLiked((prev) => { const next = new Set(prev); next.has(apt.id) ? next.delete(apt.id) : next.add(apt.id); return next; })}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow">
                    <Heart size={14} className={liked.has(apt.id) ? "fill-red-500 text-red-500" : "text-gray-400"} />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-4 py-3">
                    <p className="text-white font-bold" style={{ fontSize: "0.9rem" }}>{apt.name}</p>
                    <p className="text-white/70 flex items-center gap-1" style={{ fontSize: "0.7rem" }}><MapPin size={9} />{apt.address}</p>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {apt.tags.map((tag) => { const Icon = TAG_ICONS[tag] || CheckCircle2; return (
                      <span key={tag} className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full" style={{ fontSize: "0.65rem" }}>
                        <Icon size={8} />{tag}
                      </span>
                    ); })}
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-emerald-600 font-bold" style={{ fontSize: "1rem" }}>{apt.price}</span>
                      <p className="text-gray-400" style={{ fontSize: "0.68rem" }}>{apt.area} • {apt.rooms}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star size={11} className="fill-amber-400 text-amber-400" />
                      <span className="text-gray-600 font-semibold" style={{ fontSize: "0.8rem" }}>{apt.rating}</span>
                    </div>
                  </div>
                  <button className="w-full mt-3 bg-emerald-500 text-white py-2 rounded-xl hover:bg-emerald-600 transition-colors flex items-center justify-center gap-1.5" style={{ fontSize: "0.8rem", fontWeight: 600 }}>
                    <Calendar size={13} />Đặt lịch xem
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((apt) => (
              <motion.div key={apt.id} whileHover={{ x: 2 }} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex cursor-pointer">
                <img src={apt.img} alt={apt.name} className="w-40 h-32 object-cover flex-shrink-0" />
                <div className="p-4 flex-1 flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-gray-900 font-bold" style={{ fontSize: "0.9rem" }}>{apt.name}</p>
                      <div className="flex items-center gap-0.5"><Star size={11} className="fill-amber-400 text-amber-400" /><span className="text-gray-600" style={{ fontSize: "0.75rem" }}>{apt.rating}</span></div>
                    </div>
                    <p className="text-gray-500 flex items-center gap-1 mb-2" style={{ fontSize: "0.78rem" }}><MapPin size={11} />{apt.address}</p>
                    <div className="flex flex-wrap gap-1">
                      {apt.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full" style={{ fontSize: "0.65rem" }}>{tag}</span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right ml-4 flex-shrink-0">
                    <p className="text-emerald-600 font-bold" style={{ fontSize: "1rem" }}>{apt.price}</p>
                    <p className="text-gray-400" style={{ fontSize: "0.7rem" }}>{apt.area}</p>
                    <button className="mt-2 bg-emerald-500 text-white px-4 py-1.5 rounded-xl" style={{ fontSize: "0.75rem", fontWeight: 600 }}>Đặt xem</button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
