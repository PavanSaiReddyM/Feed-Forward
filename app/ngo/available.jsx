import { StyleSheet, Text, View, FlatList, TouchableOpacity } from "react-native";
import { COLORS } from "../../_constants/colors";

export default function AvailableFood() {
    const donations = [
        { id: "1", name: "Rice & Curry", quantity: "10kg", location: "Hyderabad" },
        { id: "2", name: "Bread Packets", quantity: "20 pcs", location: "Secunderabad" },
    ];

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Available Donations</Text>

            <FlatList
                data={donations}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.food}>{item.name}</Text>
                        <Text style={styles.info}>Quantity: {item.quantity}</Text>
                        <Text style={styles.info}>Location: {item.location}</Text>

                        <TouchableOpacity style={styles.requestBtn}>
                            <Text style={styles.requestText}>Request</Text>
                        </TouchableOpacity>
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
        padding: 20,
        borderRadius: 18,
        marginBottom: 15,
        elevation: 2,
    },
    food: {
        fontWeight: "700",
        fontSize: 16,
    },
    info: {
        marginTop: 4,
        color: "#555",
    },
    requestBtn: {
        backgroundColor: COLORS.primary,
        padding: 10,
        borderRadius: 15,
        marginTop: 10,
        alignItems: "center",
    },
    requestText: {
        color: "#fff",
        fontWeight: "600",
    },
});
