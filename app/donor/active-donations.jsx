import {
  StyleSheet, Text, View, FlatList, TouchableOpacity,
  Animated, Platform, Alert,
} from "react-native";
import { useRef, useEffect, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../../_constants/colors";

const STATUS_CONFIG = {
  Waiting: { color: "#F59E0B", bg: "#FFF8EB", icon: "clock-outline", step: 0 },
  Scheduled: { color: "#2B7FFF", bg: "#EBF2FF", icon: "calendar-check-outline", step: 1 },
  "En Route": { color: "#7C3AED", bg: "#F3EEFF", icon: "truck-fast-outline", step: 2 },
  Collected: { color: "#2D6A4F", bg: "#EAF5EF", icon: "check-circle-outline", step: 3 },
};

const STEPS = ["Posted", "Scheduled", "En Route", "Collected"];

const DONATIONS = [
  {
    id: "1", name: "Dal Makhani & Roti", quantity: "12 kg", category: "Cooked Meal",
    status: "En Route", postedAt: "Today, 10:30 AM", pickupBy: "5:00 PM",
    ngo: "Helping Hands NGO", urgent: true,
  },
  {
    id: "2", name: "Fresh Bread Loaves", quantity: "20 pcs", category: "Bakery",
    status: "Scheduled", postedAt: "Today, 9:00 AM", pickupBy: "6:00 PM",
    ngo: "Robin Hood Army", urgent: false,
  },
  {
    id: "3", name: "Mixed Vegetables", quantity: "8 kg", category: "Produce",
    status: "Waiting", postedAt: "Today, 8:15 AM", pickupBy: "4:00 PM",
    ngo: null, urgent: false,
  },
  {
    id: "4", name: "Biryani (Party Leftover)", quantity: "15 kg", category: "Cooked Meal",
    status: "Collected", postedAt: "Yesterday", pickupBy: "Done",
    ngo: "Akshaya Patra", urgent: false,
  },
];

const CAT_STYLE = {
  "Cooked Meal": { color: "#FF6B2B", bg: "#FFF0EB", icon: "food-fork-drink" },
  "Bakery": { color: "#F59E0B", bg: "#FFF8EB", icon: "bread-slice-outline" },
  "Produce": { color: "#2D6A4F", bg: "#EAF5EF", icon: "leaf" },
};

function DonationCard({ item, index }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(28)).current;
  const sc = STATUS_CONFIG[item.status] || STATUS_CONFIG.Waiting;
  const cat = CAT_STYLE[item.category] || { color: COLORS.primary, bg: "#FFF0EB", icon: "food-variant" };

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, delay: index * 80, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 400, delay: index * 80, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleCancel = () =>
    Alert.alert("Cancel Donation", `Cancel "${item.name}"?`, [
      { text: "Keep it", style: "cancel" },
      { text: "Cancel Donation", style: "destructive" },
    ]);

  return (
    <Animated.View style={[styles.card, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>

      {/* Urgent ribbon */}
      {item.urgent && (
        <View style={styles.urgentStrip}>
          <MaterialCommunityIcons name="clock-alert-outline" size={11} color="#fff" />
          <Text style={styles.urgentText}>Urgent pickup needed</Text>
        </View>
      )}

      {/* Top row */}
      <View style={styles.cardTop}>
        <View style={[styles.catIconWrap, { backgroundColor: cat.bg }]}>
          <MaterialCommunityIcons name={cat.icon} size={24} color={cat.color} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.foodName}>{item.name}</Text>
          <View style={styles.metaRow}>
            <MaterialCommunityIcons name="weight-kilogram" size={12} color={COLORS.grayText} />
            <Text style={styles.metaText}>{item.quantity}</Text>
            <View style={styles.metaDot} />
            <Text style={styles.metaText}>{item.category}</Text>
          </View>
        </View>
        <View style={[styles.statusPill, { backgroundColor: sc.bg }]}>
          <MaterialCommunityIcons name={sc.icon} size={13} color={sc.color} />
          <Text style={[styles.statusText, { color: sc.color }]}>{item.status}</Text>
        </View>
      </View>

      {/* Progress stepper */}
      <View style={styles.stepper}>
        {STEPS.map((s, i) => {
          const done = i < sc.step;
          const current = i === sc.step;
          return (
            <View key={s} style={styles.stepCol}>
              <View style={[styles.stepDot,
              done && { backgroundColor: COLORS.success, borderColor: COLORS.success },
              current && { backgroundColor: sc.color, borderColor: sc.color },
              ]}>
                {done && <MaterialCommunityIcons name="check" size={9} color="#fff" />}
              </View>
              <Text style={[styles.stepLabel,
              (done || current) && { color: done ? COLORS.success : sc.color, fontWeight: "700" },
              ]}>{s}</Text>
              {i < STEPS.length - 1 && (
                <View style={[styles.stepLine, done && { backgroundColor: COLORS.success }]} />
              )}
            </View>
          );
        })}
      </View>

      {/* Info strip */}
      <View style={styles.infoStrip}>
        <View style={styles.infoChip}>
          <MaterialCommunityIcons name="clock-outline" size={13} color={COLORS.primary} />
          <Text style={styles.infoChipText}>By {item.pickupBy}</Text>
        </View>
        {item.ngo ? (
          <View style={styles.infoChip}>
            <MaterialCommunityIcons name="domain" size={13} color={COLORS.success} />
            <Text style={[styles.infoChipText, { color: COLORS.success }]}>{item.ngo}</Text>
          </View>
        ) : (
          <View style={styles.infoChip}>
            <MaterialCommunityIcons name="magnify" size={13} color={COLORS.grayText} />
            <Text style={styles.infoChipText}>Awaiting NGO</Text>
          </View>
        )}
      </View>

      {/* Actions */}
      {item.status !== "Collected" && (
        <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel} activeOpacity={0.8}>
          <MaterialCommunityIcons name="close-circle-outline" size={15} color="#EF4444" />
          <Text style={styles.cancelBtnText}>Cancel Donation</Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
}

export default function ActiveDonations() {
  const [filter, setFilter] = useState("All");
  const FILTERS = ["All", "Waiting", "Scheduled", "En Route", "Collected"];
  const filtered = filter === "All" ? DONATIONS : DONATIONS.filter(d => d.status === filter);

  const summary = [
    {
      label: "Active", icon: "timer-sand",
      value: DONATIONS.filter(d => d.status !== "Collected").length,
      color: "#FF6B2B", cardBg: "rgba(255,255,255,0.18)", iconBg: "rgba(255,107,43,0.25)",
    },
    {
      label: "Collected", icon: "check-circle-outline",
      value: DONATIONS.filter(d => d.status === "Collected").length,
      color: "#74C69D", cardBg: "rgba(255,255,255,0.18)", iconBg: "rgba(116,198,157,0.25)",
    },
    {
      label: "Total", icon: "view-list-outline",
      value: DONATIONS.length,
      color: "#fff", cardBg: "rgba(255,255,255,0.12)", iconBg: "rgba(255,255,255,0.2)",
    },
  ];

  return (
    <View style={styles.root}>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerBlob} />
        <View style={styles.headerBlob2} />

        {/* Title row */}
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerLabel}>Donor Dashboard</Text>
            <Text style={styles.headerTitle}>Active Donations</Text>
          </View>
          {/* Live indicator */}
          <View style={styles.livePill}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>Live</Text>
          </View>
        </View>

        {/* Summary cards — horizontal strip */}
        <View style={styles.summaryRow}>
          {summary.map((s, i) => (
            <View key={s.label} style={[styles.summaryCard, { backgroundColor: s.cardBg }]}>
              <View style={[styles.summaryIconWrap, { backgroundColor: s.iconBg }]}>
                <MaterialCommunityIcons name={s.icon} size={16} color={s.color} />
              </View>
              <Text style={[styles.summaryNum, { color: s.color }]}>{s.value}</Text>
              <Text style={styles.summaryLabel}>{s.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Filter chips */}
      <View style={styles.filtersWrap}>
        <FlatList
          data={FILTERS}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 18, gap: 8 }}
          keyExtractor={f => f}
          renderItem={({ item: f }) => (
            <TouchableOpacity
              style={[styles.filterChip, filter === f && styles.filterChipActive]}
              onPress={() => setFilter(f)}
              activeOpacity={0.8}
            >
              <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={d => d.id}
        contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 100, paddingTop: 6 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => <DonationCard item={item} index={index} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <MaterialCommunityIcons name="inbox-outline" size={52} color={COLORS.grayText} />
            <Text style={styles.emptyTitle}>No donations here</Text>
            <Text style={styles.emptySub}>Try a different filter</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F5F0EB" },

  header: {
    backgroundColor: COLORS.primary, paddingTop: Platform.OS === "ios" ? 58 : 44,
    paddingHorizontal: 22, paddingBottom: 26, overflow: "hidden",
    borderBottomLeftRadius: 28, borderBottomRightRadius: 28, marginBottom: 14,
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.28, shadowRadius: 16, elevation: 10,
  },
  headerBlob: { position: "absolute", width: 180, height: 180, borderRadius: 90, backgroundColor: "#fff", opacity: 0.06, top: -50, right: -40 },
  headerLabel: { fontSize: 11, fontWeight: "600", color: "rgba(255,255,255,0.55)", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 4 },
  headerTitle: { fontSize: 26, fontWeight: "800", color: "#fff", letterSpacing: -0.5, marginBottom: 18 },
  summaryRow: { flexDirection: "row", gap: 10 },
  summaryPill: { flex: 1, backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 14, borderWidth: 1, paddingVertical: 10, alignItems: "center" },
  summaryNum: { fontSize: 20, fontWeight: "800", marginBottom: 2 },
  summaryLabel: { fontSize: 10, color: "rgba(255,255,255,0.7)", fontWeight: "600" },

  filtersWrap: { paddingVertical: 12 },
  filterChip: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 9999, backgroundColor: "#fff", borderWidth: 1.5, borderColor: "#E5E7EB" },
  filterChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  filterText: { fontSize: 13, fontWeight: "600", color: COLORS.grayText },
  filterTextActive: { color: "#fff", fontWeight: "800" },

  card: {
    backgroundColor: "#fff", borderRadius: 22, marginBottom: 14,
    shadowColor: "#000", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.07, shadowRadius: 12, elevation: 3,
    overflow: "hidden",
  },
  urgentStrip: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "#F59E0B", paddingVertical: 6, paddingHorizontal: 14 },
  urgentText: { fontSize: 11, fontWeight: "800", color: "#fff" },

  cardTop: { flexDirection: "row", alignItems: "center", gap: 12, padding: 16, paddingBottom: 12 },
  catIconWrap: { width: 50, height: 50, borderRadius: 16, justifyContent: "center", alignItems: "center" },
  foodName: { fontSize: 16, fontWeight: "800", color: COLORS.textDark, letterSpacing: -0.2, marginBottom: 5 },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  metaText: { fontSize: 12, color: COLORS.grayText, fontWeight: "500" },
  metaDot: { width: 3, height: 3, borderRadius: 2, backgroundColor: COLORS.grayText },
  statusPill: { flexDirection: "row", alignItems: "center", gap: 4, paddingVertical: 6, paddingHorizontal: 10, borderRadius: 10 },
  statusText: { fontSize: 11, fontWeight: "800" },

  stepper: { flexDirection: "row", paddingHorizontal: 16, paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: "#F3F3F7" },
  stepCol: { flex: 1, alignItems: "center", position: "relative" },
  stepDot: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: "#E5E7EB", backgroundColor: "#F5F5F8", justifyContent: "center", alignItems: "center", marginBottom: 5 },
  stepLabel: { fontSize: 9, color: COLORS.grayText, fontWeight: "600", textAlign: "center" },
  stepLine: { position: "absolute", top: 10, left: "60%", right: "-40%", height: 2, backgroundColor: "#E5E7EB", zIndex: -1 },

  infoStrip: { flexDirection: "row", gap: 10, paddingHorizontal: 16, paddingVertical: 12 },
  infoChip: { flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: "#F7F7FA", paddingVertical: 6, paddingHorizontal: 10, borderRadius: 9 },
  infoChipText: { fontSize: 12, fontWeight: "600", color: COLORS.grayText },

  cancelBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, marginHorizontal: 16, marginBottom: 14, paddingVertical: 10, borderRadius: 12, backgroundColor: "#FEF2F2", borderWidth: 1, borderColor: "#FECACA" },
  cancelBtnText: { fontSize: 13, fontWeight: "700", color: "#EF4444" },

  empty: { alignItems: "center", paddingVertical: 60, gap: 10 },
  emptyTitle: { fontSize: 16, fontWeight: "800", color: COLORS.textDark },
  emptySub: { fontSize: 13, color: COLORS.grayText },
});