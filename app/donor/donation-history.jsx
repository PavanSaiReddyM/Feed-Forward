import {
  StyleSheet, Text, View, FlatList,
  TouchableOpacity, Animated, Platform,
} from "react-native";
import { useRef, useEffect, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../../_constants/colors";

const HISTORY = [
  { id: "1", name: "Dal Makhani & Roti", qty: "12 kg", category: "Cooked Meal", ngo: "Helping Hands NGO", date: "Mar 15, 2026", meals: 24, status: "Collected" },
  { id: "2", name: "Fresh Bread Loaves", qty: "20 pcs", category: "Bakery", ngo: "Robin Hood Army", date: "Mar 12, 2026", meals: 40, status: "Collected" },
  { id: "3", name: "Mixed Vegetables", qty: "8 kg", category: "Produce", ngo: "Akshaya Patra", date: "Mar 10, 2026", meals: 16, status: "Collected" },
  { id: "4", name: "Packaged Biscuits", qty: "5 kg", category: "Packaged", ngo: "Food For All", date: "Mar 8, 2026", meals: 20, status: "Collected" },
  { id: "5", name: "Biryani (Event)", qty: "18 kg", category: "Cooked Meal", ngo: "Helping Hands NGO", date: "Mar 5, 2026", meals: 36, status: "Collected" },
  { id: "6", name: "Milk Packets", qty: "10 L", category: "Beverages", ngo: null, date: "Mar 2, 2026", meals: 0, status: "Expired" },
];

const CAT_STYLE = {
  "Cooked Meal": { color: "#FF6B2B", bg: "#FFF0EB", icon: "food-fork-drink" },
  "Bakery": { color: "#F59E0B", bg: "#FFF8EB", icon: "bread-slice-outline" },
  "Produce": { color: "#2D6A4F", bg: "#EAF5EF", icon: "leaf" },
  "Packaged": { color: "#2B7FFF", bg: "#EBF2FF", icon: "package-variant" },
  "Beverages": { color: "#7C3AED", bg: "#F3EEFF", icon: "cup-outline" },
};

const FILTERS = ["All", "Collected", "Expired"];

function HistoryCard({ item, index, isLast }) {
  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(20)).current;
  const cat = CAT_STYLE[item.category] || { color: COLORS.primary, bg: "#FFF0EB", icon: "food-variant" };
  const done = item.status === "Collected";

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 380, delay: index * 70, useNativeDriver: true }),
      Animated.timing(slide, { toValue: 0, duration: 380, delay: index * 70, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[styles.timelineRow, { opacity: fade, transform: [{ translateY: slide }] }]}>
      {/* Timeline spine */}
      <View style={styles.spine}>
        <View style={[styles.spineDot, { backgroundColor: done ? COLORS.success : "#EF4444", borderColor: done ? "#D1FAE5" : "#FEE2E2" }]}>
          <MaterialCommunityIcons name={done ? "check" : "close"} size={10} color="#fff" />
        </View>
        {!isLast && <View style={[styles.spineLine, { backgroundColor: done ? "#D1FAE5" : "#FEE2E2" }]} />}
      </View>

      {/* Card */}
      <View style={[styles.card, !done && styles.cardExpired]}>
        {/* Header */}
        <View style={styles.cardHead}>
          <View style={[styles.catIcon, { backgroundColor: cat.bg }]}>
            <MaterialCommunityIcons name={cat.icon} size={20} color={cat.color} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.foodName}>{item.name}</Text>
            <Text style={styles.dateText}>{item.date}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: done ? "#EAF5EF" : "#FEF2F2" }]}>
            <Text style={[styles.statusBadgeText, { color: done ? "#2D6A4F" : "#EF4444" }]}>
              {done ? "✓ Collected" : "✗ Expired"}
            </Text>
          </View>
        </View>

        {/* Details */}
        <View style={styles.detailGrid}>
          <View style={styles.detailItem}>
            <MaterialCommunityIcons name="weight-kilogram" size={13} color={COLORS.primary} />
            <Text style={styles.detailText}>{item.qty}</Text>
          </View>
          <View style={styles.detailItem}>
            <MaterialCommunityIcons name="tag-outline" size={13} color={COLORS.primary} />
            <Text style={styles.detailText}>{item.category}</Text>
          </View>
          {item.ngo && (
            <View style={styles.detailItem}>
              <MaterialCommunityIcons name="domain" size={13} color={COLORS.success} />
              <Text style={[styles.detailText, { color: COLORS.success }]}>{item.ngo}</Text>
            </View>
          )}
          {done && (
            <View style={styles.detailItem}>
              <MaterialCommunityIcons name="account-group-outline" size={13} color="#2B7FFF" />
              <Text style={[styles.detailText, { color: "#2B7FFF" }]}>~{item.meals} meals fed</Text>
            </View>
          )}
        </View>
      </View>
    </Animated.View>
  );
}

