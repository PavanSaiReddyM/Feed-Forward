import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../../_constants/colors";

export default function Requests() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>My Requests</Text>
            <Text>No active requests.</Text>
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
