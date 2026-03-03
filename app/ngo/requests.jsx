



import {
    StyleSheet, Text, View, FlatList,
    TouchableOpacity, Animated,
} from "react-native";
import { useState, useRef } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../../_constants/colors";

const requests = [
    {
        id: "1", food: "Rice & Curry", donor: "ABC Restaurant",
        status: "Pending", quantity: "10kg", requestedOn: "12 Feb 2026",
        steps: 1,
    },
    {
        id: "2", food: "Bread Packets", donor: "Fresh Bakery",
        status: "Approved", quantity: "20 pcs", requestedOn: "11 Feb 2026",
        steps: 2,
    },
    {
        id: "3", food: "Fresh Vegetables", donor: "Green Market",
        status: "In Transit", quantity: "15kg", requestedOn: "10 Feb 2026",
        steps: 3,
    },
    {
        id: "4", food: "Veg Biryani", donor: "Royal Hotel",
        status: "Completed", quantity: "25kg", requestedOn: "8 Feb 2026",
        steps: 4,
    },
];

const STATUS_CONFIG = {
    Pending: { icon: "clock-outline", color: COLORS.warning, bg: COLORS.warningLight },
    Approved: { icon: "check-circle-outline", color: COLORS.accentBlue, bg: COLORS.accentBlueLight },
    "In Transit": { icon: "truck-delivery-outline", color: COLORS.primary, bg: COLORS.primaryGlow },
    Completed: { icon: "checkbox-marked-circle-outline", color: COLORS.success, bg: COLORS.successLight },
};

const TABS = ["All", "Pending", "Approved", "Completed"];

const TIMELINE_STEPS = [
    { icon: "clipboard-plus-outline", label: "Posted" },
    { icon: "check-circle-outline", label: "Approved" },
    { icon: "truck-delivery-outline", label: "In Transit" },
    { icon: "package-variant-closed-check", label: "Collected" },
];

function TimelineTracker({ currentStep }) {
    return (
        <View style={styles.timelineWrap}>
            {TIMELINE_STEPS.map((step, i) => {
                const done = i < currentStep;
                const active = i === currentStep - 1;
                return (
                    <View key={i} style={styles.timelineStep}>
                        <View
                            style={[
                                styles.timelineCircle,
                                done && styles.timelineCircleDone,
                                active && styles.timelineCircleActive,
                            ]}
                        >
                            <MaterialCommunityIcons
                                name={step.icon}
                                size={13}
                                color={done || active ? COLORS.white : COLORS.placeholder}
                            />
                        </View>
                        <Text style={[styles.timelineLabel, (done || active) && styles.timelineLabelActive]}>
                            {step.label}
                        </Text>
                        {i < TIMELINE_STEPS.length - 1 && (
                            <View style={[styles.timelineLine, done && styles.timelineLineDone]} />
                        )}
                    </View>
                );
            })}
        </View>
    );
}

