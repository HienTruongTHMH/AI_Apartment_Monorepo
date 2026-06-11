import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router";
import { ChevronLeft, Building2 } from "lucide-react";
import { isAdminAuthenticated } from "@features/admin/AdminLogin";
import { isDevAuthenticated } from "@features/dev/DevLogin";
import { getMockListing } from "./data/mockDetail";
import { filterProfanity } from "./utils/profanityFilter";
import { ListingBreadcrumb } from "./components/ListingBreadcrumb";
import { ListingImageGallery } from "./components/ListingImageGallery";
import { ListingInfoBlock } from "./components/ListingInfoBlock";
import { ListingAgentCard } from "./components/ListingAgentCard";
import { ListingRatingsSection } from "./components/ListingRatingsSection";
import { ListingCommentsSection } from "./components/ListingCommentsSection";
import type { Comment } from "./components/ListingCommentsSection";
import { api } from "@/lib/api";

const QUICK_REPLIES = ["Căn hộ này còn không ạ?", "Có video không ạ?", "Thời gian xem phòng?", "Chi phí phát sinh?"];

interface ListingDetail {
  id: string;
  title: string;
  description: string;
  pricePerMonth: number;
  createdAt: string;
  images: {
    imageUrl: string;
    isPrimary: boolean;
  }[];
  apartment: {
    district: string;
    area: number;
    floor: number;
    room_number: number;
    type: string;
    note: string;
    fullAddress: string;
    bedroom: number;
    livingroom: number;
    kitchen: number;
    bathroom: number;
    owner?: {
      name: string;
      phone: string;
      email: string;
    }
  };
}

function getRole(): Comment["authorRole"] {
  if (isAdminAuthenticated()) return "admin";
  if (isDevAuthenticated()) return "dev";
  try { if (localStorage.getItem("nv-landlord-logged-in") === "true") return "landlord"; } catch { /**/ }
  return "tenant";
}
function isLandlordAuth() {
  try { return localStorage.getItem("nv-landlord-logged-in") === "true"; } catch { return false; }
}
function isTenantAuth() {
  try { return localStorage.getItem("nv-tenant-logged-in") === "true"; } catch { return false; }
}

