import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TextInput,
    ScrollView,
} from "react-native";
import { useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../../_constants/colors";

export default function NgoProfile() {
    const [isEditing, setIsEditing] = useState(false);

    const [ngoName, setNgoName] = useState("Helping Hands NGO");
    const [email, setEmail] = useState("helpinghands@gmail.com");
    const [phone, setPhone] = useState("9876543210");
    const [address, setAddress] = useState("Hyderabad, Telangana");
    const InfoCard = ({
        icon,
        value,
        setValue,
        isEditing,
        multiline,
    }) => (
        <View style={styles.card}>
            <MaterialCommunityIcons
                name={icon}
                size={24}
                color={COLORS.primary}
            />

            {isEditing ? (
                <TextInput
                    style={[styles.cardInput, multiline && { height: 70 }]}
                    value={value}
                    onChangeText={setValue}
                    multiline={multiline}
                />
            ) : (
                <Text style={styles.cardText}>{value}</Text>
            )}
        </View>
    );


    return (
        <ScrollView style={styles.container}>

            {/* HEADER */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>NGO Profile</Text>

                <TouchableOpacity
                    onPress={() => setIsEditing(!isEditing)}
                >
                    <MaterialCommunityIcons
                        name="pencil"
                        size={22}
                        color="#fff"
                    />
                </TouchableOpacity>
            </View>

            {/* PROFILE SECTION */}
            <View style={styles.profileSection}>
                <View style={styles.avatar}>
                    <MaterialCommunityIcons
                        name="account-group"
                        size={50}
                        color={COLORS.primary}
                    />
                </View>

                {isEditing ? (
                    <TextInput
                        style={styles.nameInput}
                        value={ngoName}
                        onChangeText={setNgoName}
                    />
                ) : (
                    <Text style={styles.name}>{ngoName}</Text>
                )}

                <View style={styles.badge}>
                    <MaterialCommunityIcons
                        name="shield-check"
                        size={16}
                        color="#fff"
                    />
                    <Text style={styles.badgeText}> Verified NGO</Text>
                </View>
            </View>

            {/* INFO CARDS */}
            <InfoCard
                icon="email-outline"
                value={email}
                setValue={setEmail}
                isEditing={isEditing}
            />

            <InfoCard
                icon="phone-outline"
                value={phone}
                setValue={setPhone}
                isEditing={isEditing}
            />

            <InfoCard
                icon="map-marker-outline"
                value={address}
                setValue={setAddress}
                isEditing={isEditing}
                multiline
            />

            {/* SAVE BUTTON */}
            {isEditing && (
                <TouchableOpacity style={styles.saveButton}>
                    <Text style={styles.saveButtonText}>
                        Save Changes
                    </Text>
                </TouchableOpacity>
            )}
        </ScrollView>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.peach,
    },

    header: {
        backgroundColor: COLORS.primary,
        paddingTop: 60,
        paddingBottom: 30,
        paddingHorizontal: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },

    headerTitle: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "700",
    },

    profileSection: {
        alignItems: "center",
        marginTop: -40,
        marginBottom: 20,
    },

    avatar: {
        width: 110,
        height: 110,
        borderRadius: 55,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        elevation: 5,
    },

    name: {
        fontSize: 20,
        fontWeight: "700",
        marginTop: 15,
    },

    nameInput: {
        fontSize: 20,
        fontWeight: "700",
        marginTop: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
    },

    badge: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        marginTop: 10,
        flexDirection: "row",
        alignItems: "center",
    },

    badgeText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "600",
    },

    card: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        marginHorizontal: 20,
        marginBottom: 15,
        padding: 18,
        borderRadius: 18,
        elevation: 2,
    },

    cardText: {
        marginLeft: 15,
        fontSize: 16,
        flex: 1,
    },

    cardInput: {
        marginLeft: 15,
        fontSize: 16,
        flex: 1,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
    },

    saveButton: {
        backgroundColor: COLORS.primary,
        margin: 20,
        padding: 18,
        borderRadius: 25,
        alignItems: "center",
    },

    saveButtonText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 16,
    },
});