export default function DonationHistory() {
  const [filter, setFilter] = useState("All");
  const filtered = filter === "All" ? HISTORY : HISTORY.filter(h => h.status === filter);

  const totalMeals = HISTORY.reduce((s, h) => s + h.meals, 0);
  const totalDonations = HISTORY.filter(h => h.status === "Collected").length;
  const totalKg = HISTORY.filter(h => h.status === "Collected").reduce((s, h) => s + parseFloat(h.qty), 0);

  return (
    <View style={styles.root}>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerBlob} />
        <Text style={styles.headerLabel}>Your Impact</Text>
        <Text style={styles.headerTitle}>Donation History</Text>

        {/* Impact stats */}
        <View style={styles.impactRow}>
          {[
            { icon: "hand-heart-outline", value: totalDonations, label: "Donations", color: "#FF6B2B" },
            { icon: "account-group-outline", value: `~${totalMeals}`, label: "Meals Fed", color: "#fff" },
            { icon: "weight-kilogram", value: `${totalKg}kg`, label: "Food Saved", color: "#74C69D" },
          ].map((s, i) => (
            <View key={i} style={[styles.impactCard, i === 1 && styles.impactCardCenter]}>
              <MaterialCommunityIcons name={s.icon} size={18} color={s.color} />
              <Text style={[styles.impactNum, { color: s.color }]}>{s.value}</Text>
              <Text style={styles.impactLabel}>{s.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filterRow}>
        {FILTERS.map(f => (
          <TouchableOpacity key={f}
            style={[styles.filterBtn, filter === f && styles.filterBtnActive]}
            onPress={() => setFilter(f)} activeOpacity={0.8}>
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Timeline list */}
      <FlatList
        data={filtered}
        keyExtractor={h => h.id}
        contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 100, paddingTop: 8 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <HistoryCard item={item} index={index} isLast={index === filtered.length - 1} />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <MaterialCommunityIcons name="history" size={52} color={COLORS.grayText} />
            <Text style={styles.emptyTitle}>No history yet</Text>
            <Text style={styles.emptySub}>Your completed donations will appear here</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F5F0EB" },

  header: {
    backgroundColor: COLORS.success, paddingTop: Platform.OS === "ios" ? 58 : 44,
    paddingHorizontal: 22, paddingBottom: 26, overflow: "hidden",
    borderBottomLeftRadius: 28, borderBottomRightRadius: 28, marginBottom: 14,
    shadowColor: COLORS.success, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.25, shadowRadius: 16, elevation: 10,
  },
  headerBlob: { position: "absolute", width: 180, height: 180, borderRadius: 90, backgroundColor: "#fff", opacity: 0.06, top: -50, right: -40 },
  headerLabel: { fontSize: 11, fontWeight: "600", color: "rgba(255,255,255,0.55)", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 4 },
  headerTitle: { fontSize: 26, fontWeight: "800", color: "#fff", letterSpacing: -0.5, marginBottom: 18 },
  impactRow: { flexDirection: "row", gap: 10 },
  impactCard: { flex: 1, backgroundColor: "rgba(255,255,255,0.13)", borderRadius: 14, paddingVertical: 12, alignItems: "center", gap: 4 },
  impactCardCenter: { backgroundColor: "rgba(255,255,255,0.22)", transform: [{ scale: 1.03 }] },
  impactNum: { fontSize: 18, fontWeight: "800" },
  impactLabel: { fontSize: 10, color: "rgba(255,255,255,0.65)", fontWeight: "600" },

  filterRow: { flexDirection: "row", paddingHorizontal: 18, gap: 10, paddingBottom: 10 },
  filterBtn: { paddingVertical: 8, paddingHorizontal: 20, borderRadius: 9999, backgroundColor: "#fff", borderWidth: 1.5, borderColor: "#E5E7EB" },
  filterBtnActive: { backgroundColor: COLORS.success, borderColor: COLORS.success },
  filterText: { fontSize: 13, fontWeight: "600", color: COLORS.grayText },
  filterTextActive: { color: "#fff", fontWeight: "800" },

  timelineRow: { flexDirection: "row", gap: 14, marginBottom: 16 },
  spine: { alignItems: "center", width: 22 },
  spineDot: { width: 22, height: 22, borderRadius: 11, borderWidth: 3, justifyContent: "center", alignItems: "center", zIndex: 1 },
  spineLine: { width: 2, flex: 1, marginTop: 4 },

  card: { flex: 1, backgroundColor: "#fff", borderRadius: 18, padding: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  cardExpired: { opacity: 0.75 },
  cardHead: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 12 },
  catIcon: { width: 42, height: 42, borderRadius: 13, justifyContent: "center", alignItems: "center" },
  foodName: { fontSize: 14, fontWeight: "800", color: COLORS.textDark, marginBottom: 3 },
  dateText: { fontSize: 11, color: COLORS.grayText, fontWeight: "500" },
  statusBadge: { paddingVertical: 4, paddingHorizontal: 9, borderRadius: 8 },
  statusBadgeText: { fontSize: 11, fontWeight: "800" },
  detailGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  detailItem: { flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: "#F7F7FA", paddingVertical: 5, paddingHorizontal: 9, borderRadius: 8 },
  detailText: { fontSize: 12, fontWeight: "600", color: COLORS.grayText },

  empty: { alignItems: "center", paddingVertical: 60, gap: 10 },
  emptyTitle: { fontSize: 16, fontWeight: "800", color: COLORS.textDark },
  emptySub: { fontSize: 13, color: COLORS.grayText, textAlign: "center" },
});