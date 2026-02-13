import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../../_constants/colors";

export default function History() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Pickup History</Text>
            <Text>No completed pickups yet.</Text>
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
});
