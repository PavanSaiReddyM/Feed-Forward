


import {
    StyleSheet, Text, View, FlatList,
    TouchableOpacity, ScrollView,
} from "react-native";
import { useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../../_constants/colors";

const donations = [
    {
        id: "1", name: "Rice & Curry", quantity: "10kg", location: "Hyderabad",
        donor: "ABC Restaurant", distance: "1.2 km",
        expiryMins: 90, category: "Cooked", tag: "Veg",
    },
    {
        id: "2", name: "Bread Packets", quantity: "20 pcs", location: "Secunderabad",
        donor: "Fresh Bakery", distance: "2.8 km",
        expiryMins: 300, category: "Bakery", tag: "Veg",
    },
    {
        id: "3", name: "Chicken Biryani", quantity: "8kg", location: "Banjara Hills",
        donor: "Spice Garden", distance: "3.1 km",
        expiryMins: 45, category: "Cooked", tag: "Non-Veg",
    },
    {
        id: "4", name: "Fresh Vegetables", quantity: "15kg", location: "Jubilee Hills",
        donor: "Green Market", distance: "4.5 km",
        expiryMins: 720, category: "Raw", tag: "Veg",
    },
];

const filters = ["All", "Veg", "Non-Veg", "< 5km", "Urgent"];

function getUrgency(mins) {
    if (mins <= 60) return { color: COLORS.error, label: `${mins}m left`, level: "critical" };
    if (mins <= 180) return { color: COLORS.warning, label: `${Math.floor(mins / 60)}h ${mins % 60}m`, level: "soon" };
    return { color: COLORS.success, label: `${Math.floor(mins / 60)}h ${mins % 60}m`, level: "safe" };
}

function FoodCard({ item }) {
    const urgency = getUrgency(item.expiryMins);
    const isCritical = urgency.level === "critical";

    return (
        <View style={[styles.card, isCritical && styles.cardCritical]}>
            {/* Left urgency bar */}
            <View style={[styles.urgencyBar, { backgroundColor: urgency.color }]} />

            <View style={styles.cardBody}>
                {/* Top row */}
                <View style={styles.cardTop}>
                    <View style={styles.iconCircle}>
                        <MaterialCommunityIcons name="food-variant" size={22} color={COLORS.primary} />
                    </View>
                    <View style={styles.cardTopRight}>
                        <View style={[styles.tagPill, { backgroundColor: item.tag === "Veg" ? COLORS.successLight : COLORS.errorLight }]}>
                            <View style={[styles.tagDot, { backgroundColor: item.tag === "Veg" ? COLORS.success : COLORS.error }]} />
                            <Text style={[styles.tagText, { color: item.tag === "Veg" ? COLORS.success : COLORS.error }]}>{item.tag}</Text>
                        </View>
                        <View style={styles.distPill}>
                            <MaterialCommunityIcons name="map-marker" size={11} color={COLORS.accentBlue} />
                            <Text style={styles.distText}>{item.distance}</Text>
                        </View>
                    </View>
                </View>

                {/* Food name */}
                <Text style={styles.foodName}>{item.name}</Text>

                {/* Info row */}
                <View style={styles.infoRow}>
                    <View style={styles.infoItem}>
                        <MaterialCommunityIcons name="weight-kilogram" size={14} color={COLORS.grayText} />
                        <Text style={styles.infoText}>{item.quantity}</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <MaterialCommunityIcons name="store" size={14} color={COLORS.grayText} />
                        <Text style={styles.infoText}>{item.donor}</Text>
                    </View>
                </View>

                {/* Bottom row */}
                <View style={styles.cardBottom}>
                    {/* Expiry */}
                    <View style={[styles.expiryBadge, { backgroundColor: urgency.color + "15" }]}>
                        {isCritical && <MaterialCommunityIcons name="clock-alert-outline" size={14} color={urgency.color} />}
                        {!isCritical && <MaterialCommunityIcons name="clock-outline" size={14} color={urgency.color} />}
                        <Text style={[styles.expiryText, { color: urgency.color }]}>
                            {isCritical ? "⚡ " : ""}{urgency.label} left
                        </Text>
                    </View>

                    {/* Request CTA */}
                    <TouchableOpacity
                        style={[styles.requestBtn, isCritical && styles.requestBtnUrgent]}
                        activeOpacity={0.85}
                    >
                        <MaterialCommunityIcons name="hand-heart" size={15} color={COLORS.white} />
                        <Text style={styles.requestText}>Request</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

export default function AvailableFood() {
    const [activeFilter, setActiveFilter] = useState("All");

    const filtered = donations.filter((d) => {
        if (activeFilter === "All") return true;
        if (activeFilter === "Veg") return d.tag === "Veg";
        if (activeFilter === "Non-Veg") return d.tag === "Non-Veg";
        if (activeFilter === "< 5km") return parseFloat(d.distance) < 5;
        if (activeFilter === "Urgent") return d.expiryMins <= 180;
        return true;
    });

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>Available Food</Text>
                    <Text style={styles.subtitle}>{filtered.length} donations near you</Text>
                </View>
                <TouchableOpacity style={styles.mapBtn}>
                    <MaterialCommunityIcons name="map-outline" size={20} color={COLORS.primary} />
                </TouchableOpacity>
            </View>

            {/* Filter chips */}
            <ScrollView
                horizontal showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filtersRow}
                style={styles.filtersScroll}
            >
                {filters.map((f) => (
                    <TouchableOpacity
                        key={f}
                        style={[styles.filterChip, activeFilter === f && styles.filterChipActive]}
                        onPress={() => setActiveFilter(f)}
                    >
                        {f === "Urgent" && (
                            <MaterialCommunityIcons name="clock-alert" size={13} color={activeFilter === f ? COLORS.white : COLORS.error} />
                        )}
                        <Text style={[styles.filterText, activeFilter === f && styles.filterTextActive]}>{f}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* List */}
            <FlatList
                data={filtered}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <FoodCard item={item} />}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyEmoji}>🍽️</Text>
                        <Text style={styles.emptyTitle}>No donations found</Text>
                        <Text style={styles.emptySubtitle}>Try adjusting your filters</Text>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.bg },
    header: {
        flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end",
        paddingHorizontal: 22, paddingTop: 60, paddingBottom: 16,
    },
    title: { fontSize: 26, fontWeight: "800", color: COLORS.textDark, letterSpacing: -0.3 },
    subtitle: { fontSize: 13, color: COLORS.grayText, marginTop: 3 },
    mapBtn: {
        width: 44, height: 44, borderRadius: 14,
        backgroundColor: COLORS.white,
        justifyContent: "center", alignItems: "center",
        borderWidth: 1.5, borderColor: COLORS.primary + "30",
        shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 6, elevation: 2,
    },
    filtersScroll: { maxHeight: 52 },
    filtersRow: { paddingHorizontal: 22, paddingBottom: 4, gap: 8, alignItems: "center" },
    filterChip: {
        flexDirection: "row", alignItems: "center", gap: 5,
        paddingVertical: 8, paddingHorizontal: 16,
        borderRadius: 9999, backgroundColor: COLORS.white,
        borderWidth: 1.5, borderColor: COLORS.border,
    },
    filterChipActive: {
        backgroundColor: COLORS.primary, borderColor: COLORS.primary,
        shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8, elevation: 4,
    },
    filterText: { fontSize: 13, fontWeight: "700", color: COLORS.textMid },
    filterTextActive: { color: COLORS.white },
    listContent: { paddingHorizontal: 22, paddingTop: 12, paddingBottom: 24 },
    card: {
        backgroundColor: COLORS.white,
        borderRadius: 20, marginBottom: 14,
        flexDirection: "row", overflow: "hidden",
        shadowColor: "#000", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.08, shadowRadius: 10, elevation: 3,
    },
    cardCritical: {
        shadowColor: COLORS.error, shadowOpacity: 0.15,
    },
    urgencyBar: { width: 5 },
    cardBody: { flex: 1, padding: 16 },
    cardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
    iconCircle: {
        width: 44, height: 44, borderRadius: 14,
        backgroundColor: COLORS.peach, justifyContent: "center", alignItems: "center",
    },
    cardTopRight: { flexDirection: "row", gap: 8, alignItems: "center" },
    tagPill: {
        flexDirection: "row", alignItems: "center", gap: 4,
        paddingVertical: 4, paddingHorizontal: 8, borderRadius: 9999,
    },
    tagDot: { width: 6, height: 6, borderRadius: 3 },
    tagText: { fontSize: 11, fontWeight: "700" },
    distPill: {
        flexDirection: "row", alignItems: "center", gap: 3,
        backgroundColor: COLORS.accentBlueLight,
        paddingVertical: 4, paddingHorizontal: 8, borderRadius: 9999,
    },
    distText: { fontSize: 11, fontWeight: "700", color: COLORS.accentBlue },
    foodName: { fontSize: 18, fontWeight: "800", color: COLORS.textDark, letterSpacing: -0.2, marginBottom: 8 },
    infoRow: { flexDirection: "row", gap: 16, marginBottom: 12 },
    infoItem: { flexDirection: "row", alignItems: "center", gap: 5 },
    infoText: { fontSize: 13, color: COLORS.grayText, fontWeight: "500" },
    cardBottom: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    expiryBadge: {
        flexDirection: "row", alignItems: "center", gap: 5,
        paddingVertical: 6, paddingHorizontal: 10, borderRadius: 9999,
    },
    expiryText: { fontSize: 12, fontWeight: "800" },
    requestBtn: {
        flexDirection: "row", alignItems: "center", gap: 6,
        backgroundColor: COLORS.primary,
        paddingVertical: 10, paddingHorizontal: 16, borderRadius: 12,
        shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8, elevation: 4,
    },
    requestBtnUrgent: { backgroundColor: COLORS.error, shadowColor: COLORS.error },
    requestText: { color: COLORS.white, fontWeight: "800", fontSize: 13 },
    emptyState: { alignItems: "center", paddingVertical: 60 },
    emptyEmoji: { fontSize: 48, marginBottom: 16 },
    emptyTitle: { fontSize: 18, fontWeight: "800", color: COLORS.textDark, marginBottom: 6 },
    emptySubtitle: { fontSize: 14, color: COLORS.grayText },
});