import { View, Text, StyleSheet, Pressable, ScrollView, Image } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Font, Radius } from "../../shared/theme";
import { LISTINGS } from "../../features/listing/listings";
import { toggleSave, useSaved } from "../../features/store/savedStore";

export default function SavedScreen() {
  const savedIds      = useSaved();
  const savedListings = LISTINGS.filter(l => savedIds.has(l.id));

  return (
    <SafeAreaView style={s.safe} edges={["top"]}>
      {/* Header */}
      <View style={s.header}>
        <Text style={s.pageTitle}>Đã lưu</Text>
        {savedListings.length > 0 && (
          <View style={s.countBadge}>
            <Text style={s.countText}>{savedListings.length}</Text>
          </View>
        )}
      </View>

      {savedListings.length === 0 ? (
        <View style={s.empty}>
          <Ionicons name="heart-outline" size={52} color={Colors.textDim} style={{ marginBottom: 16 }} />
          <Text style={s.emptyTitle}>Chưa có tin nào đã lưu</Text>
          <Text style={s.emptySub}>Nhấn ♡ trên tin đăng để lưu lại và so sánh sau</Text>
          <Pressable style={s.btn} onPress={() => router.push("/(tabs)/")}>
            <Text style={s.btnText}>Khám phá ngay</Text>
          </Pressable>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.list}>
          {savedListings.map(l => (
            <Pressable key={l.id} onPress={() => router.push(`/listing/${l.id}`)} style={s.card}>
              <Image source={{ uri: l.image }} style={s.cardImage} />
              <View style={s.cardBody}>
                <Text style={s.cardTitle} numberOfLines={1}>{l.title}</Text>
                <Text style={s.cardPrice}>{l.price}</Text>
                <Text style={s.cardMeta} numberOfLines={1}>📍 {l.district} · {l.area}</Text>
                <View style={s.cardFooter}>
                  {l.verified && <Text style={s.verified}>✅ AI Verified</Text>}
                  <Text style={s.rating}>⭐ {l.rating}</Text>
                </View>
              </View>
              <Pressable onPress={() => toggleSave(l.id)} style={s.removeBtn} hitSlop={10}>
                <Ionicons name="heart" size={20} color="#f87171" />
              </Pressable>
            </Pressable>
          ))}

          {/* Compare hint */}
          {savedListings.length >= 2 && (
            <View style={s.compareBanner}>
              <Text style={{ fontSize: 24 }}>🤖</Text>
              <View style={{ flex: 1 }}>
                <Text style={s.compareTitle}>So sánh bằng AI</Text>
                <Text style={s.compareSub}>Hỏi Super Broker để so sánh {savedListings.length} tin đã lưu</Text>
              </View>
              <Pressable onPress={() => router.push("/(tabs)/chat")} style={s.compareBtn}>
                <Text style={s.compareBtnText}>Hỏi AI</Text>
              </Pressable>
            </View>
          )}

          <View style={{ height: 24 }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:         { flex: 1, backgroundColor: Colors.bg },
  header:       { flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingTop: 14, paddingBottom: 18, gap: 10 },
  pageTitle:    { color: Colors.white, fontSize: Font.xl, fontWeight: "800", letterSpacing: -0.5 },
  countBadge:   { backgroundColor: Colors.bgCard, borderRadius: Radius.full, borderWidth: 1, borderColor: Colors.border, paddingHorizontal: 10, paddingVertical: 3 },
  countText:    { color: Colors.textMuted, fontSize: Font.xs, fontWeight: "700" },
  empty:        { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 32 },
  emptyTitle:   { color: Colors.white, fontWeight: "700", fontSize: Font.md, textAlign: "center" },
  emptySub:     { color: Colors.textMuted, fontSize: Font.sm, textAlign: "center", marginTop: 8, marginBottom: 24, lineHeight: 22 },
  btn:          { backgroundColor: Colors.cyan, paddingHorizontal: 26, paddingVertical: 14, borderRadius: Radius.full },
  btnText:      { color: Colors.bg, fontWeight: "800", fontSize: Font.sm },
  list:         { paddingHorizontal: 20, gap: 12 },
  card:         { flexDirection: "row", backgroundColor: Colors.bgCard, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.border, overflow: "hidden" },
  cardImage:    { width: 106, height: 106 },
  cardBody:     { flex: 1, paddingVertical: 12, paddingLeft: 14, justifyContent: "center", gap: 4 },
  cardTitle:    { color: Colors.white, fontWeight: "700", fontSize: Font.sm },
  cardPrice:    { color: Colors.cyan, fontWeight: "800", fontSize: Font.base },
  cardMeta:     { color: Colors.textMuted, fontSize: Font.xs },
  cardFooter:   { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 2 },
  verified:     { color: Colors.emerald, fontSize: Font.xs, fontWeight: "700" },
  rating:       { color: Colors.textMuted, fontSize: Font.xs },
  removeBtn:    { width: 48, alignItems: "center", justifyContent: "center" },
  compareBanner:{ flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: "rgba(34,211,238,0.05)", borderRadius: Radius.lg, borderWidth: 1, borderColor: "rgba(34,211,238,0.18)", padding: 16, marginTop: 4 },
  compareTitle: { color: Colors.white, fontWeight: "700", fontSize: Font.sm },
  compareSub:   { color: Colors.textMuted, fontSize: Font.xs, marginTop: 2, lineHeight: 18 },
  compareBtn:   { backgroundColor: Colors.cyan, paddingHorizontal: 14, paddingVertical: 8, borderRadius: Radius.full },
  compareBtnText:{ color: Colors.bg, fontWeight: "800", fontSize: Font.xs },
});
