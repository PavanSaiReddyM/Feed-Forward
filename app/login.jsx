import {
  StyleSheet, Text, View, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, Animated, Easing,
  ScrollView, Dimensions,
} from "react-native";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../_constants/colors";
import { login } from "../app/services/api";

const { height } = Dimensions.get("window");

function Input({ label, icon, value, onChangeText, placeholder,
  secureTextEntry, keyboardType, rightIcon, onRightPress }) {
  const [focused, setFocused] = useState(false);
  const lineWidth = useRef(new Animated.Value(0)).current;
  const handleFocus = () => { setFocused(true); Animated.timing(lineWidth, { toValue: 1, duration: 220, useNativeDriver: false }).start(); };
  const handleBlur = () => { setFocused(false); Animated.timing(lineWidth, { toValue: 0, duration: 220, useNativeDriver: false }).start(); };
  return (
    <View style={inp.group}>
      <Text style={[inp.label, focused && inp.labelActive]}>{label}</Text>
      <View style={[inp.box, focused && inp.boxFocused]}>
        <MaterialCommunityIcons name={icon} size={19}
          color={focused ? COLORS.primary : COLORS.grayText} />
        <TextInput style={inp.field} value={value} onChangeText={onChangeText}
          placeholder={placeholder} placeholderTextColor={COLORS.placeholder}
          secureTextEntry={secureTextEntry} keyboardType={keyboardType}
          onFocus={handleFocus} onBlur={handleBlur} autoCapitalize="none" />
        {rightIcon && (
          <TouchableOpacity onPress={onRightPress} style={{ padding: 4 }}>
            <MaterialCommunityIcons name={rightIcon} size={19} color={COLORS.grayText} />
          </TouchableOpacity>
        )}
      </View>
      <View style={inp.lineTrack}>
        <Animated.View style={[inp.lineFill, {
          width: lineWidth.interpolate({ inputRange: [0, 1], outputRange: ["0%", "100%"] }),
        }]} />
      </View>
    </View>
  );
}
const inp = StyleSheet.create({
  group: { marginBottom: 20 },
  label: { fontSize: 12, fontWeight: "700", color: COLORS.grayText, marginBottom: 8, letterSpacing: 0.4, textTransform: "uppercase" },
  labelActive: { color: COLORS.primary },
  box: { flexDirection: "row", alignItems: "center", backgroundColor: "#F8F8FA", borderRadius: 14, paddingHorizontal: 14, paddingVertical: 13, gap: 10, borderWidth: 1.5, borderColor: "transparent" },
  boxFocused: { backgroundColor: COLORS.primaryGlow, borderColor: COLORS.primary + "40" },
  field: { flex: 1, fontSize: 15, color: COLORS.textDark },
  lineTrack: { height: 2, backgroundColor: "#EBEBF0", borderRadius: 1, marginTop: 2, overflow: "hidden" },
  lineFill: { height: "100%", backgroundColor: COLORS.primary, borderRadius: 1 },
});

