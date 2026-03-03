


import {
    StyleSheet, Text, View, ScrollView, TouchableOpacity,
    Modal, FlatList, Animated,
} from "react-native";
import { useState, useRef } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../../_constants/colors";

const notifications = [
    { id: "1", title: "New NGO Registration", message: "Green Earth Foundation has requested verification.", time: "10 min ago", unread: true, icon: "office-building", color: COLORS.primary },
    { id: "2", title: "Large Donation Alert", message: "500kg of rice donated by Tech Corp.", time: "1 hour ago", unread: true, icon: "food-turkey", color: COLORS.success },
    { id: "3", title: "System Report Ready", message: "Weekly activity report is ready for review.", time: "5 hours ago", unread: false, icon: "file-chart", color: COLORS.accentBlue },
    { id: "4", title: "User Flagged", message: "Suspicious activity reported for User #1234.", time: "1 day ago", unread: false, icon: "alert-circle", color: COLORS.warning },
];

// Simple SVG-like sparkline using View bars
function Sparkline({ data, color }) {
    const max = Math.max(...data);
    return (
        <View style={styles.sparkline}>
            {data.map((v, i) => (
                <View key={i} style={styles.sparkBarWrap}>
                    <View style={[styles.sparkBar, { height: `${(v / max) * 100}%`, backgroundColor: color, opacity: i === data.length - 1 ? 1 : 0.45 + (i / data.length) * 0.55 }]} />
                </View>
            ))}
        </View>
    );
}

function TrendStatCard({ icon, number, label, color, trend, trendUp }) {
    return (
        <View style={[styles.statCard, { borderTopColor: color }]}>
            <View style={styles.statCardTop}>
                <View style={[styles.statIconWrap, { backgroundColor: color + "18" }]}>
                    <MaterialCommunityIcons name={icon} size={20} color={color} />
                </View>
                <View style={[styles.trendBadge, { backgroundColor: trendUp ? COLORS.successLight : COLORS.errorLight }]}>
                    <MaterialCommunityIcons
                        name={trendUp ? "trending-up" : "trending-down"}
                        size={12}
                        color={trendUp ? COLORS.success : COLORS.error}
                    />
                    <Text style={[styles.trendText, { color: trendUp ? COLORS.success : COLORS.error }]}>{trend}</Text>
                </View>
            </View>
            <Text style={styles.statNumber}>{number}</Text>
            <Text style={styles.statLabel}>{label}</Text>
        </View>
    );
}

function ActivityItem({ icon, title, time, color }) {
    return (
        <View style={styles.activityItem}>
            <View style={[styles.activityIcon, { backgroundColor: color + "18" }]}>
                <MaterialCommunityIcons name={icon} size={18} color={color} />
            </View>
            <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>{title}</Text>
                <Text style={styles.activityTime}>{time}</Text>
            </View>
        </View>
    );
}

