import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Font, Radius } from "../../shared/theme";

const PLAN_FEATURES = [
  "Listing Verifier AI tự động",
  "Dashboard doanh thu real-time",
  "Smart Concierge 24/7",
  "Hợp đồng & VietQR tự động",
];

export default function LandlordRegisterScreen() {
  const [company,  setCompany]  = useState("");
  const [email,    setEmail]    = useState("");
  const [phone,    setPhone]    = useState("");
  const [password, setPassword] = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [loading,  setLoading]  = useState(false);

  const handleRegister = () => {
    if (!company || !email || !password) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); router.replace("/(tabs)"); }, 1400);
  };

  return (
    <SafeAreaView style={s.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

          {/* Back */}
          <Pressable onPress={() => router.back()} style={s.backBtn} hitSlop={12}>
            <Ionicons name="chevron-back" size={20} color={Colors.textMuted} />
            <Text style={s.backText}>Quay lại</Text>
          </Pressable>

          {/* Header */}
          <View style={s.header}>
            <View style={s.iconBox}>
              <Ionicons name="business" size={28} color={Colors.violet} />
            </View>
            <Text style={s.title}>Đăng ký Chủ nhà</Text>
            <Text style={s.sub}>Quản lý toà nhà với 4 AI Agents mạnh mẽ</Text>
          </View>

          {/* Plan card */}
          <View style={s.planCard}>
            <View style={s.planHeader}>
              <View style={s.planBadge}><Text style={s.planBadgeText}>PRO PLAN</Text></View>
              <Text style={s.planPrice}>
                299.000đ<Text style={s.planPeriod}>/tháng</Text>
              </Text>
            </View>
            <Text style={s.planDesc}>Dùng thử miễn phí 30 ngày · Không cần thẻ</Text>
            {PLAN_FEATURES.map(f => (
              <View key={f} style={s.planFeatureRow}>
                <Ionicons name="checkmark-circle" size={14} color={Colors.violet} />
                <Text style={s.planFeatureText}>{f}</Text>
              </View>
            ))}
          </View>

          {/* Form */}
          <View style={s.form}>
            <Text style={s.label}>TÊN CÔNG TY / CÁ NHÂN</Text>
            <TextInput
              style={s.input}
              placeholder="Công ty BĐS ABC"
              placeholderTextColor={Colors.textDim}
              value={company}
              onChangeText={setCompany}
              autoCapitalize="words"
              textContentType="organizationName"
              returnKeyType="next"
            />

            <Text style={[s.label, { marginTop: 8 }]}>EMAIL</Text>
            <TextInput
              style={s.input}
              placeholder="landlord@email.com"
              placeholderTextColor={Colors.textDim}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="emailAddress"
              returnKeyType="next"
            />

            <Text style={[s.label, { marginTop: 8 }]}>SỐ ĐIỆN THOẠI</Text>
            <TextInput
              style={s.input}
              placeholder="0912 345 678"
              placeholderTextColor={Colors.textDim}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              textContentType="telephoneNumber"
              returnKeyType="next"
            />

            <Text style={[s.label, { marginTop: 8 }]}>MẬT KHẨU</Text>
            <View style={s.pwWrap}>
              <TextInput
                style={s.pwInput}
                placeholder="Ít nhất 8 ký tự"
                placeholderTextColor={Colors.textDim}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPw}
                textContentType="newPassword"
                returnKeyType="done"
                onSubmitEditing={handleRegister}
              />
              <Pressable onPress={() => setShowPw(v => !v)} style={s.eyeBtn} hitSlop={8}>
                <Ionicons name={showPw ? "eye-off-outline" : "eye-outline"} size={18} color={Colors.textMuted} />
              </Pressable>
            </View>
          </View>

          <Text style={s.terms}>
            Bằng cách đăng ký, bạn đồng ý với{" "}
            <Text style={{ color: Colors.violet, fontWeight: "600" }}>Điều khoản dịch vụ</Text> và{" "}
            <Text style={{ color: Colors.violet, fontWeight: "600" }}>Chính sách bảo mật</Text> của NestaVietAI.
          </Text>

          <Pressable style={[s.submitBtn, loading && { opacity: 0.7 }]} onPress={handleRegister} disabled={loading}>
            <Text style={s.submitText}>{loading ? "Đang tạo tài khoản..." : "Dùng thử miễn phí 30 ngày →"}</Text>
          </Pressable>

          <View style={s.loginRow}>
            <Text style={s.loginText}>Đã có tài khoản? </Text>
            <Pressable onPress={() => router.replace("/(auth)/landlord-login")}>
              <Text style={[s.loginText, { color: Colors.violet, fontWeight: "700" }]}>Đăng nhập</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:            { flex: 1, backgroundColor: Colors.bg },
  scroll:          { paddingHorizontal: 24, paddingBottom: 48 },
  backBtn:         { flexDirection: "row", alignItems: "center", paddingVertical: 16, gap: 4 },
  backText:        { color: Colors.textMuted, fontSize: Font.sm },
  header:          { alignItems: "center", paddingVertical: 20 },
  iconBox:         { width: 72, height: 72, borderRadius: 24, backgroundColor: "rgba(167,139,250,0.08)", borderWidth: 1.5, borderColor: "rgba(167,139,250,0.28)", alignItems: "center", justifyContent: "center", marginBottom: 16 },
  title:           { color: Colors.white, fontWeight: "800", fontSize: Font.xl, letterSpacing: -0.5 },
  sub:             { color: Colors.textMuted, fontSize: Font.sm, marginTop: 6, textAlign: "center" },
  planCard:        { backgroundColor: "rgba(167,139,250,0.05)", borderRadius: Radius.lg, borderWidth: 1, borderColor: "rgba(167,139,250,0.22)", padding: 16, marginBottom: 22, gap: 8 },
  planHeader:      { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 },
  planBadge:       { backgroundColor: Colors.violet, paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.full },
  planBadgeText:   { color: "#fff", fontSize: Font.xs, fontWeight: "800" },
  planPrice:       { color: Colors.white, fontWeight: "800", fontSize: Font.md },
  planPeriod:      { color: Colors.textMuted, fontWeight: "400", fontSize: Font.sm },
  planDesc:        { color: Colors.textMuted, fontSize: Font.xs, marginBottom: 4 },
  planFeatureRow:  { flexDirection: "row", alignItems: "center", gap: 8 },
  planFeatureText: { color: Colors.textMuted, fontSize: Font.sm },
  form:            { gap: 6, marginBottom: 18 },
  label:           { color: Colors.textMuted, fontSize: 10, fontWeight: "700", letterSpacing: 1 },
  input:           { backgroundColor: Colors.bgCard, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.border, paddingHorizontal: 16, paddingVertical: 14, color: Colors.text, fontSize: Font.base },
  pwWrap:          { flexDirection: "row", alignItems: "center", backgroundColor: Colors.bgCard, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.border },
  pwInput:         { flex: 1, paddingHorizontal: 16, paddingVertical: 14, color: Colors.text, fontSize: Font.base },
  eyeBtn:          { paddingHorizontal: 14 },
  terms:           { color: Colors.textDim, fontSize: Font.xs, textAlign: "center", lineHeight: 19, marginBottom: 20 },
  submitBtn:       { backgroundColor: Colors.violet, paddingVertical: 17, borderRadius: Radius.full, alignItems: "center", marginBottom: 16 },
  submitText:      { color: "#fff", fontWeight: "800", fontSize: Font.base },
  loginRow:        { flexDirection: "row", justifyContent: "center" },
  loginText:       { color: Colors.textMuted, fontSize: Font.sm },
});
