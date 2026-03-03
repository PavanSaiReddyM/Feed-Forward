

import {
    StyleSheet, Text, View, ScrollView, TouchableOpacity,
    Modal, Animated, Easing,
} from "react-native";
import { useState, useEffect, useRef } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../../_constants/colors";

const notifications = [
    { id: 1, icon: "check-circle", title: "Request Approved", message: "Your request for Rice & Curry has been approved", time: "2 hours ago", color: COLORS.success, unread: true },
    { id: 2, icon: "food-variant", title: "New Food Available", message: "Fresh Vegetables available at Green Market — 1.2 km away", time: "5 hours ago", color: COLORS.primary, unread: true },
    { id: 3, icon: "truck-delivery", title: "Pickup Completed", message: "Successfully picked up Bread Packets", time: "1 day ago", color: COLORS.accentBlue, unread: false },
    { id: 4, icon: "alert-circle", title: "Reminder", message: "Pending pickup for approved request", time: "2 days ago", color: COLORS.warning, unread: false },
];

function StatCard({ icon, number, label, color, delay }) {
    const scaleAnim = useRef(new Animated.Value(0.8)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.sequence([
            Animated.delay(delay),
            Animated.parallel([
                Animated.spring(scaleAnim, { toValue: 1, tension: 60, friction: 8, useNativeDriver: true }),
                Animated.timing(opacityAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
            ]),
        ]).start();
    }, []);

    return (
        <Animated.View
            style={[
                styles.statCard,
                { opacity: opacityAnim, transform: [{ scale: scaleAnim }], borderLeftColor: color },
            ]}
        >
            <View style={[styles.statIconWrap, { backgroundColor: color + "18" }]}>
                <MaterialCommunityIcons name={icon} size={22} color={color} />
            </View>
            <Text style={styles.statNumber}>{number}</Text>
            <Text style={styles.statLabel}>{label}</Text>
        </Animated.View>
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
            <View style={[styles.activityDot, { backgroundColor: color + "30" }]} />
        </View>
    );
}

function NotificationItem({ icon, title, message, time, color, unread }) {
    return (
        <TouchableOpacity style={[styles.notifItem, unread && styles.notifUnread]} activeOpacity={0.75}>
            <View style={[styles.notifIcon, { backgroundColor: color + "18" }]}>
                <MaterialCommunityIcons name={icon} size={22} color={color} />
            </View>
            <View style={styles.notifContent}>
                <View style={styles.notifHeader}>
                    <Text style={styles.notifTitle}>{title}</Text>
                    {unread && <View style={[styles.unreadDot, { backgroundColor: color }]} />}
                </View>
                <Text style={styles.notifMessage} numberOfLines={2}>{message}</Text>
                <Text style={styles.notifTime}>{time}</Text>
            </View>
        </TouchableOpacity>
    );
}

