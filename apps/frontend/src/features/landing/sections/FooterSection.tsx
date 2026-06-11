import { Building2 } from "lucide-react";
import type { NavigateFunction } from "react-router";

interface FooterSectionProps {
  navigate: NavigateFunction;
  onGetStarted: () => void;
  t: (vi: string, en: string) => string;
}

export default function FooterSection({ navigate, onGetStarted, t }: FooterSectionProps) {
  return (
    <footer className="pt-14 pb-8 px-6" style={{ background: "rgba(0,0,0,0.3)" }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center" style={{ boxShadow: "0 0 12px rgba(34,211,238,0.25)" }}>
                <Building2 size={14} className="text-white" />
              </div>
              <span style={{ fontSize: "1rem", fontWeight: 800, letterSpacing: "-0.03em" }}>
                NestaViet<span className="text-cyan-400">AI</span>
              </span>
            </div>
            <p className="text-white/30 mb-5" style={{ fontSize: "0.82rem", lineHeight: 1.75, maxWidth: "260px" }}>
              {t("Nền tảng PropTech thế hệ mới — Multi-Agent AI tự trị cho thị trường bất động sản cho thuê Việt Nam.","Next-gen PropTech platform — autonomous Multi-Agent AI for Vietnam's rental market.")}
            </p>
            <div className="space-y-1">
              <p className="text-emerald-500/40 font-mono" style={{ fontSize: "0.65rem" }}>tenant.nestaviet.vn</p>
              <p className="text-violet-500/40 font-mono" style={{ fontSize: "0.65rem" }}>manager.nestaviet.vn</p>
            </div>
          </div>
          {[
            { title: t("Sản phẩm","Product"), links: [
              { label: t("Tìm căn hộ","Find apartments"),   href: "/tenant",    action: null           },
              { label: "AI Chatbot",                          href: "/tenant",    action: null           },
              { label: t("Hợp đồng điện tử","E-Contracts"),  href: "/contracts", action: null           },
              { label: t("Thanh toán","Payments"),            href: "/payments",  action: null           },
            ]},
            { title: t("Công ty","Company"), links: [
              { label: t("Về chúng tôi","About"),     href: null, action: "modal" },
              { label: "Blog",                          href: null, action: "modal" },
              { label: t("Tuyển dụng","Careers"),     href: null, action: "modal" },
              { label: t("Đối tác","Partners"),        href: null, action: "modal" },
            ]},
            { title: t("Hỗ trợ","Support"), links: [
              { label: t("Trợ giúp","Help center"),   href: null,        action: "modal" },
              { label: t("Liên hệ","Contact"),         href: null,        action: "modal" },
              { label: t("Bảo mật","Security"),        href: "/security", action: null    },
              { label: t("Chính sách","Privacy policy"), href: null,      action: "modal" },
            ]},
          ].map(({ title, links }) => (
            <div key={title}>
              <p className="text-white/55 font-semibold mb-4" style={{ fontSize: "0.85rem" }}>{title}</p>
              <div className="space-y-3">
                {links.map(({ label, href, action }) => (
                  <button key={label} onClick={() => {
                    if (href) navigate(href);
                    else if (action === "modal") onGetStarted();
                  }}
                    className="block text-white/30 hover:text-white/65 transition-colors text-left"
                    style={{ fontSize: "0.82rem" }}>{label}</button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-white/5">
          <p className="text-white/22" style={{ fontSize: "0.75rem" }}>
            © 2026 NestaVietAI. {t("Tất cả quyền được bảo lưu.","All rights reserved.")}
          </p>
          <div className="flex items-center gap-4">
            {[
              { label: t("Điều khoản","Terms") },
              { label: t("Bảo mật","Privacy") },
              { label: t("Cookie","Cookies") },
            ].map(({ label }) => (
              <button key={label} className="text-white/22 hover:text-white/50 transition-colors" style={{ fontSize: "0.75rem" }}>{label}</button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
