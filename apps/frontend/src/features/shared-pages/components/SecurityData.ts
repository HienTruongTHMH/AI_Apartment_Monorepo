import { Bug, Globe, Network, Wifi, Key, AlertTriangle, Database, Activity, Layers } from "lucide-react";

export const OWASP_ITEMS = [
  { id: "A01", name: "Broken Access Control",             risk: "Critical", riskColor: "#ef4444", desc: "Kiểm soát quyền truy cập bị lỗi — user có thể truy cập resource của user khác.", fix: "RBAC middleware trên mọi endpoint, JWT user-scope validation, row-level security trong PostgreSQL." },
  { id: "A02", name: "Cryptographic Failures",            risk: "High",     riskColor: "#f97316", desc: "Dữ liệu nhạy cảm (CCCD, hợp đồng, mật khẩu) không được mã hóa đúng cách.", fix: "bcrypt cho password, AES-256 cho PII data, TLS 1.3 bắt buộc, không lưu plaintext." },
  { id: "A03", name: "Injection (SQLi / XSS / NoSQLi)",  risk: "Critical", riskColor: "#ef4444", desc: "Kẻ tấn công inject code độc vào query hoặc HTML để đánh cắp dữ liệu hoặc chiếm session.", fix: "Parameterized queries, ORM có sanitize, Content Security Policy, output encoding." },
  { id: "A04", name: "Insecure Design",                  risk: "High",     riskColor: "#f97316", desc: "Thiếu threat modeling từ giai đoạn thiết kế — không có defense-in-depth.", fix: "Security review trong sprint planning, threat modeling STRIDE, fail-safe defaults." },
  { id: "A05", name: "Security Misconfiguration",        risk: "Medium",   riskColor: "#eab308", desc: "Server, database, cloud bucket cấu hình sai — expose thông tin thừa.", fix: "Hardening checklist, tắt debug mode production, least-privilege IAM, secret scanning CI." },
  { id: "A06", name: "Vulnerable Components",            risk: "Medium",   riskColor: "#eab308", desc: "Thư viện/dependency cũ có CVE đã biết.", fix: "Dependabot auto-update, npm audit trong CI pipeline, SCA scanning (Snyk/Trivy)." },
  { id: "A07", name: "Auth & Identity Failures",         risk: "High",     riskColor: "#f97316", desc: "Brute-force không bị chặn, session không expire, credential stuffing dễ dàng.", fix: "Rate limiting login, JWT expiry ngắn + refresh rotation, lockout sau 5 lần thất bại." },
  { id: "A08", name: "Software Integrity Failures",      risk: "Medium",   riskColor: "#eab308", desc: "CI/CD pipeline bị compromise, package bị tamper.", fix: "Subresource Integrity (SRI), signed commits, image digest pinning trong Docker." },
  { id: "A09", name: "Logging & Monitoring Failures",    risk: "Medium",   riskColor: "#eab308", desc: "Không phát hiện breach kịp thời vì log không đầy đủ hoặc không có alerting.", fix: "Centralized logging (ELK/Loki), alert ngưỡng anomaly, audit trail không thể xóa." },
  { id: "A10", name: "Server-Side Request Forgery (SSRF)", risk: "High",   riskColor: "#f97316", desc: "Server bị dùng để làm proxy tấn công internal network hoặc cloud metadata.", fix: "Allowlist URL schemes, block internal IP ranges, disable redirect cho HTTP clients." },
];

export const ATTACK_TYPES = [
  { icon: Bug,           title: "SQL Injection",              color: "#ef4444", desc: "Chèn lệnh SQL vào input để query dữ liệu trái phép hoặc xóa bảng.", example: "' OR 1=1 --",                                         defense: "Prepared statements, ORM parameterization" },
  { icon: Globe,         title: "Cross-Site Scripting (XSS)", color: "#f97316", desc: "Inject script độc vào trang web để đánh cắp cookie/session của user khác.", example: "<script>document.cookie</script>",                  defense: "Output encoding, Content-Security-Policy header" },
  { icon: Network,       title: "Man-in-the-Middle (MITM)",   color: "#eab308", desc: "Nghe lén traffic giữa client và server, chặn hoặc chỉnh sửa dữ liệu.", example: "ARP spoofing, SSL stripping",                          defense: "TLS 1.3, HSTS, Certificate Pinning" },
  { icon: Wifi,          title: "DDoS Attack",                color: "#a78bfa", desc: "Gửi lượng request khổng lồ để làm quá tải server, dịch vụ ngừng hoạt động.", example: "SYN flood, HTTP flood, amplification",              defense: "WAF rate limiting, CDN scrubbing, anycast routing" },
  { icon: Key,           title: "Credential Stuffing",        color: "#22d3ee", desc: "Dùng list username/password từ data breach để thử đăng nhập hàng loạt.", example: "Rockyou.txt + Hydra tool",                             defense: "MFA, captcha, IP rate limiting, breach detection" },
  { icon: AlertTriangle, title: "CSRF Attack",                color: "#34d399", desc: "Lừa user đã đăng nhập thực hiện hành động trái phép qua request giả mạo.", example: "Hidden form submit từ trang evil.com",               defense: "CSRF token, SameSite cookie, Referer validation" },
];

export const SECURITY_LAYERS = [
  { layer: "L1 — Network",     color: "#ef4444", icon: Network,  items: ["Cloudflare WAF + DDoS scrubbing", "Rate limiting: 100 req/min per IP", "IP Allowlist cho Admin Portal", "Firewall rules: block port 22 external"] },
  { layer: "L2 — Application", color: "#f97316", icon: Layers,   items: ["HTTPS/TLS 1.3 bắt buộc (HTTP → redirect)", "OWASP Top 10 hardened", "JWT access (15m) + refresh (7d) rotation", "Content-Security-Policy, HSTS, X-Frame-Options"] },
  { layer: "L3 — Data",        color: "#eab308", icon: Database, items: ["AES-256 encrypt PII at rest", "bcrypt(12) cho password", "Row-level security PostgreSQL", "Backup encrypt + offsite daily"] },
  { layer: "L4 — Monitoring",  color: "#22d3ee", icon: Activity, items: ["ELK stack: log mọi request/response", "Alert: >50 lỗi 401 trong 5 phút → lockout", "Audit trail immutable (append-only)", "Uptime monitor + oncall PagerDuty"] },
];
