

import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from "react-native";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../_constants/colors";

const ROLES = [
  { key: "Restaurant", emoji: "🍽️", label: "Restaurant" },
  { key: "Hotel", emoji: "🏨", label: "Hotel" },
  { key: "Event", emoji: "🎪", label: "Event Org." },
  { key: "Household", emoji: "🏠", label: "Household" },
  { key: "NGO", emoji: "🤝", label: "NGO" },
  { key: "Volunteer", emoji: "🚴", label: "Volunteer" },
];

function StepProgress({ current, total }) {
  return (
    <View style={styles.progressWrap}>
      {Array.from({ length: total }).map((_, i) => {
        const isActive = i === current;
        const isDone = i < current;
        return (
          <View key={i} style={styles.stepItem}>
            <View
              style={[
                styles.stepCircle,
                isDone && styles.stepDone,
                isActive && styles.stepActive,
              ]}
            >
              {isDone ? (
                <MaterialCommunityIcons name="check" size={13} color={COLORS.white} />
              ) : (
                <Text style={[styles.stepNum, isActive && styles.stepNumActive]}>{i + 1}</Text>
              )}
            </View>
            {i < total - 1 && (
              <View style={[styles.stepLine, (isDone || isActive) && styles.stepLineDone]} />
            )}
          </View>
        );
      })}
    </View>
  );
}

function FilledInput({ label, value, onChangeText, placeholder, secureTextEntry, right, keyboardType, valid }) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={styles.inputGroup}>
      <Text style={[styles.label, focused && { color: COLORS.primary }]}>{label}</Text>
      <View style={[
        styles.inputWrap,
        focused && styles.inputFocused,
        valid && styles.inputValid,
      ]}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.placeholder}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          autoCapitalize="none"
        />
        {right}
        {valid && !right && (
          <MaterialCommunityIcons name="check-circle" size={20} color={COLORS.success} />
        )}
      </View>
    </View>
  );
}

function PasswordStrength({ password }) {
  const getStrength = () => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };
  const strength = getStrength();
  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  const colors = ["#ddd", COLORS.error, COLORS.warning, "#F4A261", COLORS.success];

  if (!password) return null;
  return (
    <View style={styles.strengthWrap}>
      <View style={styles.strengthBars}>
        {[1, 2, 3, 4].map((i) => (
          <View
            key={i}
            style={[
              styles.strengthBar,
              { backgroundColor: strength >= i ? colors[strength] : "#E5E5EA" },
            ]}
          />
        ))}
      </View>
      <Text style={[styles.strengthLabel, { color: colors[strength] }]}>{labels[strength]}</Text>
    </View>
  );
}

