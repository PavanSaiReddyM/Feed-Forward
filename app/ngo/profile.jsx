


import {
    StyleSheet, Text, View, TouchableOpacity, ScrollView,
    Modal, TextInput, Animated,
} from "react-native";
import { useState, useRef } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../../_constants/colors";

const SETTINGS = [
    { icon: "bell-outline", label: "Notifications", color: COLORS.primary },
    { icon: "shield-lock-outline", label: "Privacy & Security", color: COLORS.accentBlue },
    { icon: "help-circle-outline", label: "Help & Support", color: COLORS.success },
    { icon: "information-outline", label: "About Food Saver", color: COLORS.accentPurple },
];

function InfoRow({ icon, label, value }) {
    return (
        <View style={styles.infoRow}>
            <View style={styles.infoIconWrap}>
                <MaterialCommunityIcons name={icon} size={18} color={COLORS.primary} />
            </View>
            <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>{label}</Text>
                <Text style={styles.infoValue}>{value}</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={18} color={COLORS.border} />
        </View>
    );
}

export default function NgoProfile() {
    const [showEditSheet, setShowEditSheet] = useState(false);
    const [ngoName, setNgoName] = useState("Helping Hands NGO");
    const [email, setEmail] = useState("helpinghands@gmail.com");
    const [phone, setPhone] = useState("+91 98765 43210");
    const [address, setAddress] = useState("Hyderabad, Telangana");

    const slideAnim = useRef(new Animated.Value(500)).current;

    const openEdit = () => {
        setShowEditSheet(true);
        Animated.spring(slideAnim, { toValue: 0, tension: 65, friction: 11, useNativeDriver: true }).start();
    };
    const closeEdit = () => {
        Animated.timing(slideAnim, { toValue: 500, duration: 250, useNativeDriver: true }).start(() => setShowEditSheet(false));
    };

    return (
        <View style={{ flex: 1 }}>
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

                {/* Hero Header */}
                <View style={styles.hero}>
                    <View style={styles.heroBlob1} />
                    <View style={styles.heroBlob2} />

                    <TouchableOpacity style={styles.editBtn} onPress={openEdit}>
                        <MaterialCommunityIcons name="pencil-outline" size={18} color={COLORS.white} />
                    </TouchableOpacity>

                    {/* Avatar */}
                    <View style={styles.avatarWrap}>
                        <View style={styles.avatar}>
                            <MaterialCommunityIcons name="account-group" size={44} color={COLORS.success} />
                        </View>
                        <TouchableOpacity style={styles.avatarCameraBtn}>
                            <MaterialCommunityIcons name="camera-outline" size={14} color={COLORS.white} />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.heroName}>{ngoName}</Text>

                    {/* Verified banner */}
                    <View style={styles.verifiedBadge}>
                        <MaterialCommunityIcons name="shield-check" size={14} color={COLORS.white} />
                        <Text style={styles.verifiedText}>Verified NGO</Text>
                    </View>
                </View>

                {/* Impact stats row */}
                <View style={styles.impactRow}>
                    {[
                        { num: "24", label: "Pickups", icon: "truck-delivery-outline", color: COLORS.primary },
                        { num: "185", label: "People Fed", icon: "account-group-outline", color: COLORS.success },
                        { num: "~95kg", label: "Food Saved", icon: "scale-balance", color: COLORS.accentBlue },
                    ].map((stat, i) => (
                        <View key={i} style={[styles.impactCell, i < 2 && styles.impactCellBorder]}>
                            <View style={[styles.impactIconWrap, { backgroundColor: stat.color + "15" }]}>
                                <MaterialCommunityIcons name={stat.icon} size={18} color={stat.color} />
                            </View>
                            <Text style={styles.impactNum}>{stat.num}</Text>
                            <Text style={styles.impactLabel}>{stat.label}</Text>
                        </View>
                    ))}
                </View>

                {/* Info cards */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Profile Info</Text>
                    <View style={styles.infoCard}>
                        <InfoRow icon="email-outline" label="Email" value={email} />
                        <View style={styles.rowDivider} />
                        <InfoRow icon="phone-outline" label="Phone" value={phone} />
                        <View style={styles.rowDivider} />
                        <InfoRow icon="map-marker-outline" label="Location" value={address} />
                    </View>
                </View>

                {/* Settings */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Settings</Text>
                    <View style={styles.infoCard}>
                        {SETTINGS.map((s, i) => (
                            <View key={s.label}>
                                <TouchableOpacity style={styles.settingRow} activeOpacity={0.7}>
                                    <View style={[styles.settingIcon, { backgroundColor: s.color + "15" }]}>
                                        <MaterialCommunityIcons name={s.icon} size={18} color={s.color} />
                                    </View>
                                    <Text style={styles.settingLabel}>{s.label}</Text>
                                    <MaterialCommunityIcons name="chevron-right" size={18} color={COLORS.border} />
                                </TouchableOpacity>
                                {i < SETTINGS.length - 1 && <View style={styles.rowDivider} />}
                            </View>
                        ))}
                    </View>
                </View>

                {/* Sign out */}
                <TouchableOpacity style={styles.signOutBtn} activeOpacity={0.8}>
                    <MaterialCommunityIcons name="logout" size={20} color={COLORS.error} />
                    <Text style={styles.signOutText}>Sign Out</Text>
                </TouchableOpacity>

                <Text style={styles.versionText}>Food Saver v1.0.0</Text>
                <View style={{ height: 32 }} />
            </ScrollView>

            {/* Edit Bottom Sheet */}
            <Modal visible={showEditSheet} transparent animationType="none" onRequestClose={closeEdit}>
                <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={closeEdit} />
                <Animated.View style={[styles.bottomSheet, { transform: [{ translateY: slideAnim }] }]}>
                    <View style={styles.sheetHandle} />
                    <View style={styles.sheetHeader}>
                        <Text style={styles.sheetTitle}>Edit Profile</Text>
                        <TouchableOpacity onPress={closeEdit}>
                            <MaterialCommunityIcons name="close" size={22} color={COLORS.textDark} />
                        </TouchableOpacity>
                    </View>
                    <ScrollView contentContainerStyle={styles.sheetContent} keyboardShouldPersistTaps="handled">
                        {[
                            { label: "NGO Name", val: ngoName, set: setNgoName, icon: "account-group-outline" },
                            { label: "Email", val: email, set: setEmail, icon: "email-outline" },
                            { label: "Phone", val: phone, set: setPhone, icon: "phone-outline" },
                            { label: "Location", val: address, set: setAddress, icon: "map-marker-outline" },
                        ].map((f) => (
                            <View key={f.label} style={styles.editField}>
                                <Text style={styles.editLabel}>{f.label}</Text>
                                <View style={styles.editInputWrap}>
                                    <MaterialCommunityIcons name={f.icon} size={18} color={COLORS.grayText} />
                                    <TextInput
                                        style={styles.editInput}
                                        value={f.val}
                                        onChangeText={f.set}
                                        placeholderTextColor={COLORS.placeholder}
                                    />
                                </View>
                            </View>
                        ))}
                        <TouchableOpacity style={styles.saveBtn} onPress={closeEdit} activeOpacity={0.85}>
                            <MaterialCommunityIcons name="content-save-outline" size={18} color={COLORS.white} />
                            <Text style={styles.saveBtnText}>Save Changes</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </Animated.View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.bg },
    hero: {
        backgroundColor: COLORS.success,
        paddingTop: 60, paddingBottom: 36,
        alignItems: "center",
        borderBottomLeftRadius: 32, borderBottomRightRadius: 32,
        overflow: "hidden",
        shadowColor: COLORS.success, shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25, shadowRadius: 20, elevation: 8,
    },
    heroBlob1: {
        position: "absolute", width: 200, height: 200, borderRadius: 100,
        backgroundColor: "#fff", opacity: 0.06, top: -60, right: -60,
    },
    heroBlob2: {
        position: "absolute", width: 140, height: 140, borderRadius: 70,
        backgroundColor: "#fff", opacity: 0.04, bottom: -30, left: -30,
    },
    editBtn: {
        position: "absolute", top: 56, right: 22,
        width: 40, height: 40, borderRadius: 14,
        backgroundColor: "rgba(255,255,255,0.2)",
        justifyContent: "center", alignItems: "center",
    },
    avatarWrap: { position: "relative", marginBottom: 16 },
    avatar: {
        width: 100, height: 100, borderRadius: 50,
        backgroundColor: COLORS.white,
        justifyContent: "center", alignItems: "center",
        borderWidth: 4, borderColor: "rgba(255,255,255,0.4)",
        shadowColor: "#000", shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2, shadowRadius: 12, elevation: 8,
    },
    avatarCameraBtn: {
        position: "absolute", bottom: 2, right: 2,
        width: 28, height: 28, borderRadius: 9,
        backgroundColor: COLORS.primary,
        justifyContent: "center", alignItems: "center",
        borderWidth: 2, borderColor: COLORS.white,
    },
    heroName: { fontSize: 22, fontWeight: "800", color: COLORS.white, letterSpacing: -0.3, marginBottom: 10 },
    verifiedBadge: {
        flexDirection: "row", alignItems: "center", gap: 6,
        backgroundColor: "rgba(255,255,255,0.2)",
        paddingVertical: 6, paddingHorizontal: 14, borderRadius: 9999,
    },
    verifiedText: { fontSize: 13, fontWeight: "800", color: COLORS.white },
    impactRow: {
        flexDirection: "row",
        backgroundColor: COLORS.white, marginHorizontal: 22, marginTop: -1,
        borderRadius: 20,
        shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 4,
        marginBottom: 24,
    },
    impactCell: { flex: 1, alignItems: "center", paddingVertical: 18, gap: 4 },
    impactCellBorder: { borderRightWidth: 1, borderRightColor: "#F0F0F0" },
    impactIconWrap: { width: 36, height: 36, borderRadius: 12, justifyContent: "center", alignItems: "center", marginBottom: 4 },
    impactNum: { fontSize: 20, fontWeight: "800", color: COLORS.textDark, letterSpacing: -0.3 },
    impactLabel: { fontSize: 11, color: COLORS.grayText, fontWeight: "600" },
    section: { paddingHorizontal: 22, marginBottom: 20 },
    sectionTitle: { fontSize: 14, fontWeight: "800", color: COLORS.grayText, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 },
    infoCard: {
        backgroundColor: COLORS.white, borderRadius: 18,
        shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
        overflow: "hidden",
    },
    infoRow: { flexDirection: "row", alignItems: "center", padding: 16, gap: 12 },
    infoIconWrap: { width: 40, height: 40, borderRadius: 12, backgroundColor: COLORS.peach, justifyContent: "center", alignItems: "center" },
    infoContent: { flex: 1 },
    infoLabel: { fontSize: 11, color: COLORS.grayText, fontWeight: "600", marginBottom: 2 },
    infoValue: { fontSize: 14, fontWeight: "700", color: COLORS.textDark },
    rowDivider: { height: 1, backgroundColor: "#F5F5F5", marginLeft: 68 },
    settingRow: { flexDirection: "row", alignItems: "center", padding: 16, gap: 12 },
    settingIcon: { width: 40, height: 40, borderRadius: 12, justifyContent: "center", alignItems: "center" },
    settingLabel: { flex: 1, fontSize: 14, fontWeight: "700", color: COLORS.textDark },
    signOutBtn: {
        flexDirection: "row", alignItems: "center", justifyContent: "center",
        marginHorizontal: 22, gap: 10,
        backgroundColor: COLORS.errorLight,
        paddingVertical: 16, borderRadius: 16,
        marginBottom: 12,
        borderWidth: 1.5, borderColor: COLORS.error + "30",
    },
    signOutText: { fontSize: 15, fontWeight: "800", color: COLORS.error },
    versionText: { textAlign: "center", fontSize: 12, color: COLORS.placeholder },
    modalOverlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: COLORS.overlay },
    bottomSheet: {
        position: "absolute", bottom: 0, left: 0, right: 0,
        backgroundColor: COLORS.white,
        borderTopLeftRadius: 28, borderTopRightRadius: 28,
        maxHeight: "85%",
    },
    sheetHandle: {
        width: 40, height: 4, borderRadius: 2, backgroundColor: "#DDD",
        alignSelf: "center", marginTop: 12, marginBottom: 4,
    },
    sheetHeader: {
        flexDirection: "row", justifyContent: "space-between", alignItems: "center",
        paddingHorizontal: 22, paddingVertical: 16,
        borderBottomWidth: 1, borderBottomColor: "#F0F0F0",
    },
    sheetTitle: { fontSize: 18, fontWeight: "800", color: COLORS.textDark },
    sheetContent: { padding: 22, paddingBottom: 40 },
    editField: { marginBottom: 18 },
    editLabel: { fontSize: 12, fontWeight: "700", color: COLORS.grayText, marginBottom: 8 },
    editInputWrap: {
        flexDirection: "row", alignItems: "center", gap: 10,
        backgroundColor: "#F5F5F8", borderRadius: 14, borderWidth: 1.5,
        borderColor: COLORS.border, paddingHorizontal: 14, paddingVertical: 13,
    },
    editInput: { flex: 1, fontSize: 15, color: COLORS.textDark },
    saveBtn: {
        flexDirection: "row", alignItems: "center", justifyContent: "center",
        backgroundColor: COLORS.primary, borderRadius: 16, paddingVertical: 16,
        gap: 8, marginTop: 8,
        shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.28, shadowRadius: 16, elevation: 6,
    },
    saveBtnText: { color: COLORS.white, fontSize: 16, fontWeight: "800" },
});