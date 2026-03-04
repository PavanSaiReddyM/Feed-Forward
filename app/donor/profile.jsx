import {
  StyleSheet, Text, View, TouchableOpacity,
  TextInput, ScrollView, Platform,
} from "react-native";
import { useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../../_constants/colors";

const STATS = [
  { value: "45", label: "Donations", color: "#FF6B2B", bg: "#FFF0EB", icon: "food-fork-drink" },
  { value: "350", label: "People Fed", color: "#2D6A4F", bg: "#EAF5EF", icon: "account-group" },
  { value: "125", label: "kg Donated", color: "#2B7FFF", bg: "#EBF2FF", icon: "weight-kilogram" },
];

const SETTINGS = [
  { icon: "bell-outline", label: "Notifications", color: "#FF6B2B", bg: "#FFF0EB" },
  { icon: "shield-lock-outline", label: "Privacy", color: "#2B7FFF", bg: "#EBF2FF" },
  { icon: "alert-circle-outline", label: "File a Complaint", color: "#F59E0B", bg: "#FFF8EB" },
  { icon: "help-circle-outline", label: "Help & Support", color: "#2D6A4F", bg: "#EAF5EF" },
  { icon: "information-outline", label: "About", color: "#7C3AED", bg: "#F3EEFF" },
];

function InfoRow({ icon, label, value, isEditing, onChange }) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoIconWrap}>
        <MaterialCommunityIcons name={icon} size={18} color={COLORS.primary} />
      </View>
      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        {isEditing ? (
          <TextInput
            style={styles.infoInput}
            value={value}
            onChangeText={onChange}
            autoCapitalize="none"
          />
        ) : (
          <Text style={styles.infoValue}>{value}</Text>
        )}
      </View>
      {!isEditing && <MaterialCommunityIcons name="chevron-right" size={18} color="#CCC" />}
    </View>
  );
}

