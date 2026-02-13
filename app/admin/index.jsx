import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../../_constants/colors";

export default function AdminHome() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Admin Dashboard</Text>

            <View style={styles.card}>
                <Text style={styles.number}>120</Text>
                <Text style={styles.label}>Total Users</Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.number}>85</Text>
                <Text style={styles.label}>Completed Donations</Text>
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
        elevation: 4,
    },
    number: {
        fontSize: 28,
        fontWeight: "700",
        color: COLORS.primary,
    },
    label: {
        marginTop: 5,
        color: "#777",
    },
});
