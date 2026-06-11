import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import { router, Href } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Font, Radius } from "../../shared/theme";

type MenuItem = {
  icon:  React.ComponentProps<typeof Ionicons>["name"];
  label: string;
  sub:   string;
  route: string | null;
  color?: string;
};

const MENU_ITEMS: MenuItem[] = [
  { icon: "home-outline",          label: "Phòng đang thuê",         sub: "Smart Concierge · Báo sự cố & hỗ trợ",     route: "/(tabs)/chat?agent=concierge", color: Colors.emerald },
  { icon: "document-text-outline", label: "Hợp đồng của tôi",        sub: "Contract Agent · Xem & ký hợp đồng",       route: "/(tabs)/chat?agent=contract",  color: Colors.violet  },
  { icon: "card-outline",          label: "Thanh toán",               sub: "Contract Agent · VietQR & lịch sử hóa đơn", route: "/(tabs)/chat?agent=contract",  color: Colors.blue    },
  { icon: "notifications-outline", label: "Thông báo",                sub: "Cài đặt thông báo",                         route: "/notifications",               color: Colors.cyan    },
  { icon: "shield-checkmark-outline", label: "Bảo mật & quyền riêng tư", sub: "Đổi mật khẩu, xác thực 2 lớp",       route: null,                           color: Colors.textMuted },
  { icon: "help-circle-outline",   label: "Hỗ trợ",                   sub: "Smart Concierge · Liên hệ & FAQ",          route: "/(tabs)/chat?agent=concierge", color: Colors.textMuted },
];

