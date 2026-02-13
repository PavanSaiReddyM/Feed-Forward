import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../../_constants/colors";

export default function NgoDashboard() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>NGO Dashboard</Text>

            <View style={styles.card}>
                <Text style={styles.number}>12</Text>
                <Text style={styles.label}>Food Requests</Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.number}>8</Text>
                <Text style={styles.label}>Completed Pickups</Text>
            </View>
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
        fontSize: 24,
        fontWeight: "700",
        marginBottom: 20,
    },
    card: {
        backgroundColor: "#fff",
        padding: 30,
        borderRadius: 20,
        alignItems: "center",
        marginBottom: 20,
        elevation: 3,
    },
    number: {
        fontSize: 26,
        fontWeight: "700",
        color: COLORS.primary,
    },
    label: {
        marginTop: 5,
        color: "#777",
    },
});
