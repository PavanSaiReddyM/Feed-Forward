import {
  StyleSheet, Text, View, ScrollView,
  TouchableOpacity, Platform,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../../_constants/colors";

const STATUS_CONFIG = {
  Waiting: { color: "#FF6B2B", bg: "#FFF0EB", icon: "clock-outline" },
  Scheduled: { color: "#2D6A4F", bg: "#EAF5EF", icon: "calendar-check-outline" },
  Transit: { color: "#2B7FFF", bg: "#EBF2FF", icon: "truck-delivery-outline" },
};

const DONATIONS = [
  { id: 1, name: "Rice & Curry", quantity: "15 kg", category: "Cooked Food", status: "Waiting", ngo: "Hope Foundation", time: "Posted 2h ago" },
  { id: 2, name: "Fresh Vegetables", quantity: "8 kg", category: "Raw Produce", status: "Scheduled", ngo: "Care NGO", time: "Pickup at 4 PM" },
  { id: 3, name: "Bread & Pastries", quantity: "5 kg", category: "Bakery", status: "Waiting", ngo: "Food Bank", time: "Posted 30 min ago" },
  { id: 4, name: "Packed Meals", quantity: "20 kg", category: "Packaged", status: "Transit", ngo: "Helping Hands", time: "In transit now" },
];

function DonationCard({ item }) {
  const cfg = STATUS_CONFIG[item.status] || STATUS_CONFIG.Waiting;
  return (
    <View style={styles.card}>
      {/* Left accent bar */}
      <View style={[styles.accent, { backgroundColor: cfg.color }]} />

      <View style={styles.cardBody}>
        {/* Top row */}
        <View style={styles.topRow}>
          <View style={[styles.foodIconWrap, { backgroundColor: cfg.bg }]}>
            <MaterialCommunityIcons name="food-fork-drink" size={20} color={cfg.color} />
          </View>
          <View style={styles.cardInfo}>
            <Text style={styles.cardName}>{item.name}</Text>
            <Text style={styles.cardCategory}>{item.category}</Text>
          </View>
          {/* Status badge */}
          <View style={[styles.statusBadge, { backgroundColor: cfg.bg }]}>
            <MaterialCommunityIcons name={cfg.icon} size={12} color={cfg.color} />
            <Text style={[styles.statusText, { color: cfg.color }]}>{item.status}</Text>
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Bottom row */}
        <View style={styles.bottomRow}>
          <View style={styles.metaChip}>
            <MaterialCommunityIcons name="weight-kilogram" size={13} color={COLORS.grayText} />
            <Text style={styles.metaText}>{item.quantity}</Text>
          </View>
          <View style={styles.metaChip}>
            <MaterialCommunityIcons name="office-building-outline" size={13} color={COLORS.grayText} />
            <Text style={styles.metaText}>{item.ngo}</Text>
          </View>
          <View style={styles.metaChip}>
            <MaterialCommunityIcons name="clock-outline" size={13} color={COLORS.grayText} />
            <Text style={styles.metaText}>{item.time}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

export default function ActiveDonations() {
  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerBlob} />
        <Text style={styles.headerSub}>Donor Dashboard</Text>
        <Text style={styles.headerTitle}>Active Donations</Text>
        {/* Summary pills */}
        <View style={styles.pillsRow}>
          <View style={[styles.pill, { backgroundColor: "rgba(255,255,255,0.2)" }]}>
            <Text style={styles.pillTxt}>🕐 2 Waiting</Text>
          </View>
          <View style={[styles.pill, { backgroundColor: "rgba(255,255,255,0.2)" }]}>
            <Text style={styles.pillTxt}>✅ 1 Scheduled</Text>
          </View>
          <View style={[styles.pill, { backgroundColor: "rgba(255,255,255,0.2)" }]}>
            <Text style={styles.pillTxt}>🚚 1 Transit</Text>
          </View>
        </View>
      </View>

      {/* List */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {DONATIONS.map(item => <DonationCard key={item.id} item={item} />)}
        <View style={{ height: 90 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F5F0EB" },

  header: {
    backgroundColor: COLORS.primary,
    paddingTop: Platform.OS === "ios" ? 56 : 44,
    paddingHorizontal: 22,
    paddingBottom: 28,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: "hidden",
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28, shadowRadius: 16, elevation: 10,
  },
  headerBlob: {
    position: "absolute", width: 200, height: 200, borderRadius: 100,
    backgroundColor: "rgba(255,255,255,0.07)", top: -60, right: -40,
  },
  headerSub: { fontSize: 13, color: "rgba(255,255,255,0.65)", fontWeight: "600", marginBottom: 6 },
  headerTitle: { fontSize: 28, fontWeight: "800", color: "#fff", letterSpacing: -0.5, marginBottom: 16 },
  pillsRow: { flexDirection: "row", gap: 8 },
  pill: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 9999, borderWidth: 1, borderColor: "rgba(255,255,255,0.22)" },
  pillTxt: { fontSize: 11, fontWeight: "700", color: "#fff" },

  scroll: { flex: 1 },
  scrollContent: { padding: 20, gap: 12 },

  card: {
    backgroundColor: "#fff", borderRadius: 18,
    flexDirection: "row", overflow: "hidden",
    shadowColor: "#000", shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07, shadowRadius: 10, elevation: 3,
  },
  accent: { width: 4 },
  cardBody: { flex: 1, padding: 16 },
  topRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  foodIconWrap: { width: 42, height: 42, borderRadius: 13, justifyContent: "center", alignItems: "center" },
  cardInfo: { flex: 1 },
  cardName: { fontSize: 15, fontWeight: "700", color: COLORS.textDark, marginBottom: 2 },
  cardCategory: { fontSize: 12, color: COLORS.grayText, fontWeight: "500" },
  statusBadge: {
    flexDirection: "row", alignItems: "center", gap: 4,
    paddingVertical: 5, paddingHorizontal: 10, borderRadius: 9999,
  },
  statusText: { fontSize: 11, fontWeight: "700" },
  divider: { height: 1, backgroundColor: "#F3F3F7", marginVertical: 12 },
  bottomRow: { flexDirection: "row", gap: 12, flexWrap: "wrap" },
  metaChip: { flexDirection: "row", alignItems: "center", gap: 4 },
  metaText: { fontSize: 11, color: COLORS.grayText, fontWeight: "600" },
});