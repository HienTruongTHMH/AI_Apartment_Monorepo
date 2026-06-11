import { useState } from "react";
import { Link } from "react-router";
import { MessageSquare, Send, Heart, Trash2, Star, CornerDownRight, MessageCircle, LogIn, ShieldAlert } from "lucide-react";

export interface Reply {
  id: number;
  author: string;
  authorRole: "tenant" | "landlord" | "admin" | "dev";
  text: string;
  ts: string;
}

export interface Comment {
  id: number;
  author: string;
  authorRole: "tenant" | "landlord" | "admin" | "dev";
  text: string;
  ts: string;
  rating?: number;
  likes: number;
  likedByMe: boolean;
  replies: Reply[];
  showReplyBox?: boolean;
}

const ROLE_LABELS: Record<Comment["authorRole"], string> = {
  tenant: "Người thuê",
  landlord: "Chủ nhà",
  admin: "Admin",
  dev: "Dev",
};

const ROLE_COLORS: Record<Comment["authorRole"], string> = {
  tenant: "rgba(34,211,238,0.15)",
  landlord: "rgba(16,185,129,0.15)",
  admin: "rgba(239,68,68,0.15)",
  dev: "rgba(139,92,246,0.15)",
};

const ROLE_TEXT: Record<Comment["authorRole"], string> = {
  tenant: "#22d3ee",
  landlord: "#10b981",
  admin: "#ef4444",
  dev: "#8b5cf6",
};

const STAR_LABELS = ["", "Tệ", "Không tốt", "Bình thường", "Tốt", "Xuất sắc"];

interface ListingCommentsSectionProps {
  comments: Comment[];
  commentText: string;
  onCommentChange: (v: string) => void;
  onSubmit: (rating?: number) => void;
  onDelete: (id: number) => void;
  onLike: (id: number) => void;
  onReply: (commentId: number, text: string) => void;
  onDeleteReply: (commentId: number, replyId: number) => void;
  onToggleReplyBox: (id: number) => void;
  canRate: boolean;
  canModerate: boolean;
  isLoggedIn: boolean;
}

