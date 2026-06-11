import { FileText, Upload, CreditCard, Hash, User } from "lucide-react";
import {
  type LandlordFormData, BANKS,
} from "@features/landlord/components/LandlordRegisterTypes";
import { Field, SectionTitle, InfoBox, inputCls, inputStyle } from "@features/landlord/components/LandlordRegisterHelpers";

interface Props {
  form: LandlordFormData;
  set: (key: keyof LandlordFormData, val: string) => void;
}

export default function LandlordSection3Legal({ form, set }: Props) {
  return (
    <div className="space-y-6">
      <SectionTitle>Hồ sơ pháp lý</SectionTitle>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Số giấy phép kinh doanh" icon={FileText}>
          <input type="text" placeholder="0316xxxxxxx (nếu có)" value={form.businessLicense}
            onChange={(e) => set("businessLicense", e.target.value)}
            className={inputCls} style={inputStyle} />
        </Field>
        <Field label="Số sổ đỏ / giấy chứng nhận *" icon={FileText}>
          <input type="text" placeholder="Số giấy tờ sở hữu" value={form.propertyDoc}
            onChange={(e) => set("propertyDoc", e.target.value)}
            className={inputCls} style={inputStyle} />
        </Field>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          "Ảnh CCCD / CMND (2 mặt)",
          "Giấy tờ sở hữu / sổ đỏ",
          "Ảnh tòa nhà (tối thiểu 5 ảnh)",
          "Giấy phép kinh doanh (nếu có)",
        ].map((label) => (
          <label key={label} className="border border-dashed border-white/20 rounded-xl p-5 flex flex-col items-center gap-2 cursor-pointer hover:border-violet-500/40 transition-colors group">
            <Upload size={20} className="text-white/30 group-hover:text-violet-400 transition-colors" />
            <p className="text-white/50 text-center group-hover:text-white/70 transition-colors" style={{ fontSize: "0.78rem" }}>
              {label}
            </p>
            <span className="text-white/30" style={{ fontSize: "0.68rem" }}>
              PDF, JPG, PNG — tối đa 10MB
            </span>
            <input type="file" className="hidden" accept="image/*,.pdf" multiple />
          </label>
        ))}
      </div>

      <div className="border-t border-white/10 pt-5">
        <SectionTitle>Thông tin ngân hàng</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <Field label="Ngân hàng" icon={CreditCard}>
            <select value={form.bankName} onChange={(e) => set("bankName", e.target.value)}
              className={inputCls + " cursor-pointer"} style={{ ...inputStyle, colorScheme: "dark" }}>
              <option value="" disabled>Chọn ngân hàng...</option>
              {BANKS.map((b) => <option key={b} value={b} className="bg-[#0A0F1E]">{b}</option>)}
            </select>
          </Field>
          <Field label="Số tài khoản" icon={Hash}>
            <input type="text" placeholder="19034xxxxxxxxx" value={form.accountNumber}
              onChange={(e) => set("accountNumber", e.target.value)}
              className={inputCls} style={inputStyle} />
          </Field>
          <Field label="Tên chủ tài khoản" icon={User}>
            <input type="text" placeholder="NGUYEN VAN A" value={form.accountHolder}
              onChange={(e) => set("accountHolder", e.target.value)}
              className={inputCls + " uppercase"} style={inputStyle} />
          </Field>
        </div>
      </div>

      <InfoBox>
        Thông tin ngân hàng được sử dụng để nhận thanh toán tiền thuê tự động qua hệ thống NestaVietAI. Chúng tôi không lưu trữ thông tin tài khoản trực tiếp — mọi giao dịch thông qua cổng thanh toán được chứng nhận PCI-DSS.
      </InfoBox>
    </div>
  );
}
