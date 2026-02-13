import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Modal } from "react-native";
import { useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../../_constants/colors";

export default function NgoDashboard() {
    const [showNotifications, setShowNotifications] = useState(false);

    const notifications = [
        {
            id: 1,
            icon: "check-circle",
            title: "Request Approved",
            message: "Your request for Rice & Curry has been approved",
            time: "2 hours ago",
            color: COLORS.success,
            unread: true,
        },
        {
            id: 2,
            icon: "food-variant",
            title: "New Food Available",
            message: "Fresh Vegetables available at Green Market",
            time: "5 hours ago",
            color: COLORS.primary,
            unread: true,
        },
        {
            id: 3,
            icon: "truck-delivery",
            title: "Pickup Completed",
            message: "Successfully picked up Bread Packets",
            time: "1 day ago",
            color: COLORS.accentBlue,
            unread: false,
        },
        {
            id: 4,
            icon: "alert-circle",
            title: "Reminder",
            message: "Pending pickup for approved request",
            time: "2 days ago",
            color: COLORS.warning,
            unread: false,
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

    const NotificationItem = ({ icon, title, message, time, color, unread }) => (
        <View style={[styles.notificationItem, unread && styles.unreadNotification]}>
            <View style={[styles.notifIcon, { backgroundColor: color + "20" }]}>
                <MaterialCommunityIcons name={icon} size={24} color={color} />
            </View>
            <View style={styles.notifContent}>
                <Text style={styles.notifTitle}>{title}</Text>
                <Text style={styles.notifMessage}>{message}</Text>
                <Text style={styles.notifTime}>{time}</Text>
            </View>
            {unread && <View style={styles.unreadDot} />}
        </View>
    );

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* HEADER */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Welcome Back! 👋</Text>
                    <Text style={styles.orgName}>Helping Hands NGO</Text>
                </View>
                <TouchableOpacity
                    style={styles.notificationBtn}
                    onPress={() => setShowNotifications(true)}
                >
                    <MaterialCommunityIcons name="bell-outline" size={24} color={COLORS.textDark} />
                    <View style={styles.notificationBadge} />
                </TouchableOpacity>
            </View>

            {/* STATS GRID */}
            <View style={styles.statsGrid}>
                <StatCard
                    icon="food-variant"
                    number="12"
                    label="Active Requests"
                    iconBg={COLORS.primary}
                />
                <StatCard
                    icon="check-circle"
                    number="8"
                    label="Completed"
                    iconBg={COLORS.success}
                />
                <StatCard
                    icon="truck-delivery"
                    number="5"
                    label="In Transit"
                    iconBg={COLORS.accentBlue}
                />
                <StatCard
                    icon="account-group"
                    number="150"
                    label="People Served"
                    iconBg={COLORS.accentPurple}
                />
            </View>

            {/* RECENT ACTIVITY */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Recent Activity</Text>
                <View style={styles.activityCard}>
                    <ActivityItem
                        icon="check-circle"
                        title="Request approved - Rice & Curry"
                        time="2 hours ago"
                        iconColor={COLORS.success}
                    />
                    <ActivityItem
                        icon="clock-outline"
                        title="New request pending - Bread Packets"
                        time="5 hours ago"
                        iconColor={COLORS.warning}
                    />
                    <ActivityItem
                        icon="truck-delivery"
                        title="Pickup completed - Fresh Vegetables"
                        time="1 day ago"
                        iconColor={COLORS.accentBlue}
                    />
                </View>
            </View>

            {/* NOTIFICATIONS MODAL */}
            <Modal
                visible={showNotifications}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowNotifications(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Notifications</Text>
                            <TouchableOpacity onPress={() => setShowNotifications(false)}>
                                <MaterialCommunityIcons name="close" size={24} color={COLORS.textDark} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.notificationsList}>
                            {notifications.map((notif) => (
                                <NotificationItem key={notif.id} {...notif} />
                            ))}
                        </ScrollView>

                        <TouchableOpacity
                            style={styles.markAllReadBtn}
                            onPress={() => setShowNotifications(false)}
                        >
                            <Text style={styles.markAllReadText}>Mark All as Read</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </ScrollView>
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
