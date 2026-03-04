import { StyleSheet, Text, View, TouchableOpacity, TextInput } from "react-native";
import { useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../_constants/colors";

export default function UploadDocuments() {

    const [regNumber, setRegNumber] = useState("");

    return (
        <View style={styles.container}>

            <Text style={styles.title}>NGO Verification</Text>
            <Text style={styles.subtitle}>
                Submit required documents for verification
            </Text>

            <View style={styles.card}>

                <Text style={styles.label}>Registration Number</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Enter NGO Registration Number"
                    value={regNumber}
                    onChangeText={setRegNumber}
                />

                <TouchableOpacity style={styles.uploadBtn}>
                    <MaterialCommunityIcons name="file-upload" size={22} color="#fff" />
                    <Text style={styles.uploadText}>Upload Certificate</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.submitBtn}>
                    <Text style={styles.submitText}>Submit For Verification</Text>
                </TouchableOpacity>

            </View>

        </View>
    )
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: COLORS.peach,
        padding: 20,
        justifyContent: "center"
    },

    title: {
        fontSize: 26,
        fontWeight: "800",
        color: COLORS.primary,
        marginBottom: 10,
        textAlign: "center"
    },

    subtitle: {
        textAlign: "center",
        color: "#555",
        marginBottom: 30
    },

    card: {
        backgroundColor: "#fff",
        padding: 25,
        borderRadius: 20
    },

    label: {
        fontWeight: "600",
        marginBottom: 10
    },

    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 12,
        padding: 15,
        marginBottom: 20
    },

    uploadBtn: {
        backgroundColor: COLORS.primary,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: 15,
        borderRadius: 20,
        marginBottom: 15,
        gap: 8
    },

    uploadText: {
        color: "#fff",
        fontWeight: "600"
    },

    submitBtn: {
        backgroundColor: "#333",
        padding: 15,
        borderRadius: 20,
        alignItems: "center"
    },

    submitText: {
        color: "#fff",
        fontWeight: "700"
    }

})