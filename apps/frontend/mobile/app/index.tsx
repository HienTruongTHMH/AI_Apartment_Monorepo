import { useEffect, useRef, useState } from "react";
import { View, Text, Pressable, Dimensions, Image, StyleSheet, Animated } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, Font, Radius } from "../shared/theme";

const { width, height } = Dimensions.get("window");

const SLIDES = [
  {
    title: "Tìm phòng thuê\nbằng AI",
    sub: "Super Broker AI tư vấn 24/7,\nphân tích hàng ngàn tin đăng trong giây lát",
    gradient: Colors.cyan,
    emoji: "🤖",
  },
  {
    title: "Xác minh tin đăng\ntự động",
    sub: "Listing Verifier AI kiểm tra ảnh,\ngiá cả và mô tả — loại bỏ tin giả 100%",
    gradient: Colors.violet,
    emoji: "✅",
  },
  {
    title: "Hợp đồng & thanh toán\nthông minh",
    sub: "Ký hợp đồng điện tử, thanh toán\nVietQR — nhanh, an toàn, minh bạch",
    gradient: Colors.emerald,
    emoji: "📱",
  },
];

export default function OnboardingScreen() {
  const [step, setStep] = useState(0);
  const fadeAnim  = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const goTo = (next: number) => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: -30, duration: 200, useNativeDriver: true }),
    ]).start(() => {
      setStep(next);
      slideAnim.setValue(30);
      Animated.parallel([
        Animated.timing(fadeAnim,  { toValue: 1, duration: 280, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 280, useNativeDriver: true }),
      ]).start();
    });
  };

  const handleNext = () => {
    if (step < SLIDES.length - 1) goTo(step + 1);
    else router.replace("/(tabs)");
  };

  const slide = SLIDES[step];

  return (
    <SafeAreaView style={s.safe}>
      {/* Logo */}
      <View style={s.logoRow}>
        <View style={[s.logoIcon, { shadowColor: Colors.cyan }]}>
          <Text style={s.logoText}>N</Text>
        </View>
        <Text style={s.logoLabel}>NestaViet<Text style={{ color: Colors.cyan }}>AI</Text></Text>
      </View>

      {/* Slide content */}
      <View style={s.center}>
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          <View style={[s.emojiBox, { borderColor: slide.gradient + "44", shadowColor: slide.gradient }]}>
            <Text style={s.emoji}>{slide.emoji}</Text>
          </View>
          <Text style={s.title}>{slide.title}</Text>
          <Text style={s.sub}>{slide.sub}</Text>
        </Animated.View>
      </View>

      {/* Dots */}
      <View style={s.dots}>
        {SLIDES.map((_, i) => (
          <Pressable key={i} onPress={() => goTo(i)}>
            <View style={[s.dot, i === step && { width: 24, backgroundColor: slide.gradient }]} />
          </Pressable>
        ))}
      </View>

      {/* CTA */}
      <View style={s.actions}>
        <Pressable
          style={[s.btnPrimary, { shadowColor: slide.gradient }]}
          onPress={handleNext}
        >
          <Text style={s.btnPrimaryText}>
            {step < SLIDES.length - 1 ? "Tiếp theo →" : "Bắt đầu ngay"}
          </Text>
        </Pressable>
        {step < SLIDES.length - 1 && (
          <Pressable onPress={() => router.replace("/(tabs)")} style={s.btnSkip}>
            <Text style={s.btnSkipText}>Bỏ qua</Text>
          </Pressable>
        )}
      </View>

      {/* Bottom auth links */}
      <View style={s.authRow}>
        <Text style={s.authText}>Đã có tài khoản? </Text>
        <Pressable onPress={() => router.push("/(auth)/tenant-login")}>
          <Text style={[s.authText, { color: Colors.cyan }]}>Đăng nhập</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:         { flex: 1, backgroundColor: Colors.bg, paddingHorizontal: 28 },
  logoRow:      { flexDirection: "row", alignItems: "center", gap: 10, paddingTop: 16 },
  logoIcon:     { width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.cyan, alignItems: "center", justifyContent: "center", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 12, elevation: 6 },
  logoText:     { color: "#fff", fontWeight: "800", fontSize: 18 },
  logoLabel:    { fontSize: Font.md, fontWeight: "800", color: Colors.white, letterSpacing: -0.5 },
  center:       { flex: 1, alignItems: "center", justifyContent: "center" },
  emojiBox:     { width: 100, height: 100, borderRadius: 32, borderWidth: 1.5, alignItems: "center", justifyContent: "center", alignSelf: "center", marginBottom: 36, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.4, shadowRadius: 24, elevation: 8 },
  emoji:        { fontSize: 44 },
  title:        { fontSize: Font.xxl, fontWeight: "800", color: Colors.white, textAlign: "center", letterSpacing: -0.8, marginBottom: 16, lineHeight: 40 },
  sub:          { fontSize: Font.base, color: Colors.textMuted, textAlign: "center", lineHeight: 24 },
  dots:         { flexDirection: "row", gap: 6, justifyContent: "center", marginBottom: 32 },
  dot:          { width: 6, height: 6, borderRadius: 3, backgroundColor: "rgba(255,255,255,0.18)" },
  actions:      { gap: 12, marginBottom: 12 },
  btnPrimary:   { backgroundColor: Colors.cyan, paddingVertical: 17, borderRadius: Radius.full, alignItems: "center", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.35, shadowRadius: 20, elevation: 8 },
  btnPrimaryText: { color: Colors.bg, fontWeight: "800", fontSize: Font.base },
  btnSkip:      { alignItems: "center", paddingVertical: 10 },
  btnSkipText:  { color: Colors.textMuted, fontSize: Font.sm },
  authRow:      { flexDirection: "row", justifyContent: "center", paddingBottom: 8 },
  authText:     { color: Colors.textMuted, fontSize: Font.sm },
});
