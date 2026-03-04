import {
  StyleSheet, Text, View, ScrollView, Platform, TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../../_constants/colors";

const HISTORY = [
  { id: 1, date: "Jan 15, 2024", name: "Cooked Rice", quantity: "20 kg", ngo: "Hope Foundation", kg: 20 },
  { id: 2, date: "Jan 12, 2024", name: "Fresh Fruits", quantity: "12 kg", ngo: "Care NGO", kg: 12 },
  { id: 3, date: "Jan 10, 2024", name: "Packaged Food", quantity: "18 kg", ngo: "Food Bank", kg: 18 },
  { id: 4, date: "Jan 08, 2024", name: "Vegetables", quantity: "15 kg", ngo: "Hope Foundation", kg: 15 },
];

const TOTAL_KG = HISTORY.reduce((s, h) => s + h.kg, 0);
const TOTAL_MEALS = Math.round(TOTAL_KG * 3.5);
const CO2_SAVED = (TOTAL_KG * 2.5).toFixed(1);

function HistoryCard({ item }) {
  return (
    <View style={styles.card}>
      {/* Date header */}
      <View style={styles.cardTop}>
        <View style={styles.dateChip}>
          <MaterialCommunityIcons name="calendar" size={13} color={COLORS.primary} />
          <Text style={styles.dateText}>{item.date}</Text>
        </View>
        <View style={styles.completedBadge}>
          <MaterialCommunityIcons name="check-circle" size={13} color="#2D6A4F" />
          <Text style={styles.completedText}>Completed</Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Food info */}
      <View style={styles.cardRow}>
        <View style={styles.foodIconBg}>
          <Text style={{ fontSize: 22 }}>🍽️</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.foodName}>{item.name}</Text>
          <Text style={styles.foodQty}>{item.quantity}</Text>
        </View>
        <View style={styles.kgBadge}>
          <Text style={styles.kgText}>{item.kg} kg</Text>
        </View>
      </View>

      {/* NGO row */}
      <View style={styles.ngoRow}>
        <MaterialCommunityIcons name="office-building-outline" size={14} color={COLORS.grayText} />
        <Text style={styles.ngoText}>{item.ngo}</Text>
        <MaterialCommunityIcons name="chevron-right" size={14} color={COLORS.grayText} />
      </View>
    </View>
  );
}

export default function DonationHistory() {
  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerBlob} />
        <Text style={styles.headerSub}>Donor Dashboard</Text>
        <Text style={styles.headerTitle}>Donation History</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Impact summary */}
        <View style={styles.impactCard}>
          <Text style={styles.impactLabel}>Your Total Impact</Text>
          <View style={styles.impactRow}>
            {[
              { icon: "weight-kilogram", value: `${TOTAL_KG}kg`, label: "Donated", color: "#FF6B2B", bg: "#FFF0EB" },
              { icon: "food", value: TOTAL_MEALS, label: "Meals", color: "#2D6A4F", bg: "#EAF5EF" },
              { icon: "leaf", value: `${CO2_SAVED}kg`, label: "CO₂ Saved", color: "#2B7FFF", bg: "#EBF2FF" },
            ].map((s, i) => (
              <View key={i} style={[styles.impactStat, i < 2 && styles.impactStatBorder]}>
                <View style={[styles.impactIconWrap, { backgroundColor: s.bg }]}>
                  <MaterialCommunityIcons name={s.icon} size={16} color={s.color} />
                </View>
                <Text style={[styles.impactVal, { color: s.color }]}>{s.value}</Text>
                <Text style={styles.impactStatLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Section title */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>All Donations</Text>
          <Text style={styles.sectionCount}>{HISTORY.length} records</Text>
        </View>

        {/* Cards */}
        {HISTORY.map(item => <HistoryCard key={item.id} item={item} />)}
        <View style={{ height: 95 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F5F0EB" },

  header: {
    backgroundColor: COLORS.primary,
    paddingTop: Platform.OS === "ios" ? 56 : 44,
    paddingHorizontal: 22, paddingBottom: 28,
    borderBottomLeftRadius: 28, borderBottomRightRadius: 28,
    overflow: "hidden",
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28, shadowRadius: 16, elevation: 10,
  },
  headerBlob: {
    position: "absolute", width: 200, height: 200, borderRadius: 100,
    backgroundColor: "rgba(255,255,255,0.07)", top: -60, right: -40,
  },
  headerSub: { fontSize: 13, color: "rgba(255,255,255,0.65)", fontWeight: "600", marginBottom: 6 },
  headerTitle: { fontSize: 28, fontWeight: "800", color: "#fff", letterSpacing: -0.5 },

  content: { padding: 20, gap: 12 },

  // Impact card
  impactCard: {
    backgroundColor: "#fff", borderRadius: 20, padding: 18, marginBottom: 4,
    shadowColor: "#000", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.07, shadowRadius: 10, elevation: 3,
  },
  impactLabel: { fontSize: 12, fontWeight: "700", color: COLORS.grayText, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 14 },
  impactRow: { flexDirection: "row" },
  impactStat: { flex: 1, alignItems: "center", gap: 6 },
  impactStatBorder: { borderRightWidth: 1, borderRightColor: "#F0F0F5" },
  impactIconWrap: { width: 34, height: 34, borderRadius: 10, justifyContent: "center", alignItems: "center" },
  impactVal: { fontSize: 18, fontWeight: "800", letterSpacing: -0.3 },
  impactStatLabel: { fontSize: 11, color: COLORS.grayText, fontWeight: "600" },

  sectionRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 2, marginTop: 6 },
  sectionTitle: { fontSize: 18, fontWeight: "800", color: COLORS.textDark, letterSpacing: -0.3 },
  sectionCount: { fontSize: 13, color: COLORS.grayText, fontWeight: "600" },

  // History card
  card: {
    backgroundColor: "#fff", borderRadius: 18, padding: 16,
    shadowColor: "#000", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.07, shadowRadius: 10, elevation: 3,
  },
  cardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  dateChip: { flexDirection: "row", alignItems: "center", gap: 5 },
  dateText: { fontSize: 12, color: COLORS.grayText, fontWeight: "600" },
  completedBadge: {
    flexDirection: "row", alignItems: "center", gap: 5,
    backgroundColor: "#EAF5EF", paddingVertical: 4, paddingHorizontal: 10, borderRadius: 9999,
  },
  completedText: { fontSize: 11, fontWeight: "700", color: "#2D6A4F" },
  divider: { height: 1, backgroundColor: "#F3F3F7", marginBottom: 12 },
  cardRow: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 12 },
  foodIconBg: {
    width: 44, height: 44, borderRadius: 13,
    backgroundColor: "#FFF0EB", justifyContent: "center", alignItems: "center",
  },
  foodName: { fontSize: 15, fontWeight: "700", color: COLORS.textDark, marginBottom: 2 },
  foodQty: { fontSize: 12, color: COLORS.grayText, fontWeight: "500" },
  kgBadge: { backgroundColor: COLORS.primaryGlow, paddingVertical: 5, paddingHorizontal: 12, borderRadius: 9999 },
  kgText: { fontSize: 12, fontWeight: "800", color: COLORS.primary },
  ngoRow: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "#F7F7FA", borderRadius: 10, paddingVertical: 8, paddingHorizontal: 12 },
  ngoText: { flex: 1, fontSize: 12, color: COLORS.grayText, fontWeight: "600" },
});