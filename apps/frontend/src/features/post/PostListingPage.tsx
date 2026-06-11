import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Home, MapPin, Ruler, FileText, Image } from "lucide-react";
import PostHeader from "./components/PostHeader";
import PropertyTypeSelector from "./components/PropertyTypeSelector";
import PropertyLocationFields from "./components/PropertyLocationFields";
import PropertyDetailsFields from "./components/PropertyDetailsFields";
import ListingContentFields from "./components/ListingContentFields";
import ImageUploadArea from "./components/ImageUploadArea";
import PostSubmitButton from "./components/PostSubmitButton";

type PostForm = {
  propertyType: string;
  intent: "rent" | "sell" | "";
  province: string;
  district: string;
  ward: string;
  area: string;
  floors: string;
  bedrooms: string;
  bathrooms: string;
  title: string;
  description: string;
  price: string;
  priceUnit: "thang" | "m2";
  images: (File | null)[];
};

const INITIAL_FORM: PostForm = {
  propertyType: "",
  intent: "",
  province: "",
  district: "",
  ward: "",
  area: "",
  floors: "",
  bedrooms: "",
  bathrooms: "",
  title: "",
  description: "",
  price: "",
  priceUnit: "thang",
  images: Array(6).fill(null),
};

function SectionCard({ icon: Icon, title, children }: { icon: React.ComponentType<{ size: number; className: string }>, title: string, children: React.ReactNode }) {
  return (
    <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="flex items-center gap-2 mb-5">
        <Icon size={15} className="text-cyan-400" />
        <span className="text-white font-semibold" style={{ fontSize: "0.9rem" }}>{title}</span>
      </div>
      {children}
    </div>
  );
}

export function PostListingPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<PostForm>(INITIAL_FORM);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    document.documentElement.removeAttribute("data-theme");
    const ok =
      localStorage.getItem("nv-quick-email") ||
      localStorage.getItem("nv-tenant-logged-in") === "true" ||
      localStorage.getItem("nv-landlord-logged-in") === "true";
    if (!ok) navigate("/", { replace: true });
  }, [navigate]);

  const setField = (field: string, val: string) =>
    setForm(prev => ({ ...prev, [field]: val }));

  const locationDisabled = !form.propertyType || !form.intent;
  const detailsDisabled = locationDisabled;

  const handleSubmit = () => {
    if (!form.propertyType || !form.intent) return;
    setSubmitted(true);
  };

  const submitDisabled = !form.propertyType || !form.intent || submitted;

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#030B14", color: "white" }}>
      <PostHeader onBack={() => navigate("/")} />

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-5 py-8 flex flex-col gap-5">

          <SectionCard icon={Home} title="Loại bất động sản">
            <PropertyTypeSelector
              propertyType={form.propertyType}
              intent={form.intent}
              onChange={(type, intent) => setForm(prev => ({ ...prev, propertyType: type, intent }))}
            />
          </SectionCard>

          <SectionCard icon={MapPin} title="Vị trí bất động sản">
            <PropertyLocationFields
              disabled={locationDisabled}
              province={form.province}
              district={form.district}
              ward={form.ward}
              onChange={setField}
            />
          </SectionCard>

          <SectionCard icon={Ruler} title="Đặc điểm bất động sản">
            <PropertyDetailsFields
              disabled={detailsDisabled}
              area={form.area}
              floors={form.floors}
              bedrooms={form.bedrooms}
              bathrooms={form.bathrooms}
              onChange={setField}
            />
          </SectionCard>

          <SectionCard icon={FileText} title="Nội dung tin đăng">
            <ListingContentFields
              title={form.title}
              description={form.description}
              price={form.price}
              priceUnit={form.priceUnit}
              onChange={setField}
            />
          </SectionCard>

          <SectionCard icon={Image} title="Hình ảnh">
            <ImageUploadArea
              images={form.images}
              onImageChange={(index, file) =>
                setForm(prev => {
                  const images = [...prev.images];
                  images[index] = file;
                  return { ...prev, images };
                })
              }
            />
          </SectionCard>

          <PostSubmitButton
            submitted={submitted}
            onSubmit={handleSubmit}
            disabled={submitDisabled}
          />

          <div className="h-8" />
        </div>
      </div>
    </div>
  );
}
