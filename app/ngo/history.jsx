import {
    StyleSheet, Text, View, FlatList,
    TouchableOpacity, Animated, Platform,
} from "react-native";
import { useRef, useEffect, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../../_constants/colors";

const HISTORY = [
    {
        id: "1", food: "Vegetable Biryani", donor: "Royal Hotel Delhi", qty: "25 kg",
        category: "Cooked Meal", date: "Mar 15, 2026", people: 50, status: "Completed",
        pickupTime: "4:30 PM", location: "Connaught Place",
    },
    {
        id: "2", food: "Milk Packets", donor: "Dairy Farm Gurgaon", qty: "30 L",
        category: "Beverages", date: "Mar 12, 2026", people: 40, status: "Completed",
        pickupTime: "2:00 PM", location: "Karol Bagh",
    },
    {
        id: "3", food: "Fresh Bread", donor: "City Bakery", qty: "40 loaves",
        category: "Bakery", date: "Mar 10, 2026", people: 60, status: "Completed",
        pickupTime: "5:00 PM", location: "INA Market",
    },
    {
        id: "4", food: "Dal & Rice Pack", donor: "Spice Garden Caterers", qty: "18 kg",
        category: "Cooked Meal", date: "Mar 8, 2026", people: 36, status: "Completed",
        pickupTime: "3:15 PM", location: "Lajpat Nagar",
    },
    {
        id: "5", food: "Packaged Snacks", donor: "BigBasket Delhi", qty: "12 kg",
        category: "Packaged", date: "Mar 5, 2026", people: 30, status: "Missed",
        pickupTime: "—", location: "Dwarka",
    },
];

const CAT_STYLE = {
    "Cooked Meal": { color: "#FF6B2B", bg: "#FFF0EB", icon: "food-fork-drink" },
    "Bakery": { color: "#F59E0B", bg: "#FFF8EB", icon: "bread-slice-outline" },
    "Produce": { color: "#2D6A4F", bg: "#EAF5EF", icon: "leaf" },
    "Packaged": { color: "#2B7FFF", bg: "#EBF2FF", icon: "package-variant" },
    "Beverages": { color: "#7C3AED", bg: "#F3EEFF", icon: "cup-outline" },
};

const FILTERS = ["All", "Completed", "Missed"];

function HistoryCard({ item, index, isLast }) {
    const fade = useRef(new Animated.Value(0)).current;
    const slide = useRef(new Animated.Value(20)).current;
    const cat = CAT_STYLE[item.category] || { color: COLORS.primary, bg: "#FFF0EB", icon: "food-variant" };
    const done = item.status === "Completed";

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fade, { toValue: 1, duration: 380, delay: index * 70, useNativeDriver: true }),
            Animated.timing(slide, { toValue: 0, duration: 380, delay: index * 70, useNativeDriver: true }),
        ]).start();
    }, []);

    return (
        <Animated.View style={[styles.timelineRow, { opacity: fade, transform: [{ translateY: slide }] }]}>
            {/* Spine */}
            <View style={styles.spine}>
                <View style={[styles.spineDot, {
                    backgroundColor: done ? COLORS.success : "#EF4444",
                    borderColor: done ? "#D1FAE5" : "#FEE2E2",
                }]}>
                    <MaterialCommunityIcons name={done ? "check" : "close"} size={10} color="#fff" />
                </View>
                {!isLast && <View style={[styles.spineLine, { backgroundColor: done ? "#D1FAE5" : "#FEE2E2" }]} />}
            </View>

            {/* Card */}
            <View style={[styles.card, !done && styles.cardMissed]}>
                {/* Header */}
                <View style={styles.cardHead}>
                    <View style={[styles.catIcon, { backgroundColor: cat.bg }]}>
                        <MaterialCommunityIcons name={cat.icon} size={20} color={cat.color} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.foodName}>{item.food}</Text>
                        <Text style={styles.dateText}>{item.date}</Text>
                    </View>
                    <View style={[styles.badge, { backgroundColor: done ? "#EAF5EF" : "#FEF2F2" }]}>
                        <Text style={[styles.badgeText, { color: done ? "#2D6A4F" : "#EF4444" }]}>
                            {done ? "✓ Done" : "✗ Missed"}
                        </Text>
                    </View>
                </View>

                {/* Detail chips */}
                <View style={styles.chipRow}>
                    <View style={styles.chip}>
                        <MaterialCommunityIcons name="store-outline" size={12} color={COLORS.primary} />
                        <Text style={styles.chipText}>{item.donor}</Text>
                    </View>
                    <View style={styles.chip}>
                        <MaterialCommunityIcons name="weight-kilogram" size={12} color={COLORS.primary} />
                        <Text style={styles.chipText}>{item.qty}</Text>
                    </View>
                </View>

                <View style={styles.chipRow}>
                    <View style={styles.chip}>
                        <MaterialCommunityIcons name="map-marker-outline" size={12} color="#7C3AED" />
                        <Text style={[styles.chipText, { color: "#7C3AED" }]}>{item.location}</Text>
                    </View>
                    {done && (
                        <View style={styles.chip}>
                            <MaterialCommunityIcons name="clock-check-outline" size={12} color={COLORS.success} />
                            <Text style={[styles.chipText, { color: COLORS.success }]}>Picked up {item.pickupTime}</Text>
                        </View>
                    )}
                </View>

                {/* Impact bar */}
                {done && (
                    <View style={styles.impactBar}>
                        <MaterialCommunityIcons name="account-group-outline" size={14} color="#2B7FFF" />
                        <Text style={styles.impactText}>
                            Fed approximately <Text style={styles.impactNum}>{item.people} people</Text>
                        </Text>
                    </View>
                )}
            </View>
        </Animated.View>
    );
}

