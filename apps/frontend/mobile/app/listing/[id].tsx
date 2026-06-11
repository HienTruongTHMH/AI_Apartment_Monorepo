import { useState, useEffect } from "react";
import { View, Text, Image, ScrollView, Pressable, StyleSheet, Dimensions, Modal, TextInput } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Font, Radius } from "../../shared/theme";
import { LISTINGS } from "../../features/listing/listings";
import { toggleSave, useSaved } from "../../features/store/savedStore";
import { trackViewed } from "../../features/store/recentStore";

const { width } = Dimensions.get("window");
const TIMES = ["9:00", "10:00", "11:00", "14:00", "15:00", "16:00"];

function getNextDates(): string[] {
  const result: string[] = [];
  const d = new Date();
  d.setDate(d.getDate() + 1);
  while (result.length < 4) {
    const label   = d.toLocaleDateString("vi-VN", { weekday: "short" });
    const dateStr = `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
    result.push(`${label}\n${dateStr}`);
    d.setDate(d.getDate() + 1);
  }
  return result;
}

export default function ListingDetailScreen() {
  const { id }    = useLocalSearchParams<{ id: string }>();
  const insets    = useSafeAreaInsets();
  const listing   = LISTINGS.find(l => l.id === id);
  const savedIds  = useSaved();
  const [showSchedule, setShowSchedule] = useState(false);
  const [selDate,   setSelDate]   = useState("");
  const [selTime,   setSelTime]   = useState("");
  const [note,      setNote]      = useState("");
  const [scheduled, setScheduled] = useState(false);
  const DATES = getNextDates();

  useEffect(() => {
    if (listing) trackViewed(listing.id);
  }, [listing?.id]);

  if (!listing) {
    return (
      <SafeAreaView style={s.safe}>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <Text style={{ color: Colors.textMuted, fontSize: Font.base }}>Không tìm thấy tin đăng</Text>
        </View>
      </SafeAreaView>
    );
  }

  const saved = savedIds.has(listing.id);
  const overlayTop = insets.top + 8;

  const handleSchedule = () => {
    if (!selDate || !selTime) return;
    setShowSchedule(false);
    setScheduled(true);
  };

  return (
    <View style={s.safe}>
      {/* Hero image */}
      <View style={{ position: "relative" }}>
        <Image source={{ uri: listing.image }} style={s.hero} />

        {/* Back button — dynamic top via useSafeAreaInsets */}
        <Pressable onPress={() => router.back()} style={[s.overlayBtn, { top: overlayTop, left: 16 }]}>
          <Ionicons name="chevron-back" size={22} color={Colors.white} />
        </Pressable>

        {listing.verified && (
          <View style={[s.verifiedBadge, { top: overlayTop + 2 }]}>
            <Text style={s.verifiedText}>✅ AI Verified</Text>
          </View>
        )}

        {/* Save button */}
        <Pressable onPress={() => toggleSave(listing.id)} style={[s.overlayBtn, { top: overlayTop, right: 16 }]}>
          <Ionicons
            name={saved ? "heart" : "heart-outline"}
            size={20}
            color={saved ? "#f87171" : Colors.white}
          />
        </Pressable>
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={s.body}>
          {/* Title row */}
          <View style={s.titleRow}>
            <Text style={s.title}>{listing.title}</Text>
            <Text style={s.rating}>⭐ {listing.rating}</Text>
          </View>
          <Text style={s.price}>{listing.price}</Text>
          <Text style={s.meta}>📍 {listing.district} · {listing.area} · {listing.type}</Text>

          {/* Tags */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.tagScroll} contentContainerStyle={{ gap: 8 }}>
            {listing.tags.map(tag => (
              <View key={tag} style={s.tag}><Text style={s.tagText}>{tag}</Text></View>
            ))}
          </ScrollView>

          <View style={s.divider} />

          {/* Description */}
          <Text style={s.sectionTitle}>Mô tả</Text>
          <Text style={s.desc}>{listing.description}</Text>

          <View style={s.divider} />

          {/* Amenities */}
          <Text style={s.sectionTitle}>Tiện ích</Text>
          <View style={s.amenitiesGrid}>
            {listing.amenities.map(a => (
              <View key={a} style={s.amenityItem}>
                <View style={s.amenityDot} />
                <Text style={s.amenityText}>{a}</Text>
              </View>
            ))}
          </View>

          <View style={s.divider} />

          {/* AI analysis */}
          <View style={s.aiCard}>
            <View style={s.aiCardHeader}>
              <Text style={{ fontSize: 18 }}>🤖</Text>
              <Text style={s.aiCardTitle}>Phân tích AI</Text>
              <View style={s.aiBadge}><Text style={s.aiBadgeText}>GPT-4o</Text></View>
            </View>
            <Text style={s.aiCardText}>
              Căn hộ này có mức giá {listing.rating >= 4.7 ? "hợp lý" : "tương đối"} so với khu vực {listing.district}.{" "}
              {listing.verified
                ? "Tin đăng đã được AI xác minh — ảnh và thông tin khớp 100%."
                : "Tin đăng chưa được xác minh — hãy kiểm tra kỹ trước khi đặt cọc."}{" "}
              Đánh giá tổng thể: {listing.rating}/5 ⭐
            </Text>
          </View>

          {scheduled && (
            <View style={s.scheduledBanner}>
              <Text style={{ fontSize: 20 }}>✅</Text>
              <View style={{ flex: 1 }}>
                <Text style={s.scheduledTitle}>Đã đặt lịch thành công!</Text>
                <Text style={s.scheduledSub}>Chủ nhà sẽ xác nhận trong vòng 2 giờ.</Text>
              </View>
            </View>
          )}

          <View style={{ height: 110 }} />
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <SafeAreaView edges={["bottom"]} style={s.footer}>
        <View style={s.footerInner}>
          <View>
            <Text style={s.footerPrice}>{listing.price}</Text>
            <Text style={s.footerMeta}>{listing.area} · {listing.district}</Text>
          </View>
          <View style={s.footerBtns}>
            <Pressable onPress={() => router.push("/(tabs)/chat")} style={s.btnSecondary}>
              <Text style={s.btnSecondaryText}>🤖 Hỏi AI</Text>
            </Pressable>
            <Pressable onPress={() => setShowSchedule(true)} style={s.btnPrimary}>
              <Text style={s.btnPrimaryText}>📅 Đặt lịch xem</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>

      {/* Schedule Modal */}
      <Modal visible={showSchedule} animationType="slide" transparent onRequestClose={() => setShowSchedule(false)}>
        <Pressable style={s.overlay} onPress={() => setShowSchedule(false)} />
        <View style={s.sheet}>
          <View style={s.sheetHandle} />
          <Text style={s.sheetTitle}>📅 Đặt lịch xem phòng</Text>
          <Text style={s.sheetSub}>{listing.title}</Text>

          <Text style={s.sheetLabel}>Chọn ngày</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingBottom: 4 }}>
            {DATES.map(d => (
              <Pressable key={d} onPress={() => setSelDate(d)} style={[s.datePill, selDate === d && s.datePillActive]}>
                <Text style={[s.datePillText, selDate === d && { color: Colors.cyan }]}>{d}</Text>
              </Pressable>
            ))}
          </ScrollView>

          <Text style={[s.sheetLabel, { marginTop: 16 }]}>Chọn giờ</Text>
          <View style={s.timesGrid}>
            {TIMES.map(t => (
              <Pressable key={t} onPress={() => setSelTime(t)} style={[s.timePill, selTime === t && s.timePillActive]}>
                <Text style={[s.timePillText, selTime === t && { color: Colors.cyan, fontWeight: "700" }]}>{t}</Text>
              </Pressable>
            ))}
          </View>

          <Text style={[s.sheetLabel, { marginTop: 16 }]}>Ghi chú (tuỳ chọn)</Text>
          <TextInput
            style={s.noteInput}
            placeholder="Ví dụ: Tôi muốn xem bếp và view từ ban công..."
            placeholderTextColor={Colors.textDim}
            value={note}
            onChangeText={setNote}
            multiline
            returnKeyType="done"
            autoCapitalize="none"
          />

          <Pressable
            style={[s.confirmBtn, (!selDate || !selTime) && { opacity: 0.4 }]}
            onPress={handleSchedule}
            disabled={!selDate || !selTime}
          >
            <Text style={s.confirmText}>Xác nhận đặt lịch</Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  safe:           { flex: 1, backgroundColor: Colors.bg },
  hero:           { width, height: 300 },
  overlayBtn:     { position: "absolute", width: 40, height: 40, borderRadius: 20, backgroundColor: "rgba(0,0,0,0.50)", alignItems: "center", justifyContent: "center" },
  verifiedBadge:  { position: "absolute", left: 64, backgroundColor: "rgba(3,11,20,0.80)", paddingHorizontal: 12, paddingVertical: 6, borderRadius: Radius.full },
  verifiedText:   { color: Colors.emerald, fontSize: Font.xs, fontWeight: "700" },
  body:           { padding: 20 },
  titleRow:       { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 6 },
  title:          { flex: 1, color: Colors.white, fontWeight: "800", fontSize: Font.xl, letterSpacing: -0.5 },
  rating:         { color: Colors.textMuted, fontSize: Font.sm, marginTop: 4 },
  price:          { color: Colors.cyan, fontWeight: "800", fontSize: Font.xxl, letterSpacing: -0.5, marginBottom: 6 },
  meta:           { color: Colors.textMuted, fontSize: Font.sm, lineHeight: 20, marginBottom: 16 },
  tagScroll:      { marginBottom: 20 },
  tag:            { paddingHorizontal: 12, paddingVertical: 6, borderRadius: Radius.full, backgroundColor: Colors.bgCard, borderWidth: 1, borderColor: Colors.border },
  tagText:        { color: Colors.textMuted, fontSize: Font.xs, fontWeight: "600" },
  divider:        { height: 0.5, backgroundColor: Colors.border, marginVertical: 20 },
  sectionTitle:   { color: Colors.white, fontWeight: "700", fontSize: Font.md, marginBottom: 12 },
  desc:           { color: Colors.textMuted, fontSize: Font.base, lineHeight: 26 },
  amenitiesGrid:  { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  amenityItem:    { flexDirection: "row", alignItems: "center", gap: 8, width: "47%" },
  amenityDot:     { width: 5, height: 5, borderRadius: 3, backgroundColor: Colors.cyan },
  amenityText:    { color: Colors.textMuted, fontSize: Font.sm, flex: 1 },
  aiCard:         { backgroundColor: "rgba(34,211,238,0.05)", borderRadius: Radius.lg, borderWidth: 1, borderColor: "rgba(34,211,238,0.18)", padding: 16 },
  aiCardHeader:   { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10 },
  aiCardTitle:    { flex: 1, color: Colors.white, fontWeight: "700", fontSize: Font.sm },
  aiBadge:        { backgroundColor: Colors.cyan, paddingHorizontal: 8, paddingVertical: 3, borderRadius: Radius.full },
  aiBadgeText:    { color: Colors.bg, fontSize: Font.xs, fontWeight: "800" },
  aiCardText:     { color: Colors.textMuted, fontSize: Font.sm, lineHeight: 22 },
  scheduledBanner:{ flexDirection: "row", gap: 12, alignItems: "center", backgroundColor: "rgba(52,211,153,0.08)", borderWidth: 1, borderColor: "rgba(52,211,153,0.25)", borderRadius: Radius.lg, padding: 14, marginTop: 16 },
  scheduledTitle: { color: Colors.emerald, fontWeight: "700", fontSize: Font.sm },
  scheduledSub:   { color: Colors.textMuted, fontSize: Font.xs, marginTop: 2 },
  footer:         { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "rgba(3,11,20,0.98)", borderTopWidth: 0.5, borderTopColor: Colors.border },
  footerInner:    { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingVertical: 14, gap: 12 },
  footerPrice:    { color: Colors.cyan, fontWeight: "800", fontSize: Font.md },
  footerMeta:     { color: Colors.textMuted, fontSize: Font.xs, marginTop: 2 },
  footerBtns:     { flexDirection: "row", gap: 10 },
  btnSecondary:   { paddingHorizontal: 16, paddingVertical: 12, borderRadius: Radius.full, backgroundColor: Colors.bgCard, borderWidth: 1, borderColor: Colors.border },
  btnSecondaryText:{ color: Colors.white, fontWeight: "700", fontSize: Font.sm },
  btnPrimary:     { paddingHorizontal: 18, paddingVertical: 12, borderRadius: Radius.full, backgroundColor: Colors.cyan },
  btnPrimaryText: { color: Colors.bg, fontWeight: "800", fontSize: Font.sm },
  overlay:        { flex: 1, backgroundColor: "rgba(0,0,0,0.55)" },
  sheet:          { backgroundColor: "#070F20", borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, paddingBottom: 44, borderTopWidth: 0.5, borderColor: Colors.border },
  sheetHandle:    { width: 36, height: 4, borderRadius: 2, backgroundColor: "rgba(255,255,255,0.18)", alignSelf: "center", marginBottom: 22 },
  sheetTitle:     { color: Colors.white, fontWeight: "800", fontSize: Font.md, marginBottom: 4 },
  sheetSub:       { color: Colors.textMuted, fontSize: Font.sm, marginBottom: 22 },
  sheetLabel:     { color: Colors.textMuted, fontSize: Font.xs, fontWeight: "700", letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 10 },
  datePill:       { paddingHorizontal: 16, paddingVertical: 12, borderRadius: Radius.md, backgroundColor: Colors.bgCard, borderWidth: 1, borderColor: Colors.border, alignItems: "center", minWidth: 74 },
  datePillActive: { borderColor: Colors.cyan, backgroundColor: "rgba(34,211,238,0.10)" },
  datePillText:   { color: Colors.textMuted, fontSize: Font.xs, fontWeight: "600", textAlign: "center" },
  timesGrid:      { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  timePill:       { paddingHorizontal: 22, paddingVertical: 11, borderRadius: Radius.md, backgroundColor: Colors.bgCard, borderWidth: 1, borderColor: Colors.border },
  timePillActive: { borderColor: Colors.cyan, backgroundColor: "rgba(34,211,238,0.10)" },
  timePillText:   { color: Colors.textMuted, fontSize: Font.sm },
  noteInput:      { backgroundColor: Colors.bgCard, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.border, paddingHorizontal: 14, paddingVertical: 12, color: Colors.text, fontSize: Font.sm, height: 80, textAlignVertical: "top", marginBottom: 20 },
  confirmBtn:     { backgroundColor: Colors.cyan, paddingVertical: 16, borderRadius: Radius.full, alignItems: "center" },
  confirmText:    { color: Colors.bg, fontWeight: "800", fontSize: Font.base },
});
