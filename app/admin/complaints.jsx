import {
    StyleSheet, Text, View, FlatList,
    TouchableOpacity,
} from "react-native";
import { useState, useEffect } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../../_constants/colors";
import { getComplaints, resolveComplaint } from "../services/api";

const TABS = ["All", "Pending", "Resolved"];

const SEVERITY = {
    high: { color: COLORS.error, label: "High" },
    medium: { color: COLORS.warning, label: "Medium" },
    low: { color: COLORS.accentBlue, label: "Low" },
};

export default function Complaints() {
    const [activeTab, setActiveTab] = useState("All");
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch complaints on mount
    useEffect(() => {
        let mounted = true;

        const fetchComplaints = async () => {
            try {
                setLoading(true);
                const data = await getComplaints();
                const mappedComplaints = data.map(complaint => ({
                    id: complaint._id,
                    userName: complaint.reportedBy?.name || "Unknown",
                    role: complaint.reportedBy?.role || "User",
                    initials: (complaint.reportedBy?.name || "?").split(" ").map(n => n[0]).join("").toUpperCase(),
                    message: complaint.description || complaint.reason || "No description provided",
                    reason: complaint.reason || "General complaint",
                    date: new Date(complaint.createdAt).toLocaleDateString() || "Unknown date",
                    status: complaint.status === "resolved" ? "Resolved" : "Pending",
                    severity: complaint.severity?.toLowerCase() || "medium",
                }));
                if (mounted) setComplaints(mappedComplaints);
            } catch (err) {
                if (mounted) setError(err.message || "Failed to load complaints");
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchComplaints();
        return () => { mounted = false; };
    }, []);

    const handleResolve = async (id) => {
        try {
            await resolveComplaint(id);
            // Update local state
            setComplaints((prev) =>
                prev.map((c) => c.id === id ? { ...c, status: "Resolved" } : c)
            );
        } catch (err) {
            alert(err.message || "Failed to resolve complaint");
        }
    };

    const filtered = complaints.filter((c) => {
        if (activeTab === "All") return true;
        return c.status === activeTab;
    });

    const AVATAR_COLORS = [COLORS.primary, COLORS.success, COLORS.accentBlue, COLORS.accentPurple, COLORS.warning];
    const avatarColor = (name) => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
                <MaterialCommunityIcons name="loading" size={40} color={COLORS.primary} />
                <Text style={{ marginTop: 12, color: COLORS.grayText }}>Loading complaints...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
                <MaterialCommunityIcons name="alert-circle-outline" size={40} color={COLORS.error} />
                <Text style={{ marginTop: 12, color: COLORS.error, textAlign: "center", paddingHorizontal: 20 }}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>User Complaints</Text>
                    <Text style={styles.subtitle}>{complaints.filter(c => c.status === "Pending").length} pending review</Text>
                </View>
                <TouchableOpacity style={styles.refreshBtn} onPress={fetchComplaints}>
                    <MaterialCommunityIcons name="refresh" size={20} color={COLORS.textDark} />
                </TouchableOpacity>
            </View>

            {/* Tabs */}
            <View style={styles.tabsRow}>
                {TABS.map((tab) => (
                    <TouchableOpacity
                        key={tab}
                        style={[styles.tab, activeTab === tab && styles.tabActive]}
                        onPress={() => setActiveTab(tab)}
                    >
                        <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
                        {tab !== "All" && (
                            <View style={[styles.tabCount, activeTab === tab && styles.tabCountActive]}>
                                <Text style={[styles.tabCountText, activeTab === tab && styles.tabCountTextActive]}>
                                    {complaints.filter(c => tab === "All" ? true : c.status === tab).length}
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity>
                ))}
            </View>

            <FlatList
                data={filtered}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                    const sev = SEVERITY[item.severity];
                    const isResolved = item.status === "Resolved";
                    return (
                        <View style={[styles.card, isResolved && styles.cardResolved]}>
                            {/* Severity bar */}
                            <View style={[styles.severityBar, { backgroundColor: sev?.color || COLORS.warning }]} />

                            <View style={styles.cardBody}>
                                {/* Top row */}
                                <View style={styles.cardTop}>
                                    <View style={[styles.avatar, { backgroundColor: avatarColor(item.userName) }]}>
                                        <Text style={styles.avatarText}>{item.initials}</Text>
                                    </View>
                                    <View style={styles.userInfo}>
                                        <Text style={styles.userName}>{item.userName}</Text>
                                        <View style={styles.roleBadge}>
                                            <Text style={styles.roleText}>{item.role}</Text>
                                        </View>
                                    </View>
                                    <View style={[styles.sevBadge, { backgroundColor: (sev?.color || COLORS.warning) + "18" }]}>
                                        <View style={[styles.sevDot, { backgroundColor: sev?.color || COLORS.warning }]} />
                                        <Text style={[styles.sevText, { color: sev?.color || COLORS.warning }]}>{sev?.label || "Unknown"}</Text>
                                    </View>
                                </View>

                                {/* Reason */}
                                {item.reason && (
                                    <View style={styles.categoryBadge}>
                                        <MaterialCommunityIcons name="tag-outline" size={11} color={COLORS.primary} />
                                        <Text style={styles.categoryBadgeText}>{item.reason}</Text>
                                    </View>
                                )}
                                <Text style={[styles.message, isResolved && styles.messageResolved]}>{item.message}</Text>

                                {/* Footer */}
                                <View style={styles.cardFooter}>
                                    <View style={styles.dateRow}>
                                        <MaterialCommunityIcons name="calendar-outline" size={13} color={COLORS.grayText} />
                                        <Text style={styles.dateText}>{item.date}</Text>
                                    </View>
                                    <View style={styles.actions}>
                                        {!isResolved ? (
                                            <TouchableOpacity style={styles.resolveBtn} onPress={() => handleResolve(item.id)}>
                                                <MaterialCommunityIcons name="check" size={15} color={COLORS.white} />
                                                <Text style={styles.resolveBtnText}>Resolve</Text>
                                            </TouchableOpacity>
                                        ) : (
                                            <View style={styles.resolvedBadge}>
                                                <MaterialCommunityIcons name="check-circle" size={14} color={COLORS.success} />
                                                <Text style={styles.resolvedBadgeText}>Resolved</Text>
                                            </View>
                                        )}
                                    </View>
                                </View>
                            </View>
                        </View>
                    );
                }}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyEmoji}>✅</Text>
                        <Text style={styles.emptyTitle}>No complaints here</Text>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.bg },
    header: { 
        paddingHorizontal: 22, paddingTop: 60, paddingBottom: 16,
        flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end"
    },
    title: { fontSize: 26, fontWeight: "800", color: COLORS.textDark, letterSpacing: -0.3 },
    subtitle: { fontSize: 13, color: COLORS.grayText, marginTop: 3 },
    refreshBtn: {
        width: 42, height: 42, borderRadius: 14,
        backgroundColor: COLORS.white, justifyContent: "center", alignItems: "center",
        shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 6, elevation: 2,
    },
    tabsRow: { flexDirection: "row", paddingHorizontal: 22, gap: 8, marginBottom: 16 },
    tab: {
        flexDirection: "row", alignItems: "center", gap: 6,
        paddingVertical: 8, paddingHorizontal: 16,
        borderRadius: 9999, backgroundColor: COLORS.white,
        borderWidth: 1.5, borderColor: COLORS.border,
    },
    tabActive: {
        backgroundColor: COLORS.adminDark, borderColor: COLORS.adminDark,
        shadowColor: COLORS.adminDark, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4,
    },
    tabText: { fontSize: 13, fontWeight: "700", color: COLORS.grayText },
    tabTextActive: { color: COLORS.white },
    tabCount: {
        minWidth: 20, height: 20, borderRadius: 10,
        backgroundColor: COLORS.bg,
        justifyContent: "center", alignItems: "center", paddingHorizontal: 4,
    },
    tabCountActive: { backgroundColor: "rgba(255,255,255,0.2)" },
    tabCountText: { fontSize: 10, fontWeight: "800", color: COLORS.grayText },
    tabCountTextActive: { color: COLORS.white },
    listContent: { paddingHorizontal: 22, paddingBottom: 32 },
    card: {
        backgroundColor: COLORS.white, borderRadius: 20, marginBottom: 14,
        flexDirection: "row", overflow: "hidden",
        shadowColor: "#000", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.08, shadowRadius: 10, elevation: 3,
    },
    cardResolved: { opacity: 0.65 },
    severityBar: { width: 5 },
    cardBody: { flex: 1, padding: 16 },
    cardTop: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
    avatar: {
        width: 42, height: 42, borderRadius: 14,
        justifyContent: "center", alignItems: "center", marginRight: 10,
    },
    avatarText: { fontSize: 14, fontWeight: "800", color: COLORS.white },
    userInfo: { flex: 1 },
    userName: { fontSize: 14, fontWeight: "800", color: COLORS.textDark, marginBottom: 3 },
    roleBadge: {
        backgroundColor: COLORS.peach,
        paddingVertical: 2, paddingHorizontal: 8, borderRadius: 9999, alignSelf: "flex-start",
    },
    roleText: { fontSize: 10, fontWeight: "700", color: COLORS.primary },
    sevBadge: { flexDirection: "row", alignItems: "center", gap: 4, paddingVertical: 4, paddingHorizontal: 8, borderRadius: 9999 },
    sevDot: { width: 6, height: 6, borderRadius: 3 },
    sevText: { fontSize: 11, fontWeight: "800" },
    message: { fontSize: 14, color: COLORS.textMid, lineHeight: 21, marginBottom: 14 },
    messageResolved: { color: COLORS.grayText },
    categoryBadge: {
        flexDirection: "row", alignItems: "center", gap: 5,
        alignSelf: "flex-start",
        backgroundColor: COLORS.primaryGlow,
        paddingVertical: 4, paddingHorizontal: 10, borderRadius: 9999,
        marginBottom: 8,
    },
    categoryBadgeText: { fontSize: 11, fontWeight: "700", color: COLORS.primary },
    cardFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    dateRow: { flexDirection: "row", alignItems: "center", gap: 5 },
    dateText: { fontSize: 12, color: COLORS.grayText },
    actions: { flexDirection: "row", gap: 8 },
    resolveBtn: {
        flexDirection: "row", alignItems: "center", gap: 5,
        paddingVertical: 7, paddingHorizontal: 12, borderRadius: 10,
        backgroundColor: COLORS.success,
        shadowColor: COLORS.success, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.22, shadowRadius: 6, elevation: 3,
    },
    resolveBtnText: { fontSize: 12, fontWeight: "800", color: COLORS.white },
    resolvedBadge: {
        flexDirection: "row", alignItems: "center", gap: 5,
        paddingVertical: 6, paddingHorizontal: 10, borderRadius: 9999,
        backgroundColor: COLORS.successLight,
    },
    resolvedBadgeText: { fontSize: 12, fontWeight: "700", color: COLORS.success },
    emptyState: { alignItems: "center", paddingVertical: 60 },
    emptyEmoji: { fontSize: 48, marginBottom: 12 },
    emptyTitle: { fontSize: 17, fontWeight: "800", color: COLORS.textDark },
});