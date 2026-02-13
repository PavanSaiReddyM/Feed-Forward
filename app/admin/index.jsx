import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Modal, FlatList } from "react-native";
import { useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../../_constants/colors";

export default function AdminHome() {
    const [showNotifications, setShowNotifications] = useState(false);

    const notifications = [
        {
            id: "1",
            title: "New NGO Registration",
            message: "Green Earth Foundation has requested verification.",
            time: "10 min ago",
            unread: true,
            icon: "office-building",
            color: COLORS.primary,
        },
        {
            id: "2",
            title: "Large Donation Alert",
            message: "500kg of rice donated by Tech Corp.",
            time: "1 hour ago",
            unread: true,
            icon: "food-turkey",
            color: COLORS.success,
        },
        {
            id: "3",
            title: "System Report Ready",
            message: "Weekly activity report is ready for review.",
            time: "5 hours ago",
            unread: false,
            icon: "file-chart",
            color: COLORS.accentBlue,
        },
        {
            id: "4",
            title: "User Flagged",
            message: "Suspicious activity reported for User #1234.",
            time: "1 day ago",
            unread: false,
            icon: "alert-circle",
            color: COLORS.warning,
        },
    ];

    const StatCard = ({ icon, number, label, iconBg }) => (
        <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: iconBg }]}>
                <MaterialCommunityIcons name={icon} size={28} color="#fff" />
            </View>
            <Text style={styles.statNumber}>{number}</Text>
            <Text style={styles.statLabel}>{label}</Text>
        </View>
    );

    const QuickAction = ({ icon, label, color }) => (
        <TouchableOpacity style={styles.actionButton}>
            <View style={[styles.actionIcon, { backgroundColor: color }]}>
                <MaterialCommunityIcons name={icon} size={24} color="#fff" />
            </View>
            <Text style={styles.actionLabel}>{label}</Text>
        </TouchableOpacity>
    );

    const ActivityItem = ({ icon, title, time, iconColor }) => (
        <View style={styles.activityItem}>
            <View style={[styles.activityIcon, { backgroundColor: iconColor + "20" }]}>
                <MaterialCommunityIcons name={icon} size={20} color={iconColor} />
            </View>
            <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>{title}</Text>
                <Text style={styles.activityTime}>{time}</Text>
            </View>
        </View>
    );

    const NotificationItem = ({ item }) => (
        <TouchableOpacity style={[
            styles.notificationItem,
            item.unread && styles.unreadNotification
        ]}>
            <View style={[styles.notifIcon, { backgroundColor: item.color + "20" }]}>
                <MaterialCommunityIcons name={item.icon} size={24} color={item.color} />
            </View>
            <View style={styles.notifContent}>
                <Text style={styles.notifTitle}>{item.title}</Text>
                <Text style={styles.notifMessage}>{item.message}</Text>
                <Text style={styles.notifTime}>{item.time}</Text>
            </View>
            {item.unread && <View style={styles.unreadDot} />}
        </TouchableOpacity>
    );

    return (
        <View style={{ flex: 1 }}>
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                {/* HEADER */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.greeting}>Admin Panel 🛡️</Text>
                        <Text style={styles.orgName}>System Overview</Text>
                    </View>
                    <View style={{ flexDirection: 'row', gap: 12 }}>
                        <TouchableOpacity
                            style={styles.notificationBtn}
                            onPress={() => setShowNotifications(true)}
                        >
                            <MaterialCommunityIcons name="bell-outline" size={24} color={COLORS.textDark} />
                            <View style={styles.notificationBadge} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.notificationBtn}>
                            <MaterialCommunityIcons name="logout" size={24} color={COLORS.error} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* STATS GRID */}
                <View style={styles.statsGrid}>
                    <StatCard
                        icon="account-group"
                        number="1,250"
                        label="Total Users"
                        iconBg={COLORS.primary}
                    />
                    <StatCard
                        icon="domain"
                        number="45"
                        label="Active NGOs"
                        iconBg={COLORS.success}
                    />
                    <StatCard
                        icon="hand-heart"
                        number="850"
                        label="Donors"
                        iconBg={COLORS.accentBlue}
                    />
                    <StatCard
                        icon="food-turkey"
                        number="15k"
                        label="Meals Saved"
                        iconBg={COLORS.warning}
                    />
                </View>



                {/* RECENT ACTIVITY */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>System Activity</Text>
                    <View style={styles.activityCard}>
                        <ActivityItem
                            icon="shield-check"
                            title="New NGO Verified - Green Earth"
                            time="1 hour ago"
                            iconColor={COLORS.success}
                        />
                        <ActivityItem
                            icon="alert-circle"
                            title="Flagged Content Review"
                            time="3 hours ago"
                            iconColor={COLORS.warning}
                        />
                        <ActivityItem
                            icon="account-plus"
                            title="New Donor Registration"
                            time="5 hours ago"
                            iconColor={COLORS.accentBlue}
                        />
                    </View>
                </View>
            </ScrollView>

            {/* NOTIFICATION MODAL */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={showNotifications}
                onRequestClose={() => setShowNotifications(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setShowNotifications(false)}
                >
                    <TouchableOpacity
                        activeOpacity={1}
                        style={styles.modalContent}
                    >
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Notifications</Text>
                            <TouchableOpacity onPress={() => setShowNotifications(false)}>
                                <MaterialCommunityIcons name="close" size={24} color={COLORS.textDark} />
                            </TouchableOpacity>
                        </View>

                        <FlatList
                            data={notifications}
                            keyExtractor={item => item.id}
                            renderItem={({ item }) => <NotificationItem item={item} />}
                            style={styles.notificationsList}
                            showsVerticalScrollIndicator={false}
                        />

                        <TouchableOpacity
                            style={styles.markAllReadBtn}
                            onPress={() => setShowNotifications(false)}
                        >
                            <Text style={styles.markAllReadText}>Mark all as read</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.peach,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
    },
    greeting: {
        fontSize: 16,
        color: COLORS.grayText,
        fontWeight: "500",
    },
    orgName: {
        fontSize: 24,
        fontWeight: "800",
        color: COLORS.textDark,
        marginTop: 4,
    },
    notificationBtn: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        elevation: 2,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    notificationBadge: {
        position: "absolute",
        top: 12,
        right: 12,
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: COLORS.primary,
        borderWidth: 2,
        borderColor: "#fff",
    },
    statsGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        paddingHorizontal: 20,
        gap: 12,
    },
    statCard: {
        width: "48%",
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 20,
        elevation: 3,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
    },
    statIcon: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 12,
    },
    statNumber: {
        fontSize: 28,
        fontWeight: "800",
        color: COLORS.textDark,
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 13,
        color: COLORS.grayText,
        fontWeight: "600",
    },
    section: {
        marginTop: 24,
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: COLORS.textDark,
        marginBottom: 16,
    },
    actionsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 10,
    },
    actionButton: {
        flex: 1,
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 16,
        elevation: 2,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
    },
    actionIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 8,
    },
    actionLabel: {
        fontSize: 11,
        fontWeight: "600",
        color: COLORS.textDark,
        textAlign: "center",
    },
    activityCard: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 16,
        elevation: 2,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        marginBottom: 20,
    },
    activityItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#f5f5f5",
    },
    activityIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    activityContent: {
        flex: 1,
    },
    activityTitle: {
        fontSize: 14,
        fontWeight: "600",
        color: COLORS.textDark,
        marginBottom: 2,
    },
    activityTime: {
        fontSize: 12,
        color: COLORS.grayText,
        fontWeight: "500",
    },
    // Notification Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "flex-end",
    },
    modalContent: {
        backgroundColor: "#fff",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: "80%",
        paddingBottom: 20,
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "800",
        color: COLORS.textDark,
    },
    notificationsList: {
        maxHeight: 400,
    },
    notificationItem: {
        flexDirection: "row",
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#f5f5f5",
        alignItems: "flex-start",
    },
    unreadNotification: {
        backgroundColor: COLORS.peach + "30",
    },
    notifIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    notifContent: {
        flex: 1,
    },
    notifTitle: {
        fontSize: 15,
        fontWeight: "700",
        color: COLORS.textDark,
        marginBottom: 4,
    },
    notifMessage: {
        fontSize: 13,
        color: COLORS.grayText,
        marginBottom: 6,
        lineHeight: 18,
    },
    notifTime: {
        fontSize: 11,
        color: COLORS.grayText,
        fontWeight: "500",
    },
    unreadDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: COLORS.primary,
        marginLeft: 8,
        marginTop: 4,
    },
    markAllReadBtn: {
        margin: 20,
        marginTop: 10,
        backgroundColor: COLORS.primary,
        borderRadius: 12,
        padding: 16,
        alignItems: "center",
    },
    markAllReadText: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "700",
    },
});