export function ListingCommentsSection({
  comments, commentText, onCommentChange, onSubmit,
  onDelete, onLike, onReply, onDeleteReply, onToggleReplyBox,
  canRate, canModerate, isLoggedIn,
}: ListingCommentsSectionProps) {
  const [inputRating, setInputRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [replyTexts, setReplyTexts] = useState<Record<number, string>>({});
  const [loginNudge, setLoginNudge] = useState(false);

  const handleSubmit = () => {
    if (!isLoggedIn) { setLoginNudge(true); setTimeout(() => setLoginNudge(false), 3000); return; }
    onSubmit(inputRating > 0 ? inputRating : undefined);
    setInputRating(0);
    setHoverRating(0);
  };

  const handleReplySubmit = (commentId: number) => {
    const text = (replyTexts[commentId] ?? "").trim();
    if (!text) return;
    onReply(commentId, text);
    setReplyTexts(prev => ({ ...prev, [commentId]: "" }));
  };

  const activeStars = hoverRating || inputRating;

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <MessageCircle size={15} className="text-cyan-400" />
        <p className="text-white font-semibold" style={{ fontSize: "1rem" }}>Bình luận</p>
        {comments.length > 0 && (
          <span className="px-1.5 py-0.5 rounded-full text-white/40 tabular-nums"
            style={{ fontSize: "0.65rem", background: "rgba(255,255,255,0.06)" }}>
            {comments.length}
          </span>
        )}
      </div>

      {/* Comment list */}
      {comments.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-12 rounded-2xl mb-4"
          style={{ background: "rgba(255,255,255,0.015)", border: "1px dashed rgba(255,255,255,0.08)" }}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{ background: "rgba(34,211,238,0.06)", border: "1px solid rgba(34,211,238,0.1)" }}>
            <MessageSquare size={22} className="text-cyan-400/30" />
          </div>
          <div className="text-center">
            <p className="text-white/30 font-medium mb-1" style={{ fontSize: "0.88rem" }}>Chưa có bình luận nào</p>
            <p className="text-white/18" style={{ fontSize: "0.75rem" }}>Hãy là người đầu tiên nhận xét căn hộ này</p>
          </div>
        </div>
      ) : (
        <div className="space-y-3 mb-4">
          {comments.map(c => (
            <div key={c.id}>
              <div className="flex gap-3 p-4 rounded-2xl transition-colors"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                {/* Avatar */}
                <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: ROLE_COLORS[c.authorRole], border: `1px solid ${ROLE_TEXT[c.authorRole]}30` }}>
                  <span className="font-bold" style={{ fontSize: "0.78rem", color: ROLE_TEXT[c.authorRole] }}>
                    {c.author[0]?.toUpperCase() ?? "?"}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="text-white font-semibold" style={{ fontSize: "0.84rem" }}>{c.author}</span>
                    <span className="px-1.5 py-0.5 rounded font-medium"
                      style={{ fontSize: "0.6rem", background: ROLE_COLORS[c.authorRole], color: ROLE_TEXT[c.authorRole] }}>
                      {ROLE_LABELS[c.authorRole]}
                    </span>
                    {c.rating != null && (
                      <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded"
                        style={{ fontSize: "0.65rem", background: "rgba(251,191,36,0.12)", color: "#fbbf24" }}>
                        <Star size={9} className="fill-amber-400" />{c.rating} · {STAR_LABELS[c.rating]}
                      </span>
                    )}
                    <span className="text-white/20 ml-auto" style={{ fontSize: "0.65rem" }}>{c.ts}</span>
                  </div>

                  <p className="text-white/60 mb-2.5" style={{ fontSize: "0.83rem", lineHeight: 1.6 }}>{c.text}</p>

                  <div className="flex items-center gap-3">
                    {isLoggedIn && (
                      <>
                        <button onClick={() => onLike(c.id)}
                          className={`flex items-center gap-1 transition-colors ${c.likedByMe ? "text-red-400" : "text-white/25 hover:text-red-400"}`}
                          style={{ fontSize: "0.72rem" }}>
                          <Heart size={12} className={c.likedByMe ? "fill-red-400" : ""} />
                          {c.likes > 0 && <span>{c.likes}</span>}
                        </button>
                        <button onClick={() => onToggleReplyBox(c.id)}
                          className="flex items-center gap-1 text-white/25 hover:text-cyan-400 transition-colors"
                          style={{ fontSize: "0.72rem" }}>
                          <MessageSquare size={12} />Trả lời
                          {c.replies.length > 0 && <span className="text-white/20">({c.replies.length})</span>}
                        </button>
                      </>
                    )}
                    {canModerate && (
                      <button onClick={() => onDelete(c.id)}
                        className="flex items-center gap-1 text-white/15 hover:text-red-400 transition-colors ml-auto"
                        style={{ fontSize: "0.72rem" }}>
                        <Trash2 size={11} />Xoá
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Replies */}
              {c.replies.length > 0 && (
                <div className="ml-12 mt-1.5 space-y-1.5">
                  {c.replies.map(r => (
                    <div key={r.id} className="flex gap-2.5 p-3 rounded-xl"
                      style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                      <CornerDownRight size={11} className="text-white/15 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                          <span className="font-semibold" style={{ fontSize: "0.76rem", color: ROLE_TEXT[r.authorRole] }}>{r.author}</span>
                          <span className="px-1.5 py-0.5 rounded"
                            style={{ fontSize: "0.57rem", background: ROLE_COLORS[r.authorRole], color: ROLE_TEXT[r.authorRole] }}>
                            {ROLE_LABELS[r.authorRole]}
                          </span>
                          <span className="text-white/18 ml-auto" style={{ fontSize: "0.62rem" }}>{r.ts}</span>
                        </div>
                        <p className="text-white/45" style={{ fontSize: "0.78rem", lineHeight: 1.5 }}>{r.text}</p>
                      </div>
                      {canModerate && (
                        <button onClick={() => onDeleteReply(c.id, r.id)}
                          className="text-white/12 hover:text-red-400 transition-colors flex-shrink-0 self-start mt-0.5">
                          <Trash2 size={11} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Reply box */}
              {c.showReplyBox && isLoggedIn && (
                <div className="ml-12 mt-1.5 flex gap-2">
                  <input
                    value={replyTexts[c.id] ?? ""}
                    onChange={e => setReplyTexts(prev => ({ ...prev, [c.id]: e.target.value }))}
                    placeholder="Viết trả lời..."
                    className="flex-1 rounded-xl px-3 py-2 text-white placeholder-white/20 outline-none"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", fontSize: "0.78rem" }}
                    onKeyDown={e => { if (e.key === "Enter") handleReplySubmit(c.id); }}
                  />
                  <button onClick={() => handleReplySubmit(c.id)}
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-cyan-400 hover:bg-cyan-400/10 transition-colors flex-shrink-0"
                    style={{ border: "1px solid rgba(34,211,238,0.2)" }}>
                    <Send size={12} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Input form */}
      <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.09)", background: "rgba(255,255,255,0.02)" }}>
        {/* Cyan top accent */}
        <div className="h-px" style={{ background: "linear-gradient(90deg,transparent,rgba(34,211,238,0.3),transparent)" }} />

        <div className="p-4">
          {/* Star picker — always visible, interactive only for tenants */}
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="text-white/30" style={{ fontSize: "0.73rem" }}>Đánh giá:</span>
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map(n => (
                <button key={n}
                  onMouseEnter={() => canRate && setHoverRating(n)}
                  onMouseLeave={() => canRate && setHoverRating(0)}
                  onClick={() => canRate && setInputRating(prev => prev === n ? 0 : n)}
                  className={`p-0.5 transition-all ${canRate ? "hover:scale-110 active:scale-95 cursor-pointer" : "cursor-default opacity-40"}`}>
                  <Star size={22}
                    className={n <= activeStars ? "text-amber-400 fill-amber-400" : "text-white/15"} />
                </button>
              ))}
            </div>
            {activeStars > 0 && (
              <span className="text-amber-400 font-medium" style={{ fontSize: "0.75rem" }}>
                {STAR_LABELS[activeStars]}
              </span>
            )}
            {!canRate && (
              <span className="text-white/20 italic" style={{ fontSize: "0.68rem" }}>
                Chỉ cư dân đã từng thuê mới có thể đánh giá
              </span>
            )}
          </div>

          {/* Text input row */}
          <div className="flex gap-2.5 items-end">
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(34,211,238,0.08)", border: "1px solid rgba(34,211,238,0.12)" }}>
              <span className="text-cyan-400/60 font-bold" style={{ fontSize: "0.7rem" }}>B</span>
            </div>
            <input value={commentText} onChange={e => onCommentChange(e.target.value)}
              placeholder="Chia sẻ trải nghiệm của bạn về căn hộ này..."
              className="flex-1 rounded-xl px-3.5 py-2.5 text-white placeholder-white/20 outline-none"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", fontSize: "0.83rem" }}
              onKeyDown={e => { if (e.key === "Enter") handleSubmit(); }}
            />
            <button onClick={handleSubmit}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all flex-shrink-0"
              style={{
                background: commentText.trim() ? "linear-gradient(135deg,rgba(34,211,238,0.2),rgba(59,130,246,0.15))" : "rgba(255,255,255,0.04)",
                border: commentText.trim() ? "1px solid rgba(34,211,238,0.3)" : "1px solid rgba(255,255,255,0.07)",
                color: commentText.trim() ? "#22d3ee" : "rgba(255,255,255,0.2)",
              }}>
              <Send size={14} />
            </button>
          </div>

          {/* Login nudge */}
          {loginNudge && (
            <div className="mt-2.5 flex gap-2.5 px-3.5 py-3 rounded-xl"
              style={{ background: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.18)" }}>
              <ShieldAlert size={15} className="text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-amber-400/90 font-medium mb-0.5" style={{ fontSize: "0.78rem" }}>
                  Bạn cần đăng nhập với tài khoản người thuê
                </p>
                <p className="text-white/35 mb-1.5" style={{ fontSize: "0.7rem", lineHeight: 1.5 }}>
                  Chỉ cư dân đã từng thuê căn hộ mới có thể bình luận và đánh giá. Hệ thống xác minh dựa trên lịch sử hợp đồng thuê của bạn.
                </p>
                <Link to="/tenant/login"
                  className="inline-flex items-center gap-1 text-amber-400 hover:text-amber-300 transition-colors font-medium"
                  style={{ fontSize: "0.73rem" }}>
                  <LogIn size={12} />Đăng nhập tài khoản người thuê →
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
