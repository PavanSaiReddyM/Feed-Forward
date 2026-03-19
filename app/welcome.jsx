import {
  StyleSheet, Text, View, TouchableOpacity,
  Animated, Easing, Dimensions, Image, Platform,
} from "react-native";
import { useEffect, useRef } from "react";
import { useRouter } from "expo-router";
import { COLORS } from "../_constants/colors";

const { width, height } = Dimensions.get("window");

// Stats shown in the trust strip
const STATS = [
  { value: "50K+", label: "Meals Shared" },
  { value: "200+", label: "NGO Partners" },
  { value: "12K+", label: "Donors" },
];

export default function Welcome() {
  const router = useRouter();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const imgScale = useRef(new Animated.Value(1.08)).current;
  const cardY = useRef(new Animated.Value(60)).current;
  const cardOpac = useRef(new Animated.Value(0)).current;
  const btn1Y = useRef(new Animated.Value(24)).current;
  const btn2Y = useRef(new Animated.Value(32)).current;
  const btnOpac = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Background image settles
    Animated.timing(imgScale, {
      toValue: 1, duration: 1200,
      easing: Easing.out(Easing.cubic), useNativeDriver: true,
    }).start();

    // Overlay fade
    Animated.timing(fadeAnim, {
      toValue: 1, duration: 700, useNativeDriver: true,
    }).start();

    // Card slides up
    Animated.sequence([
      Animated.delay(300),
      Animated.parallel([
        Animated.timing(cardY, { toValue: 0, duration: 550, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.timing(cardOpac, { toValue: 1, duration: 550, useNativeDriver: true }),
      ]),
    ]).start();

    // Buttons stagger
    Animated.sequence([
      Animated.delay(600),
      Animated.parallel([
        Animated.timing(btnOpac, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(btn1Y, { toValue: 0, duration: 400, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ]),
    ]).start();
    Animated.sequence([
      Animated.delay(750),
      Animated.timing(btn2Y, { toValue: 0, duration: 400, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>

      {/* ── HERO IMAGE (full bleed top) ── */}
      <Animated.Image
        source={{ uri: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=900&q=85" }}
        style={[styles.heroImage, { transform: [{ scale: imgScale }] }]}
        resizeMode="cover"
      />

      {/* Dark gradient overlay */}
      <View style={styles.overlay} />

      {/* Brand badge top-left */}
      <Animated.View style={[styles.brandBadge, { opacity: fadeAnim }]}>
        <Text style={styles.brandEmoji}>🍃</Text>
        <Text style={styles.brandName}>Food Saver</Text>
      </Animated.View>

      {/* ── BOTTOM SHEET CARD ── */}
      <Animated.View
        style={[styles.card, { opacity: cardOpac, transform: [{ translateY: cardY }] }]}
      >
        {/* Handle */}
        <View style={styles.handle} />

        {/* Headline */}
        <Text style={styles.headline}>Feed Someone{"\n"}Today. 🌱</Text>
        <Text style={styles.subline}>
          Connect surplus food with people who need it most — real-time, nearby, zero waste.
        </Text>

        {/* Trust stats strip */}
        <View style={styles.statsRow}>
          {STATS.map((s, i) => (
            <View key={i} style={[styles.statCell, i < STATS.length - 1 && styles.statCellBorder]}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Buttons */}
        <View style={styles.btns}>
          <Animated.View style={{ opacity: btnOpac, transform: [{ translateY: btn1Y }] }}>
            <TouchableOpacity
              style={styles.primaryBtn}
              activeOpacity={0.88}
              onPress={() => router.push("/signup")}
            >
              <Text style={styles.primaryBtnText}>Create Free Account</Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={{ opacity: btnOpac, transform: [{ translateY: btn2Y }] }}>
            <TouchableOpacity
              style={styles.secondaryBtn}
              activeOpacity={0.88}
              onPress={() => router.push("/login")}
            >
              <Text style={styles.secondaryBtnText}>I already have an account</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Terms */}
        <Text style={styles.terms}>
          By continuing you agree to our{" "}
          <Text style={styles.termsLink}>Terms</Text> &{" "}
          <Text style={styles.termsLink}>Privacy Policy</Text>
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0A0A0A" },

  heroImage: {
    position: "absolute",
    top: 0, left: 0, right: 0,
    width, height: height * 0.58,
  },
  overlay: {
    position: "absolute",
    top: 0, left: 0, right: 0,
    height: height * 0.62,
    backgroundColor: "rgba(10,10,10,0.38)",
  },

  brandBadge: {
    position: "absolute",
    top: Platform.OS === "ios" ? 56 : 44,
    left: 24,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(0,0,0,0.35)",
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  brandEmoji: { fontSize: 17 },
  brandName: {
    fontSize: 15,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 0.2,
  },

  card: {
    position: "absolute",
    bottom: 0, left: 0, right: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    paddingHorizontal: 26,
    paddingTop: 20,
    paddingBottom: Platform.OS === "ios" ? 44 : 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.14,
    shadowRadius: 28,
    elevation: 24,
  },
  handle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: "#E0E0E0",
    alignSelf: "center",
    marginBottom: 24,
  },

  headline: {
    fontSize: 34,
    fontWeight: "800",
    color: COLORS.textDark,
    letterSpacing: -0.8,
    lineHeight: 40,
    marginBottom: 10,
  },
  subline: {
    fontSize: 14,
    color: COLORS.grayText,
    lineHeight: 22,
    marginBottom: 22,
  },

  statsRow: {
    flexDirection: "row",
    backgroundColor: COLORS.bg,
    borderRadius: 18,
    marginBottom: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
  },
  statCell: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 14,
  },
  statCellBorder: {
    borderRightWidth: 1,
    borderRightColor: "rgba(0,0,0,0.07)",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.primary,
    letterSpacing: -0.3,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: COLORS.grayText,
    textAlign: "center",
  },

  btns: { gap: 11, marginBottom: 16 },

  primaryBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 17,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.32,
    shadowRadius: 16,
    elevation: 8,
  },
  primaryBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.2,
  },

  secondaryBtn: {
    backgroundColor: "transparent",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "rgba(0,0,0,0.12)",
  },
  secondaryBtnText: {
    color: COLORS.textDark,
    fontSize: 15,
    fontWeight: "700",
  },

  terms: {
    textAlign: "center",
    fontSize: 11,
    color: COLORS.grayText,
    lineHeight: 18,
  },
  termsLink: {
    color: COLORS.primary,
    fontWeight: "700",
  },
});