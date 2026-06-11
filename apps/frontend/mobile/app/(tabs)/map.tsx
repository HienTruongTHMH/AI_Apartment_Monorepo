import { useState } from "react";
import { View, Text, Pressable, ScrollView, Image, StyleSheet, Dimensions } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Font, Radius } from "../../shared/theme";
import { LISTINGS } from "../../features/listing/listings";

const { width } = Dimensions.get("window");

// District metadata: name, zone, accent color, price range label
const DISTRICTS = [
  // Premium zone
  { id: "Q1",   name: "Quận 1",      zone: "Trung tâm", color: "#22d3ee", minPrice: 8,  maxPrice: 22 },
  { id: "Q3",   name: "Quận 3",      zone: "Trung tâm", color: "#22d3ee", minPrice: 7,  maxPrice: 18 },
  { id: "BT",   name: "Bình Thạnh",  zone: "Trung tâm", color: "#22d3ee", minPrice: 6,  maxPrice: 14 },
  // South zone
  { id: "Q7",   name: "Quận 7",      zone: "Phía Nam",  color: "#34d399", minPrice: 7,  maxPrice: 16 },
  { id: "Q4",   name: "Quận 4",      zone: "Phía Nam",  color: "#34d399", minPrice: 6,  maxPrice: 13 },
  // West zone
  { id: "GV",   name: "Gò Vấp",      zone: "Phía Tây",  color: "#a78bfa", minPrice: 4,  maxPrice: 10 },
  { id: "Q10",  name: "Quận 10",     zone: "Phía Tây",  color: "#a78bfa", minPrice: 5,  maxPrice: 11 },
  // East zone
  { id: "TD",   name: "TP. Thủ Đức", zone: "Phía Đông", color: "#f59e0b", minPrice: 5,  maxPrice: 15 },
] as const;

type DistrictId = typeof DISTRICTS[number]["id"];

// Rough listing-to-district mapping by keyword
function getListingsForDistrict(districtId: DistrictId) {
  const kwMap: Record<DistrictId, string[]> = {
    Q1:  ["Quận 1"],
    Q3:  ["Quận 3"],
    BT:  ["Bình Thạnh"],
    Q7:  ["Quận 7"],
    Q4:  ["Quận 4"],
    GV:  ["Gò Vấp"],
    Q10: ["Quận 10"],
    TD:  ["Thủ Đức", "Thủ Đức"],
  };
  const kws = kwMap[districtId];
  return LISTINGS.filter(l => kws.some(kw => l.district.includes(kw)));
}

// Zone grouping
const ZONES = ["Trung tâm", "Phía Nam", "Phía Tây", "Phía Đông"] as const;
type Zone = typeof ZONES[number];