export default function ProfileScreen() {
  return (
    <SafeAreaView style={s.safe} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

        {/* ── Page title ─────────────────────────────────── */}
        <Text style={s.pageTitle}>Tài khoản</Text>

        {/* ── Avatar card ───────────────────────────────── */}
        <View style={s.avatarCard}>
          <View style={s.avatar}>
            <Ionicons name="person" size={26} color={Colors.cyan} />
          </View>
          <View style={s.avatarInfo}>
            <Text style={s.avatarName}>Người dùng</Text>
            <Text style={s.avatarEmail}>Chưa đăng nhập</Text>
          </View>
          <Pressable style={s.loginBtn} onPress={() => router.push("/(auth)/tenant-login")}>
            <Text style={s.loginBtnText}>Đăng nhập</Text>
          </Pressable>
        </View>

        {/* ── AI credits ────────────────────────────────── */}
        <View style={s.creditCard}>
          <View style={s.creditLeft}>
            <View style={s.creditIcon}>
              <Text style={{ fontSize: 18 }}>🤖</Text>
            </View>
            <View>
              <Text style={s.creditTitle}>AI Credits</Text>
              <Text style={s.creditSub}>Còn 50 lượt tư vấn miễn phí</Text>
            </View>
          </View>
          <View style={s.freeBadge}><Text style={s.freeBadgeText}>Free</Text></View>
        </View>

        {/* ── Menu ──────────────────────────────────────── */}
        <View style={s.menuCard}>
          {MENU_ITEMS.map((item, i) => (
            <Pressable
              key={i}
              onPress={() => item.route && router.push(item.route as Href)}
              style={[s.menuItem, i < MENU_ITEMS.length - 1 && s.menuItemBorder]}
            >
              <View style={[s.menuIconBox, { backgroundColor: `${item.color ?? Colors.textMuted}12` }]}>
                <Ionicons name={item.icon} size={18} color={item.color ?? Colors.textMuted} />
              </View>
              <View style={s.menuBody}>
                <Text style={s.menuLabel}>{item.label}</Text>
                <Text style={s.menuSub}>{item.sub}</Text>
              </View>
              {item.route ? (
                <Ionicons name="chevron-forward" size={16} color={Colors.textDim} />
              ) : (
                <View style={s.lockIcon}>
                  <Ionicons name="lock-closed-outline" size={12} color={Colors.textDim} />
                </View>
              )}
            </Pressable>
          ))}
        </View>

        {/* ── Role switch ───────────────────────────────── */}
        <Text style={s.sectionLabel}>CHUYỂN VAI TRÒ</Text>
        <View style={s.roleRow}>
          <Pressable style={[s.roleBtn, { borderColor: `${Colors.emerald}40` }]} onPress={() => router.push("/(auth)/tenant-login")}>
            <Ionicons name="home" size={26} color={Colors.emerald} />
            <Text style={[s.roleBtnText, { color: Colors.emerald }]}>Cư dân</Text>
            <Text style={s.roleBtnSub}>Thuê phòng</Text>
          </Pressable>
          <Pressable style={[s.roleBtn, { borderColor: `${Colors.violet}40` }]} onPress={() => router.push("/(auth)/landlord-login")}>
            <Ionicons name="business" size={26} color={Colors.violet} />
            <Text style={[s.roleBtnText, { color: Colors.violet }]}>Chủ nhà</Text>
            <Text style={s.roleBtnSub}>Đăng tin</Text>
          </Pressable>
        </View>

        {/* ── Version ───────────────────────────────────── */}
        <Text style={s.version}>NestaVietAI v1.0.0 · Made with ❤️ in Vietnam</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:           { flex: 1, backgroundColor: Colors.bg },
  pageTitle:      { color: Colors.white, fontSize: Font.xl, fontWeight: "800", paddingHorizontal: 20, paddingTop: 14, paddingBottom: 18, letterSpacing: -0.5 },
  avatarCard:     { marginHorizontal: 20, marginBottom: 12, backgroundColor: Colors.bgCard, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.border, padding: 18, flexDirection: "row", alignItems: "center", gap: 14 },
  avatar:         { width: 52, height: 52, borderRadius: 26, backgroundColor: "rgba(34,211,238,0.08)", borderWidth: 1.5, borderColor: "rgba(34,211,238,0.30)", alignItems: "center", justifyContent: "center" },
  avatarInfo:     { flex: 1 },
  avatarName:     { color: Colors.white, fontWeight: "700", fontSize: Font.base },
  avatarEmail:    { color: Colors.textMuted, fontSize: Font.xs, marginTop: 2 },
  loginBtn:       { paddingHorizontal: 16, paddingVertical: 8, borderRadius: Radius.full, backgroundColor: "rgba(34,211,238,0.10)", borderWidth: 1, borderColor: "rgba(34,211,238,0.30)" },
  loginBtnText:   { color: Colors.cyan, fontWeight: "700", fontSize: Font.xs },
  creditCard:     { marginHorizontal: 20, marginBottom: 16, backgroundColor: "rgba(34,211,238,0.05)", borderRadius: Radius.lg, borderWidth: 1, borderColor: "rgba(34,211,238,0.18)", padding: 16, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  creditLeft:     { flexDirection: "row", alignItems: "center", gap: 12 },
  creditIcon:     { width: 40, height: 40, borderRadius: 20, backgroundColor: "rgba(34,211,238,0.10)", borderWidth: 1, borderColor: "rgba(34,211,238,0.25)", alignItems: "center", justifyContent: "center" },
  creditTitle:    { color: Colors.white, fontWeight: "700", fontSize: Font.sm },
  creditSub:      { color: Colors.textMuted, fontSize: Font.xs, marginTop: 2 },
  freeBadge:      { backgroundColor: Colors.cyan, paddingHorizontal: 12, paddingVertical: 5, borderRadius: Radius.full },
  freeBadgeText:  { color: Colors.bg, fontWeight: "800", fontSize: Font.xs },
  menuCard:       { marginHorizontal: 20, backgroundColor: Colors.bgCard, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.border, overflow: "hidden", marginBottom: 22 },
  menuItem:       { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 14, gap: 14 },
  menuItemBorder: { borderBottomWidth: 0.5, borderBottomColor: Colors.border },
  menuIconBox:    { width: 34, height: 34, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  menuBody:       { flex: 1 },
  menuLabel:      { color: Colors.white, fontWeight: "600", fontSize: Font.sm },
  menuSub:        { color: Colors.textMuted, fontSize: Font.xs, marginTop: 2 },
  lockIcon:       { width: 20, height: 20, borderRadius: 10, backgroundColor: Colors.bgCard, borderWidth: 1, borderColor: Colors.border, alignItems: "center", justifyContent: "center" },
  sectionLabel:   { color: Colors.textMuted, fontSize: 10, fontWeight: "700", letterSpacing: 1, paddingHorizontal: 20, marginBottom: 12 },
  roleRow:        { flexDirection: "row", marginHorizontal: 20, gap: 12, marginBottom: 28 },
  roleBtn:        { flex: 1, backgroundColor: Colors.bgCard, borderRadius: Radius.lg, borderWidth: 1, padding: 18, alignItems: "center", gap: 6 },
  roleBtnText:    { fontWeight: "700", fontSize: Font.sm },
  roleBtnSub:     { color: Colors.textMuted, fontSize: Font.xs },
  version:        { textAlign: "center", color: Colors.textDim, fontSize: Font.xs },
});