export function ListingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // const { listing, agent, images } = getMockListing(id ?? "");
  // const {agent} = getMockListing(id ?? "");

  const [listing, setListing] = useState<ListingDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const isLoggedIn  = isTenantAuth() || isLandlordAuth() || isAdminAuthenticated() || isDevAuthenticated();
  const canRate     = isTenantAuth();
  const canModerate = isAdminAuthenticated() || isDevAuthenticated() || isLandlordAuth();

  const [activeImage, setActiveImage] = useState(0);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    document.documentElement.removeAttribute("data-theme");
    window.scrollTo(0, 0);
  }, [id]);

  console.log("Trang detail: ");

  useEffect(() => {
    const fetchListingDetail = async () => {
      if(!id) return;

      try {
        setLoading(true);
        const res = await api.get(`/listing/${id}`);
        console.log("Data nhận được: ", res.data);

        setListing(res.data)
      } catch (error) {
        console.error("Lỗi khi nhận Data: ", error)
      } finally {
        setLoading(false);
      }
    }

    fetchListingDetail();
  }, [id])

  // Derived ratings from comments that have a star rating
  const ratedComments = useMemo(() => comments.filter(c => c.rating != null), [comments]);
  const totalRatings  = ratedComments.length;
  const averageRating = totalRatings > 0
    ? ratedComments.reduce((sum, c) => sum + (c.rating ?? 0), 0) / totalRatings
    : 0;
  const breakdown = [1, 2, 3, 4, 5].map(n => ratedComments.filter(c => c.rating === n).length);

  const handleCommentSubmit = (rating?: number) => {
    if (!commentText.trim()) return;
    const filtered = filterProfanity(commentText.trim());
    const role = getRole();
    const nameMap: Record<Comment["authorRole"], string> = {
      tenant: "Bạn", landlord: "Chủ nhà", admin: "Admin", dev: "Dev",
    };
    setComments(prev => [...prev, {
      id: Date.now(), author: nameMap[role], authorRole: role,
      text: filtered, ts: "Vừa xong", rating,
      likes: 0, likedByMe: false, replies: [], showReplyBox: false,
    }]);
    setCommentText("");
  };

  const handleLike = (id: number) => {
    setComments(prev => prev.map(c => c.id === id
      ? { ...c, likes: c.likedByMe ? c.likes - 1 : c.likes + 1, likedByMe: !c.likedByMe }
      : c));
  };

  const handleDelete = (id: number) => {
    setComments(prev => prev.filter(c => c.id !== id));
  };

  const handleReply = (commentId: number, text: string) => {
    const role = getRole();
    const nameMap: Record<Comment["authorRole"], string> = {
      tenant: "Bạn", landlord: "Chủ nhà", admin: "Admin", dev: "Dev",
    };
    setComments(prev => prev.map(c => c.id === commentId
      ? { ...c, replies: [...c.replies, { id: Date.now(), author: nameMap[role], authorRole: role, text, ts: "Vừa xong" }], showReplyBox: false }
      : c));
  };

  const handleDeleteReply = (commentId: number, replyId: number) => {
    setComments(prev => prev.map(c => c.id === commentId
      ? { ...c, replies: c.replies.filter(r => r.id !== replyId) }
      : c));
  };

  const handleToggleReplyBox = (id: number) => {
    setComments(prev => prev.map(c => c.id === id ? { ...c, showReplyBox: !c.showReplyBox } : c));
  };

  if (loading) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center" style={{ backgroundColor: "#030B14" }}>
        <div className="animate-pulse text-cyan-400 font-bold text-xl">Đang tải thông tin chi tiết...</div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen text-white flex flex-col items-center justify-center gap-4" style={{ backgroundColor: "#030B14" }}>
        <p className="text-xl">Không tìm thấy bài đăng hoặc bài đăng đã bị xóa.</p>
        <button onClick={() => navigate(-1)} className="px-4 py-2 bg-cyan-600 rounded-lg">Quay lại</button>
      </div>
    );
  }

  const crumbs = ["Trang chủ", "Thuê căn hộ", listing.title.length > 40 ? listing.title.slice(0, 40) + "…" : listing.title];
  const defaultErrorImg = "https://xzwpyzamhyevocaqmyhn.supabase.co/storage/v1/object/public/apartment-listings/imageError.png"

  const validImages = listing?.images?.map(img => img.imageUrl).filter(url => url && url.trim() !== "" );
  
  const imageUrls = validImages && validImages.length > 0 
    ? validImages
    : [defaultErrorImg];

  // Format giá tiền (8500000 -> 8.5 Triệu/tháng)
  const formattedPrice = `${(listing.pricePerMonth / 1000000).toFixed(1)} Triệu/tháng`;

  // Format ngày đăng
  const postedDate = new Date(listing.createdAt).toLocaleDateString("vi-VN");

  return (
    <div className="min-h-screen text-white" style={{ backgroundColor: "#030B14" }}>
      <div className="sticky top-0 z-10 border-b border-white/6 px-6 py-4 flex items-center justify-between"
        style={{ background: "rgba(3,7,18,0.9)", backdropFilter: "blur(20px)" }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg,#3b82f6,#22d3ee)", boxShadow: "0 4px 14px rgba(34,211,238,0.3)" }}>
            <Building2 size={18} className="text-white" />
          </div>
          <div>
            <p style={{ fontSize: "1rem", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.01em" }}>
              NestaViet<span style={{ color: "#22d3ee" }}>AI</span>
            </p>
            <p style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.3)", lineHeight: 1 }}>Nền tảng thuê căn hộ</p>
          </div>
        </div>
        <button onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 text-white/45 hover:text-white/80 hover:border-white/20 hover:bg-white/5 transition-all"
          style={{ fontSize: "0.82rem" }}>
          <ChevronLeft size={15} />Quay lại
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 lg:px-8">
        <ListingBreadcrumb crumbs={crumbs} />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">
          <div>
            <ListingImageGallery images={imageUrls} activeIndex={activeImage} onSelect={setActiveImage} />
            <ListingInfoBlock
              title={listing.title}
              price={formattedPrice}
              area={`${listing.apartment?.area || 0}m2`}
              type={listing.apartment.type || "Căn hộ"}
              address={listing.apartment?.fullAddress || listing.apartment?.district || "Đang cập nhật"}
              updatedAt={`Đăng ngày ${postedDate}`}
              verified={true}
              description={listing.description}
              amenities={[
                "Đang cập nhập"
              ]}
            />
            <ListingRatingsSection
              averageRating={averageRating}
              totalRatings={totalRatings}
              breakdown={breakdown}
            />
            <ListingCommentsSection
              comments={comments}
              commentText={commentText}
              onCommentChange={setCommentText}
              onSubmit={handleCommentSubmit}
              onDelete={handleDelete}
              onLike={handleLike}
              onReply={handleReply}
              onDeleteReply={handleDeleteReply}
              onToggleReplyBox={handleToggleReplyBox}
              canRate={canRate}
              canModerate={canModerate}
              isLoggedIn={isLoggedIn}
            />
          </div>

          <div className="lg:sticky lg:top-20">
            {/* Agent Này không phải AI */}
            <ListingAgentCard
              agentName={listing.apartment?.owner?.name || "Chủ nhà"}
              agentRole="Chính chủ"
              isOnline={true}
              listingCount={1}
              yearsActive={1}
              responseRate= {98}
              phone={listing.apartment?.owner?.phone}
              quickReplies={QUICK_REPLIES}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