function RequestCard({ item }) {
    const cfg = STATUS_CONFIG[item.status] || STATUS_CONFIG.Pending;
    const isCompleted = item.status === "Completed";
    const isApproved = item.status === "Approved";
    const isTransit = item.status === "In Transit";

    return (
        <View style={[styles.card, isCompleted && styles.cardCompleted]}>
            {/* Header */}
            <View style={styles.cardHeader}>
                <View style={[styles.foodIcon, { backgroundColor: cfg.bg }]}>
                    <MaterialCommunityIcons name="food" size={22} color={cfg.color} />
                </View>
                <View style={styles.foodInfo}>
                    <Text style={styles.foodName}>{item.food}</Text>
                    <Text style={styles.foodQty}>{item.quantity}</Text>
                </View>
                <View style={[styles.statusChip, { backgroundColor: cfg.bg }]}>
                    <MaterialCommunityIcons name={cfg.icon} size={13} color={cfg.color} />
                    <Text style={[styles.statusText, { color: cfg.color }]}>{item.status}</Text>
                </View>
            </View>

            <View style={styles.divider} />

            {/* Info */}
            <View style={styles.infoRow}>
                <View style={styles.infoItem}>
                    <MaterialCommunityIcons name="store" size={14} color={COLORS.grayText} />
                    <Text style={styles.infoText}>{item.donor}</Text>
                </View>
                <View style={styles.infoItem}>
                    <MaterialCommunityIcons name="calendar-outline" size={14} color={COLORS.grayText} />
                    <Text style={styles.infoText}>{item.requestedOn}</Text>
                </View>
            </View>

            {/* Timeline tracker */}
            <TimelineTracker currentStep={item.steps} />

            {/* Action row */}
            {(isApproved || isTransit) && (
                <View style={styles.actionRow}>
                    <TouchableOpacity style={styles.navigateBtn}>
                        <MaterialCommunityIcons name="map-marker-radius-outline" size={16} color={COLORS.white} />
                        <Text style={styles.navigateBtnText}>Navigate to Pickup</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.cancelBtn}>
                        <MaterialCommunityIcons name="close" size={16} color={COLORS.error} />
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

export default function Requests() {
    const [activeTab, setActiveTab] = useState("All");
    const indicatorX = useRef(new Animated.Value(0)).current;

    const filtered = requests.filter((r) => {
        if (activeTab === "All") return true;
        if (activeTab === "Completed") return r.status === "Completed";
        return r.status === activeTab;
    });

    const handleTabChange = (tab, index) => {
        setActiveTab(tab);
        Animated.spring(indicatorX, {
            toValue: index * (100 / TABS.length),
            tension: 60, friction: 10, useNativeDriver: false,
        }).start();
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>My Requests</Text>
                <Text style={styles.subtitle}>Track your food requests</Text>
            </View>

            {/* Tabs */}
            <View style={styles.tabsWrap}>
                <View style={styles.tabs}>
                    {TABS.map((tab, i) => (
                        <TouchableOpacity
                            key={tab}
                            style={styles.tab}
                            onPress={() => handleTabChange(tab, i)}
                        >
                            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <Animated.View
                    style={[
                        styles.tabIndicator,
                        { left: indicatorX.interpolate({ inputRange: [0, 100], outputRange: ["0%", "100%"] }) },
                    ]}
                />
            </View>

            {/* List */}
            <FlatList
                data={filtered}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <RequestCard item={item} />}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyEmoji}>📋</Text>
                        <Text style={styles.emptyTitle}>No requests here</Text>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.bg },
    header: { paddingHorizontal: 22, paddingTop: 60, paddingBottom: 16 },
    title: { fontSize: 26, fontWeight: "800", color: COLORS.textDark, letterSpacing: -0.3 },
    subtitle: { fontSize: 13, color: COLORS.grayText, marginTop: 3 },
    tabsWrap: {
        marginHorizontal: 22, marginBottom: 16,
        backgroundColor: COLORS.white, borderRadius: 14,
        overflow: "hidden",
        shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
    },
    tabs: { flexDirection: "row" },
    tab: { flex: 1, paddingVertical: 12, alignItems: "center" },
    tabText: { fontSize: 12, fontWeight: "700", color: COLORS.grayText },
    tabTextActive: { color: COLORS.primary },
    tabIndicator: {
        position: "absolute", bottom: 0,
        width: `${100 / TABS.length}%`, height: 3,
        backgroundColor: COLORS.primary, borderRadius: 2,
    },
    listContent: { paddingHorizontal: 22, paddingBottom: 24 },
    card: {
        backgroundColor: COLORS.white, borderRadius: 20, marginBottom: 14, padding: 18,
        shadowColor: "#000", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.08, shadowRadius: 10, elevation: 3,
    },
    cardCompleted: { opacity: 0.75 },
    cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 14 },
    foodIcon: { width: 48, height: 48, borderRadius: 14, justifyContent: "center", alignItems: "center", marginRight: 12 },
    foodInfo: { flex: 1 },
    foodName: { fontSize: 16, fontWeight: "800", color: COLORS.textDark, marginBottom: 2 },
    foodQty: { fontSize: 13, color: COLORS.grayText, fontWeight: "600" },
    statusChip: {
        flexDirection: "row", alignItems: "center", gap: 4,
        paddingVertical: 5, paddingHorizontal: 10, borderRadius: 9999,
    },
    statusText: { fontSize: 11, fontWeight: "800" },
    divider: { height: 1, backgroundColor: "#F5F5F5", marginBottom: 12 },
    infoRow: { flexDirection: "row", gap: 20, marginBottom: 14 },
    infoItem: { flexDirection: "row", alignItems: "center", gap: 6 },
    infoText: { fontSize: 13, color: COLORS.grayText, fontWeight: "500" },
    timelineWrap: { flexDirection: "row", alignItems: "flex-start", marginBottom: 14 },
    timelineStep: { flex: 1, alignItems: "center", position: "relative" },
    timelineCircle: {
        width: 28, height: 28, borderRadius: 14,
        backgroundColor: "#EBEBF0", justifyContent: "center", alignItems: "center",
        marginBottom: 4,
    },
    timelineCircleDone: { backgroundColor: COLORS.success },
    timelineCircleActive: { backgroundColor: COLORS.primary },
    timelineLabel: { fontSize: 9, color: COLORS.placeholder, fontWeight: "700", textAlign: "center" },
    timelineLabelActive: { color: COLORS.primary },
    timelineLine: {
        position: "absolute", top: 13, right: "-50%",
        width: "100%", height: 2, backgroundColor: "#EBEBF0",
    },
    timelineLineDone: { backgroundColor: COLORS.success },
    actionRow: { flexDirection: "row", gap: 10, marginTop: 4 },
    navigateBtn: {
        flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center",
        gap: 8, backgroundColor: COLORS.accentBlue,
        paddingVertical: 12, borderRadius: 12,
        shadowColor: COLORS.accentBlue, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.22, shadowRadius: 8, elevation: 4,
    },
    navigateBtnText: { color: COLORS.white, fontWeight: "800", fontSize: 14 },
    cancelBtn: {
        width: 44, height: 44, borderRadius: 12,
        backgroundColor: COLORS.errorLight,
        justifyContent: "center", alignItems: "center",
    },
    emptyState: { alignItems: "center", paddingVertical: 60 },
    emptyEmoji: { fontSize: 48, marginBottom: 12 },
    emptyTitle: { fontSize: 17, fontWeight: "800", color: COLORS.textDark },
});