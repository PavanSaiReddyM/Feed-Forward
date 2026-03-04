import {
  StyleSheet, Text, View, TextInput, TouchableOpacity,
  ScrollView, KeyboardAvoidingView, Platform, Animated, Dimensions,
} from "react-native";
import { useState, useRef } from "react";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../_constants/colors";

const { height } = Dimensions.get("window");

const ROLES = [
  { key: "Restaurant", emoji: "🍽️", label: "Restaurant", desc: "Share surplus meals" },
  { key: "Hotel", emoji: "🏨", label: "Hotel / Catering", desc: "Donate event food" },
  { key: "NGO", emoji: "🤝", label: "NGO / Charity", desc: "Receive & distribute" },
  { key: "Volunteer", emoji: "🚴", label: "Volunteer", desc: "Help with pickup" },
];

// ─── Step header bar ───────────────────────────────────────────────────────────
function StepBar({ step }) {
  return (
    <View style={sb.wrap}>
      {[0, 1, 2].map((i) => (
        <View key={i} style={sb.item}>
          <View style={[sb.circle, i < step && sb.done, i === step && sb.active]}>
            {i < step
              ? <MaterialCommunityIcons name="check" size={12} color="#fff" />
              : <Text style={[sb.num, i === step && sb.numActive]}>{i + 1}</Text>
            }
          </View>
          {i < 2 && <View style={[sb.line, i < step && sb.lineDone]} />}
        </View>
      ))}
    </View>
  );
}
const sb = StyleSheet.create({
  wrap: { flexDirection: "row", alignItems: "center", paddingHorizontal: 4 },
  item: { flexDirection: "row", alignItems: "center", flex: 1 },
  circle: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: "#EBEBF0",
    justifyContent: "center", alignItems: "center",
    zIndex: 1,
  },
  active: { backgroundColor: COLORS.primary, shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  done: { backgroundColor: COLORS.success },
  num: { fontSize: 12, fontWeight: "700", color: "#AAA" },
  numActive: { color: "#fff" },
  line: { flex: 1, height: 2, backgroundColor: "#EBEBF0", marginHorizontal: 4 },
  lineDone: { backgroundColor: COLORS.success },
});

// ─── Input field ──────────────────────────────────────────────────────────────
function Field({ label, icon, value, onChangeText, placeholder,
  secure, keyboardType, right, valid }) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={fld.group}>
      <Text style={[fld.label, focused && { color: COLORS.primary }]}>{label}</Text>
      <View style={[
        fld.box,
        focused && fld.boxFocused,
        valid && fld.boxValid,
      ]}>
        <MaterialCommunityIcons
          name={icon}
          size={18}
          color={valid ? COLORS.success : focused ? COLORS.primary : COLORS.grayText}
        />
        <TextInput
          style={fld.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.placeholder}
          secureTextEntry={secure}
          keyboardType={keyboardType}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          autoCapitalize="none"
        />
        {right}
        {valid && !right && (
          <MaterialCommunityIcons name="check-circle" size={18} color={COLORS.success} />
        )}
      </View>
    </View>
  );
}
const fld = StyleSheet.create({
  group: { marginBottom: 16 },
  label: { fontSize: 12, fontWeight: "700", color: COLORS.grayText, marginBottom: 7, letterSpacing: 0.3, textTransform: "uppercase" },
  box: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#F7F7FA",
    borderRadius: 14, paddingHorizontal: 14, paddingVertical: 14,
    gap: 10, borderWidth: 1.5, borderColor: "transparent",
  },
  boxFocused: { borderColor: COLORS.primary, backgroundColor: COLORS.primaryGlow },
  boxValid: { borderColor: COLORS.success + "60", backgroundColor: "rgba(45,106,79,0.05)" },
  input: { flex: 1, fontSize: 15, color: COLORS.textDark },
});

// ─── Password strength bar ─────────────────────────────────────────────────────
function StrengthBar({ password }) {
  if (!password) return null;
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  const colors = ["", COLORS.error, COLORS.warning, "#F4A261", COLORS.success];
  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  return (
    <View style={str.wrap}>
      <View style={str.bars}>
        {[1, 2, 3, 4].map(i => (
          <View key={i} style={[str.bar, { backgroundColor: score >= i ? colors[score] : "#E5E5EA" }]} />
        ))}
      </View>
      <Text style={[str.label, { color: colors[score] }]}>{labels[score]}</Text>
    </View>
  );
}
const str = StyleSheet.create({
  wrap: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 16, marginTop: -4 },
  bars: { flex: 1, flexDirection: "row", gap: 5 },
  bar: { flex: 1, height: 4, borderRadius: 2 },
  label: { fontSize: 11, fontWeight: "700", width: 42, textAlign: "right" },
});

