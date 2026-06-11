import { motion } from "motion/react";
import { Plus, MapPin, Eye } from "lucide-react";

const PROPERTIES = [
  { id: "P01", name: "Sunrise City North - Tầng 12", rooms: 3, occupied: 3, revenue: "34.5M", img: "https://images.unsplash.com/photo-1638454795595-0a0abf68614d?w=200", district: "Quận 7" },
  { id: "P02", name: "Vinhomes Grand Park - Block A", rooms: 5, occupied: 4, revenue: "42.2M", img: "https://images.unsplash.com/photo-1585128792103-0b591f96512e?w=200", district: "TP. Thủ Đức" },
  { id: "P03", name: "The River Thủ Thiêm - T15", rooms: 4, occupied: 4, revenue: "56.8M", img: "https://images.unsplash.com/photo-1763401929055-43fd29000be3?w=200", district: "Quận 2" },
];

export default function PropertiesTab() {
  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      <div className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-gray-900 font-bold" style={{ fontSize: "1.1rem" }}>Bất động sản</h2>
            <p className="text-gray-400" style={{ fontSize: "0.75rem" }}>{PROPERTIES.length} tài sản đang quản lý</p>
          </div>
          <button className="flex items-center gap-1.5 bg-violet-600 text-white px-4 py-2 rounded-xl shadow-sm" style={{ fontSize: "0.82rem", fontWeight: 600 }}>
            <Plus size={15} />Thêm BĐS
          </button>
        </div>
      </div>
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {PROPERTIES.map((p) => (
          <motion.div key={p.id} whileHover={{ y: -4 }} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm cursor-pointer">
            <img src={p.img} alt={p.name} className="w-full h-40 object-cover" />
            <div className="p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-gray-400 flex items-center gap-1" style={{ fontSize: "0.7rem" }}><MapPin size={10} />{p.district}</span>
                <span className={`px-2 py-0.5 rounded-full text-white text-xs font-semibold ${p.occupied === p.rooms ? "bg-emerald-500" : "bg-amber-500"}`}>{Math.round((p.occupied / p.rooms) * 100)}%</span>
              </div>
              <p className="text-gray-900 font-bold mb-3" style={{ fontSize: "0.9rem" }}>{p.name}</p>
              <div className="w-full bg-gray-100 rounded-full h-1.5 mb-3">
                <div className={`h-1.5 rounded-full ${p.occupied === p.rooms ? "bg-emerald-500" : "bg-amber-500"}`} style={{ width: `${(p.occupied / p.rooms) * 100}%` }} />
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-emerald-600 font-bold" style={{ fontSize: "1rem" }}>{p.revenue} ₫</span>
                  <p className="text-gray-400" style={{ fontSize: "0.68rem" }}>{p.occupied}/{p.rooms} phòng đang thuê</p>
                </div>
                <button className="flex items-center gap-1 text-violet-600 hover:text-violet-700" style={{ fontSize: "0.75rem" }}><Eye size={13} />Chi tiết</button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
