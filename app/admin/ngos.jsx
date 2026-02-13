import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    FlatList,
} from "react-native";
import { COLORS } from "../../_constants/colors";

export default function NGOs() {
    const ngoList = [
        { id: "1", name: "Helping Hands NGO" },
        { id: "2", name: "Care Foundation" },
    ];

    return (
        <View style={styles.container}>
            <Text style={styles.title}>NGOs to Verify</Text>

            <FlatList
                data={ngoList}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.name}>{item.name}</Text>

                        <View style={styles.buttonRow}>
                            <TouchableOpacity style={styles.approve}>
                                <Text style={styles.btnText}>Approve</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.reject}>
                                <Text style={styles.btnText}>Reject</Text>
                            </TouchableOpacity>
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
        padding: 20,
        borderRadius: 15,
        marginBottom: 15,
        elevation: 2,
    },
    name: {
        fontWeight: "600",
        marginBottom: 10,
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    approve: {
        backgroundColor: COLORS.primary,
        padding: 10,
        borderRadius: 10,
    },
    reject: {
        backgroundColor: "#999",
        padding: 10,
        borderRadius: 10,
    },
    btnText: {
        color: "#fff",
    },
});
