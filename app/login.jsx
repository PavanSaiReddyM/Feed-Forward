import {
  StyleSheet,
  Text,
  ScrollView,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../_constants/colors";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Welcome Back 👋</Text>
        <Text style={styles.headerSub}>Sign in to continue</Text>
      </View>

      {/* CARD */}
      <ScrollView
        style={styles.card}
        showsVerticalScrollIndicator={false}
      >
        {/* EMAIL */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>

          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
            />
          </View>
        </View>

        {/* PASSWORD */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>

          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />

            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={{ padding: 5 }}
            >
              <MaterialCommunityIcons
                name={showPassword ? "eye" : "eye-off"}
                size={22}
                color={COLORS.darkOrange}
              />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity>
          <Text style={styles.forgot}>Forgot password?</Text>
        </TouchableOpacity>

        {/* BUTTON */}
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>SIGN IN</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          Don’t have account?{" "}
          <Text
            style={styles.link}
            onPress={() => router.push("/signup")}
          >
            Sign up
          </Text>
        </Text>
        <TouchableOpacity
          style={styles.demoButton}
          activeOpacity={0.85}
          onPress={() => router.push('/donor/dashboard')}
        >
          <Text style={styles.demoButtonText}>🎯 View Donor Demo</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.demoButton}
          activeOpacity={0.85}
          onPress={() => router.push('/admin')}
        >
          <Text style={styles.demoButtonText}>View Admin Demo</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.demoButton}
          activeOpacity={0.85}
          onPress={() => router.push('/ngo')}
        >
          <Text style={styles.demoButtonText}>View NGO Demo</Text>
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.peach,
  },

  header: {
    height: 250,
    paddingTop: 100,
    paddingHorizontal: 30,
    backgroundColor: COLORS.primary,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  demoButton: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 18,
    borderRadius: 22,
    marginTop: 8,
  },

  demoButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: COLORS.white,
  },

  headerSub: {
    color: COLORS.white,
    marginTop: 5,
  },

  card: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 30,
  },


  inputGroup: {
    marginBottom: 25,
  },

  label: {
    color: COLORS.darkOrange,
    fontWeight: "700",
    marginBottom: 8,
  },

  /* 🔥 THIS FIXES EMAIL VISIBILITY */
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
    paddingVertical: 6,
  },

  input: {
    flex: 1,
    paddingVertical: 8,
    fontSize: 16,
  },

  forgot: {
    alignSelf: "flex-end",
    color: COLORS.grayText,
    marginBottom: 30,
  },

  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 25,
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
  },

  footerText: {
    textAlign: "center",
    color: COLORS.grayText,
  },

  link: {
    color: COLORS.primary,
    fontWeight: "700",
  },
});
