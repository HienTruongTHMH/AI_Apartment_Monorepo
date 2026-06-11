import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Font, Radius } from "../../shared/theme";

const FEATURES = [
  { icon: "shield-checkmark-outline" as const, text: "Listing Verifier AI tự động" },
  { icon: "bar-chart-outline"         as const, text: "Dashboard doanh thu real-time" },
  { icon: "construct-outline"         as const, text: "Smart Concierge 24/7" },
  { icon: "document-text-outline"     as const, text: "Hợp đồng & VietQR tự động" },
];

export default function LandlordLoginScreen() {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [loading,  setLoading]  = useState(false);

  const handleLogin = () => {
    if (!email || !password) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); router.replace("/(tabs)"); }, 1200);
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
            <Text style={s.title}>Chủ nhà đăng nhập</Text>
            <Text style={s.sub}>Quản lý toà nhà với 4 AI Agents</Text>
          </View>

          {/* Feature list */}
          <View style={s.featureList}>
            {FEATURES.map(({ icon, text }) => (
              <View key={text} style={s.featureRow}>
                <Ionicons name={icon} size={15} color={Colors.violet} />
                <Text style={s.featureText}>{text}</Text>
              </View>
            ))}
          </View>

          {/* Form */}
          <View style={s.form}>
            <Text style={s.label}>EMAIL</Text>
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

            <Text style={[s.label, { marginTop: 8 }]}>MẬT KHẨU</Text>
            <View style={s.pwWrap}>
              <TextInput
                style={s.pwInput}
                placeholder="••••••••"
                placeholderTextColor={Colors.textDim}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPw}
                textContentType="password"
                returnKeyType="done"
                onSubmitEditing={handleLogin}
              />
              <Pressable onPress={() => setShowPw(v => !v)} style={s.eyeBtn} hitSlop={8}>
                <Ionicons name={showPw ? "eye-off-outline" : "eye-outline"} size={18} color={Colors.textMuted} />
              </Pressable>
            </View>
          </View>

          <Pressable style={[s.submitBtn, loading && { opacity: 0.7 }]} onPress={handleLogin} disabled={loading}>
            <Text style={s.submitText}>{loading ? "Đang đăng nhập..." : "Đăng nhập"}</Text>
          </Pressable>

          <View style={s.linkRow}>
            <Text style={s.linkText}>Chưa có tài khoản? </Text>
            <Pressable onPress={() => router.push("/(auth)/landlord-register")}>
              <Text style={[s.linkText, { color: Colors.violet, fontWeight: "700" }]}>Đăng ký miễn phí</Text>
            </Pressable>
          </View>

          <Pressable onPress={() => router.replace("/(auth)/tenant-login")} style={s.switchRole}>
            <Text style={s.switchText}>Bạn là cư dân? </Text>
            <Text style={[s.switchText, { color: Colors.cyan }]}>Đăng nhập với vai trò Cư dân →</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:        { flex: 1, backgroundColor: Colors.bg },
  scroll:      { paddingHorizontal: 24, paddingBottom: 48 },
  backBtn:     { flexDirection: "row", alignItems: "center", paddingVertical: 16, gap: 4 },
  backText:    { color: Colors.textMuted, fontSize: Font.sm },
  header:      { alignItems: "center", paddingVertical: 24 },
  iconBox:     { width: 72, height: 72, borderRadius: 24, backgroundColor: "rgba(167,139,250,0.08)", borderWidth: 1.5, borderColor: "rgba(167,139,250,0.28)", alignItems: "center", justifyContent: "center", marginBottom: 16 },
  title:       { color: Colors.white, fontWeight: "800", fontSize: Font.xl, letterSpacing: -0.5 },
  sub:         { color: Colors.textMuted, fontSize: Font.sm, marginTop: 6, textAlign: "center" },
  featureList: { backgroundColor: Colors.bgCard, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.border, padding: 16, gap: 12, marginBottom: 24 },
  featureRow:  { flexDirection: "row", alignItems: "center", gap: 10 },
  featureText: { color: Colors.textMuted, fontSize: Font.sm },
  form:        { gap: 6, marginBottom: 20 },
  label:       { color: Colors.textMuted, fontSize: 10, fontWeight: "700", letterSpacing: 1 },
  input:       { backgroundColor: Colors.bgCard, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.border, paddingHorizontal: 16, paddingVertical: 14, color: Colors.text, fontSize: Font.base },
  pwWrap:      { flexDirection: "row", alignItems: "center", backgroundColor: Colors.bgCard, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.border },
  pwInput:     { flex: 1, paddingHorizontal: 16, paddingVertical: 14, color: Colors.text, fontSize: Font.base },
  eyeBtn:      { paddingHorizontal: 14 },
  submitBtn:   { backgroundColor: Colors.violet, paddingVertical: 17, borderRadius: Radius.full, alignItems: "center", marginBottom: 16 },
  submitText:  { color: "#fff", fontWeight: "800", fontSize: Font.base },
  linkRow:     { flexDirection: "row", justifyContent: "center", marginBottom: 10 },
  linkText:    { color: Colors.textMuted, fontSize: Font.sm },
  switchRole:  { flexDirection: "row", justifyContent: "center", flexWrap: "wrap", paddingVertical: 12 },
  switchText:  { color: Colors.textDim, fontSize: Font.xs },
});
