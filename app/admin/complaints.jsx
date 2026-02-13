import {
    StyleSheet,
    Text,
    View,
    FlatList,
    TouchableOpacity,
} from "react-native";
import { useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../../_constants/colors";

export default function Complaints() {
    const [complaints, setComplaints] = useState([
        {
            id: "1",
            userName: "Ravi Kumar",
            role: "Donor",
            message: "NGO did not arrive for pickup on time.",
            date: "12 Feb 2026",
            status: "Pending",
        },
        {
            id: "2",
            userName: "Helping Hands NGO",
            role: "NGO",
            message: "Food quality was not suitable for distribution.",
            date: "10 Feb 2026",
            status: "Pending",
        },
    ]);

    const markResolved = (id) => {
        const updated = complaints.map((item) =>
            item.id === id
                ? { ...item, status: "Resolved" }
                : item
        );
        setComplaints(updated);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>User Complaints</Text>

            <FlatList
                data={complaints}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <View style={styles.card}>

                        {/* User Info */}
                        <View style={styles.userRow}>
                            <MaterialCommunityIcons
                                name="account-circle"
                                size={28}
                                color={COLORS.primary}
                            />
                            <View style={{ marginLeft: 10 }}>
                                <Text style={styles.userName}>
                                    {item.userName}
                                </Text>
                                <Text style={styles.role}>
                                    {item.role}
                                </Text>
                            </View>

                            <View
                                style={[
                                    styles.statusBadge,
                                    item.status === "Resolved" &&
                                    styles.resolvedBadge,
                                ]}
                            >
                                <Text style={styles.statusText}>
                                    {item.status}
                                </Text>
                            </View>
                        </View>

                        {/* Complaint Text */}
                        <Text style={styles.message}>
                            {item.message}
                        </Text>

                        {/* Date + Action */}
                        <View style={styles.bottomRow}>
                            <Text style={styles.date}>
                                {item.date}
                            </Text>

                            {item.status === "Pending" && (
                                <TouchableOpacity
                                    style={styles.resolveButton}
                                    onPress={() =>
                                        markResolved(item.id)
                                    }
                                >
                                    <Text style={styles.resolveText}>
                                        Mark Resolved
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                )}
            />
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.peach,
        padding: 20,
    },

    title: {
        fontSize: 22,
        fontWeight: "700",
        marginBottom: 20,
    },

    card: {
        backgroundColor: "#fff",
        padding: 18,
        borderRadius: 18,
        marginBottom: 15,
        elevation: 3,
    },

    userRow: {
        flexDirection: "row",
        alignItems: "center",
    },

    userName: {
        fontWeight: "700",
        fontSize: 15,
    },

    role: {
        fontSize: 12,
        color: "#777",
    },

    statusBadge: {
        marginLeft: "auto",
        backgroundColor: "#ffe0b2",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },

    resolvedBadge: {
        backgroundColor: "#c8e6c9",
    },

    statusText: {
        fontSize: 12,
        fontWeight: "600",
    },

    message: {
        marginTop: 12,
        fontSize: 14,
        color: "#444",
    },

    bottomRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 12,
    },

    date: {
        fontSize: 12,
        color: "#888",
    },

    resolveButton: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
    },

    resolveText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "600",
    },
});
