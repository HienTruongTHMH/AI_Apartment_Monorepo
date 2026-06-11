import { CheckCircle2 } from "lucide-react";
import { type LandlordFormData, SERVICES } from "@features/landlord/components/LandlordRegisterTypes";
import { SectionTitle } from "@features/landlord/components/LandlordRegisterHelpers";

interface Props {
  form: LandlordFormData;
  toggleArr: (key: "unitTypes" | "services", val: string) => void;
}

export default function LandlordSection4Services({ form, toggleArr }: Props) {
  return (
    <div className="space-y-6">
      <SectionTitle>Dịch vụ muốn sử dụng</SectionTitle>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {SERVICES.map((s) => (
          <button key={s} onClick={() => toggleArr("services", s)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all ${
              form.services.includes(s)
                ? "bg-violet-500/15 border-violet-500/50 text-violet-300"
                : "bg-white/5 border-white/10 text-white/60 hover:border-white/25"
            }`}
            style={{ fontSize: "0.875rem" }}>
            <div className={`w-4 h-4 rounded flex items-center justify-center border flex-shrink-0 ${
              form.services.includes(s) ? "bg-violet-500 border-violet-500" : "border-white/30"
            }`}>
              {form.services.includes(s) && <CheckCircle2 size={10} className="text-white" />}
            </div>
            {s}
          </button>
        ))}
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
        <p className="text-white font-semibold mb-4" style={{ fontSize: "0.95rem" }}>
          Xác nhận thông tin đăng ký
        </p>
        <div className="grid grid-cols-2 gap-3">
          {[
            ["Chủ sở hữu", form.fullName],
            ["Email", form.email],
            ["Tòa nhà", form.buildingName],
            ["Địa điểm", form.district + ", " + form.city],
            ["Số tầng", form.floors + " tầng"],
            ["Tổng căn hộ", form.totalUnits + " căn"],
          ].map(([label, val]) => (
            <div key={label}>
              <p className="text-white/40" style={{ fontSize: "0.72rem" }}>{label}</p>
              <p className="text-white" style={{ fontSize: "0.85rem" }}>{val || "—"}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl p-4">
        <p className="text-white/70" style={{ fontSize: "0.82rem", lineHeight: 1.7 }}>
          Bằng cách gửi đăng ký, bạn xác nhận tất cả thông tin là chính xác và đồng ý với{" "}
          <button className="text-violet-400 underline">Điều khoản Quản lý</button>,{" "}
          <button className="text-violet-400 underline">Chính sách Bảo mật</button> và{" "}
          <button className="text-violet-400 underline">Thỏa thuận Dịch vụ</button> của NestaVietAI.
          Hồ sơ sẽ được đội ngũ xác minh trong 1–2 ngày làm việc.
        </p>
      </div>
    </div>
  );
}
