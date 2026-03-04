import {
  StyleSheet, Text, View, TextInput, TouchableOpacity,
  ScrollView, KeyboardAvoidingView, Platform,
} from "react-native";
import { useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../../_constants/colors";

const FOOD_TYPES = ["Cooked Meal", "Raw Produce", "Packaged Food", "Bakery", "Beverages", "Other"];

function Field({ label, icon, value, onChange, placeholder, keyboardType, multiline }) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={styles.fieldGroup}>
      <Text style={[styles.fieldLabel, focused && { color: COLORS.primary }]}>{label}</Text>
      <View style={[styles.fieldBox, focused && styles.fieldBoxFocused, multiline && { height: 88, alignItems: "flex-start" }]}>
        <MaterialCommunityIcons
          name={icon} size={18}
          color={focused ? COLORS.primary : COLORS.grayText}
          style={multiline ? { marginTop: 2 } : {}}
        />
        <TextInput
          style={[styles.fieldInput, multiline && { height: 70, textAlignVertical: "top" }]}
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor={COLORS.placeholder}
          keyboardType={keyboardType}
          multiline={multiline}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          autoCapitalize="none"
        />
      </View>
    </View>
  );
}

export default function PostDonation() {
  const [foodName, setFoodName] = useState("");
  const [foodType, setFoodType] = useState("");
  const [quantity, setQuantity] = useState("");
  const [expiry, setExpiry] = useState("");
  const [location, setLocation] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [imageUri, setImageUri] = useState(null);

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerBlob} />
          <View style={styles.headerIconWrap}>
            <Text style={{ fontSize: 28 }}>🍽️</Text>
          </View>
          <Text style={styles.headerTitle}>Post Donation</Text>
          <Text style={styles.headerSub}>Share surplus food · reduce waste · feed someone today</Text>
        </View>

        {/* Image upload */}
        <TouchableOpacity style={styles.imgUpload} activeOpacity={0.8}>
          <View style={styles.imgIconWrap}>
            <MaterialCommunityIcons name="camera-plus-outline" size={32} color={COLORS.primary} />
          </View>
          <Text style={styles.imgTitle}>Upload Food Photo</Text>
          <Text style={styles.imgSub}>Tap to add an image (optional)</Text>
        </TouchableOpacity>

        {/* Form card */}
        <View style={styles.formCard}>
          <Text style={styles.formSection}>Food Details</Text>

          <Field label="Food Name" icon="food-outline" value={foodName} onChange={setFoodName} placeholder="e.g. Biryani, Rice & Dal" />
          <Field label="Quantity (kg)" icon="weight-kilogram" value={quantity} onChange={setQuantity} placeholder="e.g. 10" keyboardType="numeric" />
          <Field label="Expiry / Best Before" icon="clock-alert-outline" value={expiry} onChange={setExpiry} placeholder="e.g. Today 6 PM" />

          {/* Food type chips */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Food Type</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsScroll}>
              {FOOD_TYPES.map(t => (
                <TouchableOpacity
                  key={t}
                  style={[styles.typeChip, foodType === t && styles.typeChipActive]}
                  onPress={() => setFoodType(t)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.typeChipText, foodType === t && styles.typeChipTextActive]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.formSection2}>
            <Text style={styles.formSection}>Pickup Details</Text>
          </View>

          <Field label="Pickup Location" icon="map-marker-outline" value={location} onChange={setLocation} placeholder="Full address for pickup" multiline />
          <Field label="Preferred Pickup Time" icon="calendar-clock" value={pickupTime} onChange={setPickupTime} placeholder="e.g. Today 4–6 PM" />
        </View>

        {/* Submit */}
        <TouchableOpacity style={styles.submitBtn} activeOpacity={0.86}>
          <MaterialCommunityIcons name="check-circle-outline" size={22} color="#fff" />
          <Text style={styles.submitText}>Submit Donation</Text>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          Your donation will be visible to verified NGOs nearby. You'll get a notification once someone accepts.
        </Text>

        <View style={{ height: 95 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F5F0EB" },
  content: { paddingBottom: 20 },

  header: {
    backgroundColor: COLORS.primary,
    paddingTop: Platform.OS === "ios" ? 56 : 44,
    paddingHorizontal: 22, paddingBottom: 30,
    alignItems: "flex-start",
    borderBottomLeftRadius: 28, borderBottomRightRadius: 28,
    overflow: "hidden",
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28, shadowRadius: 16, elevation: 10,
    marginBottom: 20,
  },
  headerBlob: {
    position: "absolute", width: 220, height: 220, borderRadius: 110,
    backgroundColor: "rgba(255,255,255,0.07)", top: -70, right: -50,
  },
  headerIconWrap: {
    width: 56, height: 56, borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.18)",
    justifyContent: "center", alignItems: "center",
    marginBottom: 14,
  },
  headerTitle: { fontSize: 26, fontWeight: "800", color: "#fff", letterSpacing: -0.4, marginBottom: 6 },
  headerSub: { fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 19 },

  imgUpload: {
    marginHorizontal: 20, borderRadius: 18,
    borderWidth: 2, borderStyle: "dashed", borderColor: COLORS.primary + "55",
    backgroundColor: "#fff", padding: 24,
    alignItems: "center", gap: 6, marginBottom: 16,
  },
  imgIconWrap: {
    width: 60, height: 60, borderRadius: 18,
    backgroundColor: COLORS.primaryGlow,
    justifyContent: "center", alignItems: "center",
    marginBottom: 4,
  },
  imgTitle: { fontSize: 15, fontWeight: "700", color: COLORS.textDark },
  imgSub: { fontSize: 12, color: COLORS.grayText },

  formCard: {
    backgroundColor: "#fff", marginHorizontal: 20,
    borderRadius: 22, padding: 20, marginBottom: 16,
    shadowColor: "#000", shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07, shadowRadius: 10, elevation: 3,
  },
  formSection: { fontSize: 13, fontWeight: "800", color: COLORS.grayText, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 16 },
  formSection2: { marginTop: 8, marginBottom: 0 },

  fieldGroup: { marginBottom: 16 },
  fieldLabel: { fontSize: 12, fontWeight: "700", color: COLORS.grayText, marginBottom: 7, letterSpacing: 0.3, textTransform: "uppercase" },
  fieldBox: {
    flexDirection: "row", alignItems: "center", gap: 10,
    backgroundColor: "#F7F7FA", borderRadius: 14,
    paddingHorizontal: 14, paddingVertical: 13,
    borderWidth: 1.5, borderColor: "transparent",
  },
  fieldBoxFocused: { borderColor: COLORS.primary, backgroundColor: COLORS.primaryGlow },
  fieldInput: { flex: 1, fontSize: 14, color: COLORS.textDark },

  chipsScroll: { gap: 8, paddingBottom: 2 },
  typeChip: {
    paddingVertical: 8, paddingHorizontal: 14, borderRadius: 9999,
    backgroundColor: "#F0F0F5", borderWidth: 1.5, borderColor: "transparent",
  },
  typeChipActive: { backgroundColor: COLORS.primaryGlow, borderColor: COLORS.primary },
  typeChipText: { fontSize: 13, fontWeight: "600", color: COLORS.grayText },
  typeChipTextActive: { color: COLORS.primary, fontWeight: "700" },

  submitBtn: {
    marginHorizontal: 20,
    backgroundColor: COLORS.primary,
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 10, paddingVertical: 18, borderRadius: 18,
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3, shadowRadius: 16, elevation: 8,
    marginBottom: 14,
  },
  submitText: { color: "#fff", fontSize: 16, fontWeight: "800", letterSpacing: 0.2 },

  disclaimer: {
    marginHorizontal: 20, fontSize: 12, color: COLORS.grayText,
    textAlign: "center", lineHeight: 18,
  },
});