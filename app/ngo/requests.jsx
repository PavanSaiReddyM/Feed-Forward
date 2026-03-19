import {
    StyleSheet, Text, View, FlatList,
    TouchableOpacity, Animated, Platform, Alert,
} from "react-native";
import { useRef, useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../../_constants/colors";

const REQUESTS = [
    {
        id: "1", food: "Dal Makhani & Roti", donor: "Moti Mahal Restaurant", qty: "12 kg",
        category: "Cooked Meal", date: "Mar 19, 2026", deadline: "5:00 PM today",
        status: "Approved", location: "Connaught Place, Delhi",
        donorLocation: { latitude: 28.6315, longitude: 77.2167 },
    },
    {
        id: "2", food: "Fresh Bread Loaves", donor: "Delhi Bakers", qty: "20 pcs",
        category: "Bakery", date: "Mar 19, 2026", deadline: "6:00 PM today",
        status: "Pending", location: "Karol Bagh, Delhi",
        donorLocation: { latitude: 28.6519, longitude: 77.1909 },
    },
    {
        id: "3", food: "Mixed Vegetables", donor: "INA Sabzi Wala", qty: "8 kg",
        category: "Produce", date: "Mar 18, 2026", deadline: "Completed",
        status: "Collected", location: "INA Market, Delhi",
        donorLocation: { latitude: 28.5733, longitude: 77.2090 },
    },
    {
        id: "4", food: "Biryani (Event Pack)", donor: "Spice Route Caterers", qty: "15 kg",
        category: "Cooked Meal", date: "Mar 18, 2026", deadline: "Expired",
        status: "Cancelled", location: "Lajpat Nagar, Delhi",
        donorLocation: { latitude: 28.5677, longitude: 77.2433 },
    },
];

const STATUS_CFG = {
    Pending: { color: "#F59E0B", bg: "#FFF8EB", icon: "clock-outline", label: "Pending Approval" },
    Approved: { color: "#2B7FFF", bg: "#EBF2FF", icon: "check-circle-outline", label: "Approved" },
    Collected: { color: "#2D6A4F", bg: "#EAF5EF", icon: "package-variant-closed", label: "Collected" },
    Cancelled: { color: "#EF4444", bg: "#FEF2F2", icon: "close-circle-outline", label: "Cancelled" },
};

const CAT_STYLE = {
    "Cooked Meal": { color: "#FF6B2B", bg: "#FFF0EB", icon: "food-fork-drink" },
    "Bakery": { color: "#F59E0B", bg: "#FFF8EB", icon: "bread-slice-outline" },
    "Produce": { color: "#2D6A4F", bg: "#EAF5EF", icon: "leaf" },
};

const FILTERS = ["All", "Pending", "Approved", "Collected", "Cancelled"];

function RequestCard({ item, index }) {
    const router = useRouter();
    const fade = useRef(new Animated.Value(0)).current;
    const slide = useRef(new Animated.Value(24)).current;
    const sc = STATUS_CFG[item.status];
    const cat = CAT_STYLE[item.category] || { color: COLORS.primary, bg: "#FFF0EB", icon: "food-variant" };

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fade, { toValue: 1, duration: 400, delay: index * 80, useNativeDriver: true }),
            Animated.timing(slide, { toValue: 0, duration: 400, delay: index * 80, useNativeDriver: true }),
        ]).start();
    }, []);

    const handleCancel = () =>
        Alert.alert("Cancel Request", `Cancel your request for "${item.food}"?`, [
            { text: "Keep it", style: "cancel" },
            { text: "Cancel", style: "destructive" },
        ]);

    const navigateToMap = () =>
        router.push({
            pathname: "/ngo/pickup-map",
            params: {
                pickupId: item.id, foodName: item.food, donor: item.donor,
                address: item.location, deadline: item.deadline,
                latitude: item.donorLocation.latitude, longitude: item.donorLocation.longitude,
            },
        });

    return (
        <Animated.View style={[styles.card, { opacity: fade, transform: [{ translateY: slide }] }]}>

            {/* Status accent bar */}
            <View style={[styles.accentBar, { backgroundColor: sc.color }]} />

            <View style={styles.cardBody}>
                {/* Top row */}
                <View style={styles.cardTop}>
                    <View style={[styles.catIcon, { backgroundColor: cat.bg }]}>
                        <MaterialCommunityIcons name={cat.icon} size={22} color={cat.color} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.foodName}>{item.food}</Text>
                        <View style={styles.metaRow}>
                            <MaterialCommunityIcons name="store-outline" size={12} color={COLORS.grayText} />
                            <Text style={styles.metaText}>{item.donor}</Text>
                        </View>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: sc.bg }]}>
                        <MaterialCommunityIcons name={sc.icon} size={12} color={sc.color} />
                        <Text style={[styles.statusText, { color: sc.color }]}>{item.status}</Text>
                    </View>
                </View>

                {/* Info grid */}
                <View style={styles.infoGrid}>
                    {[
                        { icon: "weight-kilogram", text: item.qty, color: COLORS.primary },
                        { icon: "tag-outline", text: item.category, color: COLORS.primary },
                        { icon: "map-marker-outline", text: item.location, color: "#7C3AED" },
                        { icon: "timer-outline", text: item.deadline, color: item.deadline === "Expired" ? "#EF4444" : "#F59E0B" },
                    ].map((info, i) => (
                        <View key={i} style={styles.infoChip}>
                            <MaterialCommunityIcons name={info.icon} size={12} color={info.color} />
                            <Text style={styles.infoText} numberOfLines={1}>{info.text}</Text>
                        </View>
                    ))}
                </View>

                {/* Actions */}
                {item.status === "Approved" && (
                    <View style={styles.actionRow}>
                        <TouchableOpacity style={styles.mapBtn} onPress={navigateToMap} activeOpacity={0.85}>
                            <MaterialCommunityIcons name="map-marker-radius-outline" size={16} color={COLORS.success} />
                            <Text style={styles.mapBtnText}>View on Map</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel} activeOpacity={0.8}>
                            <MaterialCommunityIcons name="close" size={14} color="#EF4444" />
                        </TouchableOpacity>
                    </View>
                )}
                {item.status === "Pending" && (
                    <View style={styles.actionRow}>
                        <View style={styles.waitingBanner}>
                            <MaterialCommunityIcons name="clock-outline" size={14} color="#F59E0B" />
                            <Text style={styles.waitingText}>Waiting for donor approval</Text>
                        </View>
                        <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel} activeOpacity={0.8}>
                            <MaterialCommunityIcons name="close" size={14} color="#EF4444" />
                        </TouchableOpacity>
                    </View>
                )}
                {item.status === "Collected" && (
                    <View style={styles.doneBanner}>
                        <MaterialCommunityIcons name="check-circle" size={15} color="#2D6A4F" />
                        <Text style={styles.doneText}>Pickup completed · {item.date}</Text>
                    </View>
                )}
            </View>
        </Animated.View>
    );
}