export default function DonorProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("Pavan Moola");
  const [email, setEmail] = useState("pavanmoola19@gmail.com");
  const [phone, setPhone] = useState("9876543210");
  const [address, setAddress] = useState("Hyderabad, Telangana");

  return (
    <ScrollView style={styles.root} showsVerticalScrollIndicator={false}>

      {/* Hero header */}
      <View style={styles.hero}>
        <View style={styles.heroBlob1} />
        <View style={styles.heroBlob2} />

        {/* Edit button */}
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => setIsEditing(!isEditing)}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons
            name={isEditing ? "check" : "pencil-outline"}
            size={20} color="#fff"
          />
        </TouchableOpacity>

        {/* Avatar */}
        <View style={styles.avatarWrap}>
          <View style={styles.avatar}>
            <MaterialCommunityIcons name="account" size={52} color={COLORS.primary} />
          </View>
          <View style={styles.avatarBadge}>
            <MaterialCommunityIcons name="camera" size={14} color="#fff" />
          </View>
        </View>

        {isEditing ? (
          <TextInput
            style={styles.nameInput}
            value={name}
            onChangeText={setName}
          />
        ) : (
          <Text style={styles.heroName}>{name}</Text>
        )}

        {/* Role + Verified */}
        <View style={styles.badgeRow}>
          <View style={styles.roleBadge}>
            <Text style={styles.roleBadgeText}>🍽️  Donor</Text>
          </View>
          <View style={styles.verifiedBadge}>
            <MaterialCommunityIcons name="shield-check" size={13} color="#fff" />
            <Text style={styles.verifiedText}>Verified</Text>
          </View>
        </View>
      </View>

      {/* Stats strip */}
      <View style={styles.statsCard}>
        {STATS.map((s, i) => (
          <View key={i} style={[styles.statItem, i < STATS.length - 1 && styles.statItemBorder]}>
            <View style={[styles.statIconWrap, { backgroundColor: s.bg }]}>
              <MaterialCommunityIcons name={s.icon} size={15} color={s.color} />
            </View>
            <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* Info card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Account Info</Text>
        <InfoRow icon="email-outline" label="Email" value={email} isEditing={isEditing} onChange={setEmail} />
        <View style={styles.rowDivider} />
        <InfoRow icon="phone-outline" label="Phone" value={phone} isEditing={isEditing} onChange={setPhone} />
        <View style={styles.rowDivider} />
        <InfoRow icon="map-marker-outline" label="Address" value={address} isEditing={isEditing} onChange={setAddress} />
      </View>

      {/* Save button */}
      {isEditing && (
        <TouchableOpacity style={styles.saveBtn} onPress={() => setIsEditing(false)} activeOpacity={0.86}>
          <MaterialCommunityIcons name="content-save-outline" size={20} color="#fff" />
          <Text style={styles.saveBtnText}>Save Changes</Text>
        </TouchableOpacity>
      )}

      {/* Settings */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Settings</Text>
        {SETTINGS.map((s, i) => (
          <View key={i}>
            <TouchableOpacity style={styles.settingRow} activeOpacity={0.75}>
              <View style={[styles.settingIconWrap, { backgroundColor: s.bg }]}>
                <MaterialCommunityIcons name={s.icon} size={18} color={s.color} />
              </View>
              <Text style={styles.settingLabel}>{s.label}</Text>
              <MaterialCommunityIcons name="chevron-right" size={18} color="#CCC" />
            </TouchableOpacity>
            {i < SETTINGS.length - 1 && <View style={styles.rowDivider} />}
          </View>
        ))}
      </View>

      {/* Sign out */}
      <TouchableOpacity style={styles.signOutBtn} activeOpacity={0.86}>
        <MaterialCommunityIcons name="logout" size={20} color="#D32F2F" />
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>

      <View style={{ height: 95 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F5F0EB" },

  hero: {
    backgroundColor: COLORS.primary,
    paddingTop: Platform.OS === "ios" ? 56 : 44,
    paddingBottom: 36,
    alignItems: "center",
    overflow: "hidden",
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.28, shadowRadius: 18, elevation: 10,
    marginBottom: 20,
  },
  heroBlob1: {
    position: "absolute", width: 220, height: 220, borderRadius: 110,
    backgroundColor: "rgba(255,255,255,0.07)", top: -60, right: -60,
  },
  heroBlob2: {
    position: "absolute", width: 130, height: 130, borderRadius: 65,
    backgroundColor: "rgba(0,0,0,0.08)", bottom: -40, left: -30,
  },
  editBtn: {
    position: "absolute", top: Platform.OS === "ios" ? 58 : 46, right: 20,
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center", alignItems: "center",
  },

  avatarWrap: { marginBottom: 14, position: "relative" },
  avatar: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: "#fff",
    justifyContent: "center", alignItems: "center",
    borderWidth: 3, borderColor: "rgba(255,255,255,0.3)",
    shadowColor: "#000", shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15, shadowRadius: 12, elevation: 6,
  },
  avatarBadge: {
    position: "absolute", bottom: 2, right: 2,
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: COLORS.primary,
    justifyContent: "center", alignItems: "center",
    borderWidth: 2, borderColor: "#fff",
  },

  heroName: { fontSize: 22, fontWeight: "800", color: "#fff", letterSpacing: -0.3, marginBottom: 10 },
  nameInput: {
    fontSize: 20, fontWeight: "800", color: "#fff",
    borderBottomWidth: 1.5, borderBottomColor: "rgba(255,255,255,0.5)",
    marginBottom: 10, minWidth: 160, textAlign: "center",
  },

  badgeRow: { flexDirection: "row", gap: 10 },
  roleBadge: {
    backgroundColor: "rgba(255,255,255,0.18)",
    paddingVertical: 6, paddingHorizontal: 14, borderRadius: 9999,
    borderWidth: 1, borderColor: "rgba(255,255,255,0.25)",
  },
  roleBadgeText: { fontSize: 13, fontWeight: "700", color: "#fff" },
  verifiedBadge: {
    flexDirection: "row", alignItems: "center", gap: 5,
    backgroundColor: "#2D6A4F",
    paddingVertical: 6, paddingHorizontal: 12, borderRadius: 9999,
  },
  verifiedText: { fontSize: 12, fontWeight: "700", color: "#fff" },

  statsCard: {
    flexDirection: "row",
    backgroundColor: "#fff", marginHorizontal: 20, borderRadius: 20,
    padding: 16, marginBottom: 16,
    shadowColor: "#000", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.07, shadowRadius: 10, elevation: 3,
  },
  statItem: { flex: 1, alignItems: "center", gap: 5 },
  statItemBorder: { borderRightWidth: 1, borderRightColor: "#F0F0F5" },
  statIconWrap: { width: 32, height: 32, borderRadius: 10, justifyContent: "center", alignItems: "center" },
  statValue: { fontSize: 18, fontWeight: "800", letterSpacing: -0.3 },
  statLabel: { fontSize: 10, color: COLORS.grayText, fontWeight: "600", textAlign: "center" },

  card: {
    backgroundColor: "#fff", marginHorizontal: 20, borderRadius: 20,
    padding: 18, marginBottom: 16,
    shadowColor: "#000", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.07, shadowRadius: 10, elevation: 3,
  },
  cardTitle: { fontSize: 12, fontWeight: "800", color: COLORS.grayText, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 16 },

  infoRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  infoIconWrap: {
    width: 38, height: 38, borderRadius: 12,
    backgroundColor: COLORS.primaryGlow,
    justifyContent: "center", alignItems: "center",
  },
  infoContent: { flex: 1 },
  infoLabel: { fontSize: 11, color: COLORS.grayText, fontWeight: "600", marginBottom: 2 },
  infoValue: { fontSize: 14, fontWeight: "700", color: COLORS.textDark },
  infoInput: {
    fontSize: 14, fontWeight: "700", color: COLORS.textDark,
    borderBottomWidth: 1.5, borderBottomColor: COLORS.primary + "66",
    paddingBottom: 2,
  },
  rowDivider: { height: 1, backgroundColor: "#F3F3F7", marginVertical: 12 },

  saveBtn: {
    marginHorizontal: 20, backgroundColor: COLORS.primary,
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 10, paddingVertical: 16, borderRadius: 16,
    marginBottom: 16,
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.28, shadowRadius: 12, elevation: 6,
  },
  saveBtnText: { color: "#fff", fontSize: 15, fontWeight: "800" },

  settingRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  settingIconWrap: { width: 38, height: 38, borderRadius: 12, justifyContent: "center", alignItems: "center" },
  settingLabel: { flex: 1, fontSize: 15, fontWeight: "600", color: COLORS.textDark },

  signOutBtn: {
    marginHorizontal: 20, backgroundColor: "#fff",
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 10, paddingVertical: 16, borderRadius: 16, marginBottom: 10,
    borderWidth: 1.5, borderColor: "#FFCDD2",
  },
  signOutText: { color: "#D32F2F", fontSize: 15, fontWeight: "800" },
});