
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Easing,
  ScrollView,
} from "react-native";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../_constants/colors";

function FilledInput({ label, value, onChangeText, placeholder, secureTextEntry, right, keyboardType }) {
  const [focused, setFocused] = useState(false);
  const borderAnim = useRef(new Animated.Value(0)).current;

  const onFocus = () => {
    setFocused(true);
    Animated.timing(borderAnim, { toValue: 1, duration: 200, useNativeDriver: false }).start();
  };
  const onBlur = () => {
    setFocused(false);
    Animated.timing(borderAnim, { toValue: 0, duration: 200, useNativeDriver: false }).start();
  };

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [COLORS.border, COLORS.primary],
  });
  const bgColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#F5F5F8", COLORS.primaryGlow],
  });

  return (
    <View style={styles.inputGroup}>
      <Text style={[styles.label, focused && styles.labelFocused]}>{label}</Text>
      <Animated.View
        style={[
          styles.inputWrap,
          { borderColor, backgroundColor: bgColor },
        ]}
      >
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.placeholder}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          onFocus={onFocus}
          onBlur={onBlur}
          autoCapitalize="none"
        />
        {right}
      </Animated.View>
    </View>
  );
}

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const fadeIn = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeIn, { toValue: 1, duration: 500, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(slideUp, { toValue: 0, duration: 500, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
  }, []);

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push("/ngo");
    }, 1200);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerBlobTop} />
        <View style={styles.headerBlobBottom} />
        <Animated.View style={{ opacity: fadeIn }}>
          <View style={styles.brandRow}>
            <View style={styles.brandIcon}>
              <Text style={{ fontSize: 22 }}>🍃</Text>
            </View>
            <Text style={styles.brandName}>Food Saver</Text>
          </View>
          <Text style={styles.headerTitle}>Welcome back</Text>
          <Text style={styles.headerSub}>Sign in to continue making an impact</Text>
        </Animated.View>
      </View>

      {/* Card */}
      <Animated.View
        style={[styles.card, { opacity: fadeIn, transform: [{ translateY: slideUp }] }]}
      >
        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <FilledInput
            label="Email address"
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            keyboardType="email-address"
          />

          <FilledInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Your password"
            secureTextEntry={!showPassword}
            right={
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ padding: 4 }}>
                <MaterialCommunityIcons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={21}
                  color={COLORS.grayText}
                />
              </TouchableOpacity>
            }
          />

          <TouchableOpacity style={styles.forgotRow}>
            <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableOpacity>

          {/* Sign In */}
          <TouchableOpacity
            style={[styles.signInBtn, loading && styles.signInBtnLoading]}
            activeOpacity={0.85}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <View style={styles.loadingRow}>
                <MaterialCommunityIcons name="loading" size={20} color={COLORS.white} style={styles.spinner} />
                <Text style={styles.signInText}>Signing in…</Text>
              </View>
            ) : (
              <Text style={styles.signInText}>Sign In</Text>
            )}
          </TouchableOpacity>

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerLabel}>or continue as</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Role quick links */}
          <View style={styles.roleRow}>
            {[
              { label: "Donor", icon: "🍽️", route: "/donor" },
              { label: "NGO", icon: "🤝", route: "/ngo" },
              { label: "Admin", icon: "🛡️", route: "/admin" },
            ].map((r) => (
              <TouchableOpacity
                key={r.label}
                style={styles.roleBtn}
                onPress={() => router.push(r.route)}
              >
                <Text style={styles.roleEmoji}>{r.icon}</Text>
                <Text style={styles.roleLabel}>{r.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.signupText}>
            Don't have an account?{" "}
            <Text style={styles.signupLink} onPress={() => router.push("/signup")}>
              Sign up
            </Text>
          </Text>
        </ScrollView>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  header: {
    paddingTop: 64,
    paddingHorizontal: 28,
    paddingBottom: 36,
    overflow: "hidden",
  },
  headerBlobTop: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: COLORS.primaryLight,
    opacity: 0.25,
    top: -80,
    right: -60,
  },
  headerBlobBottom: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: COLORS.primaryDark,
    opacity: 0.3,
    bottom: -40,
    left: -40,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 24,
  },
  brandIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  brandName: {
    fontSize: 16,
    fontWeight: "700",
    color: "rgba(255,255,255,0.9)",
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: COLORS.white,
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  headerSub: {
    fontSize: 15,
    color: "rgba(255,255,255,0.75)",
  },
  card: {
    flex: 1,
    backgroundColor: COLORS.bg,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    padding: 28,
    paddingTop: 32,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.grayText,
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  labelFocused: {
    color: COLORS.primary,
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1.5,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: COLORS.textDark,
  },
  forgotRow: {
    alignItems: "flex-end",
    marginBottom: 28,
    marginTop: -6,
  },
  forgotText: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.primary,
  },
  signInBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 18,
    borderRadius: 18,
    alignItems: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 18,
    elevation: 8,
    marginBottom: 24,
  },
  signInBtnLoading: {
    opacity: 0.8,
  },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  spinner: {
    opacity: 0.9,
  },
  signInText: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerLabel: {
    fontSize: 12,
    color: COLORS.grayText,
    fontWeight: "600",
  },
  roleRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 28,
  },
  roleBtn: {
    flex: 1,
    alignItems: "center",
    backgroundColor: COLORS.white,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    gap: 4,
  },
  roleEmoji: {
    fontSize: 22,
  },
  roleLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textMid,
  },
  signupText: {
    textAlign: "center",
    fontSize: 14,
    color: COLORS.grayText,
    paddingBottom: 20,
  },
  signupLink: {
    color: COLORS.primary,
    fontWeight: "800",
  },
});