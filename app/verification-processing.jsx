import { StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../_constants/colors";

export default function VerificationProcessing() {

    return (

        <View style={styles.container}>

            <MaterialCommunityIcons
                name="progress-clock"
                size={80}
                color={COLORS.primary}
            />

            <Text style={styles.title}>
                Verification in Progress
            </Text>

            <Text style={styles.message}>
                Your NGO documents are currently under review.
                Admin will verify them shortly.

                You will be able to access NGO dashboard
                after approval.
            </Text>

        </View>

    )
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: COLORS.peach,
        justifyContent: "center",
        alignItems: "center",
        padding: 40
    },

    title: {
        fontSize: 24,
        fontWeight: "800",
        color: COLORS.primary,
        marginTop: 20,
        marginBottom: 15
    },

    message: {
        textAlign: "center",
        color: "#555",
        fontSize: 15,
        lineHeight: 22
    }

})