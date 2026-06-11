import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import {
  Send, Phone, Video, MoreHorizontal, CheckCheck, Check,
  Paperclip, Smile, Search, Image as ImageIcon,
} from "lucide-react";

interface Message {
  id: string;
  from: "me" | "other";
  text: string;
  time: string;
  read: boolean;
}
interface Conversation {
  id: string;
  name: string;
  avatar: string;
  avatarGrad: string;
  role: string;
  lastMsg: string;
  time: string;
  unread: number;
  online: boolean;
  messages: Message[];
}

const CONVERSATIONS: Conversation[] = [
  {
    id: "c1", name: "Nguyễn Văn Hùng", avatar: "N",
    avatarGrad: "from-violet-500 to-purple-600", role: "Chủ nhà",
    lastMsg: "Vui lòng kiểm tra hóa đơn điện tháng 4", time: "10:42", unread: 2, online: true,
    messages: [
      { id: "m1", from: "other", text: "Chào bạn, tôi muốn thông báo về lịch kiểm tra PCCC tuần tới.", time: "09:15", read: true },
      { id: "m2", from: "me", text: "Vâng anh, lịch kiểm tra là ngày nào vậy anh?", time: "09:18", read: true },
      { id: "m3", from: "other", text: "Thứ 4 ngày 7/5, từ 9h–11h sáng. Bạn cần có mặt để mở cửa phòng.", time: "09:20", read: true },
      { id: "m4", from: "me", text: "Được anh, em sẽ sắp xếp có mặt. Cảm ơn anh đã thông báo sớm!", time: "09:22", read: true },
      { id: "m5", from: "other", text: "Vui lòng kiểm tra hóa đơn điện tháng 4 nhé, có thể cao hơn vì chạy điều hòa nhiều.", time: "10:42", read: false },
      { id: "m6", from: "other", text: "Tổng cộng là 680,000 ₫ cho 136 kWh.", time: "10:43", read: false },
    ],
  },
  {
    id: "c2", name: "Ban Quản Lý Tòa Nhà", avatar: "B",
    avatarGrad: "from-blue-500 to-cyan-500", role: "Quản lý",
    lastMsg: "Thông báo: Mất nước từ 7h–12h ngày 3/5", time: "Hôm qua", unread: 1, online: false,
    messages: [
      { id: "m1", from: "other", text: "Kính gửi cư dân, sẽ có sự cố mất nước ngày 3/5 từ 7h đến 12h để bảo trì đường ống chính.", time: "15:00", read: false },
    ],
  },
  {
    id: "c3", name: "Trần Thị Bình (P.1203)", avatar: "T",
    avatarGrad: "from-amber-500 to-orange-500", role: "Hàng xóm",
    lastMsg: "Cảm ơn bạn nhé!", time: "T2", unread: 0, online: true,
    messages: [
      { id: "m1", from: "other", text: "Bạn ơi, tối qua nhà bạn có tiếng ồn khá lớn, bạn có thể nhẹ hơn không?", time: "08:30", read: true },
      { id: "m2", from: "me", text: "Xin lỗi bạn nhiều nhé! Hôm qua mình có khách đến. Sẽ không để xảy ra nữa!", time: "08:45", read: true },
      { id: "m3", from: "other", text: "Cảm ơn bạn nhé!", time: "08:46", read: true },
    ],
  },
];

const QUICK_REPLIES = ["Được ạ!", "Tôi sẽ kiểm tra.", "Cảm ơn bạn đã thông báo!", "Vui lòng cho tôi thêm thông tin."];

