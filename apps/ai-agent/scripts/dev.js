/**
 * Cross-platform dev launcher cho Python FastAPI service.
 *
 * WHY: npm scripts trong package.json không thể detect OS natively.
 * Cách này dùng Node.js (luôn có sẵn trong monorepo) để:
 *   1. Detect OS qua `process.platform`
 *   2. Chọn đúng đường dẫn Python trong venv
 *   3. Spawn uvicorn như một process con
 */

const { spawn } = require('child_process');
const path = require('path');

// ── 1. Detect OS và chọn đúng executable path ────────────────────────────────
// Windows dùng `venv\Scripts\python.exe`
// macOS/Linux dùng `venv/bin/python`
const isWindows = process.platform === 'win32';

// ── Dùng __dirname để tạo absolute path đến venv của project này ──────────────
// __dirname = thư mục chứa file này = .../apps/ai-agent/scripts/
// '..' đi lên 1 cấp → .../apps/ai-agent/
// → venv sẽ luôn trỏ đúng dù bạn chạy npm từ đâu
const venvDir = path.join(__dirname, '..', 'venv');

const pythonPath = isWindows
  ? path.join(venvDir, 'Scripts', 'python.exe')
  : path.join(venvDir, 'bin', 'python');

// ── 2. Định nghĩa lệnh uvicorn sẽ chạy ───────────────────────────────────────
// Tương đương: python -m uvicorn app.main:app --reload --port 8000
const args = ['-m', 'uvicorn', 'app.main:app', '--reload', '--port', '8000'];

console.log(`[AI] Platform: ${process.platform}`);
console.log(`[AI] Python path: ${pythonPath}`);
console.log(`[AI] Launching: ${pythonPath} ${args.join(' ')}\n`);

// ── 3. Spawn process con — stdio: 'inherit' nghĩa là pipe log thẳng ra terminal
const child = spawn(pythonPath, args, {
  stdio: 'inherit', // stdout + stderr của uvicorn sẽ hiện trực tiếp trên terminal
  shell: false,     // Không cần shell wrapper — gọi trực tiếp cho an toàn hơn
});

// ── 4. Handle khi process con thoát (Ctrl+C, crash, v.v.) ────────────────────
child.on('exit', (code) => {
  console.log(`\n[AI] Python service exited with code: ${code}`);
  process.exit(code ?? 0);
});

// Forward Ctrl+C từ Node process xuống uvicorn
process.on('SIGINT', () => child.kill('SIGINT'));
process.on('SIGTERM', () => child.kill('SIGTERM'));