const ROLE_ROUTES = { donor: "/donor", receiver: "/ngo", admin: "/admin" };

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
  }, []);

  const shakeError = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 6, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  };

  // Hardcoded credentials — only developer knows these
  const DEMO_ACCOUNTS = [
    { email: "psr@gmail.com", password: "12345678", route: "/donor" },
    { email: "helpinghands@gmail.com", password: "12345678", route: "/ngo" },
    { email: "teamdeveloper@gmail.com", password: "12345678", route: "/admin" },
  ];

  const handleLogin = async () => {
    setError("");
    if (!email.trim()) return setError("Please enter your email.");
    if (!email.includes("@")) return setError("Please enter a valid email address.");
    if (!password) return setError("Please enter your password.");

    setLoading(true);

    // Check hardcoded accounts first (works offline too)
    const match = DEMO_ACCOUNTS.find(
      a => a.email === email.trim().toLowerCase() && a.password === password
    );
    if (match) {
      setLoading(false);
      router.replace(match.route);
      return;
    }

    // Otherwise hit real backend
    try {
      const data = await login(email.trim().toLowerCase(), password);
      const role = data.user?.role ?? data.role;
      const route = ROLE_ROUTES[role] ?? "/donor";
      router.replace(route);
    } catch (err) {
      setError(err.message || "Invalid email or password.");
      shakeError();
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled" bounces={false}>

        <View style={styles.hero}>
          <View style={styles.heroBlob1} />
          <View style={styles.heroBlob2} />
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <MaterialCommunityIcons name="arrow-left" size={20} color="#fff" />
          </TouchableOpacity>
          <View style={styles.logoWrap}>
            <View style={styles.logoCircle}><Text style={{ fontSize: 30 }}>🍃</Text></View>
          </View>
          <Text style={styles.heroTitle}>Welcome back!</Text>
          <Text style={styles.heroSub}>Sign in to continue your impact</Text>
        </View>

        <Animated.View style={[styles.card, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>

          <Input label="Email" icon="email-outline"
            value={email} onChangeText={(t) => { setEmail(t); setError(""); }}
            placeholder="you@example.com" keyboardType="email-address" />

          <Input label="Password" icon="lock-outline"
            value={password} onChangeText={(t) => { setPassword(t); setError(""); }}
            placeholder="Your password" secureTextEntry={!showPassword}
            rightIcon={showPassword ? "eye-outline" : "eye-off-outline"}
            onRightPress={() => setShowPassword(!showPassword)} />

          {!!error && (
            <Animated.View style={[styles.errorBanner, { transform: [{ translateX: shakeAnim }] }]}>
              <MaterialCommunityIcons name="alert-circle-outline" size={16} color="#D32F2F" />
              <Text style={styles.errorText}>{error}</Text>
            </Animated.View>
          )}

          <TouchableOpacity style={styles.forgotBtn}>
            <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.signInBtn, (loading || !email || !password) && { opacity: 0.72 }]}
            activeOpacity={0.86} onPress={handleLogin} disabled={loading}>
            {loading
              ? <Text style={styles.signInText}>Signing in…</Text>
              : <><Text style={styles.signInText}>Sign In</Text>
                <MaterialCommunityIcons name="arrow-right" size={20} color="#fff" /></>
            }
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.divLine} />
            <Text style={styles.divLabel}>or continue as</Text>
            <View style={styles.divLine} />
          </View>

          {/* <View style={styles.rolesRow}>
            {[
              { label: "Donor", emoji: "🍽️" },
              { label: "NGO", emoji: "🤝" },
              { label: "Admin", emoji: "🛡️" },
            ].map((r) => (
              <TouchableOpacity key={r.label} style={styles.roleChip}
                onPress={() => router.push(r.label === "Donor" ? "/donor" : r.label === "NGO" ? "/ngo" : "/admin")}
                activeOpacity={0.8}>
                <Text style={styles.roleEmoji}>{r.emoji}</Text>
                <Text style={styles.roleLabel}>{r.label}</Text>
                <MaterialCommunityIcons name="arrow-right" size={13} color={COLORS.grayText} />
              </TouchableOpacity>
            ))}
          </View> */}

          <View style={styles.signupRow}>
            <Text style={styles.signupText}>New to Food Saver? </Text>
            <TouchableOpacity onPress={() => router.push("/signup")}>
              <Text style={styles.signupLink}>Create account →</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.primary },
  scroll: { flexGrow: 1 },
  hero: { paddingTop: Platform.OS === "ios" ? 56 : 44, paddingHorizontal: 24, paddingBottom: 40, overflow: "hidden", alignItems: "flex-start" },
  heroBlob1: { position: "absolute", width: 240, height: 240, borderRadius: 120, backgroundColor: "rgba(255,255,255,0.1)", top: -80, right: -60 },
  heroBlob2: { position: "absolute", width: 140, height: 140, borderRadius: 70, backgroundColor: "rgba(0,0,0,0.12)", bottom: -30, left: -30 },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.15)", justifyContent: "center", alignItems: "center", marginBottom: 24 },
  logoWrap: { marginBottom: 20 },
  logoCircle: { width: 64, height: 64, borderRadius: 20, backgroundColor: "rgba(255,255,255,0.2)", justifyContent: "center", alignItems: "center", borderWidth: 1.5, borderColor: "rgba(255,255,255,0.3)" },
  heroTitle: { fontSize: 30, fontWeight: "800", color: "#fff", letterSpacing: -0.5, marginBottom: 6 },
  heroSub: { fontSize: 15, color: "rgba(255,255,255,0.72)" },
  card: { flex: 1, backgroundColor: "#fff", borderTopLeftRadius: 32, borderTopRightRadius: 32, paddingHorizontal: 24, paddingTop: 32, paddingBottom: 32, minHeight: height * 0.62 },
  errorBanner: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "#FEF2F2", borderRadius: 12, padding: 12, marginBottom: 16, borderWidth: 1, borderColor: "#FECACA" },
  errorText: { flex: 1, fontSize: 13, color: "#D32F2F", fontWeight: "600" },
  forgotBtn: { alignSelf: "flex-end", marginTop: -8, marginBottom: 24 },
  forgotText: { fontSize: 13, fontWeight: "700", color: COLORS.primary },
  signInBtn: { backgroundColor: COLORS.primary, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, paddingVertical: 17, borderRadius: 16, shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.28, shadowRadius: 16, elevation: 8, marginBottom: 28 },
  signInText: { color: "#fff", fontSize: 16, fontWeight: "800", letterSpacing: 0.2 },
  divider: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 20 },
  divLine: { flex: 1, height: 1, backgroundColor: "#EBEBF0" },
  divLabel: { fontSize: 12, fontWeight: "600", color: COLORS.grayText },
  rolesRow: { gap: 10, marginBottom: 28 },
  roleChip: { flexDirection: "row", alignItems: "center", backgroundColor: COLORS.bg, borderRadius: 14, paddingVertical: 13, paddingHorizontal: 16, gap: 12, borderWidth: 1.5, borderColor: "rgba(0,0,0,0.06)" },
  roleEmoji: { fontSize: 20 },
  roleLabel: { fontSize: 14, fontWeight: "700", color: COLORS.textDark, marginBottom: 2 },
  fillBadge: { backgroundColor: COLORS.primary + "18", paddingVertical: 5, paddingHorizontal: 10, borderRadius: 8 },
  fillBadgeText: { fontSize: 12, fontWeight: "800", color: COLORS.primary },
  signupRow: { flexDirection: "row", justifyContent: "center", alignItems: "center" },
  signupText: { fontSize: 14, color: COLORS.grayText },
  signupLink: { fontSize: 14, fontWeight: "800", color: COLORS.primary },
});