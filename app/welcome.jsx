
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  Easing,
  Dimensions,
} from "react-native";
import { useEffect, useRef } from "react";
import { useRouter } from "expo-router";
import { COLORS } from "../_constants/colors";

const { width, height } = Dimensions.get("window");

const Feature = ({ emoji, label, delay, animVal }) => (
  <Animated.View
    style={[
      styles.featureChip,
      {
        opacity: animVal,
        transform: [
          {
            translateY: animVal.interpolate({
              inputRange: [0, 1],
              outputRange: [12, 0],
            }),
          },
        ],
      },
    ]}
  >
    <Text style={styles.featureEmoji}>{emoji}</Text>
    <Text style={styles.featureLabel}>{label}</Text>
  </Animated.View>
);

export default function Welcome() {
  const router = useRouter();

  const heroOpacity = useRef(new Animated.Value(0)).current;
  const heroY = useRef(new Animated.Value(30)).current;
  const chipOpacity = useRef(new Animated.Value(0)).current;
  const btnsOpacity = useRef(new Animated.Value(0)).current;
  const btnsY = useRef(new Animated.Value(24)).current;
  const bowlFloat = useRef(new Animated.Value(0)).current;
  const stemRotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Hero text
    Animated.parallel([
      Animated.timing(heroOpacity, { toValue: 1, duration: 600, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(heroY, { toValue: 0, duration: 600, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();

    // Chips
    Animated.sequence([
      Animated.delay(300),
      Animated.timing(chipOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();

    // Buttons
    Animated.sequence([
      Animated.delay(500),
      Animated.parallel([
        Animated.timing(btnsOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(btnsY, { toValue: 0, duration: 500, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ]),
    ]).start();

    // Floating bowl
    Animated.loop(
      Animated.sequence([
        Animated.timing(bowlFloat, { toValue: -10, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(bowlFloat, { toValue: 0, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(stemRotate, { toValue: 1, duration: 2200, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(stemRotate, { toValue: -1, duration: 2200, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const stemRotateDeg = stemRotate.interpolate({
    inputRange: [-1, 1],
    outputRange: ["-6deg", "6deg"],
  });

  return (
    <View style={styles.container}>
      {/* Decorative blobs */}
      <View style={styles.blob1} />
      <View style={styles.blob2} />
      <View style={styles.blob3} />

      {/* Top Section */}
      <View style={styles.top}>
        {/* Illustration */}
        <Animated.View style={[styles.illustrationWrap, { transform: [{ translateY: bowlFloat }] }]}>
          <View style={styles.plateOuter}>
            <View style={styles.plateInner}>
              <Animated.Text style={[styles.illustrationEmoji, { transform: [{ rotate: stemRotateDeg }] }]}>
                🥗
              </Animated.Text>
            </View>
          </View>
          {/* Steam wisps */}
          <View style={styles.steamRow}>
            {["〰", "〰", "〰"].map((s, i) => (
              <Text key={i} style={[styles.steam, { opacity: 0.3 + i * 0.15 }]}>{s}</Text>
            ))}
          </View>
        </Animated.View>

        {/* Hero Text */}
        <Animated.View style={{ opacity: heroOpacity, transform: [{ translateY: heroY }] }}>
          <Text style={styles.headline}>Food shouldn't{"\n"}go to waste.</Text>
          <Text style={styles.subheadline}>
            Connect donors with people in need — instantly, nearby, always.
          </Text>
        </Animated.View>

        {/* Feature chips */}
        <Animated.View style={[styles.chipsRow, { opacity: chipOpacity }]}>
          {[
            { emoji: "🤝", label: "Connect" },
            { emoji: "📍", label: "Locate" },
            { emoji: "❤️", label: "Share" },
          ].map((f) => (
            <View key={f.label} style={styles.featureChip}>
              <Text style={styles.featureEmoji}>{f.emoji}</Text>
              <Text style={styles.featureLabel}>{f.label}</Text>
            </View>
          ))}
        </Animated.View>
      </View>

      {/* Bottom Buttons */}
      <Animated.View style={[styles.bottom, { opacity: btnsOpacity, transform: [{ translateY: btnsY }] }]}>
        <TouchableOpacity
          style={styles.loginBtn}
          activeOpacity={0.85}
          onPress={() => router.push("/login")}
        >
          <Text style={styles.loginBtnText}>Sign In</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.signupBtn}
          activeOpacity={0.85}
          onPress={() => router.push("/signup")}
        >
          <Text style={styles.signupBtnText}>Create Account</Text>
        </TouchableOpacity>

        <Text style={styles.termsText}>
          By continuing you agree to our{" "}
          <Text style={styles.termsLink}>Terms & Privacy Policy</Text>
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
    justifyContent: "space-between",
  },
  blob1: {
    position: "absolute",
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: COLORS.primary,
    opacity: 0.07,
    top: -80,
    right: -80,
  },
  blob2: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: COLORS.success,
    opacity: 0.06,
    top: height * 0.2,
    left: -60,
  },
  blob3: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: COLORS.warning,
    opacity: 0.08,
    bottom: 160,
    right: -50,
  },
  top: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 28,
    paddingTop: 60,
  },
  illustrationWrap: {
    alignItems: "center",
    marginBottom: 32,
  },
  plateOuter: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: COLORS.peach,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 10,
  },
  plateInner: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  illustrationEmoji: {
    fontSize: 52,
  },
  steamRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 6,
    transform: [{ rotate: "90deg" }],
  },
  steam: {
    fontSize: 16,
    color: COLORS.primaryLight,
  },
  headline: {
    fontSize: 38,
    fontWeight: "800",
    color: COLORS.textDark,
    textAlign: "center",
    lineHeight: 44,
    letterSpacing: -0.8,
    marginBottom: 14,
  },
  subheadline: {
    fontSize: 15,
    color: COLORS.grayText,
    textAlign: "center",
    lineHeight: 23,
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  chipsRow: {
    flexDirection: "row",
    gap: 10,
  },
  featureChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: COLORS.peach,
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 9999,
    borderWidth: 1.5,
    borderColor: COLORS.peachDark,
  },
  featureEmoji: {
    fontSize: 15,
  },
  featureLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.primaryDark,
  },
  bottom: {
    paddingHorizontal: 28,
    paddingBottom: 44,
    gap: 12,
  },
  loginBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 18,
    borderRadius: 18,
    alignItems: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.32,
    shadowRadius: 18,
    elevation: 8,
  },
  loginBtnText: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  signupBtn: {
    backgroundColor: COLORS.white,
    paddingVertical: 18,
    borderRadius: 18,
    alignItems: "center",
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  signupBtnText: {
    color: COLORS.primary,
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  termsText: {
    textAlign: "center",
    fontSize: 12,
    color: COLORS.grayText,
    marginTop: 4,
  },
  termsLink: {
    color: COLORS.primary,
    fontWeight: "600",
  },
});