export default function NgoDashboard() {
    const [showNotifications, setShowNotifications] = useState(false);
    const slideAnim = useRef(new Animated.Value(400)).current;

    const openNotifs = () => {
        setShowNotifications(true);
        Animated.spring(slideAnim, { toValue: 0, tension: 65, friction: 11, useNativeDriver: true }).start();
    };
    const closeNotifs = () => {
        Animated.timing(slideAnim, { toValue: 400, duration: 250, easing: Easing.in(Easing.cubic), useNativeDriver: true })
            .start(() => setShowNotifications(false));
    };

    return (
        <View style={{ flex: 1 }}>
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

                {/* HEADER */}
                <View style={styles.header}>
                    <View style={styles.headerBlob} />
                    <View>
                        <Text style={styles.greeting}>Good morning 👋</Text>
                        <Text style={styles.orgName}>Helping Hands NGO</Text>
                    </View>
                    <TouchableOpacity style={styles.notifBtn} onPress={openNotifs}>
                        <MaterialCommunityIcons name="bell-outline" size={22} color={COLORS.textDark} />
                        <View style={styles.notifBadge} />
                    </TouchableOpacity>
                </View>

                {/* IMPACT BANNER */}
                <View style={styles.impactBanner}>
                    <View style={styles.impactBannerBlob} />
                    <View style={styles.impactLeft}>
                        <Text style={styles.impactEmoji}>🌱</Text>
                        <View>
                            <Text style={styles.impactTitle}>This month's impact</Text>
                            <Text style={styles.impactStat}>You helped feed <Text style={styles.impactHighlight}>150 people</Text></Text>
                        </View>
                    </View>
                    <View style={styles.impactBadge}>
                        <Text style={styles.impactBadgeText}>Top NGO</Text>
                    </View>
                </View>

                {/* STATS GRID */}
                <View style={styles.statsGrid}>
                    <StatCard icon="food-variant" number="12" label="Active Requests" color={COLORS.primary} delay={0} />
                    <StatCard icon="check-circle" number="8" label="Completed" color={COLORS.success} delay={80} />
                    <StatCard icon="truck-delivery" number="5" label="In Transit" color={COLORS.accentBlue} delay={160} />
                    <StatCard icon="account-group" number="150" label="People Served" color={COLORS.accentPurple} delay={240} />
                </View>

                {/* QUICK ACTIONS */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Quick Actions</Text>
                    <View style={styles.actionsRow}>
                        {[
                            { icon: "food-fork-drink", label: "Browse\nFood", color: COLORS.primary, route: "available" },
                            { icon: "clipboard-list-outline", label: "My\nRequests", color: COLORS.accentBlue, route: "requests" },
                            { icon: "history", label: "Pickup\nHistory", color: COLORS.success, route: "history" },
                            { icon: "account-outline", label: "Profile", color: COLORS.accentPurple, route: "profile" },
                        ].map((a) => (
                            <TouchableOpacity key={a.label} style={styles.actionBtn} activeOpacity={0.8}>
                                <View style={[styles.actionIconWrap, { backgroundColor: a.color + "18" }]}>
                                    <MaterialCommunityIcons name={a.icon} size={22} color={a.color} />
                                </View>
                                <Text style={styles.actionLabel}>{a.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* RECENT ACTIVITY */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Recent Activity</Text>
                        <TouchableOpacity>
                            <Text style={styles.seeAll}>See all</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.activityCard}>
                        <ActivityItem icon="check-circle" title="Request approved — Rice & Curry" time="2 hours ago" color={COLORS.success} />
                        <ActivityItem icon="clock-outline" title="New request pending — Bread Packets" time="5 hours ago" color={COLORS.warning} />
                        <ActivityItem icon="truck-delivery" title="Pickup completed — Fresh Vegetables" time="1 day ago" color={COLORS.accentBlue} />
                    </View>
                </View>

                <View style={{ height: 24 }} />
            </ScrollView>

            {/* Notifications Bottom Sheet */}
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
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {notifications.map((n) => (
                            <NotificationItem key={n.id} {...n} />
                        ))}
                    </ScrollView>
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
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 22,
        paddingTop: 60,
        paddingBottom: 20,
        overflow: "hidden",
    },
    headerBlob: {
        position: "absolute",
        width: 160,
        height: 160,
        borderRadius: 80,
        backgroundColor: COLORS.primary,
        opacity: 0.05,
        top: -40,
        right: -40,
    },
    greeting: { fontSize: 14, color: COLORS.grayText, fontWeight: "500", marginBottom: 3 },
    orgName: { fontSize: 22, fontWeight: "800", color: COLORS.textDark, letterSpacing: -0.3 },
    notifBtn: {
        width: 46, height: 46, borderRadius: 23,
        backgroundColor: COLORS.white,
        justifyContent: "center", alignItems: "center",
        shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3,
    },
    notifBadge: {
        position: "absolute", top: 10, right: 10,
        width: 10, height: 10, borderRadius: 5,
        backgroundColor: COLORS.error, borderWidth: 2, borderColor: COLORS.white,
    },
    impactBanner: {
        marginHorizontal: 22, marginBottom: 20,
        backgroundColor: COLORS.success,
        borderRadius: 20, padding: 20,
        flexDirection: "row", alignItems: "center", justifyContent: "space-between",
        overflow: "hidden",
        shadowColor: COLORS.success, shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.22, shadowRadius: 16, elevation: 6,
    },
    impactBannerBlob: {
        position: "absolute", width: 120, height: 120, borderRadius: 60,
        backgroundColor: "#fff", opacity: 0.07, top: -30, right: -20,
    },
    impactLeft: { flexDirection: "row", alignItems: "center", gap: 14, flex: 1 },
    impactEmoji: { fontSize: 32 },
    impactTitle: { fontSize: 12, color: "rgba(255,255,255,0.7)", fontWeight: "600", marginBottom: 3 },
    impactStat: { fontSize: 15, color: COLORS.white, fontWeight: "700" },
    impactHighlight: { fontWeight: "800", color: "#B7E4C7" },
    impactBadge: {
        backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 9999,
        paddingHorizontal: 12, paddingVertical: 6,
    },
    impactBadgeText: { fontSize: 12, color: COLORS.white, fontWeight: "800" },
    statsGrid: {
        flexDirection: "row", flexWrap: "wrap",
        paddingHorizontal: 22, gap: 12, marginBottom: 8,
    },
    statCard: {
        width: "47%", backgroundColor: COLORS.white,
        borderRadius: 18, padding: 18,
        borderLeftWidth: 4,
        shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 8, elevation: 2,
    },
    statIconWrap: {
        width: 44, height: 44, borderRadius: 14,
        justifyContent: "center", alignItems: "center", marginBottom: 12,
    },
    statNumber: { fontSize: 28, fontWeight: "800", color: COLORS.textDark, letterSpacing: -0.5, marginBottom: 2 },
    statLabel: { fontSize: 12, color: COLORS.grayText, fontWeight: "600" },
    section: { paddingHorizontal: 22, marginTop: 24 },
    sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
    sectionTitle: { fontSize: 17, fontWeight: "800", color: COLORS.textDark },
    seeAll: { fontSize: 13, fontWeight: "700", color: COLORS.primary },
    actionsRow: { flexDirection: "row", gap: 10 },
    actionBtn: {
        flex: 1, alignItems: "center",
        backgroundColor: COLORS.white, borderRadius: 16, padding: 14,
        shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
        gap: 8,
    },
    actionIconWrap: { width: 46, height: 46, borderRadius: 14, justifyContent: "center", alignItems: "center" },
    actionLabel: { fontSize: 11, fontWeight: "700", color: COLORS.textMid, textAlign: "center" },
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
    activityDot: { width: 8, height: 8, borderRadius: 4 },
    // Modal
    modalOverlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: COLORS.overlay },
    bottomSheet: {
        position: "absolute", bottom: 0, left: 0, right: 0,
        backgroundColor: COLORS.white,
        borderTopLeftRadius: 28, borderTopRightRadius: 28,
        maxHeight: "80%", paddingBottom: 32,
    },
    sheetHandle: {
        width: 40, height: 4, borderRadius: 2, backgroundColor: "#DDD",
        alignSelf: "center", marginTop: 12, marginBottom: 4,
    },
    sheetHeader: {
        flexDirection: "row", justifyContent: "space-between", alignItems: "center",
        paddingHorizontal: 22, paddingVertical: 16,
        borderBottomWidth: 1, borderBottomColor: "#F0F0F0",
    },
    sheetTitle: { fontSize: 18, fontWeight: "800", color: COLORS.textDark },
    notifItem: {
        flexDirection: "row", padding: 16, borderBottomWidth: 1, borderBottomColor: "#F5F5F5",
    },
    notifUnread: { backgroundColor: COLORS.bg },
    notifIcon: { width: 46, height: 46, borderRadius: 14, justifyContent: "center", alignItems: "center", marginRight: 14 },
    notifContent: { flex: 1 },
    notifHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 },
    notifTitle: { fontSize: 14, fontWeight: "700", color: COLORS.textDark },
    unreadDot: { width: 8, height: 8, borderRadius: 4 },
    notifMessage: { fontSize: 13, color: COLORS.grayText, lineHeight: 18, marginBottom: 4 },
    notifTime: { fontSize: 11, color: COLORS.placeholder },
    markAllBtn: {
        margin: 16, backgroundColor: COLORS.primary,
        borderRadius: 14, padding: 16, alignItems: "center",
    },
    markAllText: { color: COLORS.white, fontWeight: "800", fontSize: 15 },
});