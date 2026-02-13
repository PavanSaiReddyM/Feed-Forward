import { StyleSheet, Text, View, FlatList } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../../_constants/colors";

export default function History() {
    const historyData = [
        {
            id: "1",
            food: "Vegetable Biryani",
            donor: "Royal Hotel",
            date: "11 January 2026",
            quantity: "25kg",
            beneficiaries: "50 people",
        },
        {
            id: "2",
            food: "Milk Packets",
            donor: "Dairy Farm",
            date: "2 February 2026",
            quantity: "30 liters",
            beneficiaries: "40 people",
        },
        {
            id: "3",
            food: "Fresh Bread",
            donor: "City Bakery",
            date: "8 February 2026",
            quantity: "40 loaves",
            beneficiaries: "60 people",
        },
    ];

    const renderItem = ({ item, index }) => (
        <View style={styles.timelineItem}>
            <View style={styles.timelineIndicator}>
                <View style={styles.timelineDot} />
                {index < historyData.length - 1 && <View style={styles.timelineLine} />}
            </View>

            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <View style={styles.iconCircle}>
                        <MaterialCommunityIcons name="check-circle" size={24} color={COLORS.success} />
                    </View>
                    <View style={styles.headerContent}>
                        <Text style={styles.food}>{item.food}</Text>
                        <Text style={styles.date}>{item.date}</Text>
                    </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.infoRow}>
                    <MaterialCommunityIcons name="store" size={18} color={COLORS.grayText} />
                    <Text style={styles.info}>{item.donor}</Text>
                </View>

                <View style={styles.infoRow}>
                    <MaterialCommunityIcons name="weight" size={18} color={COLORS.grayText} />
                    <Text style={styles.info}>{item.quantity}</Text>
                </View>

                <View style={styles.infoRow}>
                    <MaterialCommunityIcons name="account-group" size={18} color={COLORS.grayText} />
                    <Text style={styles.info}>Served {item.beneficiaries}</Text>
                </View>

                <View style={styles.completedBadge}>
                    <MaterialCommunityIcons name="checkbox-marked-circle" size={16} color={COLORS.success} />
                    <Text style={styles.completedText}>Completed</Text>
                </View>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Pickup History</Text>
                <Text style={styles.subtitle}>Your impact timeline</Text>
            </View>

            <FlatList
                data={historyData}
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
    timelineItem: {
        flexDirection: "row",
        marginBottom: 16,
    },
    timelineIndicator: {
        alignItems: "center",
        marginRight: 16,
        width: 20,
    },
    timelineDot: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: COLORS.success,
        borderWidth: 4,
        borderColor: COLORS.successLight,
        zIndex: 1,
    },
    timelineLine: {
        width: 3,
        flex: 1,
        backgroundColor: COLORS.successLight,
        marginTop: 4,
    },
    card: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 20,
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
        backgroundColor: COLORS.successLight,
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
    date: {
        fontSize: 13,
        color: COLORS.primary,
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
    completedBadge: {
        marginTop: 12,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: COLORS.successLight,
        alignSelf: "flex-start",
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    completedText: {
        fontSize: 13,
        fontWeight: "700",
        color: COLORS.success,
    },
});
