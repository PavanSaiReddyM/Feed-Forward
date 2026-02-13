import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    FlatList,
    Image,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../../_constants/colors";

export default function NGOs() {
    const ngoList = [
        {
            id: "1",
            name: "Helping Hands NGO",
            location: "Hyderabad, Telangana",
            date: "Joined 2 days ago",
            status: "Pending",
        },
        {
            id: "2",
            name: "Care Foundation",
            location: "Secunderabad, Telangana",
            date: "Joined 5 hours ago",
            status: "Pending",
        },
        {
            id: "3",
            name: "Food For All",
            location: "Cyber Towers, Hitech City",
            date: "Joined 1 day ago",
            status: "Verified",
        },
    ];

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View style={styles.iconContainer}>
                    <MaterialCommunityIcons
                        name="office-building"
                        size={24}
                        color={COLORS.primary}
                    />
                </View>
                <View style={styles.headerContent}>
                    <Text style={styles.name}>{item.name}</Text>
                    <View style={styles.locationRow}>
                        <MaterialCommunityIcons name="map-marker" size={14} color={COLORS.grayText} />
                        <Text style={styles.location}>{item.location}</Text>
                    </View>
                </View>
                <View style={[
                    styles.statusBadge,
                    { backgroundColor: item.status === "Verified" ? COLORS.success + "20" : COLORS.warning + "20" }
                ]}>
                    <Text style={[
                        styles.statusText,
                        { color: item.status === "Verified" ? COLORS.success : COLORS.warning }
                    ]}>{item.status}</Text>
                </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.cardFooter}>
                <Text style={styles.date}>{item.date}</Text>

                {item.status === "Pending" && (
                    <View style={styles.buttonRow}>
                        <TouchableOpacity style={styles.rejectBtn}>
                            <MaterialCommunityIcons name="close" size={20} color={COLORS.error} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.approveBtn}>
                            <Text style={styles.approveText}>Verify</Text>
                            <MaterialCommunityIcons name="check" size={18} color="#fff" />
                        </TouchableOpacity>
                    </View>
                )}

                {item.status === "Verified" && (
                    <TouchableOpacity style={styles.viewBtn}>
                        <Text style={styles.viewText}>View Details</Text>
                        <MaterialCommunityIcons name="arrow-right" size={16} color={COLORS.primary} />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton}>
                    <MaterialCommunityIcons name="arrow-left" size={24} color={COLORS.textDark} />
                </TouchableOpacity>
                <Text style={styles.title}>NGO Verification</Text>
                <TouchableOpacity style={styles.filterButton}>
                    <MaterialCommunityIcons name="filter-variant" size={24} color={COLORS.textDark} />
                </TouchableOpacity>
            </View>

            <FlatList
                data={ngoList}
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
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
    },
    backButton: {
        padding: 8,
        borderRadius: 12,
        backgroundColor: "#fff",
        elevation: 2,
    },
    filterButton: {
        padding: 8,
    },
    title: {
        fontSize: 20,
        fontWeight: "800",
        color: COLORS.textDark,
    },
    listContent: {
        padding: 20,
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 20,
        marginBottom: 16,
        padding: 16,
        elevation: 3,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    cardHeader: {
        flexDirection: "row",
        alignItems: "flex-start",
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: COLORS.peach,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    headerContent: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: "700",
        color: COLORS.textDark,
        marginBottom: 4,
    },
    locationRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    location: {
        fontSize: 13,
        color: COLORS.grayText,
        fontWeight: "500",
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 12,
        fontWeight: "700",
    },
    divider: {
        height: 1,
        backgroundColor: "#f0f0f0",
        marginVertical: 12,
    },
    cardFooter: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    date: {
        fontSize: 12,
        color: COLORS.grayText,
        fontWeight: "500",
    },
    buttonRow: {
        flexDirection: "row",
        gap: 8,
    },
    rejectBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#ffebee",
        justifyContent: "center",
        alignItems: "center",
    },
    approveBtn: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.success,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 18,
        gap: 6,
    },
    approveText: {
        color: "#fff",
        fontSize: 13,
        fontWeight: "700",
    },
    viewBtn: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    viewText: {
        color: COLORS.primary,
        fontWeight: "600",
        fontSize: 13,
    },
});