export default function Signup() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [role, setRole] = useState("");

  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const stepTitles = ["Personal Info", "Choose Your Role", "Set Password"];
  const stepIcons = ["account-outline", "account-group-outline", "lock-outline"];

  const goNext = () => {
    // Animate out/in
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: -30, duration: 150, useNativeDriver: true }),
    ]).start(() => {
      setStep((s) => s + 1);
      slideAnim.setValue(30);
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 250, useNativeDriver: true }),
      ]).start();
    });
  };

  const goBack = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 30, duration: 150, useNativeDriver: true }),
    ]).start(() => {
      setStep((s) => s - 1);
      slideAnim.setValue(-30);
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 250, useNativeDriver: true }),
      ]).start();
    });
  };

  const isStep0Valid = name.length > 1 && email.includes("@") && phone.length >= 8;
  const isStep1Valid = !!role;
  const isStep2Valid = password.length >= 6 && password === confirmPassword;

  const canProceed = [isStep0Valid, isStep1Valid, isStep2Valid][step];

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerBlob} />
        {step > 0 && (
          <TouchableOpacity style={styles.backBtn} onPress={goBack}>
            <MaterialCommunityIcons name="arrow-left" size={22} color={COLORS.white} />
          </TouchableOpacity>
        )}
        <View style={styles.headerIcon}>
          <MaterialCommunityIcons name={stepIcons[step]} size={26} color={COLORS.primary} />
        </View>
        <Text style={styles.headerTitle}>{stepTitles[step]}</Text>
        <Text style={styles.headerSub}>Step {step + 1} of 3</Text>
        <StepProgress current={step} total={3} />
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>

          {/* Step 0: Personal Info */}
          {step === 0 && (
            <View>
              <FilledInput label="Full Name" value={name} onChangeText={setName}
                placeholder="Your full name" valid={name.length > 1} />
              <FilledInput label="Email Address" value={email} onChangeText={setEmail}
                placeholder="you@example.com" keyboardType="email-address"
                valid={email.includes("@") && email.includes(".")} />
              <FilledInput label="Phone Number" value={phone} onChangeText={setPhone}
                placeholder="+91 98765 43210" keyboardType="phone-pad"
                valid={phone.length >= 8} />
            </View>
          )}

          {/* Step 1: Role */}
          {step === 1 && (
            <View>
              <Text style={styles.rolePrompt}>What best describes you?</Text>
              <View style={styles.rolesGrid}>
                {ROLES.map((r) => (
                  <TouchableOpacity
                    key={r.key}
                    style={[styles.roleCard, role === r.key && styles.roleCardActive]}
                    onPress={() => setRole(r.key)}
                    activeOpacity={0.8}
                  >
                    <View style={[styles.roleEmojiWrap, role === r.key && styles.roleEmojiWrapActive]}>
                      <Text style={styles.roleEmoji}>{r.emoji}</Text>
                    </View>
                    <Text style={[styles.roleCardLabel, role === r.key && styles.roleCardLabelActive]}>
                      {r.label}
                    </Text>
                    {role === r.key && (
                      <View style={styles.roleCheck}>
                        <MaterialCommunityIcons name="check-circle" size={18} color={COLORS.white} />
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Step 2: Password */}
          {step === 2 && (
            <View>
              <FilledInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                placeholder="Min. 6 characters"
                secureTextEntry={!showPassword}
                right={
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ padding: 4 }}>
                    <MaterialCommunityIcons
                      name={showPassword ? "eye-outline" : "eye-off-outline"}
                      size={20}
                      color={COLORS.grayText}
                    />
                  </TouchableOpacity>
                }
              />
              <PasswordStrength password={password} />

              <FilledInput
                label="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Repeat your password"
                secureTextEntry={!showConfirm}
                valid={confirmPassword.length > 0 && confirmPassword === password}
                right={
                  <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)} style={{ padding: 4 }}>
                    <MaterialCommunityIcons
                      name={showConfirm ? "eye-outline" : "eye-off-outline"}
                      size={20}
                      color={COLORS.grayText}
                    />
                  </TouchableOpacity>
                }
              />

              {/* Summary */}
              <View style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>Account Summary</Text>
                <View style={styles.summaryRow}>
                  <MaterialCommunityIcons name="account" size={16} color={COLORS.grayText} />
                  <Text style={styles.summaryVal}>{name || "—"}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <MaterialCommunityIcons name="email" size={16} color={COLORS.grayText} />
                  <Text style={styles.summaryVal}>{email || "—"}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <MaterialCommunityIcons name="account-group" size={16} color={COLORS.grayText} />
                  <Text style={styles.summaryVal}>{role || "—"}</Text>
                </View>
              </View>
            </View>
          )}
        </Animated.View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.nextBtn, !canProceed && styles.nextBtnDisabled]}
          onPress={step < 2 ? goNext : () => router.replace("/login")}
          disabled={!canProceed}
          activeOpacity={0.85}
        >
          <Text style={styles.nextBtnText}>
            {step === 2 ? "Create Account" : "Continue"}
          </Text>
          <MaterialCommunityIcons
            name={step === 2 ? "check" : "arrow-right"}
            size={20}
            color={COLORS.white}
          />
        </TouchableOpacity>

        {step === 0 && (
          <Text style={styles.loginText}>
            Already have an account?{" "}
            <Text style={styles.loginLink} onPress={() => router.push("/login")}>
              Sign in
            </Text>
          </Text>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 60,
    paddingHorizontal: 28,
    paddingBottom: 28,
    overflow: "hidden",
  },
  headerBlob: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: COLORS.primaryLight,
    opacity: 0.2,
    top: -60,
    right: -60,
  },
  backBtn: {
    marginBottom: 20,
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: COLORS.white,
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  headerSub: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
    marginBottom: 20,
  },
  progressWrap: {
    flexDirection: "row",
    alignItems: "center",
  },
  stepItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.25)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.3)",
  },
  stepActive: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.white,
  },
  stepDone: {
    backgroundColor: COLORS.success,
    borderColor: COLORS.success,
  },
  stepNum: {
    fontSize: 12,
    fontWeight: "700",
    color: "rgba(255,255,255,0.7)",
  },
  stepNumActive: {
    color: COLORS.primary,
  },
  stepLine: {
    width: 40,
    height: 2,
    backgroundColor: "rgba(255,255,255,0.25)",
    marginHorizontal: 4,
  },
  stepLineDone: {
    backgroundColor: "rgba(255,255,255,0.6)",
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 16,
  },
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.grayText,
    marginBottom: 8,
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F8",
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "rgba(0,0,0,0.07)",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 8,
  },
  inputFocused: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryGlow,
  },
  inputValid: {
    borderColor: COLORS.success,
    backgroundColor: "rgba(45,106,79,0.06)",
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: COLORS.textDark,
  },
  strengthWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: -8,
    marginBottom: 16,
    paddingHorizontal: 2,
  },
  strengthBars: {
    flex: 1,
    flexDirection: "row",
    gap: 4,
  },
  strengthBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  strengthLabel: {
    fontSize: 12,
    fontWeight: "700",
    width: 44,
    textAlign: "right",
  },
  rolePrompt: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.textMid,
    marginBottom: 16,
  },
  rolesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  roleCard: {
    width: "30%",
    aspectRatio: 0.9,
    backgroundColor: COLORS.white,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: COLORS.border,
    padding: 12,
    gap: 8,
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  roleCardActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryGlow,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.2,
  },
  roleEmojiWrap: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: COLORS.peach,
    justifyContent: "center",
    alignItems: "center",
  },
  roleEmojiWrapActive: {
    backgroundColor: COLORS.primary,
  },
  roleEmoji: {
    fontSize: 22,
  },
  roleCardLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textMid,
    textAlign: "center",
  },
  roleCardLabelActive: {
    color: COLORS.primary,
  },
  roleCheck: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  summaryCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 18,
    marginTop: 8,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    gap: 10,
  },
  summaryTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: COLORS.grayText,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  summaryVal: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textDark,
  },
  bottomBar: {
    padding: 20,
    paddingBottom: 36,
    gap: 14,
    backgroundColor: COLORS.bg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  nextBtn: {
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    borderRadius: 18,
    gap: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 16,
    elevation: 6,
  },
  nextBtnDisabled: {
    backgroundColor: COLORS.placeholder,
    shadowOpacity: 0,
    elevation: 0,
  },
  nextBtnText: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  loginText: {
    textAlign: "center",
    fontSize: 14,
    color: COLORS.grayText,
  },
  loginLink: {
    color: COLORS.primary,
    fontWeight: "800",
  },
});