export default function History() {
    const [filter, setFilter] = useState("All");
    const filtered = filter === "All" ? HISTORY : HISTORY.filter(h => h.status === filter);

    const totalPeople = HISTORY.filter(h => h.status === "Completed").reduce((s, h) => s + h.people, 0);
    const totalCompleted = HISTORY.filter(h => h.status === "Completed").length;
    const successRate = Math.round((totalCompleted / HISTORY.length) * 100);

    return (
        <View style={styles.root}>

            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerBlob} />
                <Text style={styles.headerLabel}>NGO Impact</Text>
                <Text style={styles.headerTitle}>Pickup History</Text>

                {/* Impact metrics */}
                <View style={styles.metricsRow}>
                    <View style={styles.metricCard}>
                        <MaterialCommunityIcons name="package-variant-closed" size={18} color="#FF6B2B" />
                        <Text style={styles.metricNum}>{totalCompleted}</Text>
                        <Text style={styles.metricLabel}>Pickups</Text>
                    </View>
                    <View style={[styles.metricCard, styles.metricCardCenter]}>
                        <MaterialCommunityIcons name="account-group-outline" size={18} color="#fff" />
                        <Text style={[styles.metricNum, { color: "#fff" }]}>{totalPeople}</Text>
                        <Text style={[styles.metricLabel, { color: "rgba(255,255,255,0.7)" }]}>People Fed</Text>
                    </View>
                    <View style={styles.metricCard}>
                        <MaterialCommunityIcons name="check-decagram-outline" size={18} color="#74C69D" />
                        <Text style={[styles.metricNum, { color: "#74C69D" }]}>{successRate}%</Text>
                        <Text style={styles.metricLabel}>Success Rate</Text>
                    </View>
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

            {/* Timeline */}
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
                        <Text style={styles.emptySub}>Completed pickups will appear here</Text>
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
    metricsRow: { flexDirection: "row", gap: 10 },
    metricCard: { flex: 1, backgroundColor: "rgba(255,255,255,0.13)", borderRadius: 14, paddingVertical: 12, alignItems: "center", gap: 4 },
    metricCardCenter: { backgroundColor: "rgba(255,255,255,0.24)", transform: [{ scale: 1.03 }] },
    metricNum: { fontSize: 18, fontWeight: "800", color: "#fff" },
    metricLabel: { fontSize: 10, color: "rgba(255,255,255,0.65)", fontWeight: "600" },

    filterRow: { flexDirection: "row", paddingHorizontal: 18, gap: 10, paddingBottom: 10 },
    filterBtn: { paddingVertical: 8, paddingHorizontal: 20, borderRadius: 9999, backgroundColor: "#fff", borderWidth: 1.5, borderColor: "#E5E7EB" },
    filterBtnActive: { backgroundColor: COLORS.success, borderColor: COLORS.success },
    filterText: { fontSize: 13, fontWeight: "600", color: COLORS.grayText },
    filterTextActive: { color: "#fff", fontWeight: "800" },

    timelineRow: { flexDirection: "row", gap: 14, marginBottom: 16 },
    spine: { alignItems: "center", width: 22 },
    spineDot: { width: 22, height: 22, borderRadius: 11, borderWidth: 3, justifyContent: "center", alignItems: "center", zIndex: 1 },
    spineLine: { width: 2, flex: 1, marginTop: 4 },

    card: { flex: 1, backgroundColor: "#fff", borderRadius: 18, padding: 15, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
    cardMissed: { opacity: 0.72 },
    cardHead: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10 },
    catIcon: { width: 40, height: 40, borderRadius: 12, justifyContent: "center", alignItems: "center" },
    foodName: { fontSize: 14, fontWeight: "800", color: COLORS.textDark, marginBottom: 2 },
    dateText: { fontSize: 11, color: COLORS.grayText },
    badge: { paddingVertical: 4, paddingHorizontal: 9, borderRadius: 8 },
    badgeText: { fontSize: 11, fontWeight: "800" },
    chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 7, marginBottom: 7 },
    chip: { flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: "#F7F7FA", paddingVertical: 5, paddingHorizontal: 9, borderRadius: 8 },
    chipText: { fontSize: 11, fontWeight: "600", color: COLORS.grayText },
    impactBar: { flexDirection: "row", alignItems: "center", gap: 7, marginTop: 4, backgroundColor: "#EBF2FF", paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10 },
    impactText: { fontSize: 12, color: "#2B7FFF", fontWeight: "500" },
    impactNum: { fontWeight: "800" },

    empty: { alignItems: "center", paddingVertical: 60, gap: 10 },
    emptyTitle: { fontSize: 16, fontWeight: "800", color: COLORS.textDark },
    emptySub: { fontSize: 13, color: COLORS.grayText, textAlign: "center" },
});