export default function Requests() {
    const [filter, setFilter] = useState("All");
    const filtered = filter === "All" ? REQUESTS : REQUESTS.filter(r => r.status === filter);

    const counts = {
        Pending: REQUESTS.filter(r => r.status === "Pending").length,
        Approved: REQUESTS.filter(r => r.status === "Approved").length,
        Collected: REQUESTS.filter(r => r.status === "Collected").length,
    };

    return (
        <View style={styles.root}>

            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerBlob} />
                <Text style={styles.headerLabel}>NGO Portal</Text>
                <Text style={styles.headerTitle}>My Requests</Text>

                {/* Stats */}
                <View style={styles.statsRow}>
                    {[
                        { label: "Pending", value: counts.Pending, color: "#F59E0B" },
                        { label: "Approved", value: counts.Approved, color: "#2B7FFF" },
                        { label: "Collected", value: counts.Collected, color: "#2D6A4F" },
                    ].map(s => (
                        <View key={s.label} style={styles.statPill}>
                            <Text style={[styles.statNum, { color: s.color }]}>{s.value}</Text>
                            <Text style={styles.statLabel}>{s.label}</Text>
                        </View>
                    ))}
                </View>
            </View>

            {/* Filter tabs */}
            <View style={styles.filterWrap}>
                <FlatList
                    data={FILTERS}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 18, gap: 8 }}
                    keyExtractor={f => f}
                    renderItem={({ item: f }) => (
                        <TouchableOpacity
                            style={[styles.filterChip, filter === f && styles.filterChipActive]}
                            onPress={() => setFilter(f)} activeOpacity={0.8}>
                            <Text style={[styles.filterChipText, filter === f && styles.filterChipTextActive]}>{f}</Text>
                        </TouchableOpacity>
                    )}
                />
            </View>

            {/* Cards */}
            <FlatList
                data={filtered}
                keyExtractor={r => r.id}
                contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 100, paddingTop: 6 }}
                showsVerticalScrollIndicator={false}
                renderItem={({ item, index }) => <RequestCard item={item} index={index} />}
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <MaterialCommunityIcons name="clipboard-list-outline" size={52} color={COLORS.grayText} />
                        <Text style={styles.emptyTitle}>No requests found</Text>
                        <Text style={styles.emptySub}>Browse Available Food to make a request</Text>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: "#F5F0EB" },

    header: {
        backgroundColor: "#2B7FFF", paddingTop: Platform.OS === "ios" ? 58 : 44,
        paddingHorizontal: 22, paddingBottom: 26, overflow: "hidden",
        borderBottomLeftRadius: 28, borderBottomRightRadius: 28, marginBottom: 14,
        shadowColor: "#2B7FFF", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.28, shadowRadius: 16, elevation: 10,
    },
    headerBlob: { position: "absolute", width: 180, height: 180, borderRadius: 90, backgroundColor: "#fff", opacity: 0.06, top: -50, right: -40 },
    headerLabel: { fontSize: 11, fontWeight: "600", color: "rgba(255,255,255,0.55)", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 4 },
    headerTitle: { fontSize: 26, fontWeight: "800", color: "#fff", letterSpacing: -0.5, marginBottom: 18 },
    statsRow: { flexDirection: "row", gap: 10 },
    statPill: { flex: 1, backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 14, paddingVertical: 10, alignItems: "center", gap: 3 },
    statNum: { fontSize: 20, fontWeight: "800" },
    statLabel: { fontSize: 10, color: "rgba(255,255,255,0.65)", fontWeight: "600" },

    filterWrap: { paddingVertical: 12 },
    filterChip: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 9999, backgroundColor: "#fff", borderWidth: 1.5, borderColor: "#E5E7EB" },
    filterChipActive: { backgroundColor: "#2B7FFF", borderColor: "#2B7FFF" },
    filterChipText: { fontSize: 13, fontWeight: "600", color: COLORS.grayText },
    filterChipTextActive: { color: "#fff", fontWeight: "800" },

    card: { backgroundColor: "#fff", borderRadius: 20, marginBottom: 14, flexDirection: "row", overflow: "hidden", shadowColor: "#000", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.07, shadowRadius: 10, elevation: 3 },
    accentBar: { width: 4 },
    cardBody: { flex: 1, padding: 16 },
    cardTop: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 12 },
    catIcon: { width: 44, height: 44, borderRadius: 13, justifyContent: "center", alignItems: "center" },
    foodName: { fontSize: 15, fontWeight: "800", color: COLORS.textDark, marginBottom: 3 },
    metaRow: { flexDirection: "row", alignItems: "center", gap: 5 },
    metaText: { fontSize: 12, color: COLORS.grayText, fontWeight: "500" },
    statusBadge: { flexDirection: "row", alignItems: "center", gap: 4, paddingVertical: 5, paddingHorizontal: 9, borderRadius: 9 },
    statusText: { fontSize: 11, fontWeight: "800" },

    infoGrid: { flexDirection: "row", flexWrap: "wrap", gap: 7, marginBottom: 12 },
    infoChip: { flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: "#F7F7FA", paddingVertical: 5, paddingHorizontal: 9, borderRadius: 8 },
    infoText: { fontSize: 11, color: COLORS.grayText, fontWeight: "600", maxWidth: 130 },

    actionRow: { flexDirection: "row", gap: 8, alignItems: "center" },
    mapBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, paddingVertical: 10, borderRadius: 12, backgroundColor: "#EAF5EF", borderWidth: 1, borderColor: COLORS.success + "30" },
    mapBtnText: { fontSize: 13, fontWeight: "800", color: COLORS.success },
    cancelBtn: { width: 38, height: 38, borderRadius: 11, backgroundColor: "#FEF2F2", justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: "#FECACA" },
    waitingBanner: { flex: 1, flexDirection: "row", alignItems: "center", gap: 7, backgroundColor: "#FFF8EB", paddingVertical: 9, paddingHorizontal: 12, borderRadius: 12 },
    waitingText: { fontSize: 12, fontWeight: "700", color: "#F59E0B" },
    doneBanner: { flexDirection: "row", alignItems: "center", gap: 7, backgroundColor: "#EAF5EF", paddingVertical: 9, paddingHorizontal: 12, borderRadius: 12 },
    doneText: { fontSize: 12, fontWeight: "700", color: "#2D6A4F" },

    empty: { alignItems: "center", paddingVertical: 60, gap: 10 },
    emptyTitle: { fontSize: 16, fontWeight: "800", color: COLORS.textDark },
    emptySub: { fontSize: 13, color: COLORS.grayText, textAlign: "center" },
});