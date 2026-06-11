import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Font, Radius } from "../../shared/theme";

export default function TenantLoginScreen() {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  const handleLogin = () => {
    if (!email || !password) { setError("Vui lòng nhập đầy đủ thông tin"); return; }
    setLoading(true);
    setError("");
    setTimeout(() => { setLoading(false); router.replace("/(tabs)"); }, 1200);
  };

  return (
    <SafeAreaView style={s.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }} keyboardVerticalOffset={0}>
        <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

          {/* Back */}
          <Pressable onPress={() => router.back()} style={s.backBtn} hitSlop={12}>
            <Ionicons name="chevron-back" size={20} color={Colors.textMuted} />
            <Text style={s.backText}>Quay lại</Text>
          </Pressable>

          {/* Header */}
          <View style={s.header}>
            <View style={s.iconBox}>
              <Ionicons name="home" size={28} color={Colors.emerald} />
            </View>
            <Text style={s.title}>Đăng nhập</Text>
            <Text style={s.sub}>Cư dân / Người thuê nhà</Text>
          </View>

          {/* Social login */}
          <View style={s.socialRow}>
            {[
              { label: "Google",  icon: "logo-google"  as const },
              { label: "Apple",   icon: "logo-apple"   as const },
            ].map(({ label, icon }) => (
              <Pressable key={label} style={s.socialBtn}>
                <Ionicons name={icon} size={17} color={Colors.text} style={{ marginRight: 8 }} />
                <Text style={s.socialText}>{label}</Text>
              </Pressable>
            ))}
          </View>

          <View style={s.orRow}>
            <View style={s.orLine} />
            <Text style={s.orText}>hoặc</Text>
            <View style={s.orLine} />
          </View>

          {/* Form */}
          <View style={s.form}>
            <Text style={s.label}>EMAIL</Text>
            <TextInput
              style={[s.input, error && !email && s.inputError]}
              placeholder="tenant@email.com"
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
                style={[s.pwInput, error && !password && s.inputError]}
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

            {error !== "" && (
              <View style={s.errorRow}>
                <Ionicons name="alert-circle-outline" size={14} color="#ef4444" />
                <Text style={s.errorText}>{error}</Text>
              </View>
            )}

            <Pressable style={s.forgotBtn}>
              <Text style={s.forgotText}>Quên mật khẩu?</Text>
            </Pressable>
          </View>

          {/* Submit */}
          <Pressable style={[s.submitBtn, loading && { opacity: 0.7 }]} onPress={handleLogin} disabled={loading}>
            <Text style={s.submitText}>{loading ? "Đang đăng nhập..." : "Đăng nhập"}</Text>
          </Pressable>

          {/* Register link */}
          <View style={s.linkRow}>
            <Text style={s.linkText}>Chưa có tài khoản? </Text>
            <Pressable onPress={() => router.push("/(auth)/tenant-register")}>
              <Text style={[s.linkText, { color: Colors.cyan, fontWeight: "700" }]}>Đăng ký miễn phí</Text>
            </Pressable>
          </View>

          {/* Role switch */}
          <Pressable onPress={() => router.replace("/(auth)/landlord-login")} style={s.switchRole}>
            <Text style={s.switchText}>Bạn là chủ nhà? </Text>
            <Text style={[s.switchText, { color: Colors.violet }]}>Đăng nhập với vai trò Chủ nhà →</Text>
          </Pressable>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:       { flex: 1, backgroundColor: Colors.bg },
  scroll:     { paddingHorizontal: 24, paddingBottom: 48 },
  backBtn:    { flexDirection: "row", alignItems: "center", paddingVertical: 16, gap: 4 },
  backText:   { color: Colors.textMuted, fontSize: Font.sm },
  header:     { alignItems: "center", paddingVertical: 24 },
  iconBox:    { width: 72, height: 72, borderRadius: 24, backgroundColor: "rgba(52,211,153,0.08)", borderWidth: 1.5, borderColor: "rgba(52,211,153,0.28)", alignItems: "center", justifyContent: "center", marginBottom: 16 },
  title:      { color: Colors.white, fontWeight: "800", fontSize: Font.xxl, letterSpacing: -0.5 },
  sub:        { color: Colors.textMuted, fontSize: Font.sm, marginTop: 6 },
  socialRow:  { flexDirection: "row", gap: 12, marginBottom: 20 },
  socialBtn:  { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: Colors.bgCard, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.border, paddingVertical: 13 },
  socialText: { color: Colors.text, fontWeight: "600", fontSize: Font.sm },
  orRow:      { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 20 },
  orLine:     { flex: 1, height: 0.5, backgroundColor: Colors.border },
  orText:     { color: Colors.textMuted, fontSize: Font.xs },
  form:       { gap: 6, marginBottom: 20 },
  label:      { color: Colors.textMuted, fontSize: 10, fontWeight: "700", letterSpacing: 1 },
  input:      { backgroundColor: Colors.bgCard, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.border, paddingHorizontal: 16, paddingVertical: 14, color: Colors.text, fontSize: Font.base },
  inputError: { borderColor: "#ef4444" },
  pwWrap:     { flexDirection: "row", alignItems: "center", backgroundColor: Colors.bgCard, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.border },
  pwInput:    { flex: 1, paddingHorizontal: 16, paddingVertical: 14, color: Colors.text, fontSize: Font.base },
  eyeBtn:     { paddingHorizontal: 14 },
  errorRow:   { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4 },
  errorText:  { color: "#ef4444", fontSize: Font.xs },
  forgotBtn:  { alignSelf: "flex-end", paddingVertical: 8 },
  forgotText: { color: Colors.cyan, fontSize: Font.xs, fontWeight: "600" },
  submitBtn:  { backgroundColor: Colors.emerald, paddingVertical: 17, borderRadius: Radius.full, alignItems: "center", marginBottom: 16 },
  submitText: { color: Colors.bg, fontWeight: "800", fontSize: Font.base },
  linkRow:    { flexDirection: "row", justifyContent: "center", marginBottom: 10 },
  linkText:   { color: Colors.textMuted, fontSize: Font.sm },
  switchRole: { flexDirection: "row", justifyContent: "center", flexWrap: "wrap", paddingVertical: 12 },
  switchText: { color: Colors.textDim, fontSize: Font.xs },
});