export function ChatInbox({ isDark }: { isDark?: boolean }) {
  const [convos, setConvos] = useState(CONVERSATIONS);
  const [selectedId, setSelectedId] = useState("c1");
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const msgRef = useRef<HTMLDivElement>(null);

  const conv = convos.find((c) => c.id === selectedId)!;

  useEffect(() => {
    if (msgRef.current) msgRef.current.scrollTop = msgRef.current.scrollHeight;
  }, [selectedId, convos]);

  const sendMessage = (text = input.trim()) => {
    if (!text) return;
    setConvos((cs) =>
      cs.map((c) => {
        if (c.id !== selectedId) return c;
        const msg: Message = { id: `m${Date.now()}`, from: "me", text, time: now(), read: false };
        return { ...c, messages: [...c.messages, msg], lastMsg: text, time: "Vừa xong", unread: 0 };
      })
    );
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      const replies = ["Cảm ơn bạn đã phản hồi!", "Được, tôi sẽ lưu ý.", "Bạn cần hỗ trợ thêm gì không?", "OK, tôi đã nhận được."];
      const reply: Message = { id: `r${Date.now()}`, from: "other", text: replies[Math.floor(Math.random() * replies.length)], time: now(), read: false };
      setConvos((cs) => cs.map((c) => (c.id !== selectedId ? c : { ...c, messages: [...c.messages, reply] })));
    }, 1800);
  };

  const bg = isDark ? "bg-slate-900" : "bg-white";
  const border = isDark ? "border-slate-700" : "border-gray-100";
  const tp = isDark ? "text-slate-100" : "text-gray-900";
  const ts = isDark ? "text-slate-400" : "text-gray-500";
  const hov = isDark ? "hover:bg-slate-800" : "hover:bg-gray-50";

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      <div className={`${bg} border-b ${border} px-6 py-4 flex-shrink-0`}>
        <h2 className={`font-bold ${tp}`} style={{ fontSize: "1.1rem" }}>Hộp thư</h2>
        <p className={ts} style={{ fontSize: "0.75rem" }}>Tin nhắn với chủ nhà & ban quản lý</p>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Conversation list */}
        <div className={`w-64 lg:w-72 border-r flex flex-col flex-shrink-0 ${bg} ${border}`}>
          <div className="p-3">
            <div className={`flex items-center gap-2 px-3 py-2 rounded-xl ${isDark ? "bg-slate-800" : "bg-gray-100"}`}>
              <Search size={13} className={ts} />
              <input placeholder="Tìm cuộc trò chuyện..." className={`bg-transparent flex-1 outline-none ${tp}`}
                style={{ fontSize: "0.8rem" }} />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto divide-y" style={{ borderColor: isDark ? "#1e293b" : "#f9fafb" }}>
            {convos.map((c) => (
              <button key={c.id} onClick={() => setSelectedId(c.id)}
                className={`w-full flex items-start gap-3 px-4 py-3.5 transition-colors text-left ${
                  selectedId === c.id
                    ? isDark ? "bg-emerald-900/20" : "bg-emerald-50"
                    : hov
                }`}>
                <div className="relative flex-shrink-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm bg-gradient-to-br ${c.avatarGrad}`}>
                    {c.avatar}
                  </div>
                  {c.online && <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className={`font-semibold truncate ${tp}`} style={{ fontSize: "0.82rem" }}>{c.name}</span>
                    <span className={ts} style={{ fontSize: "0.62rem" }}>{c.time}</span>
                  </div>
                  <p className={`truncate ${c.unread > 0 ? "font-semibold " + tp : ts}`} style={{ fontSize: "0.72rem" }}>{c.lastMsg}</p>
                  <p className={ts} style={{ fontSize: "0.62rem" }}>{c.role}</p>
                </div>
                {c.unread > 0 && (
                  <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 mt-1"
                    style={{ fontSize: "0.58rem", fontWeight: 700 }}>{c.unread}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Thread */}
        <div className={`flex-1 flex flex-col overflow-hidden ${isDark ? "bg-slate-950" : "bg-gray-50/60"}`}>
          {/* Header */}
          <div className={`flex items-center justify-between px-5 py-3 border-b flex-shrink-0 ${bg} ${border}`}>
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-sm bg-gradient-to-br ${conv.avatarGrad}`}>
                {conv.avatar}
              </div>
              <div>
                <p className={`font-semibold ${tp}`} style={{ fontSize: "0.875rem" }}>{conv.name}</p>
                <p className={`${ts} flex items-center gap-1.5`} style={{ fontSize: "0.65rem" }}>
                  {conv.online
                    ? <><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />Online</>
                    : "Offline"}
                  {" · "}{conv.role}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {[Phone, Video, MoreHorizontal].map((Icon, i) => (
                <button key={i} className={`w-8 h-8 rounded-xl flex items-center justify-center ${hov} ${ts} transition-colors`}>
                  <Icon size={14} />
                </button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div ref={msgRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-2.5">
            {conv.messages.map((msg, i) => (
              <motion.div key={msg.id}
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.025 }}
                className={`flex ${msg.from === "me" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[72%] rounded-2xl px-4 py-2.5 ${
                  msg.from === "me"
                    ? "bg-emerald-500 text-white rounded-br-md"
                    : isDark ? "bg-slate-700 text-slate-100 rounded-bl-md" : "bg-white text-gray-800 shadow-sm rounded-bl-md"
                }`}>
                  <p style={{ fontSize: "0.84rem", lineHeight: 1.55 }}>{msg.text}</p>
                  <div className={`flex items-center justify-end gap-1 mt-1 ${
                    msg.from === "me" ? "text-white/60" : isDark ? "text-slate-500" : "text-gray-400"
                  }`} style={{ fontSize: "0.6rem" }}>
                    {msg.time}
                    {msg.from === "me" && (msg.read ? <CheckCheck size={10} /> : <Check size={10} />)}
                  </div>
                </div>
              </motion.div>
            ))}
            {typing && (
              <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
                <div className={`rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-1 ${isDark ? "bg-slate-700" : "bg-white shadow-sm"}`}>
                  {[0, 1, 2].map((i) => (
                    <motion.div key={i} animate={{ y: [-2, 2, -2] }} transition={{ repeat: Infinity, duration: 0.9, delay: i * 0.18 }}
                      className={`w-1.5 h-1.5 rounded-full ${isDark ? "bg-slate-400" : "bg-gray-400"}`} />
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Quick replies */}
          <div className={`px-5 py-2 flex gap-2 flex-wrap border-t ${border}`}>
            {QUICK_REPLIES.map((r) => (
              <button key={r} onClick={() => sendMessage(r)}
                className={`px-3 py-1 rounded-full border text-xs font-medium transition-colors ${isDark ? "border-slate-600 text-slate-400 hover:border-emerald-500 hover:text-emerald-400" : "border-gray-200 text-gray-500 hover:border-emerald-400 hover:text-emerald-600"}`}>
                {r}
              </button>
            ))}
          </div>

          {/* Compose */}
          <div className={`p-4 border-t flex-shrink-0 ${bg} ${border}`}>
            <div className={`flex items-center gap-3 rounded-2xl border px-4 py-3 transition-colors ${isDark ? "bg-slate-800 border-slate-600 focus-within:border-emerald-500/40" : "bg-white border-gray-200 focus-within:border-emerald-400/50"}`}>
              <button className={`${ts} hover:text-emerald-500 transition-colors`}><Paperclip size={15} /></button>
              <button className={`${ts} hover:text-emerald-500 transition-colors`}><ImageIcon size={15} /></button>
              <input value={input} onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                placeholder="Nhắn tin..." className={`flex-1 bg-transparent outline-none ${tp}`}
                style={{ fontSize: "0.875rem" }} />
              <button className={`${ts} hover:text-emerald-500 transition-colors`}><Smile size={15} /></button>
              <motion.button whileTap={{ scale: 0.9 }} onClick={() => sendMessage()}
                disabled={!input.trim()}
                className="w-8 h-8 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 flex items-center justify-center transition-colors">
                <Send size={14} className="text-white" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function now() {
  return new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
}
