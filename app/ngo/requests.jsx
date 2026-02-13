import { StyleSheet, Text, View, FlatList } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../../_constants/colors";

export default function Requests() {
    const requests = [
        {
            id: "1",
            food: "Rice & Curry",
            donor: "ABC Restaurant",
            status: "Pending",
            quantity: "10kg",
            requestedOn: "12 Feb 2026",
        },
        {
            id: "2",
            food: "Bread Packets",
            donor: "Fresh Bakery",
            status: "Approved",
            quantity: "20 pcs",
            requestedOn: "11 Feb 2026",
        },
        {
            id: "3",
            food: "Fresh Vegetables",
            donor: "Green Market",
            status: "Approved",
            quantity: "15kg",
            requestedOn: "10 Feb 2026",
        },
    ];

    const getStatusConfig = (status) => {
        switch (status) {
            case "Approved":
                return {
                    icon: "check-circle",
                    bgColor: COLORS.successLight,
                    textColor: COLORS.success,
                };
            case "Pending":
                return {
                    icon: "clock-outline",
                    bgColor: COLORS.pendingLight,
                    textColor: COLORS.pending,
                };
            default:
                return {
                    icon: "information",
                    bgColor: "#f5f5f5",
                    textColor: COLORS.grayText,
                };
        }
    };

    const renderItem = ({ item }) => {
        const statusConfig = getStatusConfig(item.status);

        return (
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <View style={styles.iconCircle}>
                        <MaterialCommunityIcons name="food" size={24} color={COLORS.primary} />
                    </View>
                    <View style={styles.headerContent}>
                        <Text style={styles.food}>{item.food}</Text>
                        <Text style={styles.quantity}>{item.quantity}</Text>
                    </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.infoRow}>
                    <MaterialCommunityIcons name="store" size={18} color={COLORS.grayText} />
                    <Text style={styles.info}>{item.donor}</Text>
                </View>

                <View style={styles.infoRow}>
                    <MaterialCommunityIcons name="calendar" size={18} color={COLORS.grayText} />
                    <Text style={styles.info}>Requested on {item.requestedOn}</Text>
                </View>

                <View style={[styles.statusBadge, { backgroundColor: statusConfig.bgColor }]}>
                    <MaterialCommunityIcons
                        name={statusConfig.icon}
                        size={16}
                        color={statusConfig.textColor}
                    />
                    <Text style={[styles.statusText, { color: statusConfig.textColor }]}>
                        {item.status}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>My Requests</Text>
                <Text style={styles.subtitle}>Track your food requests</Text>
            </View>

            <FlatList
                data={requests}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.peach,
    },
    header: {
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: "800",
        color: COLORS.textDark,
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 15,
        color: COLORS.grayText,
        fontWeight: "500",
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    card: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 20,
        marginBottom: 16,
        elevation: 4,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
    },
    cardHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
    },
    iconCircle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: COLORS.peach,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    headerContent: {
        flex: 1,
    },
    food: {
        fontSize: 18,
        fontWeight: "700",
        color: COLORS.textDark,
        marginBottom: 2,
    },
    quantity: {
        fontSize: 14,
        color: COLORS.grayText,
        fontWeight: "600",
    },
    divider: {
        height: 1,
        backgroundColor: "#f0f0f0",
        marginBottom: 12,
    },
    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    info: {
        marginLeft: 10,
        fontSize: 14,
        color: COLORS.grayText,
        fontWeight: "500",
    },
    statusBadge: {
        marginTop: 12,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        alignSelf: "flex-start",
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    statusText: {
        fontSize: 13,
        fontWeight: "700",
    },
});
