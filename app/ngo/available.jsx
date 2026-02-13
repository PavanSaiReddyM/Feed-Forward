import { StyleSheet, Text, View, FlatList, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../../_constants/colors";

export default function AvailableFood() {
    const donations = [
        { id: "1", name: "Rice & Curry", quantity: "10kg", location: "Hyderabad", donor: "ABC Restaurant" },
        { id: "2", name: "Bread Packets", quantity: "20 pcs", location: "Secunderabad", donor: "Fresh Bakery" },
        { id: "3", name: "Fresh Vegetables", quantity: "15kg", location: "Banjara Hills", donor: "Green Market" },
    ];

    const renderDonation = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.iconCircle}>
                <MaterialCommunityIcons name="food-variant" size={28} color={COLORS.primary} />
            </View>

            <View style={styles.cardContent}>
                <Text style={styles.foodName}>{item.name}</Text>

                <View style={styles.infoRow}>
                    <MaterialCommunityIcons name="weight-kilogram" size={16} color={COLORS.grayText} />
                    <Text style={styles.infoText}>{item.quantity}</Text>
                </View>

                <View style={styles.infoRow}>
                    <MaterialCommunityIcons name="map-marker" size={16} color={COLORS.grayText} />
                    <Text style={styles.infoText}>{item.location}</Text>
                </View>

                <View style={styles.infoRow}>
                    <MaterialCommunityIcons name="store" size={16} color={COLORS.grayText} />
                    <Text style={styles.infoText}>{item.donor}</Text>
                </View>
            </View>

            <TouchableOpacity style={styles.requestBtn}>
                <View style={styles.requestBtnContent}>
                    <MaterialCommunityIcons name="hand-heart" size={20} color="#fff" />
                    <Text style={styles.requestText}>Request</Text>
                </View>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Available Donations</Text>
                <Text style={styles.subtitle}>Food ready for pickup</Text>
            </View>

            <FlatList
                data={donations}
                keyExtractor={(item) => item.id}
                renderItem={renderDonation}
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
        borderRadius: 20,
        marginBottom: 16,
        elevation: 4,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        overflow: "hidden",
    },
    iconCircle: {
        position: "absolute",
        top: 20,
        right: 20,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: COLORS.peach,
        justifyContent: "center",
        alignItems: "center",
    },
    cardContent: {
        padding: 20,
        paddingRight: 90,
    },
    foodName: {
        fontSize: 20,
        fontWeight: "700",
        color: COLORS.textDark,
        marginBottom: 12,
    },
    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 6,
    },
    infoText: {
        marginLeft: 8,
        fontSize: 14,
        color: COLORS.grayText,
        fontWeight: "500",
    },
    requestBtn: {
        marginHorizontal: 20,
        marginBottom: 20,
        borderRadius: 16,
        overflow: "hidden",
        elevation: 3,
        backgroundColor: COLORS.primary,
    },
    requestBtnContent: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 14,
        paddingHorizontal: 24,
        gap: 8,
    },
    requestText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 16,
    },
});
