import { useState } from "react";
import { View, Text, ScrollView, Pressable, TextInput, Image, StyleSheet, Dimensions } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Font, Radius } from "../../shared/theme";
import { LISTINGS } from "../../features/listing/listings";
import { toggleSave, useSaved } from "../../features/store/savedStore";
import { useRecent } from "../../features/store/recentStore";

const { width } = Dimensions.get("window");
const CARD_W    = width * 0.56;
const FILTERS   = ["Tất cả", "Studio", "1 Phòng ngủ", "2 Phòng ngủ", "Penthouse"];
const FEATURED  = LISTINGS.filter(l => l.verified && l.rating >= 4.7);

export default function HomeScreen() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Tất cả");
  const savedIds   = useSaved();
  const recentIds  = useRecent();
  const recentListings = LISTINGS.filter(l => recentIds.includes(l.id))
    .sort((a, b) => recentIds.indexOf(a.id) - recentIds.indexOf(b.id));

  const filtered = LISTINGS.filter(l =>
    (filter === "Tất cả" || l.type === filter) &&
    (search === "" ||
      l.title.toLowerCase().includes(search.toLowerCase()) ||
      l.district.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <SafeAreaView style={s.safe} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>

        {/* ── Header ─────────────────────────────────────── */}
        <View style={s.header}>
          <View>
            <Text style={s.greeting}>Xin chào 👋</Text>
            <Text style={s.pageTitle}>Tìm nhà thuê</Text>
          </View>
          <View style={s.headerRight}>
            <Pressable onPress={() => router.push("/notifications" as any)} style={s.iconBtn}>
              <Ionicons name="notifications-outline" size={20} color={Colors.text} />
            </Pressable>
            <Pressable onPress={() => router.push("/(auth)/tenant-login")} style={s.iconBtn}>
              <Ionicons name="person-outline" size={20} color={Colors.text} />
            </Pressable>
          </View>
        </View>

        {/* ── AI Banner ──────────────────────────────────── */}
        <Pressable onPress={() => router.push("/(tabs)/chat")} style={s.aiBanner}>
          <View style={s.aiBannerLeft}>
            <View style={s.aiBannerIcon}>
              <Text style={{ fontSize: 20 }}>🤖</Text>
            </View>
            <View>
              <Text style={s.aiBannerTitle}>Super Broker AI</Text>
              <Text style={s.aiBannerSub}>Tư vấn 24/7 · Phản hồi trong 1.2s</Text>
            </View>
          </View>
          <View style={s.aiBannerBadge}>
            <Text style={s.aiBannerBadgeText}>Hỏi ngay</Text>
          </View>
        </Pressable>

        {/* ── Search ─────────────────────────────────────── */}
        <View style={s.searchBox}>
          <Ionicons name="search-outline" size={17} color={Colors.textDim} style={{ marginRight: 8 }} />
          <TextInput
            style={s.searchInput}
            placeholder="Quận, phường, tiêu đề..."
            placeholderTextColor={Colors.textDim}
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
            clearButtonMode="while-editing"
          />
        </View>

        {/* ── Featured ───────────────────────────────────── */}
        {search === "" && filter === "Tất cả" && (
          <>
            <View style={s.sectionHeader}>
              <Text style={s.sectionTitle}>Nổi bật</Text>
              <Pressable><Text style={[s.sectionLink]}>Xem tất cả</Text></Pressable>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 20, gap: 14, paddingBottom: 4 }}
            >
              {FEATURED.map(l => (
                <Pressable key={l.id} onPress={() => router.push(`/listing/${l.id}`)} style={[s.featCard, { width: CARD_W }]}>
                  <Image source={{ uri: l.image }} style={s.featImage} />
                  <View style={s.featVerifiedBadge}>
                    <Text style={s.featVerifiedText}>✅ AI</Text>
                  </View>
                  <Pressable
                    onPress={(e) => { e.stopPropagation(); toggleSave(l.id); }}
                    style={s.heartBtn}
                  >
                    <Ionicons
                      name={savedIds.has(l.id) ? "heart" : "heart-outline"}
                      size={16}
                      color={savedIds.has(l.id) ? "#f87171" : Colors.white}
                    />
                  </Pressable>
                  <View style={s.featBody}>
                    <Text style={s.featTitle} numberOfLines={1}>{l.title}</Text>
                    <Text style={s.featPrice}>{l.price}</Text>
                    <Text style={s.featMeta} numberOfLines={1}>📍 {l.district}</Text>
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          </>
        )}

        {/* ── Filters ────────────────────────────────────── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={s.filterScroll}
          contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}
        >
          {FILTERS.map(f => (
            <Pressable key={f} onPress={() => setFilter(f)} style={[s.chip, filter === f && s.chipActive]}>
              <Text style={[s.chipText, filter === f && s.chipTextActive]}>{f}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* ── Recently viewed ────────────────────────────── */}
        {recentListings.length > 0 && (
          <>
            <View style={s.sectionHeader}>
              <Text style={s.sectionTitle}>Đã xem gần đây</Text>
              <Text style={s.sectionCount}>{recentListings.length} tin</Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 20, gap: 12, paddingBottom: 4 }}
              style={{ marginBottom: 18 }}
            >
              {recentListings.map(l => (
                <Pressable key={l.id} onPress={() => router.push(`/listing/${l.id}`)} style={s.recentCard}>
                  <Image source={{ uri: l.image }} style={s.recentImage} />
                  <View style={s.recentBody}>
                    <Text style={s.recentTitle} numberOfLines={1}>{l.title}</Text>
                    <Text style={s.recentPrice}>{l.price}</Text>
                    <Text style={s.recentMeta} numberOfLines={1}>📍 {l.district}</Text>
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          </>
        )}

        {/* ── Stats row ──────────────────────────────────── */}
        <View style={s.statsRow}>
          {[
            { label: "Tin đăng",    val: "1,240+", color: Colors.cyan    },
            { label: "AI Verified", val: "820",    color: Colors.emerald },
            { label: "Hoạt động",   val: "340",    color: Colors.violet  },
          ].map(stat => (
            <View key={stat.label} style={s.statCard}>
              <Text style={[s.statVal, { color: stat.color }]}>{stat.val}</Text>
              <Text style={s.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* ── Section header ─────────────────────────────── */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>Gần đây</Text>
          <Text style={s.sectionCount}>{filtered.length} tin</Text>
        </View>

        {/* ── Listing cards ──────────────────────────────── */}
        <View style={s.cardList}>
          {filtered.map(listing => (
            <Pressable key={listing.id} onPress={() => router.push(`/listing/${listing.id}`)} style={s.card}>
              <View style={{ position: "relative" }}>
                <Image source={{ uri: listing.image }} style={s.cardImage} />
                {listing.verified && (
                  <View style={s.verifiedBadge}>
                    <Text style={s.verifiedText}>✅ AI Verified</Text>
                  </View>
                )}
                <Pressable
                  onPress={(e) => { e.stopPropagation(); toggleSave(listing.id); }}
                  style={s.cardHeart}
                >
                  <Ionicons
                    name={savedIds.has(listing.id) ? "heart" : "heart-outline"}
                    size={18}
                    color={savedIds.has(listing.id) ? "#f87171" : Colors.white}
                  />
                </Pressable>
              </View>
              <View style={s.cardBody}>
                <View style={s.cardRow}>
                  <Text style={s.cardTitle} numberOfLines={1}>{listing.title}</Text>
                  <Text style={s.cardRating}>⭐ {listing.rating}</Text>
                </View>
                <Text style={s.cardPrice}>{listing.price}</Text>
                <Text style={s.cardMeta} numberOfLines={1}>📍 {listing.district} · {listing.area}</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }} contentContainerStyle={{ gap: 6 }}>
                  {listing.tags.map(tag => (
                    <View key={tag} style={s.tag}>
                      <Text style={s.tagText}>{tag}</Text>
                    </View>
                  ))}
                </ScrollView>
              </View>
            </Pressable>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:              { flex: 1, backgroundColor: Colors.bg },
  header:            { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingTop: 14, paddingBottom: 18 },
  greeting:          { color: Colors.textMuted, fontSize: Font.sm },
  pageTitle:         { color: Colors.white, fontSize: Font.xl, fontWeight: "800", letterSpacing: -0.5, marginTop: 2 },
  headerRight:       { flexDirection: "row", gap: 10 },
  iconBtn:           { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.bgCard, borderWidth: 1, borderColor: Colors.border, alignItems: "center", justifyContent: "center" },
  aiBanner:          { marginHorizontal: 20, marginBottom: 16, padding: 16, borderRadius: Radius.lg, borderWidth: 1, borderColor: "rgba(34,211,238,0.22)", backgroundColor: "rgba(34,211,238,0.05)", flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  aiBannerLeft:      { flexDirection: "row", alignItems: "center", gap: 12 },
  aiBannerIcon:      { width: 42, height: 42, borderRadius: 21, backgroundColor: "rgba(34,211,238,0.10)", borderWidth: 1, borderColor: "rgba(34,211,238,0.28)", alignItems: "center", justifyContent: "center" },
  aiBannerTitle:     { color: Colors.white, fontWeight: "700", fontSize: Font.base },
  aiBannerSub:       { color: Colors.textMuted, fontSize: Font.xs, marginTop: 2 },
  aiBannerBadge:     { backgroundColor: Colors.cyan, paddingHorizontal: 14, paddingVertical: 7, borderRadius: Radius.full },
  aiBannerBadgeText: { color: Colors.bg, fontWeight: "800", fontSize: Font.xs },
  searchBox:         { marginHorizontal: 20, marginBottom: 18, flexDirection: "row", alignItems: "center", backgroundColor: Colors.bgCard, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.border, paddingHorizontal: 14, height: 46 },
  searchInput:       { flex: 1, color: Colors.text, fontSize: Font.sm },
  sectionHeader:     { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, marginBottom: 14 },
  sectionTitle:      { color: Colors.white, fontSize: Font.md, fontWeight: "700" },
  sectionLink:       { fontSize: Font.sm, color: Colors.cyan, fontWeight: "600" },
  sectionCount:      { fontSize: Font.sm, color: Colors.textMuted },
  featCard:          { backgroundColor: Colors.bgCard, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.border, overflow: "hidden" },
  featImage:         { width: "100%", height: 148 },
  featVerifiedBadge: { position: "absolute", top: 10, left: 10, backgroundColor: "rgba(3,11,20,0.82)", paddingHorizontal: 8, paddingVertical: 4, borderRadius: Radius.full },
  featVerifiedText:  { color: Colors.emerald, fontSize: 10, fontWeight: "700" },
  heartBtn:          { position: "absolute", top: 10, right: 10, width: 32, height: 32, borderRadius: 16, backgroundColor: "rgba(0,0,0,0.48)", alignItems: "center", justifyContent: "center" },
  featBody:          { padding: 12 },
  featTitle:         { color: Colors.white, fontWeight: "700", fontSize: Font.sm, marginBottom: 3 },
  featPrice:         { color: Colors.cyan, fontWeight: "800", fontSize: Font.base, marginBottom: 3 },
  featMeta:          { color: Colors.textMuted, fontSize: Font.xs },
  filterScroll:      { marginBottom: 18 },
  chip:              { paddingHorizontal: 16, paddingVertical: 8, borderRadius: Radius.full, backgroundColor: Colors.bgCard, borderWidth: 1, borderColor: Colors.border },
  chipActive:        { backgroundColor: "rgba(34,211,238,0.12)", borderColor: Colors.cyan },
  chipText:          { color: Colors.textMuted, fontSize: Font.xs, fontWeight: "600" },
  chipTextActive:    { color: Colors.cyan },
  statsRow:          { flexDirection: "row", marginHorizontal: 20, gap: 10, marginBottom: 22 },
  statCard:          { flex: 1, backgroundColor: Colors.bgCard, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.border, padding: 12, alignItems: "center" },
  statVal:           { fontSize: Font.md, fontWeight: "800" },
  statLabel:         { color: Colors.textMuted, fontSize: Font.xs, marginTop: 3 },
  cardList:          { paddingHorizontal: 20, gap: 16 },
  card:              { backgroundColor: Colors.bgCard, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.border, overflow: "hidden" },
  cardImage:         { width: "100%", height: 200 },
  verifiedBadge:     { position: "absolute", top: 12, left: 12, backgroundColor: "rgba(3,11,20,0.85)", paddingHorizontal: 10, paddingVertical: 5, borderRadius: Radius.full },
  verifiedText:      { color: Colors.emerald, fontSize: Font.xs, fontWeight: "700" },
  cardHeart:         { position: "absolute", top: 12, right: 12, width: 36, height: 36, borderRadius: 18, backgroundColor: "rgba(0,0,0,0.50)", alignItems: "center", justifyContent: "center" },
  cardBody:          { padding: 16 },
  cardRow:           { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 },
  cardTitle:         { flex: 1, color: Colors.white, fontWeight: "700", fontSize: Font.base, marginRight: 8 },
  cardRating:        { color: Colors.textMuted, fontSize: Font.xs },
  cardPrice:         { color: Colors.cyan, fontWeight: "800", fontSize: Font.md, marginBottom: 4 },
  cardMeta:          { color: Colors.textMuted, fontSize: Font.sm },
  tag:               { paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.full, backgroundColor: "rgba(255,255,255,0.05)", borderWidth: 1, borderColor: Colors.border },
  tagText:           { color: Colors.textMuted, fontSize: 11, fontWeight: "600" },
  recentCard:        { width: 160, backgroundColor: Colors.bgCard, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.border, overflow: "hidden" },
  recentImage:       { width: "100%", height: 96 },
  recentBody:        { padding: 10 },
  recentTitle:       { color: Colors.white, fontWeight: "700", fontSize: Font.xs, marginBottom: 3 },
  recentPrice:       { color: Colors.cyan, fontWeight: "800", fontSize: Font.sm, marginBottom: 2 },
  recentMeta:        { color: Colors.textMuted, fontSize: 11 },
});