// ─── Main Signup ──────────────────────────────────────────────────────────────
export default function Signup() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showCpw, setShowCpw] = useState(false);

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const TITLES = ["Your Details", "Your Role", "Set Password"];
  const SUBTITLES = ["Tell us about yourself", "How will you use Food Saver?", "Secure your account"];

  const canGoNext = [
    name.length > 1 && email.includes("@") && phone.length >= 8,
    !!role,
    password.length >= 6 && password === confirmPw,
  ][step];

  const transition = (direction, cb) => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 0, duration: 140, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: direction * -24, duration: 140, useNativeDriver: true }),
    ]).start(() => {
      cb();
      slideAnim.setValue(direction * 24);
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 240, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 240, useNativeDriver: true }),
      ]).start();
    });
  };

  const goNext = () => transition(1, () => setStep(s => s + 1));
  const goBack = () => transition(-1, () => setStep(s => s - 1));

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* ── TOP NAV ── */}
      <View style={styles.nav}>
        <TouchableOpacity
          style={styles.navBack}
          onPress={step === 0 ? () => router.back() : goBack}
        >
          <MaterialCommunityIcons name="arrow-left" size={22} color={COLORS.textDark} />
        </TouchableOpacity>
        <Text style={styles.navStep}>{step + 1} / 3</Text>
        <TouchableOpacity onPress={() => router.push("/login")}>
          <Text style={styles.navSkip}>Sign in</Text>
        </TouchableOpacity>
      </View>

      {/* ── PROGRESS BAR (full width animated) ── */}
      <View style={styles.progressTrack}>
        <Animated.View
          style={[styles.progressFill, { width: `${((step + 1) / 3) * 100}%` }]}
        />
      </View>

      {/* ── HEADING ── */}
      <View style={styles.heading}>
        <StepBar step={step} />
        <Text style={styles.headTitle}>{TITLES[step]}</Text>
        <Text style={styles.headSub}>{SUBTITLES[step]}</Text>
      </View>

      {/* ── FORM CONTENT ── */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>

          {/* STEP 0 */}
          {step === 0 && (
            <>
              <Field label="Full Name" icon="account-outline"
                value={name} onChangeText={setName}
                placeholder="John Doe"
                valid={name.length > 1} />
              <Field label="Email Address" icon="email-outline"
                value={email} onChangeText={setEmail}
                placeholder="you@example.com" keyboardType="email-address"
                valid={email.includes("@") && email.includes(".")} />
              <Field label="Phone Number" icon="phone-outline"
                value={phone} onChangeText={setPhone}
                placeholder="+91 98765 43210" keyboardType="phone-pad"
                valid={phone.length >= 8} />
            </>
          )}

          {/* STEP 1 – Role */}
          {step === 1 && (
            <View style={styles.rolesGrid}>
              {ROLES.map((r) => {
                const active = role === r.key;
                return (
                  <TouchableOpacity
                    key={r.key}
                    style={[styles.roleCard, active && styles.roleCardActive]}
                    onPress={() => setRole(r.key)}
                    activeOpacity={0.8}
                  >
                    <View style={[styles.roleEmojiBg, active && styles.roleEmojiBgActive]}>
                      <Text style={styles.roleEmoji}>{r.emoji}</Text>
                    </View>
                    <View style={styles.roleText}>
                      <Text style={[styles.roleLabel, active && styles.roleLabelActive]}>{r.label}</Text>
                      <Text style={styles.roleDesc}>{r.desc}</Text>
                    </View>
                    <View style={[styles.roleRadio, active && styles.roleRadioActive]}>
                      {active && <View style={styles.roleRadioDot} />}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {/* STEP 2 – Password */}
          {step === 2 && (
            <>
              <Field label="Password" icon="lock-outline"
                value={password} onChangeText={setPassword}
                placeholder="Min. 6 characters" secure={!showPw}
                right={
                  <TouchableOpacity onPress={() => setShowPw(v => !v)} style={{ padding: 2 }}>
                    <MaterialCommunityIcons name={showPw ? "eye-outline" : "eye-off-outline"} size={18} color={COLORS.grayText} />
                  </TouchableOpacity>
                }
              />
              <StrengthBar password={password} />

              <Field label="Confirm Password" icon="lock-check-outline"
                value={confirmPw} onChangeText={setConfirmPw}
                placeholder="Repeat password" secure={!showCpw}
                valid={confirmPw.length > 0 && confirmPw === password}
                right={
                  <TouchableOpacity onPress={() => setShowCpw(v => !v)} style={{ padding: 2 }}>
                    <MaterialCommunityIcons name={showCpw ? "eye-outline" : "eye-off-outline"} size={18} color={COLORS.grayText} />
                  </TouchableOpacity>
                }
              />

              {/* Summary */}
              <View style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>Account Preview</Text>
                {[
                  { icon: "account", val: name || "—" },
                  { icon: "email", val: email || "—" },
                  { icon: "phone", val: phone || "—" },
                  { icon: "account-group", val: ROLES.find(r => r.key === role)?.label || "—" },
                ].map((row, i) => (
                  <View key={i} style={styles.summaryRow}>
                    <MaterialCommunityIcons name={row.icon} size={15} color={COLORS.grayText} />
                    <Text style={styles.summaryVal}>{row.val}</Text>
                  </View>
                ))}
              </View>
            </>
          )}
        </Animated.View>
      </ScrollView>

      {/* ── BOTTOM CTA ── */}
      <View style={styles.bottom}>
        <TouchableOpacity
          style={[styles.nextBtn, !canGoNext && styles.nextBtnOff]}
          onPress={step < 2 ? goNext : () => router.replace("/login")}
          disabled={!canGoNext}
          activeOpacity={0.86}
        >
          <Text style={styles.nextBtnText}>
            {step === 2 ? "Create Account" : "Continue"}
          </Text>
          <MaterialCommunityIcons
            name={step === 2 ? "check" : "arrow-right"}
            size={20} color="#fff"
          />
        </TouchableOpacity>

        {step === 0 && (
          <View style={styles.loginRow}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/login")}>
              <Text style={styles.loginLink}>Sign in</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#fff" },

  // Nav
  nav: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 56 : 44,
    paddingBottom: 12,
  },
  navBack: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: "#F5F5F8",
    justifyContent: "center", alignItems: "center",
  },
  navStep: { fontSize: 13, fontWeight: "700", color: COLORS.grayText },
  navSkip: { fontSize: 14, fontWeight: "700", color: COLORS.primary },

  // Progress
  progressTrack: { height: 3, backgroundColor: "#EBEBF0", marginHorizontal: 20, borderRadius: 2, marginBottom: 24, overflow: "hidden" },
  progressFill: { height: "100%", backgroundColor: COLORS.primary, borderRadius: 2 },

  // Heading
  heading: { paddingHorizontal: 22, marginBottom: 24, gap: 12 },
  headTitle: { fontSize: 26, fontWeight: "800", color: COLORS.textDark, letterSpacing: -0.4, marginTop: 4 },
  headSub: { fontSize: 14, color: COLORS.grayText, lineHeight: 20 },

  // Scroll
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 22, paddingBottom: 20 },

  // Roles
  rolesGrid: { gap: 12 },
  roleCard: {
    flexDirection: "row", alignItems: "center", gap: 14,
    backgroundColor: "#F7F7FA",
    borderRadius: 16, padding: 16,
    borderWidth: 1.5, borderColor: "transparent",
  },
  roleCardActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryGlow,
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 10, elevation: 3,
  },
  roleEmojiBg: {
    width: 48, height: 48, borderRadius: 14,
    backgroundColor: "#EBEBF0",
    justifyContent: "center", alignItems: "center",
  },
  roleEmojiBgActive: { backgroundColor: COLORS.primary + "22" },
  roleEmoji: { fontSize: 24 },
  roleText: { flex: 1 },
  roleLabel: { fontSize: 15, fontWeight: "700", color: COLORS.textDark, marginBottom: 2 },
  roleLabelActive: { color: COLORS.primary },
  roleDesc: { fontSize: 12, color: COLORS.grayText },
  roleRadio: {
    width: 22, height: 22, borderRadius: 11,
    borderWidth: 2, borderColor: "#D0D0D8",
    justifyContent: "center", alignItems: "center",
  },
  roleRadioActive: { borderColor: COLORS.primary },
  roleRadioDot: {
    width: 10, height: 10, borderRadius: 5,
    backgroundColor: COLORS.primary,
  },

  // Summary
  summaryCard: {
    backgroundColor: COLORS.bg, borderRadius: 16,
    padding: 18, gap: 10,
    borderWidth: 1.5, borderColor: "rgba(0,0,0,0.07)",
    marginTop: 4,
  },
  summaryTitle: {
    fontSize: 11, fontWeight: "800", color: COLORS.grayText,
    textTransform: "uppercase", letterSpacing: 1, marginBottom: 2,
  },
  summaryRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  summaryVal: { fontSize: 14, fontWeight: "600", color: COLORS.textDark },

  // Bottom CTA
  bottom: {
    paddingHorizontal: 22,
    paddingBottom: Platform.OS === "ios" ? 36 : 24,
    paddingTop: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F5",
    gap: 12,
  },
  nextBtn: {
    backgroundColor: COLORS.primary,
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 10, paddingVertical: 17, borderRadius: 16,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.26, shadowRadius: 16, elevation: 6,
  },
  nextBtnOff: { backgroundColor: "#D0D0D8", shadowOpacity: 0, elevation: 0 },
  nextBtnText: { color: "#fff", fontSize: 16, fontWeight: "800", letterSpacing: 0.2 },
  loginRow: { flexDirection: "row", justifyContent: "center" },
  loginText: { fontSize: 13, color: COLORS.grayText },
  loginLink: { fontSize: 13, fontWeight: "800", color: COLORS.primary },
});