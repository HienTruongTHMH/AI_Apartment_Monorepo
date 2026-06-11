import { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet, Image } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Font, Radius } from "../../shared/theme";
import { LISTINGS } from "../../features/listing/listings";

const DISTRICTS = ["Quận 1", "Quận 7", "Bình Thạnh", "Thủ Đức", "Gò Vấp", "Quận 4", "Quận 3", "Quận 10"];
const BUDGETS   = ["Dưới 5tr", "5–8tr", "8–12tr", "Trên 12tr"];

export default function SearchScreen() {
  const [query,    setQuery]    = useState("");
  const [district, setDistrict] = useState("");
  const [budget,   setBudget]   = useState("");

  const results = LISTINGS.filter(l => {
    const matchQ = !query    || l.title.toLowerCase().includes(query.toLowerCase()) || l.district.toLowerCase().includes(query.toLowerCase());
    const matchD = !district || l.district.includes(district);
    const matchB = !budget   || (() => {
      if (budget === "Dưới 5tr")  return l.priceNum < 5_000_000;
      if (budget === "5–8tr")     return l.priceNum >= 5_000_000 && l.priceNum <= 8_000_000;
      if (budget === "8–12tr")    return l.priceNum > 8_000_000  && l.priceNum <= 12_000_000;
      if (budget === "Trên 12tr") return l.priceNum > 12_000_000;
      return true;
    })();
    return matchQ && matchD && matchB;
  });

  const hasFilter = !!(query || district || budget);

  return (
    <SafeAreaView style={s.safe} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>

        {/* ── Header ─────────────────────────────────────── */}
        <Text style={s.pageTitle}>Tìm kiếm</Text>

        {/* ── Search bar ─────────────────────────────────── */}
        <View style={s.searchBox}>
          <Ionicons name="search-outline" size={17} color={Colors.textDim} style={{ marginRight: 8 }} />
          <TextInput
            style={s.searchInput}
            placeholder="Khu vực, tiêu đề, loại phòng..."
            placeholderTextColor={Colors.textDim}
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
            clearButtonMode="while-editing"
          />
        </View>

        {/* ── District filter ─────────────────────────────── */}
        <Text style={s.filterLabel}>KHU VỰC</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}>
          {DISTRICTS.map(d => (
            <Pressable key={d} onPress={() => setDistrict(district === d ? "" : d)} style={[s.chip, district === d && s.chipActive]}>
              <Text style={[s.chipText, district === d && s.chipTextActive]}>{d}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* ── Budget filter ──────────────────────────────── */}
        <Text style={[s.filterLabel, { marginTop: 20 }]}>NGÂN SÁCH</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}>
          {BUDGETS.map(b => (
            <Pressable key={b} onPress={() => setBudget(budget === b ? "" : b)} style={[s.chip, budget === b && s.chipActive]}>
              <Text style={[s.chipText, budget === b && s.chipTextActive]}>{b}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* ── Results header ──────────────────────────────── */}
        <View style={s.resultsHeader}>
          <Text style={s.resultsCount}>
            {results.length} kết quả{hasFilter ? " — đang lọc" : ""}
          </Text>
          {hasFilter && (
            <Pressable onPress={() => { setQuery(""); setDistrict(""); setBudget(""); }}>
              <Text style={s.clearText}>Xóa bộ lọc</Text>
            </Pressable>
          )}
        </View>

        {/* ── Results list ────────────────────────────────── */}
        <View style={s.list}>
          {results.map(l => (
            <Pressable key={l.id} onPress={() => router.push(`/listing/${l.id}`)} style={s.row}>
              <Image source={{ uri: l.image }} style={s.rowImg} />
              <View style={s.rowBody}>
                <Text style={s.rowTitle} numberOfLines={1}>{l.title}</Text>
                <Text style={s.rowPrice}>{l.price}</Text>
                <Text style={s.rowMeta} numberOfLines={1}>📍 {l.district} · {l.area}</Text>
                {l.verified && <Text style={s.rowVerified}>✅ AI Verified</Text>}
              </View>
              <Ionicons name="chevron-forward" size={16} color={Colors.textDim} style={{ alignSelf: "center", marginRight: 14 }} />
            </Pressable>
          ))}

          {results.length === 0 && (
            <View style={s.empty}>
              <Text style={s.emptyEmoji}>🔍</Text>
              <Text style={s.emptyText}>Không tìm thấy kết quả</Text>
              <Text style={s.emptySub}>Thử điều chỉnh bộ lọc hoặc hỏi AI nhé</Text>
              <Pressable onPress={() => router.push("/(tabs)/chat")} style={s.emptyBtn}>
                <Text style={s.emptyBtnText}>🤖 Hỏi Super Broker AI</Text>
              </Pressable>
            </View>
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:          { flex: 1, backgroundColor: Colors.bg },
  pageTitle:     { color: Colors.white, fontSize: Font.xl, fontWeight: "800", paddingHorizontal: 20, paddingTop: 14, paddingBottom: 18, letterSpacing: -0.5 },
  searchBox:     { marginHorizontal: 20, marginBottom: 22, flexDirection: "row", alignItems: "center", backgroundColor: Colors.bgCard, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.border, paddingHorizontal: 14, height: 46 },
  searchInput:   { flex: 1, color: Colors.text, fontSize: Font.sm },
  filterLabel:   { color: Colors.textMuted, fontSize: 10, fontWeight: "700", paddingHorizontal: 20, marginBottom: 10, letterSpacing: 1 },
  chip:          { paddingHorizontal: 14, paddingVertical: 8, borderRadius: Radius.full, backgroundColor: Colors.bgCard, borderWidth: 1, borderColor: Colors.border },
  chipActive:    { backgroundColor: "rgba(34,211,238,0.12)", borderColor: Colors.cyan },
  chipText:      { color: Colors.textMuted, fontSize: Font.xs, fontWeight: "600" },
  chipTextActive:{ color: Colors.cyan, fontWeight: "700" },
  resultsHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, marginTop: 22, marginBottom: 14 },
  resultsCount:  { color: Colors.white, fontWeight: "700", fontSize: Font.sm },
  clearText:     { color: Colors.cyan, fontSize: Font.xs, fontWeight: "600" },
  list:          { paddingHorizontal: 20, gap: 10 },
  row:           { flexDirection: "row", backgroundColor: Colors.bgCard, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.border, overflow: "hidden" },
  rowImg:        { width: 96, height: 96 },
  rowBody:       { flex: 1, paddingVertical: 12, paddingLeft: 14, justifyContent: "center", gap: 3 },
  rowTitle:      { color: Colors.white, fontWeight: "700", fontSize: Font.sm },
  rowPrice:      { color: Colors.cyan, fontWeight: "800", fontSize: Font.base },
  rowMeta:       { color: Colors.textMuted, fontSize: Font.xs },
  rowVerified:   { color: Colors.emerald, fontSize: Font.xs, fontWeight: "700" },
  empty:         { alignItems: "center", paddingVertical: 52 },
  emptyEmoji:    { fontSize: 44, marginBottom: 14 },
  emptyText:     { color: Colors.white, fontWeight: "700", fontSize: Font.md },
  emptySub:      { color: Colors.textMuted, fontSize: Font.sm, marginTop: 6, marginBottom: 20, textAlign: "center", lineHeight: 20 },
  emptyBtn:      { backgroundColor: "rgba(34,211,238,0.08)", borderWidth: 1, borderColor: "rgba(34,211,238,0.28)", paddingHorizontal: 22, paddingVertical: 12, borderRadius: Radius.full },
  emptyBtnText:  { color: Colors.cyan, fontWeight: "700", fontSize: Font.sm },
});