export default function AdminHome() {
    const [showNotifications, setShowNotifications] = useState(false);
    const slideAnim = useRef(new Animated.Value(500)).current;

    const openNotifs = () => {
        setShowNotifications(true);
        Animated.spring(slideAnim, { toValue: 0, tension: 65, friction: 11, useNativeDriver: true }).start();
    };
    const closeNotifs = () => {
        Animated.timing(slideAnim, { toValue: 500, duration: 250, useNativeDriver: true }).start(() => setShowNotifications(false));
    };

    const weekData = [820, 1100, 760, 980, 1340, 1200, 1560];

    return (
        <View style={{ flex: 1 }}>
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

                {/* DARK HEADER */}
                <View style={styles.header}>
                    <View style={styles.headerBlob} />
                    <View style={styles.headerDots}>
                        {[...Array(6)].map((_, i) => (
                            <View key={i} style={[styles.headerDot, { opacity: 0.04 + i * 0.015 }]} />
                        ))}
                    </View>
                    <View style={styles.headerRow}>
                        <View>
                            <Text style={styles.adminLabel}>Admin Panel 🛡️</Text>
                            <Text style={styles.headerTitle}>System Overview</Text>
                        </View>
                        <View style={styles.headerActions}>
                            <TouchableOpacity style={styles.headerBtn} onPress={openNotifs}>
                                <MaterialCommunityIcons name="bell-outline" size={20} color={COLORS.white} />
                                <View style={styles.notifDot} />
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.headerBtn, { backgroundColor: "rgba(230,57,70,0.25)" }]}>
                                <MaterialCommunityIcons name="logout" size={20} color={COLORS.error} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Health banner */}
                    <View style={styles.healthBanner}>
                        <View style={styles.healthPulse} />
                        <Text style={styles.healthText}>System Active · All services running</Text>
                    </View>
                </View>

                {/* STAT CARDS */}
                <View style={styles.statsGrid}>
                    <TrendStatCard icon="account-group" number="1,250" label="Total Users" color={COLORS.primary} trend="↑12%" trendUp />
                    <TrendStatCard icon="domain" number="45" label="Active NGOs" color={COLORS.success} trend="↑3%" trendUp />
                    <TrendStatCard icon="hand-heart" number="850" label="Donors" color={COLORS.accentBlue} trend="↑8%" trendUp />
                    <TrendStatCard icon="food-turkey" number="15k" label="Meals Saved" color={COLORS.warning} trend="↑22%" trendUp />
                </View>

                {/* WEEKLY CHART */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Meals Saved This Week</Text>
                        <Text style={styles.chartTotal}>+1,560 today</Text>
                    </View>
                    <View style={styles.chartCard}>
                        <View style={styles.chartLabels}>
                            {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                                <Text key={i} style={[styles.chartDay, i === 6 && styles.chartDayActive]}>{d}</Text>
                            ))}
                        </View>
                        <Sparkline data={weekData} color={COLORS.primary} />
                    </View>
                </View>

                {/* QUICK LINKS */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Quick Actions</Text>
                    <View style={styles.quickRow}>
                        <TouchableOpacity style={styles.quickCard}>
                            <View style={[styles.quickIcon, { backgroundColor: COLORS.warning + "18" }]}>
                                <MaterialCommunityIcons name="account-check-outline" size={22} color={COLORS.warning} />
                            </View>
                            <Text style={styles.quickLabel}>Verify NGOs</Text>
                            <View style={styles.quickBadge}>
                                <Text style={styles.quickBadgeText}>3</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.quickCard}>
                            <View style={[styles.quickIcon, { backgroundColor: COLORS.error + "15" }]}>
                                <MaterialCommunityIcons name="alert-circle-outline" size={22} color={COLORS.error} />
                            </View>
                            <Text style={styles.quickLabel}>Complaints</Text>
                            <View style={[styles.quickBadge, { backgroundColor: COLORS.error }]}>
                                <Text style={styles.quickBadgeText}>2</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.quickCard}>
                            <View style={[styles.quickIcon, { backgroundColor: COLORS.accentBlue + "18" }]}>
                                <MaterialCommunityIcons name="file-chart-outline" size={22} color={COLORS.accentBlue} />
                            </View>
                            <Text style={styles.quickLabel}>Reports</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* ACTIVITY */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>System Activity</Text>
                        <TouchableOpacity>
                            <Text style={styles.seeAll}>View all</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.activityCard}>
                        <ActivityItem icon="shield-check" title="New NGO Verified — Green Earth" time="1 hour ago" color={COLORS.success} />
                        <ActivityItem icon="alert-circle" title="Flagged Content Review Pending" time="3 hours ago" color={COLORS.warning} />
                        <ActivityItem icon="account-plus" title="New Donor Registration — Taj Hotel" time="5 hours ago" color={COLORS.accentBlue} />
                        <ActivityItem icon="food-turkey" title="Large donation posted — 500kg Rice" time="6 hours ago" color={COLORS.primary} />
                    </View>
                </View>

                <View style={{ height: 24 }} />
            </ScrollView>

            {/* Notification bottom sheet */}
            <Modal visible={showNotifications} transparent animationType="none" onRequestClose={closeNotifs}>
                <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={closeNotifs} />
                <Animated.View style={[styles.bottomSheet, { transform: [{ translateY: slideAnim }] }]}>
                    <View style={styles.sheetHandle} />
                    <View style={styles.sheetHeader}>
                        <Text style={styles.sheetTitle}>Notifications</Text>
                        <TouchableOpacity onPress={closeNotifs}>
                            <MaterialCommunityIcons name="close" size={22} color={COLORS.textDark} />
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={notifications}
                        keyExtractor={(n) => n.id}
                        renderItem={({ item: n }) => (
                            <TouchableOpacity style={[styles.notifItem, n.unread && styles.notifUnread]} activeOpacity={0.75}>
                                <View style={[styles.notifIcon, { backgroundColor: n.color + "18" }]}>
                                    <MaterialCommunityIcons name={n.icon} size={22} color={n.color} />
                                </View>
                                <View style={styles.notifContent}>
                                    <View style={styles.notifHeaderRow}>
                                        <Text style={styles.notifTitle}>{n.title}</Text>
                                        {n.unread && <View style={[styles.unreadDot, { backgroundColor: n.color }]} />}
                                    </View>
                                    <Text style={styles.notifMessage} numberOfLines={2}>{n.message}</Text>
                                    <Text style={styles.notifTime}>{n.time}</Text>
                                </View>
                            </TouchableOpacity>
                        )}
                        style={{ maxHeight: 380 }}
                        showsVerticalScrollIndicator={false}
                    />
                    <TouchableOpacity style={styles.markAllBtn} onPress={closeNotifs}>
                        <Text style={styles.markAllText}>Mark All as Read</Text>
                    </TouchableOpacity>
                </Animated.View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.bg },
    header: {
        backgroundColor: COLORS.adminDark,
        paddingTop: 60, paddingHorizontal: 22, paddingBottom: 24,
        overflow: "hidden",
    },
    headerBlob: {
        position: "absolute", width: 200, height: 200, borderRadius: 100,
        backgroundColor: COLORS.primary, opacity: 0.07, top: -60, right: -40,
    },
    headerDots: { position: "absolute", flexDirection: "row", flexWrap: "wrap", top: 0, left: 0, right: 0, bottom: 0 },
    headerDot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: COLORS.white, margin: 12 },
    headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 },
    adminLabel: { fontSize: 13, color: "rgba(255,255,255,0.55)", fontWeight: "600", marginBottom: 4 },
    headerTitle: { fontSize: 22, fontWeight: "800", color: COLORS.white, letterSpacing: -0.3 },
    headerActions: { flexDirection: "row", gap: 10 },
    headerBtn: {
        width: 42, height: 42, borderRadius: 14,
        backgroundColor: "rgba(255,255,255,0.12)",
        justifyContent: "center", alignItems: "center",
    },
    notifDot: {
        position: "absolute", top: 9, right: 9,
        width: 8, height: 8, borderRadius: 4,
        backgroundColor: COLORS.error, borderWidth: 1.5, borderColor: COLORS.adminDark,
    },
    healthBanner: {
        flexDirection: "row", alignItems: "center", gap: 10,
        backgroundColor: "rgba(45,106,79,0.3)",
        borderRadius: 12, padding: 12, borderWidth: 1, borderColor: "rgba(45,106,79,0.4)",
    },
    healthPulse: {
        width: 10, height: 10, borderRadius: 5,
        backgroundColor: COLORS.successMid,
        shadowColor: COLORS.successMid, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 6, elevation: 4,
    },
    healthText: { fontSize: 13, color: COLORS.successMid, fontWeight: "700" },
    statsGrid: {
        flexDirection: "row", flexWrap: "wrap",
        paddingHorizontal: 22, gap: 12, paddingTop: 20, marginBottom: 8,
    },
    statCard: {
        width: "47%", backgroundColor: COLORS.white,
        borderRadius: 18, padding: 16, borderTopWidth: 4,
        shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 8, elevation: 2,
    },
    statCardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
    statIconWrap: { width: 40, height: 40, borderRadius: 12, justifyContent: "center", alignItems: "center" },
    trendBadge: {
        flexDirection: "row", alignItems: "center", gap: 2,
        paddingVertical: 3, paddingHorizontal: 7, borderRadius: 9999,
    },
    trendText: { fontSize: 10, fontWeight: "800" },
    statNumber: { fontSize: 26, fontWeight: "800", color: COLORS.textDark, letterSpacing: -0.5, marginBottom: 3 },
    statLabel: { fontSize: 12, color: COLORS.grayText, fontWeight: "600" },
    section: { paddingHorizontal: 22, marginTop: 24 },
    sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
    sectionTitle: { fontSize: 16, fontWeight: "800", color: COLORS.textDark },
    seeAll: { fontSize: 13, fontWeight: "700", color: COLORS.primary },
    chartTotal: { fontSize: 13, fontWeight: "800", color: COLORS.success },
    chartCard: {
        backgroundColor: COLORS.white, borderRadius: 18, padding: 18, paddingBottom: 14,
        shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 8, elevation: 2,
    },
    chartLabels: { flexDirection: "row", justifyContent: "space-around", marginBottom: 8 },
    chartDay: { fontSize: 11, fontWeight: "700", color: COLORS.grayText },
    chartDayActive: { color: COLORS.primary },
    sparkline: { flexDirection: "row", alignItems: "flex-end", height: 60, gap: 4 },
    sparkBarWrap: { flex: 1, height: "100%", justifyContent: "flex-end" },
    sparkBar: { width: "100%", borderRadius: 4, minHeight: 6 },
    quickRow: { flexDirection: "row", gap: 10 },
    quickCard: {
        flex: 1, backgroundColor: COLORS.white,
        borderRadius: 16, padding: 16, alignItems: "center", gap: 8,
        position: "relative",
        shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
    },
    quickIcon: { width: 46, height: 46, borderRadius: 14, justifyContent: "center", alignItems: "center" },
    quickLabel: { fontSize: 11, fontWeight: "700", color: COLORS.textMid, textAlign: "center" },
    quickBadge: {
        position: "absolute", top: 10, right: 10,
        backgroundColor: COLORS.warning,
        width: 20, height: 20, borderRadius: 10,
        justifyContent: "center", alignItems: "center",
    },
    quickBadgeText: { fontSize: 10, fontWeight: "800", color: COLORS.white },
    activityCard: {
        backgroundColor: COLORS.white, borderRadius: 18, overflow: "hidden",
        shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
    },
    activityItem: {
        flexDirection: "row", alignItems: "center",
        paddingVertical: 14, paddingHorizontal: 18,
        borderBottomWidth: 1, borderBottomColor: "#F5F5F5",
    },
    activityIcon: { width: 38, height: 38, borderRadius: 12, justifyContent: "center", alignItems: "center", marginRight: 12 },
    activityContent: { flex: 1 },
    activityTitle: { fontSize: 13, fontWeight: "600", color: COLORS.textDark, marginBottom: 2 },
    activityTime: { fontSize: 11, color: COLORS.grayText },
    modalOverlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: COLORS.overlay },
    bottomSheet: {
        position: "absolute", bottom: 0, left: 0, right: 0,
        backgroundColor: COLORS.white, borderTopLeftRadius: 28, borderTopRightRadius: 28,
        maxHeight: "80%", paddingBottom: 32,
    },
    sheetHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: "#DDD", alignSelf: "center", marginTop: 12, marginBottom: 4 },
    sheetHeader: {
        flexDirection: "row", justifyContent: "space-between", alignItems: "center",
        paddingHorizontal: 22, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: "#F0F0F0",
    },
    sheetTitle: { fontSize: 18, fontWeight: "800", color: COLORS.textDark },
    notifItem: { flexDirection: "row", padding: 16, borderBottomWidth: 1, borderBottomColor: "#F5F5F5" },
    notifUnread: { backgroundColor: COLORS.bg },
    notifIcon: { width: 46, height: 46, borderRadius: 14, justifyContent: "center", alignItems: "center", marginRight: 14 },
    notifContent: { flex: 1 },
    notifHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 },
    notifTitle: { fontSize: 14, fontWeight: "700", color: COLORS.textDark },
    unreadDot: { width: 8, height: 8, borderRadius: 4 },
    notifMessage: { fontSize: 13, color: COLORS.grayText, lineHeight: 18, marginBottom: 4 },
    notifTime: { fontSize: 11, color: COLORS.placeholder },
    markAllBtn: { margin: 16, backgroundColor: COLORS.primary, borderRadius: 14, padding: 16, alignItems: "center" },
    markAllText: { color: COLORS.white, fontWeight: "800", fontSize: 15 },
});