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

    const InfoCard = ({ icon, value, setValue, isEditing, multiline }) => (
        <View style={styles.card}>
            <View style={styles.iconCircle}>
                <MaterialCommunityIcons name={icon} size={24} color={COLORS.primary} />
            </View>

            {isEditing ? (
                <TextInput
                    style={[styles.cardInput, multiline && { height: 70 }]}
                    value={value}
                    onChangeText={setValue}
                    multiline={multiline}
                    placeholderTextColor={COLORS.grayText}
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
                    style={styles.editButton}
                    onPress={() => setIsEditing(!isEditing)}
                >
                    <MaterialCommunityIcons
                        name={isEditing ? "close" : "pencil"}
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
                        placeholderTextColor={COLORS.grayText}
                    />
                ) : (
                    <Text style={styles.name}>{ngoName}</Text>
                )}

                <View style={styles.badge}>
                    <MaterialCommunityIcons name="shield-check" size={16} color="#fff" />
                    <Text style={styles.badgeText}> Verified NGO</Text>
                </View>
            </View>

            {/* INFO CARDS */}
            <View style={styles.cardsContainer}>
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
            </View>

            {/* SAVE BUTTON */}
            {isEditing && (
                <TouchableOpacity
                    style={styles.saveButtonContainer}
                    onPress={() => setIsEditing(false)}
                >
                    <View style={styles.saveButton}>
                        <MaterialCommunityIcons name="content-save" size={22} color="#fff" />
                        <Text style={styles.saveButtonText}>Save Changes</Text>
                    </View>
                </TouchableOpacity>
            )}

            {/* SIGN OUT BUTTON */}
            <TouchableOpacity style={styles.signOutButton}>
                <MaterialCommunityIcons name="logout" size={22} color="#fff" />
                <Text style={styles.signOutText}>Sign Out</Text>
            </TouchableOpacity>
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
        elevation: 8,
    },

    headerTitle: {
        color: "#fff",
        fontSize: 24,
        fontWeight: "800",
        textShadowColor: "rgba(0, 0, 0, 0.2)",
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },

    editButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "rgba(255, 255, 255, 0.25)",
        justifyContent: "center",
        alignItems: "center",
    },

    profileSection: {
        alignItems: "center",
        marginTop: -40,
        marginBottom: 30,
    },

    avatar: {
        width: 110,
        height: 110,
        borderRadius: 55,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        elevation: 8,
        shadowColor: COLORS.shadowDark,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        borderWidth: 4,
        borderColor: "#fff",
    },

    name: {
        fontSize: 22,
        fontWeight: "800",
        marginTop: 15,
        color: COLORS.textDark,
    },

    nameInput: {
        fontSize: 22,
        fontWeight: "800",
        marginTop: 15,
        borderBottomWidth: 2,
        borderBottomColor: COLORS.primary,
        paddingBottom: 4,
        minWidth: 200,
        textAlign: "center",
        color: COLORS.textDark,
    },

    badge: {
        backgroundColor: COLORS.success,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginTop: 12,
        flexDirection: "row",
        alignItems: "center",
        elevation: 3,
    },

    badgeText: {
        color: "#fff",
        fontSize: 13,
        fontWeight: "700",
    },

    cardsContainer: {
        paddingHorizontal: 20,
    },

    card: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        marginBottom: 16,
        padding: 20,
        borderRadius: 20,
        elevation: 3,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
    },

    iconCircle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: COLORS.peach,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 16,
    },

    cardText: {
        flex: 1,
        fontSize: 16,
        color: COLORS.textDark,
        fontWeight: "500",
    },

    cardInput: {
        flex: 1,
        fontSize: 16,
        borderBottomWidth: 2,
        borderBottomColor: COLORS.primary,
        paddingBottom: 4,
        color: COLORS.textDark,
        fontWeight: "500",
    },

    saveButtonContainer: {
        margin: 20,
        marginTop: 10,
        borderRadius: 25,
        overflow: "hidden",
        elevation: 5,
    },

    saveButton: {
        backgroundColor: COLORS.primary,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: 18,
        gap: 10,
    },

    saveButtonText: {
        color: "#fff",
        fontWeight: "800",
        fontSize: 17,
    },

    signOutButton: {
        backgroundColor: "#d32f2f",
        margin: 20,
        marginTop: 10,
        borderRadius: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: 18,
        gap: 10,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },

    signOutText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 16,
    },
});
