import { useNavigate } from "react-router";
import { motion } from "motion/react";
import {
  Shield, Lock, Eye, Key, Database, Activity,
  CheckCircle2, Building2, ChevronLeft, Terminal,
  Server, ArrowRight, ExternalLink,
  Layers, Network, Users,
} from "lucide-react";
import { OWASP_ITEMS, ATTACK_TYPES, SECURITY_LAYERS } from "@features/shared-pages/components/SecurityData";
import OWASPCard from "@features/shared-pages/components/OWASPCard";

export function SecurityPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen text-white overflow-x-hidden" style={{ backgroundColor: "var(--nv-bg)" }}>
      <div className="fixed inset-0 pointer-events-none z-0" style={{ backgroundImage: "radial-gradient(rgba(148,163,184,0.035) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
      <div className="fixed top-0 left-0 w-[600px] h-[600px] rounded-full pointer-events-none z-0"
        style={{ background: "radial-gradient(circle, rgba(239,68,68,0.06) 0%, transparent 65%)", transform: "translate(-20%, -20%)" }} />

      <header className="relative z-10 border-b border-white/6" style={{ background: "var(--nv-navbar-bg)", backdropFilter: "blur(20px)" }}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <button onClick={() => navigate("/")} className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
              <Building2 size={15} className="text-white" />
            </div>
            <span style={{ fontSize: "1rem", fontWeight: 800 }}>NestaViet<span className="text-cyan-400">AI</span></span>
          </button>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-red-500/20 bg-red-500/8">
              <Shield size={13} className="text-red-400" />
              <span className="text-red-400 font-semibold" style={{ fontSize: "0.72rem" }}>Security Center</span>
            </div>
            <button onClick={() => navigate("/")} className="flex items-center gap-1.5 text-white/40 hover:text-white/70 transition-colors" style={{ fontSize: "0.82rem" }}>
              <ChevronLeft size={15} />Trang chủ
            </button>
          </div>
        </div>
      </header>

      <div className="relative z-10">
        {/* Hero */}
        <section className="py-20 px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 bg-red-500/8 border border-red-500/18 rounded-full px-4 py-1.5 mb-5">
              <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
              <span className="text-red-400 font-semibold" style={{ fontSize: "0.72rem", letterSpacing: "0.1em" }}>SECURITY OPERATIONS CENTER</span>
            </div>
            <h1 className="text-white mb-4" style={{ fontSize: "clamp(2rem,5vw,3.5rem)", fontWeight: 900, letterSpacing: "-0.04em" }}>
              Trung tâm Bảo mật<br />
              <span style={{ background: "linear-gradient(100deg,#ef4444,#f97316,#eab308)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                NestaVietAI
              </span>
            </h1>
            <p className="text-white/50 max-w-2xl mx-auto mb-8" style={{ fontSize: "1rem", lineHeight: 1.75 }}>
              Tổng quan kiến trúc bảo mật 4 lớp, hướng dẫn giám sát hệ thống, và tài liệu tham khảo
              về các kỹ thuật tấn công mạng thường gặp dành cho học viên an ninh mạng.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button onClick={() => navigate("/admin/login")}
                className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white hover:opacity-90 transition-opacity"
                style={{ fontSize: "0.88rem", background: "linear-gradient(135deg,#8b5cf6,#6d28d9)", boxShadow: "0 0 20px rgba(139,92,246,0.3)" }}>
                <Shield size={15} />Vào Admin Security Portal<ArrowRight size={14} />
              </button>
              <a href="https://owasp.org/Top10/" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-white/45 hover:text-white/70 transition-colors" style={{ fontSize: "0.85rem" }}>
                <ExternalLink size={13} />OWASP Official Docs
              </a>
            </div>
          </motion.div>
        </section>

        {/* Admin Access Guide */}
        <section className="py-16 px-6 border-t border-white/5" style={{ background: "var(--nv-surface-alt)" }}>
          <div className="max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
              <p className="text-violet-400 mb-2" style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em" }}>HƯỚNG DẪN TRUY CẬP</p>
              <h2 className="text-white" style={{ fontSize: "clamp(1.5rem,3vw,2.2rem)", fontWeight: 800, letterSpacing: "-0.03em" }}>Admin Security Portal</h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                className="rounded-2xl p-6 border border-violet-500/20" style={{ background: "var(--nv-surface)" }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/15 flex items-center justify-center">
                    <Lock size={18} className="text-violet-400" />
                  </div>
                  <div>
                    <p className="text-white font-bold" style={{ fontSize: "0.9rem" }}>Đăng nhập Admin</p>
                    <p className="text-white/40" style={{ fontSize: "0.72rem" }}>Portal: /admin/login</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    { role: "Siêu quản trị", email: "admin@nestaviet.vn",   pw: "NestaViet@Admin2025",   color: "#ef4444" },
                    { role: "Quản trị viên", email: "manager@nestaviet.vn", pw: "NestaViet@Manager2025", color: "#f97316" },
                    { role: "Developer",      email: "dev@nestaviet.vn",     pw: "NestaViet@Dev2025",     color: "#22d3ee" },
                  ].map((u) => (
                    <div key={u.role} className="rounded-xl px-4 py-3 border border-white/6" style={{ background: `${u.color}08` }}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold" style={{ fontSize: "0.75rem", color: u.color }}>{u.role}</span>
                      </div>
                      <p className="text-white/60 font-mono" style={{ fontSize: "0.72rem" }}>{u.email}</p>
                      <p className="text-white/40 font-mono" style={{ fontSize: "0.68rem" }}>{u.pw}</p>
                    </div>
                  ))}
                </div>
                <p className="text-white/25 mt-3" style={{ fontSize: "0.65rem" }}>⚠ Demo credentials — thay bằng OAuth/SSO trong production</p>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                className="rounded-2xl p-6 border border-cyan-500/18" style={{ background: "var(--nv-surface)" }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/12 flex items-center justify-center">
                    <Eye size={18} className="text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-white font-bold" style={{ fontSize: "0.9rem" }}>Cần giám sát gì?</p>
                    <p className="text-white/40" style={{ fontSize: "0.72rem" }}>Trong Admin Panel</p>
                  </div>
                </div>
                <div className="space-y-2.5">
                  {[
                    { tab: "Overview", icon: Activity, desc: "KPI tổng quan: API requests, error rate, active users" },
                    { tab: "Agents",   icon: Server,   desc: "CPU load agents, latency, số lỗi mỗi agent" },
                    { tab: "API Logs", icon: Terminal,  desc: "Filter lỗi 4xx/5xx, request chậm >1s, user bất thường" },
                    { tab: "Users",    icon: Users,    desc: "Tài khoản suspended, role changes, login activity" },
                    { tab: "Settings", icon: Key,      desc: "Rate limits, API keys, RBAC permissions" },
                  ].map((item) => (
                    <div key={item.tab} className="flex items-start gap-3 rounded-xl px-3 py-2.5 bg-white/4 border border-white/6">
                      <item.icon size={14} className="text-cyan-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="text-white font-semibold" style={{ fontSize: "0.78rem" }}>{item.tab} — </span>
                        <span className="text-white/50" style={{ fontSize: "0.75rem" }}>{item.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Security Layers */}
        <section className="py-20 px-6">
          <div className="max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
              <p className="text-red-400 mb-2" style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em" }}>DEFENSE IN DEPTH</p>
              <h2 className="text-white" style={{ fontSize: "clamp(1.5rem,3vw,2.2rem)", fontWeight: 800, letterSpacing: "-0.03em" }}>Kiến trúc Bảo mật 4 Lớp</h2>
              <p className="text-white/40 mt-2 max-w-lg mx-auto" style={{ fontSize: "0.88rem" }}>
                Mỗi lớp là một hàng rào độc lập — kẻ tấn công phải vượt qua tất cả 4 lớp mới có thể gây hại
              </p>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {SECURITY_LAYERS.map((layer, i) => (
                <motion.div key={layer.layer}
                  initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="rounded-2xl p-5 border hover:border-white/15 transition-all"
                  style={{ background: "var(--nv-surface)", borderColor: `${layer.color}30` }}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${layer.color}18` }}>
                      <layer.icon size={18} style={{ color: layer.color }} />
                    </div>
                    <span className="text-white font-bold" style={{ fontSize: "0.88rem" }}>{layer.layer}</span>
                  </div>
                  <ul className="space-y-2">
                    {layer.items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-white/55" style={{ fontSize: "0.78rem", lineHeight: 1.5 }}>
                        <CheckCircle2 size={12} className="flex-shrink-0 mt-0.5" style={{ color: layer.color }} />{item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Attack Types */}
        <section className="py-20 px-6 border-t border-white/5" style={{ background: "var(--nv-surface-alt)" }}>
          <div className="max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
              <p className="text-amber-400 mb-2" style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em" }}>AN NINH MẠNG — KIẾN THỨC CƠ BẢN</p>
              <h2 className="text-white" style={{ fontSize: "clamp(1.5rem,3vw,2.2rem)", fontWeight: 800, letterSpacing: "-0.03em" }}>Các kiểu tấn công phổ biến</h2>
              <p className="text-white/40 mt-2 max-w-lg mx-auto" style={{ fontSize: "0.88rem" }}>
                Hiểu cách kẻ tấn công hoạt động là bước đầu tiên để xây dựng hệ thống phòng thủ hiệu quả
              </p>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {ATTACK_TYPES.map((attack, i) => (
                <motion.div key={attack.title}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                  whileHover={{ y: -3 }}
                  className="rounded-2xl p-5 border border-white/6 hover:border-white/12 transition-all" style={{ background: "var(--nv-surface)" }}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${attack.color}18` }}>
                      <attack.icon size={18} style={{ color: attack.color }} />
                    </div>
                    <span className="px-2 py-0.5 rounded-full font-semibold" style={{ fontSize: "0.6rem", background: `${attack.color}20`, color: attack.color }}>Attack</span>
                  </div>
                  <h3 className="text-white font-bold mb-1.5" style={{ fontSize: "0.9rem" }}>{attack.title}</h3>
                  <p className="text-white/45 mb-3" style={{ fontSize: "0.78rem", lineHeight: 1.6 }}>{attack.desc}</p>
                  <div className="rounded-lg px-3 py-2 bg-white/4 border border-white/6 mb-2">
                    <p className="text-white/30 mb-0.5" style={{ fontSize: "0.6rem", fontWeight: 600 }}>VÍ DỤ PAYLOAD</p>
                    <p className="font-mono text-red-400/80" style={{ fontSize: "0.68rem" }}>{attack.example}</p>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <Shield size={11} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                    <p className="text-emerald-400/80" style={{ fontSize: "0.72rem", lineHeight: 1.5 }}>{attack.defense}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* OWASP Top 10 */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
              <p className="text-orange-400 mb-2" style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em" }}>CHUẨN QUỐC TẾ</p>
              <h2 className="text-white" style={{ fontSize: "clamp(1.5rem,3vw,2.2rem)", fontWeight: 800, letterSpacing: "-0.03em" }}>OWASP Top 10 — 2021</h2>
              <p className="text-white/40 mt-2 max-w-lg mx-auto" style={{ fontSize: "0.88rem" }}>
                Click vào từng mục để xem mô tả và biện pháp phòng chống. Tất cả đều đã được áp dụng trên NestaVietAI.
              </p>
            </motion.div>
            <div className="space-y-2">
              {OWASP_ITEMS.map((item, i) => (
                <OWASPCard key={item.id} item={item} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* Tools & Resources */}
        <section className="py-16 px-6 border-t border-white/5" style={{ background: "var(--nv-surface-alt)" }}>
          <div className="max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
              <h2 className="text-white font-bold mb-1" style={{ fontSize: "1.3rem" }}>Công cụ học tập & Testing</h2>
              <p className="text-white/40" style={{ fontSize: "0.85rem" }}>Dành cho mục đích học tập và kiểm thử authorized. Không dùng cho mục đích tấn công bất hợp pháp.</p>
            </motion.div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { name: "OWASP ZAP",  desc: "Web app scanner",    color: "#22d3ee", url: "https://www.zaproxy.org" },
                { name: "Burp Suite", desc: "Intercept proxy",    color: "#f97316", url: "https://portswigger.net" },
                { name: "Nmap",       desc: "Network scanner",    color: "#a78bfa", url: "https://nmap.org" },
                { name: "Metasploit", desc: "Pentest framework",  color: "#ef4444", url: "https://metasploit.com" },
                { name: "Wireshark",  desc: "Packet analyzer",    color: "#34d399", url: "https://wireshark.org" },
                { name: "Gobuster",   desc: "Dir/subdomain enum", color: "#eab308", url: "https://github.com/OJ/gobuster" },
                { name: "SQLMap",     desc: "SQLi automation",    color: "#f97316", url: "https://sqlmap.org" },
                { name: "CyberChef",  desc: "Encode/decode tool", color: "#22d3ee", url: "https://gchq.github.io/CyberChef" },
              ].map((tool, i) => (
                <motion.a key={tool.name} href={tool.url} target="_blank" rel="noopener noreferrer"
                  initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                  whileHover={{ scale: 1.03 }}
                  className="rounded-xl p-4 border border-white/6 hover:border-white/15 transition-all flex flex-col gap-1.5" style={{ background: "var(--nv-surface)" }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${tool.color}18` }}>
                    <Terminal size={15} style={{ color: tool.color }} />
                  </div>
                  <p className="text-white font-semibold" style={{ fontSize: "0.82rem" }}>{tool.name}</p>
                  <p className="text-white/40" style={{ fontSize: "0.68rem" }}>{tool.desc}</p>
                  <div className="flex items-center gap-1 text-white/25 mt-auto">
                    <ExternalLink size={10} />
                    <span style={{ fontSize: "0.6rem" }}>Xem tài liệu</span>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </section>

        <footer className="py-8 px-6 border-t border-white/5">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Shield size={14} className="text-red-400" />
              <span className="text-white/30" style={{ fontSize: "0.72rem" }}>NestaVietAI Security Center — Chỉ dành cho học tập & authorized testing</span>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => navigate("/")} className="text-white/30 hover:text-white/55 transition-colors" style={{ fontSize: "0.72rem" }}>Trang chủ</button>
              <button onClick={() => navigate("/admin/login")} className="flex items-center gap-1.5 text-violet-400 hover:text-violet-300 transition-colors" style={{ fontSize: "0.72rem" }}>
                <Lock size={11} />Admin Portal
              </button>
              <a href="https://owasp.org" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-white/30 hover:text-white/55 transition-colors" style={{ fontSize: "0.72rem" }}>
                <ExternalLink size={10} />OWASP
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
