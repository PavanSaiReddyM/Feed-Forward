import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../_constants/colors";

export default function Signup() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const roles = ["NGO", "Volunteer", "Event", "Restaurant"];

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>
            Join us to make a difference
          </Text>
        </View>

        {/* FORM CARD */}
        <View style={styles.form}>
          {/* NAME */}
          <Input label="Full Name" value={name} setValue={setName} />

          {/* EMAIL */}
          <Input label="Email" value={email} setValue={setEmail} />

          {/* PHONE */}
          <Input label="Phone Number" value={phone} setValue={setPhone} />

          {/* PASSWORD */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordRow}>
              <TextInput
                style={styles.input}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                placeholder="Enter password"
                placeholderTextColor="#aaa"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
              >
                <MaterialCommunityIcons
                  name={showPassword ? "eye" : "eye-off"}
                  size={22}
                  color={COLORS.darkOrange}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* CONFIRM PASSWORD */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirm Password</Text>
            <View style={styles.passwordRow}>
              <TextInput
                style={styles.input}
                secureTextEntry={!showConfirm}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm password"
                placeholderTextColor="#aaa"
              />
              <TouchableOpacity
                onPress={() => setShowConfirm(!showConfirm)}
              >
                <MaterialCommunityIcons
                  name={showConfirm ? "eye" : "eye-off"}
                  size={22}
                  color={COLORS.darkOrange}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* ROLE SELECTION */}
          <Text style={styles.roleTitle}>Select Your Role</Text>

          <View style={styles.roleContainer}>
            {roles.map((r) => (
              <TouchableOpacity
                key={r}
                style={[
                  styles.roleChip,
                  role === r && styles.roleChipActive,
                ]}
                onPress={() => setRole(r)}
              >
                <Text
                  style={[
                    styles.roleText,
                    role === r && styles.roleTextActive,
                  ]}
                >
                  {r}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* BUTTON */}
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>CREATE ACCOUNT</Text>
          </TouchableOpacity>

          <Text style={styles.linkText}>
            Already have an account?{" "}
            <Text
              style={styles.linkBold}
              onPress={() => router.push("/login")}
            >
              Login
            </Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/* 🔹 Reusable Input Component */
const Input = ({ label, value, setValue }) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.inputRow}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={setValue}
        placeholder={`Enter ${label}`}
        placeholderTextColor="#aaa"
      />
    </View>
  </View>
);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.peach,
  },

  header: {
    paddingTop: 90,
    paddingBottom: 40,
    alignItems: "center",
  },

  title: {
    fontSize: 32,
    fontWeight: "800",
    color: COLORS.darkOrange,
  },

  subtitle: {
    fontSize: 16,
    color: COLORS.lightOrange,
    marginTop: 6,
  },

  form: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 30,
    paddingBottom: 60,
  },

  inputGroup: {
    marginBottom: 22,
  },

  label: {
    fontWeight: "700",
    color: COLORS.darkOrange,
    marginBottom: 6,
  },

  inputRow: {
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingVertical: 6,
  },

  input: {
    flex: 1,
    fontSize: 16,
  },

  passwordRow: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingVertical: 6,
  },

  /* ROLE */

  roleTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.darkOrange,
    marginBottom: 14,
    marginTop: 10,
  },

  roleContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 30,
  },

  roleChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.lightOrange,
    marginRight: 10,
    marginBottom: 10,
  },

  roleChipActive: {
    backgroundColor: COLORS.lightOrange,
  },

  roleText: {
    color: COLORS.lightOrange,
    fontWeight: "600",
  },

  roleTextActive: {
    color: COLORS.white,
  },

  /* BUTTON */

  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 10,

    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 6,
  },

  buttonText: {
    color: COLORS.white,
    fontWeight: "700",
    fontSize: 16,
    letterSpacing: 1,
  },

  linkText: {
    textAlign: "center",
    marginTop: 25,
    color: COLORS.grayText,
  },

  linkBold: {
    color: COLORS.primary,
    fontWeight: "700",
  },
});