export default function MapScreen() {
  const [selected, setSelected] = useState<DistrictId | null>(null);

  const selectedDistrict = DISTRICTS.find(d => d.id === selected);
  const listings = selected ? getListingsForDistrict(selected) : LISTINGS;

  return (
    <SafeAreaView style={s.safe} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>

        {/* ── Header ─────────────────────────────────────── */}
        <View style={s.header}>
          <View>
            <Text style={s.pageTitle}>Bản đồ giá</Text>
            <Text style={s.pageSub}>Giá thuê theo khu vực tại TP.HCM</Text>
          </View>
          {selected && (
            <Pressable onPress={() => setSelected(null)} style={s.clearBtn} hitSlop={8}>
              <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
              <Text style={s.clearText}>Xóa lọc</Text>
            </Pressable>
          )}
        </View>

        {/* ── Legend ─────────────────────────────────────── */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 8, marginBottom: 16 }}>
          {ZONES.map(zone => {
            const d = DISTRICTS.find(d => d.zone === zone)!;
            return (
              <View key={zone} style={s.legendItem}>
                <View style={[s.legendDot, { backgroundColor: d.color }]} />
                <Text style={s.legendText}>{zone}</Text>
              </View>
            );
          })}
        </ScrollView>

        {/* ── District grid ──────────────────────────────── */}
        <View style={s.gridWrap}>
          {ZONES.map(zone => {
            const zoneDistricts = DISTRICTS.filter(d => d.zone === zone);
            return (
              <View key={zone} style={s.zoneSection}>
                <Text style={s.zoneLabel}>{zone.toUpperCase()}</Text>
                <View style={s.zoneRow}>
                  {zoneDistricts.map(d => {
                    const count   = getListingsForDistrict(d.id).length;
                    const isActive = selected === d.id;
                    return (
                      <Pressable
                        key={d.id}
                        onPress={() => setSelected(isActive ? null : d.id)}
                        style={[
                          s.distCard,
                          { borderColor: isActive ? d.color : Colors.border },
                          isActive && { backgroundColor: `${d.color}14` },
                        ]}
                      >
                        <View style={[s.distDot, { backgroundColor: d.color }]} />
                        <Text style={[s.distName, isActive && { color: Colors.white }]}>{d.name}</Text>
                        <Text style={[s.distPrice, { color: d.color }]}>
                          {d.minPrice}–{d.maxPrice}M
                        </Text>
                        <View style={s.distFooter}>
                          <Ionicons name="home-outline" size={11} color={Colors.textDim} />
                          <Text style={s.distCount}>{count > 0 ? `${count} tin` : "Sắp có"}</Text>
                        </View>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            );
          })}
        </View>

        {/* ── AI insight bar ─────────────────────────────── */}
        <View style={s.insightBar}>
          <Ionicons name="sparkles-outline" size={15} color={Colors.cyan} />
          <Text style={s.insightText}>
            {selected && selectedDistrict
              ? `${selectedDistrict.name}: giá thuê trung bình ${Math.round((selectedDistrict.minPrice + selectedDistrict.maxPrice) / 2)}M/tháng`
              : "Quận 1 & Q.7 có thanh khoản cao nhất — phù hợp thuê ngắn hạn"}
          </Text>
        </View>

        {/* ── Results section ────────────────────────────── */}
        <View style={s.resultsHeader}>
          <Text style={s.resultsTitle}>
            {selected && selectedDistrict ? selectedDistrict.name : "Tất cả khu vực"}
          </Text>
          <Text style={s.resultsCount}>{listings.length} tin đăng</Text>
        </View>

        {listings.length === 0 ? (
          <View style={s.empty}>
            <Ionicons name="map-outline" size={44} color={Colors.textDim} style={{ marginBottom: 12 }} />
            <Text style={s.emptyText}>Chưa có tin đăng tại khu vực này</Text>
            <Text style={s.emptySub}>Hỏi Super Broker AI để được gợi ý thay thế</Text>
            <Pressable onPress={() => router.push("/(tabs)/chat")} style={s.emptyBtn}>
              <Text style={s.emptyBtnText}>🤖 Hỏi AI ngay</Text>
            </Pressable>
          </View>
        ) : (
          <View style={s.list}>
            {listings.map(l => (
              <Pressable key={l.id} onPress={() => router.push(`/listing/${l.id}`)} style={s.row}>
                <Image source={{ uri: l.image }} style={s.rowImg} />
                <View style={s.rowBody}>
                  <Text style={s.rowTitle} numberOfLines={1}>{l.title}</Text>
                  <Text style={s.rowPrice}>{l.price}</Text>
                  <Text style={s.rowMeta} numberOfLines={1}>📍 {l.district} · {l.area}</Text>
                  {l.verified && (
                    <Text style={s.rowVerified}>✅ AI Verified</Text>
                  )}
                </View>
                <Ionicons name="chevron-forward" size={15} color={Colors.textDim} style={{ alignSelf: "center", marginRight: 14 }} />
              </Pressable>
            ))}
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const CARD_W = (width - 20 * 2 - 10) / 2;

const s = StyleSheet.create({
  safe:          { flex: 1, backgroundColor: Colors.bg },
  header:        { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", paddingHorizontal: 20, paddingTop: 14, paddingBottom: 18 },
  pageTitle:     { color: Colors.white, fontSize: Font.xl, fontWeight: "800", letterSpacing: -0.5 },
  pageSub:       { color: Colors.textMuted, fontSize: Font.xs, marginTop: 4 },
  clearBtn:      { flexDirection: "row", alignItems: "center", gap: 4, paddingTop: 4 },
  clearText:     { color: Colors.textMuted, fontSize: Font.xs },
  legendItem:    { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: Colors.bgCard, borderRadius: Radius.full, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: Colors.border },
  legendDot:     { width: 7, height: 7, borderRadius: 4 },
  legendText:    { color: Colors.textMuted, fontSize: Font.xs, fontWeight: "600" },
  gridWrap:      { paddingHorizontal: 20, gap: 18, marginBottom: 16 },
  zoneSection:   { gap: 10 },
  zoneLabel:     { color: Colors.textMuted, fontSize: 10, fontWeight: "700", letterSpacing: 1 },
  zoneRow:       { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  distCard:      { width: CARD_W, backgroundColor: Colors.bgCard, borderRadius: Radius.lg, borderWidth: 1, padding: 14, gap: 4 },
  distDot:       { width: 6, height: 6, borderRadius: 3, marginBottom: 2 },
  distName:      { color: Colors.textMuted, fontWeight: "700", fontSize: Font.sm },
  distPrice:     { fontWeight: "800", fontSize: Font.base },
  distFooter:    { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 },
  distCount:     { color: Colors.textDim, fontSize: Font.xs },
  insightBar:    { marginHorizontal: 20, marginBottom: 16, flexDirection: "row", alignItems: "flex-start", gap: 8, backgroundColor: "rgba(34,211,238,0.05)", borderRadius: Radius.md, borderWidth: 1, borderColor: "rgba(34,211,238,0.15)", padding: 12 },
  insightText:   { flex: 1, color: Colors.textMuted, fontSize: Font.xs, lineHeight: 18 },
  resultsHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, marginBottom: 12 },
  resultsTitle:  { color: Colors.white, fontWeight: "700", fontSize: Font.md },
  resultsCount:  { color: Colors.textMuted, fontSize: Font.sm },
  list:          { paddingHorizontal: 20, gap: 10 },
  row:           { flexDirection: "row", backgroundColor: Colors.bgCard, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.border, overflow: "hidden" },
  rowImg:        { width: 96, height: 96 },
  rowBody:       { flex: 1, paddingVertical: 12, paddingLeft: 14, justifyContent: "center", gap: 3 },
  rowTitle:      { color: Colors.white, fontWeight: "700", fontSize: Font.sm },
  rowPrice:      { color: Colors.cyan, fontWeight: "800", fontSize: Font.base },
  rowMeta:       { color: Colors.textMuted, fontSize: Font.xs },
  rowVerified:   { color: Colors.emerald, fontSize: Font.xs, fontWeight: "700" },
  empty:         { alignItems: "center", paddingVertical: 40 },
  emptyText:     { color: Colors.white, fontWeight: "700", fontSize: Font.md },
  emptySub:      { color: Colors.textMuted, fontSize: Font.sm, marginTop: 6, marginBottom: 20, textAlign: "center" },
  emptyBtn:      { backgroundColor: "rgba(34,211,238,0.08)", borderWidth: 1, borderColor: "rgba(34,211,238,0.28)", paddingHorizontal: 20, paddingVertical: 11, borderRadius: Radius.full },
  emptyBtnText:  { color: Colors.cyan, fontWeight: "700", fontSize: Font.sm },
});
