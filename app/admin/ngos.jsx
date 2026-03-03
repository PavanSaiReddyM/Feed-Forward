
import {
    StyleSheet, Text, View, FlatList,
    TouchableOpacity,
} from "react-native";
import { useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../../_constants/colors";

const STATUS_TABS = ["All", "Pending", "Verified", "Rejected"];

export default function NGOs() {
    const [activeTab, setActiveTab] = useState("All");
    const [ngoList, setNgoList] = useState([
        {
            id: "1", name: "Helping Hands NGO", location: "Hyderabad, Telangana",
            date: "Joined 2 days ago", status: "Pending", initials: "HH",
            docs: ["Registration.pdf", "Tax Exemption.pdf"],
            members: 12,
        },
        {
            id: "2", name: "Care Foundation", location: "Secunderabad, Telangana",
            date: "Joined 5 hours ago", status: "Pending", initials: "CF",
            docs: ["Reg Certificate.pdf"],
            members: 8,
        },
        {
            id: "3", name: "Food For All", location: "Hitech City, Hyderabad",
            date: "Joined 1 day ago", status: "Verified", initials: "FA",
            verifiedOn: "10 Feb 2026",
            docs: ["Reg Certificate.pdf", "NGO12 License.pdf"],
            members: 25,
        },
        {
            id: "4", name: "Green Earth Society", location: "Secunderabad",
            date: "Joined 3 days ago", status: "Rejected", initials: "GE",
            docs: [],
            members: 4,
        },
    ]);

    const updateStatus = (id, newStatus) => {
        setNgoList((prev) => prev.map((n) => n.id === id ? { ...n, status: newStatus } : n));
    };

    const filtered = ngoList.filter((n) => activeTab === "All" || n.status === activeTab);

    const AVATAR_COLORS = [COLORS.primary, COLORS.success, COLORS.accentBlue, COLORS.accentPurple];
    const avatarColor = (name) => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

    const STATUS_STYLE = {
        Pending: { color: COLORS.warning, bg: COLORS.warningLight, icon: "clock-outline" },
        Verified: { color: COLORS.success, bg: COLORS.successLight, icon: "shield-check" },
        Rejected: { color: COLORS.error, bg: COLORS.errorLight, icon: "close-circle" },
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>NGO Verification</Text>
                    <Text style={styles.subtitle}>
                        {ngoList.filter(n => n.status === "Pending").length} pending approval
                    </Text>
                </View>
                <TouchableOpacity style={styles.filterBtn}>
                    <MaterialCommunityIcons name="filter-variant" size={20} color={COLORS.textDark} />
                </TouchableOpacity>
            </View>

            {/* Status tabs */}
            <View style={styles.tabsScroll}>
                {STATUS_TABS.map((tab) => {
                    const count = tab === "All" ? ngoList.length : ngoList.filter(n => n.status === tab).length;
                    const s = STATUS_STYLE[tab];
                    return (
                        <TouchableOpacity
                            key={tab}
                            style={[
                                styles.tab,
                                activeTab === tab && [
                                    styles.tabActive,
                                    tab !== "All" && { backgroundColor: s?.bg, borderColor: s?.color + "50" },
                                    tab === "All" && { backgroundColor: COLORS.adminDark, borderColor: COLORS.adminDark },
                                ],
                            ]}
                            onPress={() => setActiveTab(tab)}
                        >
                            {tab !== "All" && s && (
                                <MaterialCommunityIcons name={s.icon} size={13} color={activeTab === tab ? s.color : COLORS.grayText} />
                            )}
                            <Text style={[
                                styles.tabText,
                                activeTab === tab && tab === "All" && { color: COLORS.white },
                                activeTab === tab && tab !== "All" && { color: s?.color },
                            ]}>{tab}</Text>
                            <View style={styles.tabBubble}>
                                <Text style={styles.tabBubbleText}>{count}</Text>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>

            <FlatList
                data={filtered}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                    const ss = STATUS_STYLE[item.status];
                    const isPending = item.status === "Pending";
                    const isVerified = item.status === "Verified";

                    return (
                        <View style={styles.card}>
                            {/* Top */}
                            <View style={styles.cardTop}>
                                <View style={[styles.avatar, { backgroundColor: avatarColor(item.name) }]}>
                                    <Text style={styles.avatarText}>{item.initials}</Text>
                                </View>
                                <View style={styles.ngoInfo}>
                                    <Text style={styles.ngoName}>{item.name}</Text>
                                    <View style={styles.locationRow}>
                                        <MaterialCommunityIcons name="map-marker" size={12} color={COLORS.grayText} />
                                        <Text style={styles.locationText}>{item.location}</Text>
                                    </View>
                                </View>
                                <View style={[styles.statusBadge, { backgroundColor: ss.bg }]}>
                                    <MaterialCommunityIcons name={ss.icon} size={13} color={ss.color} />
                                    <Text style={[styles.statusText, { color: ss.color }]}>{item.status}</Text>
                                </View>
                            </View>

                            {/* Meta row */}
                            <View style={styles.metaRow}>
                                <View style={styles.metaItem}>
                                    <MaterialCommunityIcons name="calendar-outline" size={13} color={COLORS.grayText} />
                                    <Text style={styles.metaText}>{item.date}</Text>
                                </View>
                                <View style={styles.metaItem}>
                                    <MaterialCommunityIcons name="account-group-outline" size={13} color={COLORS.grayText} />
                                    <Text style={styles.metaText}>{item.members} members</Text>
                                </View>
                            </View>

                            {/* Docs */}
                            {item.docs.length > 0 && (
                                <View style={styles.docsRow}>
                                    {item.docs.map((doc) => (
                                        <TouchableOpacity key={doc} style={styles.docChip}>
                                            <MaterialCommunityIcons name="file-pdf-box" size={13} color={COLORS.error} />
                                            <Text style={styles.docText} numberOfLines={1}>{doc}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}

                            {item.docs.length === 0 && (
                                <View style={styles.noDocsRow}>
                                    <MaterialCommunityIcons name="alert-circle-outline" size={14} color={COLORS.warning} />
                                    <Text style={styles.noDocsText}>No documents uploaded</Text>
                                </View>
                            )}

                            <View style={styles.divider} />

                            {/* Actions */}
                            {isPending && (
                                <View style={styles.actionRow}>
                                    <TouchableOpacity style={styles.rejectBtn} onPress={() => updateStatus(item.id, "Rejected")}>
                                        <MaterialCommunityIcons name="close" size={18} color={COLORS.error} />
                                        <Text style={styles.rejectText}>Reject</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.verifyBtn} onPress={() => updateStatus(item.id, "Verified")}>
                                        <MaterialCommunityIcons name="shield-check" size={18} color={COLORS.white} />
                                        <Text style={styles.verifyText}>Verify & Approve</Text>
                                    </TouchableOpacity>
                                </View>
                            )}

                            {isVerified && (
                                <View style={styles.verifiedRow}>
                                    <View style={styles.verifiedInfo}>
                                        <MaterialCommunityIcons name="shield-check" size={18} color={COLORS.success} />
                                        <Text style={styles.verifiedText}>Verified NGO</Text>
                                    </View>
                                    <TouchableOpacity style={styles.viewDetailsBtn}>
                                        <Text style={styles.viewDetailsText}>View Details</Text>
                                        <MaterialCommunityIcons name="arrow-right" size={15} color={COLORS.primary} />
                                    </TouchableOpacity>
                                </View>
                            )}

                            {item.status === "Rejected" && (
                                <View style={styles.rejectedRow}>
                                    <MaterialCommunityIcons name="close-circle-outline" size={16} color={COLORS.error} />
                                    <Text style={styles.rejectedText}>Registration rejected</Text>
                                    <TouchableOpacity>
                                        <Text style={styles.reviewAgainText}>Review again</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    );
                }}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
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
    filterBtn: {
        width: 42, height: 42, borderRadius: 14,
        backgroundColor: COLORS.white, justifyContent: "center", alignItems: "center",
        shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 6, elevation: 2,
    },
    tabsScroll: { flexDirection: "row", paddingHorizontal: 22, gap: 8, marginBottom: 16, flexWrap: "wrap" },
    tab: {
        flexDirection: "row", alignItems: "center", gap: 5,
        paddingVertical: 7, paddingHorizontal: 12, borderRadius: 9999,
        backgroundColor: COLORS.white, borderWidth: 1.5, borderColor: COLORS.border,
    },
    tabActive: { shadowColor: "#000", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.1, shadowRadius: 6, elevation: 3 },
    tabText: { fontSize: 12, fontWeight: "700", color: COLORS.grayText },
    tabBubble: {
        backgroundColor: "#F0F0F5", borderRadius: 9999,
        width: 18, height: 18, justifyContent: "center", alignItems: "center",
    },
    tabBubbleText: { fontSize: 9, fontWeight: "800", color: COLORS.grayText },
    listContent: { paddingHorizontal: 22, paddingBottom: 32 },
    card: {
        backgroundColor: COLORS.white, borderRadius: 20, marginBottom: 14, padding: 18,
        shadowColor: "#000", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.08, shadowRadius: 10, elevation: 3,
    },
    cardTop: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
    avatar: {
        width: 48, height: 48, borderRadius: 16,
        justifyContent: "center", alignItems: "center", marginRight: 12,
    },
    avatarText: { fontSize: 16, fontWeight: "800", color: COLORS.white },
    ngoInfo: { flex: 1 },
    ngoName: { fontSize: 15, fontWeight: "800", color: COLORS.textDark, marginBottom: 3 },
    locationRow: { flexDirection: "row", alignItems: "center", gap: 3 },
    locationText: { fontSize: 12, color: COLORS.grayText, fontWeight: "500" },
    statusBadge: {
        flexDirection: "row", alignItems: "center", gap: 4,
        paddingVertical: 5, paddingHorizontal: 9, borderRadius: 9999,
    },
    statusText: { fontSize: 11, fontWeight: "800" },
    metaRow: { flexDirection: "row", gap: 16, marginBottom: 12 },
    metaItem: { flexDirection: "row", alignItems: "center", gap: 5 },
    metaText: { fontSize: 12, color: COLORS.grayText, fontWeight: "500" },
    docsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 12 },
    docChip: {
        flexDirection: "row", alignItems: "center", gap: 5,
        backgroundColor: COLORS.errorLight, paddingVertical: 5, paddingHorizontal: 10, borderRadius: 8,
    },
    docText: { fontSize: 11, fontWeight: "700", color: COLORS.error, maxWidth: 120 },
    noDocsRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 12 },
    noDocsText: { fontSize: 12, color: COLORS.warning, fontWeight: "600" },
    divider: { height: 1, backgroundColor: "#F5F5F5", marginBottom: 14 },
    actionRow: { flexDirection: "row", gap: 10 },
    rejectBtn: {
        flexDirection: "row", alignItems: "center", gap: 6,
        paddingVertical: 11, paddingHorizontal: 16, borderRadius: 12,
        backgroundColor: COLORS.errorLight, borderWidth: 1.5, borderColor: COLORS.error + "30",
    },
    rejectText: { fontSize: 13, fontWeight: "800", color: COLORS.error },
    verifyBtn: {
        flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 7,
        paddingVertical: 12, borderRadius: 12, backgroundColor: COLORS.success,
        shadowColor: COLORS.success, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8, elevation: 4,
    },
    verifyText: { fontSize: 14, fontWeight: "800", color: COLORS.white },
    verifiedRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    verifiedInfo: { flexDirection: "row", alignItems: "center", gap: 6 },
    verifiedText: { fontSize: 14, fontWeight: "700", color: COLORS.success },
    viewDetailsBtn: { flexDirection: "row", alignItems: "center", gap: 4 },
    viewDetailsText: { fontSize: 13, fontWeight: "700", color: COLORS.primary },
    rejectedRow: { flexDirection: "row", alignItems: "center", gap: 8 },
    rejectedText: { flex: 1, fontSize: 13, color: COLORS.error, fontWeight: "600" },
    reviewAgainText: { fontSize: 13, fontWeight: "700", color: COLORS.primary },
});
