import {
    StyleSheet, Text, View, TouchableOpacity, TextInput,
    ScrollView, Platform, Animated, Alert,
} from "react-native";
import { useState, useRef } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { COLORS } from "../_constants/colors";

const DOCS = [
    { key: "reg_cert", label: "NGO Registration Certificate", desc: "Section 8 / Trust Deed / Society Reg.", icon: "certificate-outline", required: true },
    { key: "tax_cert", label: "80G / 12A Certificate", desc: "Income Tax exemption certificate", icon: "file-star-outline", required: false },
    { key: "id_proof", label: "Authorised Signatory ID Proof", desc: "Aadhaar card or PAN card", icon: "card-account-details-outline", required: true },
];

export default function Verification() {
    const router = useRouter();
    const params = useLocalSearchParams();

    const [regNumber, setRegNumber] = useState("");
    const [orgName, setOrgName] = useState(params.name || "");
    const [uploads, setUploads] = useState({});   // { key: uri }
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const successScale = useRef(new Animated.Value(0.5)).current;
    const successFade = useRef(new Animated.Value(0)).current;

    const pickDocument = async (docKey) => {
        Alert.alert("Upload Document", "Choose an option", [
            {
                text: "Take Photo",
                onPress: async () => {
                    const { status } = await ImagePicker.requestCameraPermissionsAsync();
                    if (status !== "granted") {
                        Alert.alert("Permission needed", "Please allow camera access in Settings.");
                        return;
                    }
                    const result = await ImagePicker.launchCameraAsync({
                        mediaTypes: ["images"], allowsEditing: true, quality: 0.8,
                    });
                    if (!result.canceled && result.assets?.[0]?.uri) {
                        setUploads(prev => ({ ...prev, [docKey]: result.assets[0].uri }));
                    }
                },
            },
            {
                text: "Choose from Gallery",
                onPress: async () => {
                    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                    if (status !== "granted") {
                        Alert.alert("Permission needed", "Please allow photo library access in Settings.");
                        return;
                    }
                    const result = await ImagePicker.launchImageLibraryAsync({
                        mediaTypes: ["images"], allowsEditing: true, quality: 0.8,
                    });
                    if (!result.canceled && result.assets?.[0]?.uri) {
                        setUploads(prev => ({ ...prev, [docKey]: result.assets[0].uri }));
                    }
                },
            },
            { text: "Cancel", style: "cancel" },
        ]);
    };

    const requiredDocs = DOCS.filter(d => d.required);
    const allRequiredUploaded = requiredDocs.every(d => !!uploads[d.key]);
    const canSubmit = regNumber.trim().length >= 4 && allRequiredUploaded;

    const handleSubmit = () => {
        if (!canSubmit) {
            Alert.alert(
                "Incomplete",
                "Please enter your Registration Number and upload all required documents (marked *)."
            );
            return;
        }
        setLoading(true);
        // TODO: POST /api/ngo/verification — { regNumber, orgName, documents: uploads }
        setTimeout(() => {
            setLoading(false);
            setSubmitted(true);
            Animated.parallel([
                Animated.spring(successScale, { toValue: 1, tension: 60, friction: 8, useNativeDriver: true }),
                Animated.timing(successFade, { toValue: 1, duration: 400, useNativeDriver: true }),
            ]).start();
        }, 1400);
    };

    if (submitted) {
        return (
            <View style={styles.root}>
                <Animated.View style={[styles.successWrap, { opacity: successFade }]}>
                    <Animated.View style={[styles.successCircle, { transform: [{ scale: successScale }] }]}>
                        <MaterialCommunityIcons name="clock-check-outline" size={56} color="#F59E0B" />
                    </Animated.View>
                    <Text style={styles.successTitle}>Submitted for Review</Text>
                    <Text style={styles.successBody}>
                        Your NGO documents have been submitted.{"\n"}
                        Our admin team will verify and approve your account within{" "}
                        <Text style={{ fontWeight: "800", color: COLORS.textDark }}>24–48 hours</Text>.
                    </Text>
                    <View style={styles.successSteps}>
                        {[
                            { icon: "file-check-outline", label: "Documents received", done: true },
                            { icon: "account-check-outline", label: "Admin review in progress", done: false },
                            { icon: "shield-check-outline", label: "Account activated", done: false },
                        ].map((s, i) => (
                            <View key={i} style={styles.successStep}>
                                <View style={[styles.successStepIcon, s.done && styles.successStepIconDone]}>
                                    <MaterialCommunityIcons name={s.icon} size={18}
                                        color={s.done ? "#2D6A4F" : COLORS.grayText} />
                                </View>
                                <Text style={[styles.successStepText, s.done && { color: "#2D6A4F", fontWeight: "700" }]}>
                                    {s.label}
                                </Text>
                                {s.done && <MaterialCommunityIcons name="check-circle" size={16} color="#2D6A4F" />}
                            </View>
                        ))}
                    </View>
                    <TouchableOpacity style={styles.successBtn} onPress={() => router.replace("/login")} activeOpacity={0.86}>
                        <Text style={styles.successBtnText}>Go to Login</Text>
                        <MaterialCommunityIcons name="arrow-right" size={18} color="#fff" />
                    </TouchableOpacity>
                </Animated.View>
            </View>
        );
    }

    return (
        <View style={styles.root}>
            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerBlob} />
                    <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                        <MaterialCommunityIcons name="arrow-left" size={20} color="#fff" />
                    </TouchableOpacity>
                    <View style={styles.headerIconWrap}>
                        <MaterialCommunityIcons name="shield-check-outline" size={32} color="#fff" />
                    </View>
                    <Text style={styles.headerTitle}>NGO Verification</Text>
                    <Text style={styles.headerSub}>Submit your documents to get verified and start receiving donations</Text>
                </View>

                {/* Info banner */}
                <View style={styles.infoBanner}>
                    <MaterialCommunityIcons name="information-outline" size={18} color="#2B7FFF" />
                    <Text style={styles.infoBannerText}>
                        Verification is required for all NGOs before accessing the platform. Fields marked <Text style={{ color: "#EF4444", fontWeight: "800" }}>*</Text> are mandatory.
                    </Text>
                </View>

                {/* Form card */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Organisation Details</Text>

                    {/* Org name */}
                    <View style={styles.fieldGroup}>
                        <Text style={styles.fieldLabel}>Organisation Name</Text>
                        <View style={styles.fieldBox}>
                            <MaterialCommunityIcons name="office-building-outline" size={18} color={COLORS.primary} />
                            <TextInput
                                style={styles.fieldInput}
                                value={orgName}
                                onChangeText={setOrgName}
                                placeholder="Your NGO / Organisation name"
                                placeholderTextColor={COLORS.placeholder}
                                autoCapitalize="words"
                            />
                        </View>
                    </View>

                    {/* Registration number */}
                    <View style={styles.fieldGroup}>
                        <Text style={styles.fieldLabel}>Registration Number <Text style={styles.req}>*</Text></Text>
                        <View style={[styles.fieldBox, regNumber.length >= 4 && styles.fieldBoxValid]}>
                            <MaterialCommunityIcons name="numeric" size={18}
                                color={regNumber.length >= 4 ? COLORS.success : COLORS.primary} />
                            <TextInput
                                style={styles.fieldInput}
                                value={regNumber}
                                onChangeText={setRegNumber}
                                placeholder="e.g. NGO/AP/2021/0012345"
                                placeholderTextColor={COLORS.placeholder}
                                autoCapitalize="characters"
                            />
                            {regNumber.length >= 4 &&
                                <MaterialCommunityIcons name="check-circle" size={18} color={COLORS.success} />
                            }
                        </View>
                    </View>
                </View>

                {/* Document upload card */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Document Uploads</Text>

                    {DOCS.map((doc) => {
                        const uploaded = !!uploads[doc.key];
                        return (
                            <TouchableOpacity
                                key={doc.key}
                                style={[styles.docRow, uploaded && styles.docRowUploaded]}
                                onPress={() => pickDocument(doc.key)}
                                activeOpacity={0.8}
                            >
                                <View style={[styles.docIconWrap, uploaded && styles.docIconWrapUploaded]}>
                                    <MaterialCommunityIcons
                                        name={uploaded ? "check" : doc.icon}
                                        size={22}
                                        color={uploaded ? "#2D6A4F" : COLORS.primary}
                                    />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.docLabel}>
                                        {doc.label}
                                        {doc.required && <Text style={styles.req}> *</Text>}
                                    </Text>
                                    <Text style={[styles.docSub, uploaded && { color: "#2D6A4F" }]}>
                                        {uploaded ? "✓ Uploaded — tap to replace" : "Tap to upload (photo or file)"}
                                    </Text>
                                </View>
                                <MaterialCommunityIcons
                                    name={uploaded ? "pencil-outline" : "upload-outline"}
                                    size={20}
                                    color={uploaded ? "#2D6A4F" : COLORS.grayText}
                                />
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* Submit */}
                <TouchableOpacity
                    style={[styles.submitBtn, (!canSubmit || loading) && { opacity: 0.6 }]}
                    onPress={handleSubmit}
                    disabled={!canSubmit || loading}
                    activeOpacity={0.86}
                >
                    <MaterialCommunityIcons
                        name={loading ? "loading" : "send-check-outline"}
                        size={22} color="#fff"
                    />
                    <Text style={styles.submitText}>
                        {loading ? "Submitting…" : "Submit for Verification"}
                    </Text>
                </TouchableOpacity>

                <Text style={styles.disclaimer}>
                    By submitting, you agree that all documents provided are genuine.{"\n"}
                    False submissions may result in permanent account ban.
                </Text>

                <View style={{ height: 48 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: "#F5F0EB" },

    header: {
        backgroundColor: COLORS.success,
        paddingTop: Platform.OS === "ios" ? 56 : 44,
        paddingHorizontal: 22, paddingBottom: 32,
        borderBottomLeftRadius: 28, borderBottomRightRadius: 28,
        overflow: "hidden", marginBottom: 16,
        shadowColor: COLORS.success, shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25, shadowRadius: 16, elevation: 10,
    },
    headerBlob: { position: "absolute", width: 200, height: 200, borderRadius: 100, backgroundColor: "rgba(255,255,255,0.08)", top: -60, right: -50 },
    backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.18)", justifyContent: "center", alignItems: "center", marginBottom: 20 },
    headerIconWrap: { width: 60, height: 60, borderRadius: 18, backgroundColor: "rgba(255,255,255,0.18)", justifyContent: "center", alignItems: "center", marginBottom: 16 },
    headerTitle: { fontSize: 26, fontWeight: "800", color: "#fff", letterSpacing: -0.4, marginBottom: 8 },
    headerSub: { fontSize: 13, color: "rgba(255,255,255,0.78)", lineHeight: 20, maxWidth: 300 },

    infoBanner: { flexDirection: "row", alignItems: "flex-start", gap: 10, backgroundColor: "#EBF2FF", borderRadius: 14, padding: 14, marginHorizontal: 20, marginBottom: 16, borderWidth: 1, borderColor: "#BFDBFE" },
    infoBannerText: { flex: 1, fontSize: 13, color: "#1D4ED8", lineHeight: 19 },

    card: { backgroundColor: "#fff", marginHorizontal: 20, borderRadius: 22, padding: 20, marginBottom: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.07, shadowRadius: 10, elevation: 3 },
    sectionTitle: { fontSize: 12, fontWeight: "800", color: COLORS.grayText, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 18 },

    fieldGroup: { marginBottom: 16 },
    fieldLabel: { fontSize: 12, fontWeight: "700", color: COLORS.grayText, marginBottom: 7, letterSpacing: 0.3, textTransform: "uppercase" },
    req: { color: "#EF4444" },
    fieldBox: { flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: "#F7F7FA", borderRadius: 14, paddingHorizontal: 14, paddingVertical: 14, borderWidth: 1.5, borderColor: "transparent" },
    fieldBoxValid: { borderColor: COLORS.success + "60", backgroundColor: "rgba(45,106,79,0.05)" },
    fieldInput: { flex: 1, fontSize: 15, color: COLORS.textDark },

    docRow: { flexDirection: "row", alignItems: "center", gap: 14, backgroundColor: "#F7F7FA", borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1.5, borderColor: "transparent" },
    docRowUploaded: { backgroundColor: "#EAF5EF", borderColor: COLORS.success + "50" },
    docIconWrap: { width: 46, height: 46, borderRadius: 14, backgroundColor: COLORS.primaryGlow, justifyContent: "center", alignItems: "center" },
    docIconWrapUploaded: { backgroundColor: "#D1FAE5" },
    docLabel: { fontSize: 14, fontWeight: "700", color: COLORS.textDark, marginBottom: 3 },
    docSub: { fontSize: 12, color: COLORS.grayText },

    submitBtn: { marginHorizontal: 20, backgroundColor: COLORS.success, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, paddingVertical: 18, borderRadius: 18, shadowColor: COLORS.success, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.28, shadowRadius: 16, elevation: 8, marginBottom: 14 },
    submitText: { color: "#fff", fontSize: 16, fontWeight: "800", letterSpacing: 0.2 },
    disclaimer: { marginHorizontal: 20, fontSize: 12, color: COLORS.grayText, textAlign: "center", lineHeight: 18 },

    // Success
    successWrap: { flex: 1, alignItems: "center", justifyContent: "center", padding: 32 },
    successCircle: { width: 110, height: 110, borderRadius: 55, backgroundColor: "#FFF8EB", justifyContent: "center", alignItems: "center", marginBottom: 24 },
    successTitle: { fontSize: 26, fontWeight: "800", color: COLORS.textDark, letterSpacing: -0.4, marginBottom: 14, textAlign: "center" },
    successBody: { fontSize: 14, color: COLORS.grayText, textAlign: "center", lineHeight: 22, marginBottom: 28, maxWidth: 300 },
    successSteps: { width: "100%", gap: 12, marginBottom: 32, backgroundColor: "#fff", borderRadius: 18, padding: 18, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
    successStep: { flexDirection: "row", alignItems: "center", gap: 12 },
    successStepIcon: { width: 38, height: 38, borderRadius: 12, backgroundColor: "#F5F5F8", justifyContent: "center", alignItems: "center" },
    successStepIconDone: { backgroundColor: "#D1FAE5" },
    successStepText: { flex: 1, fontSize: 14, color: COLORS.grayText, fontWeight: "500" },
    successBtn: { backgroundColor: COLORS.success, flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 16, paddingHorizontal: 36, borderRadius: 16, shadowColor: COLORS.success, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.28, shadowRadius: 12, elevation: 6 },
    successBtnText: { color: "#fff", fontSize: 15, fontWeight: "800" },
});