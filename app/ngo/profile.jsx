import {
    StyleSheet, Text, View, TouchableOpacity, Switch,
    TextInput, ScrollView, Platform, Modal, Animated, Easing,
    KeyboardAvoidingView, Linking, Image, Alert,
} from "react-native";
import { useState, useRef } from "react";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../../_constants/colors";
import * as ImagePicker from "expo-image-picker";

const SETTINGS = [
    { icon: "bell-outline", label: "Notifications", color: COLORS.primary },
    { icon: "shield-lock-outline", label: "Privacy & Security", color: COLORS.accentBlue },
    { icon: "alert-circle-outline", label: "File a Complaint", color: "#F59E0B" },
    { icon: "help-circle-outline", label: "Help & Support", color: COLORS.success },
    { icon: "information-outline", label: "About Food Saver", color: COLORS.accentPurple },
];

const REASONS = [
    { id: "app_bug", label: "App Bug", icon: "bug-outline", color: "#EF4444" },
    { id: "wrong_info", label: "Wrong Info", icon: "file-alert-outline", color: "#F59E0B" },
    { id: "donor_behavior", label: "Donor Behavior", icon: "account-alert-outline", color: "#FF6B2B" },
    { id: "pickup_issue", label: "Pickup Issue", icon: "truck-alert-outline", color: "#2B7FFF" },
    { id: "food_quality", label: "Food Quality", icon: "food-off", color: "#7C3AED" },
    { id: "account_issue", label: "Account Issue", icon: "account-lock-outline", color: "#2D6A4F" },
    { id: "other", label: "Other", icon: "dots-horizontal-circle", color: "#6B7280" },
];

const FAQS = [
    { q: "How do I request a donation?", a: "Go to Browse tab, find available food listings nearby, and tap 'Request'. The donor will be notified and can confirm the pickup." },
    { q: "How do I confirm a pickup?", a: "Go to My Requests, select the approved request, and tap 'Confirm Pickup' once you've collected the food." },
    { q: "Can I request multiple donations?", a: "Yes. You can have multiple active requests at the same time as long as you have the capacity to handle them." },
    { q: "What if a donor cancels?", a: "You'll receive a notification if a donor cancels. You can then browse other available donations in the Browse tab." },
    { q: "How is my NGO verified?", a: "Our admin team reviews your registration documents. Verification typically takes 2–3 business days after submission." },
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

function useSheet(initial = 600) {
    const anim = useRef(new Animated.Value(initial)).current;
    const [visible, setVisible] = useState(false);
    const open = () => { setVisible(true); Animated.spring(anim, { toValue: 0, tension: 65, friction: 11, useNativeDriver: true }).start(); };
    const close = (cb) => Animated.timing(anim, { toValue: initial, duration: 260, easing: Easing.in(Easing.cubic), useNativeDriver: true }).start(() => { setVisible(false); cb && cb(); });
    return { anim, visible, open, close };
}

export default function NgoProfile() {
    const [ngoName, setNgoName] = useState("Helping Hands NGO");
    const [email, setEmail] = useState("helpinghands@gmail.com");
    const [phone, setPhone] = useState("+91 98765 43210");
    const [address, setAddress] = useState("Hyderabad, Telangana");
    const router = useRouter();
    const [photoUri, setPhotoUri] = useState(null);

    const pickPhoto = async (source) => {
        try {
            let result;
            if (source === "camera") {
                const camPerm = await ImagePicker.requestCameraPermissionsAsync();
                if (camPerm.status !== "granted") {
                    Alert.alert(
                        "Camera Permission",
                        "Please enable camera access in Settings > Apps > Food Saver > Permissions.",
                        [{ text: "OK" }]
                    );
                    return;
                }
                result = await ImagePicker.launchCameraAsync({
                    mediaTypes: ["images"],
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 0.8,
                });
            } else {
                const libPerm = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (libPerm.status !== "granted") {
                    Alert.alert(
                        "Gallery Permission",
                        "Please enable photo library access in Settings > Apps > Food Saver > Permissions.",
                        [{ text: "OK" }]
                    );
                    return;
                }
                result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ["images"],
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 0.8,
                });
            }
            if (result && !result.canceled && result.assets && result.assets.length > 0) {
                setPhotoUri(result.assets[0].uri);
            }
        } catch (e) {
            console.error("ImagePicker error:", e);
            Alert.alert("Error", e?.message || "Could not open photo picker. Please try again.");
        }
    };

    const openPhotoPicker = () => {
        Alert.alert("Update Photo", "Choose an option", [
            { text: "Take Photo", onPress: () => pickPhoto("camera") },
            { text: "Choose from Library", onPress: () => pickPhoto("library") },
            { text: "Cancel", style: "cancel" },
        ]);
    };

    // Edit sheet
    const edit = useSheet();

    // Settings sheets
    const notif = useSheet();
    const privacy = useSheet();
    const complaint = useSheet();
    const help = useSheet();
    const about = useSheet();

    // Notification toggles
    const [notifRequest, setNotifRequest] = useState(true);
    const [notifPickup, setNotifPickup] = useState(true);
    const [notifReminder, setNotifReminder] = useState(true);
    const [notifPromo, setNotifPromo] = useState(false);

    // Privacy toggles
    const [privProfile, setPrivProfile] = useState(true);
    const [privActivity, setPrivActivity] = useState(true);
    const [privLocation, setPrivLocation] = useState(true);
    const [privData, setPrivData] = useState(false);

    // Complaint
    const [reason, setReason] = useState(null);
    const [description, setDescription] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const canSubmit = reason && description.trim().length >= 10;

    // FAQ
    const [openFaq, setOpenFaq] = useState(null);

    const handleComplaintClose = () => complaint.close(() => {
        setTimeout(() => { setReason(null); setDescription(""); setSubmitted(false); }, 100);
    });

    const settingHandler = (label) => {
        if (label === "Notifications") return notif.open;
        if (label === "Privacy & Security") return privacy.open;
        if (label === "File a Complaint") return complaint.open;
        if (label === "Help & Support") return help.open;
        if (label === "About Food Saver") return about.open;
        return undefined;
    };

    const Sheet = ({ hook, onClose, children }) => (
        <Modal visible={hook.visible} transparent animationType="none" onRequestClose={onClose || (() => hook.close())}>
            <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose || (() => hook.close())} />
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.sheetPositioner}>
                <Animated.View style={[styles.sheet, { transform: [{ translateY: hook.anim }] }]}>
                    <View style={styles.sheetHandle} />
                    {children}
                </Animated.View>
            </KeyboardAvoidingView>
        </Modal>
    );

    return (
        <View style={{ flex: 1 }}>
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

                {/* ── HERO ── */}
                <View style={styles.hero}>
                    <View style={styles.heroBlob1} />
                    <View style={styles.heroBlob2} />
                    <TouchableOpacity style={styles.editBtn} onPress={edit.open}>
                        <MaterialCommunityIcons name="pencil-outline" size={18} color={COLORS.white} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.avatarWrap} onPress={openPhotoPicker} activeOpacity={0.85}>
                        <View style={styles.avatar}>
                            {photoUri
                                ? <Image source={{ uri: photoUri }} style={styles.avatarImg} />
                                : <MaterialCommunityIcons name="account-group" size={44} color={COLORS.success} />
                            }
                        </View>
                        <View style={styles.avatarCameraBtn}>
                            <MaterialCommunityIcons name="camera-outline" size={14} color={COLORS.white} />
                        </View>
                    </TouchableOpacity>
                    <Text style={styles.heroName}>{ngoName}</Text>
                    <View style={styles.verifiedBadge}>
                        <MaterialCommunityIcons name="shield-check" size={14} color={COLORS.white} />
                        <Text style={styles.verifiedText}>Verified NGO</Text>
                    </View>
                </View>

                {/* ── IMPACT STATS ── */}
                <View style={styles.impactRow}>
                    {[
                        { num: "24", label: "Pickups", icon: "truck-delivery-outline", color: COLORS.primary },
                        { num: "185", label: "People Fed", icon: "account-group-outline", color: COLORS.success },
                        { num: "~95kg", label: "Food Saved", icon: "scale-balance", color: COLORS.accentBlue },
                    ].map((s, i) => (
                        <View key={i} style={[styles.impactCell, i < 2 && styles.impactCellBorder]}>
                            <View style={[styles.impactIconWrap, { backgroundColor: s.color + "15" }]}>
                                <MaterialCommunityIcons name={s.icon} size={18} color={s.color} />
                            </View>
                            <Text style={styles.impactNum}>{s.num}</Text>
                            <Text style={styles.impactLabel}>{s.label}</Text>
                        </View>
                    ))}
                </View>

                {/* ── PROFILE INFO ── */}
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

                {/* ── SETTINGS ── */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Settings</Text>
                    <View style={styles.infoCard}>
                        {SETTINGS.map((s, i) => (
                            <View key={s.label}>
                                <TouchableOpacity style={styles.settingRow} activeOpacity={0.7} onPress={settingHandler(s.label)}>
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

                <TouchableOpacity
                    style={styles.signOutBtn}
                    activeOpacity={0.8}
                    onPress={() =>
                        Alert.alert("Sign Out", "Are you sure you want to sign out?", [
                            { text: "Cancel", style: "cancel" },
                            { text: "Sign Out", style: "destructive", onPress: () => router.replace("/welcome") },
                        ])
                    }
                >
                    <MaterialCommunityIcons name="logout" size={20} color={COLORS.error} />
                    <Text style={styles.signOutText}>Sign Out</Text>
                </TouchableOpacity>
                <Text style={styles.versionText}>Food Saver v1.0.0</Text>
                <View style={{ height: 32 }} />
            </ScrollView>

            {/* ════════════════════════════════
          EDIT PROFILE SHEET
      ════════════════════════════════ */}
            <Sheet hook={edit}>
                <View style={styles.sheetHeader}>
                    <Text style={styles.sheetTitle}>Edit Profile</Text>
                    <TouchableOpacity style={styles.closeBtn} onPress={() => edit.close()}>
                        <MaterialCommunityIcons name="close" size={20} color={COLORS.textDark} />
                    </TouchableOpacity>
                </View>
                <ScrollView contentContainerStyle={styles.sheetBody} keyboardShouldPersistTaps="handled">
                    {[
                        { label: "NGO Name", val: ngoName, set: setNgoName, icon: "account-group-outline" },
                        { label: "Email", val: email, set: setEmail, icon: "email-outline" },
                        { label: "Phone", val: phone, set: setPhone, icon: "phone-outline" },
                        { label: "Location", val: address, set: setAddress, icon: "map-marker-outline" },
                    ].map(f => (
                        <View key={f.label} style={styles.editField}>
                            <Text style={styles.editLabel}>{f.label}</Text>
                            <View style={styles.editInputWrap}>
                                <MaterialCommunityIcons name={f.icon} size={18} color={COLORS.grayText} />
                                <TextInput style={styles.editInput} value={f.val} onChangeText={f.set} />
                            </View>
                        </View>
                    ))}
                    <TouchableOpacity style={[styles.actionBtn, { backgroundColor: COLORS.success }]} onPress={() => edit.close()} activeOpacity={0.85}>
                        <MaterialCommunityIcons name="content-save-outline" size={18} color="#fff" />
                        <Text style={styles.actionBtnText}>Save Changes</Text>
                    </TouchableOpacity>
                    <View style={{ height: 24 }} />
                </ScrollView>
            </Sheet>

            {/* ════════════════════════════════
          1. NOTIFICATIONS SHEET
      ════════════════════════════════ */}
            <Sheet hook={notif}>
                <View style={styles.sheetHeader}>
                    <View>
                        <Text style={styles.sheetTitle}>Notifications</Text>
                        <Text style={styles.sheetSub}>Choose what alerts you receive</Text>
                    </View>
                    <TouchableOpacity style={styles.closeBtn} onPress={() => notif.close()}>
                        <MaterialCommunityIcons name="close" size={20} color={COLORS.textDark} />
                    </TouchableOpacity>
                </View>
                <ScrollView contentContainerStyle={styles.sheetBody} showsVerticalScrollIndicator={false}>
                    {[
                        { label: "New Food Available", sub: "When a new donation is posted nearby", val: notifRequest, set: setNotifRequest, color: COLORS.primary },
                        { label: "Pickup Confirmed", sub: "When a donor confirms your pickup", val: notifPickup, set: setNotifPickup, color: COLORS.success },
                        { label: "Expiry Reminders", sub: "Before an approved donation expires", val: notifReminder, set: setNotifReminder, color: "#F59E0B" },
                        { label: "Promotions & Updates", sub: "App news, tips and announcements", val: notifPromo, set: setNotifPromo, color: COLORS.accentPurple },
                    ].map((item, i, arr) => (
                        <View key={item.label}>
                            <View style={styles.toggleRow}>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.toggleLabel}>{item.label}</Text>
                                    <Text style={styles.toggleSub}>{item.sub}</Text>
                                </View>
                                <Switch value={item.val} onValueChange={item.set} trackColor={{ false: "#E5E7EB", true: item.color + "55" }} thumbColor={item.val ? item.color : "#9CA3AF"} />
                            </View>
                            {i < arr.length - 1 && <View style={styles.rowDivider} />}
                        </View>
                    ))}
                    <View style={styles.infoBanner}>
                        <MaterialCommunityIcons name="information-outline" size={16} color={COLORS.accentBlue} />
                        <Text style={styles.infoBannerText}>Push notifications must be enabled in your device settings for these to work.</Text>
                    </View>
                </ScrollView>
            </Sheet>

            {/* ════════════════════════════════
          2. PRIVACY SHEET
      ════════════════════════════════ */}
            <Sheet hook={privacy}>
                <View style={styles.sheetHeader}>
                    <View>
                        <Text style={styles.sheetTitle}>Privacy & Security</Text>
                        <Text style={styles.sheetSub}>Control how your data is used</Text>
                    </View>
                    <TouchableOpacity style={styles.closeBtn} onPress={() => privacy.close()}>
                        <MaterialCommunityIcons name="close" size={20} color={COLORS.textDark} />
                    </TouchableOpacity>
                </View>
                <ScrollView contentContainerStyle={styles.sheetBody} showsVerticalScrollIndicator={false}>
                    {[
                        { label: "Public NGO Profile", sub: "Allow donors to view your NGO profile", val: privProfile, set: setPrivProfile, color: COLORS.primary },
                        { label: "Activity Visible", sub: "Show your pickup activity to donors", val: privActivity, set: setPrivActivity, color: COLORS.success },
                        { label: "Location Access", sub: "Share location for nearby food matching", val: privLocation, set: setPrivLocation, color: COLORS.accentBlue },
                        { label: "Analytics Sharing", sub: "Help improve the app with usage data", val: privData, set: setPrivData, color: COLORS.accentPurple },
                    ].map((item, i, arr) => (
                        <View key={item.label}>
                            <View style={styles.toggleRow}>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.toggleLabel}>{item.label}</Text>
                                    <Text style={styles.toggleSub}>{item.sub}</Text>
                                </View>
                                <Switch value={item.val} onValueChange={item.set} trackColor={{ false: "#E5E7EB", true: item.color + "55" }} thumbColor={item.val ? item.color : "#9CA3AF"} />
                            </View>
                            {i < arr.length - 1 && <View style={styles.rowDivider} />}
                        </View>
                    ))}
                    <TouchableOpacity style={styles.dangerRow}>
                        <MaterialCommunityIcons name="delete-outline" size={18} color="#EF4444" />
                        <Text style={styles.dangerText}>Delete My Account</Text>
                    </TouchableOpacity>
                </ScrollView>
            </Sheet>

            {/* ════════════════════════════════
          3. COMPLAINT SHEET
      ════════════════════════════════ */}
            <Sheet hook={complaint} onClose={handleComplaintClose}>
                {submitted ? (
                    <View style={styles.successWrap}>
                        <View style={styles.successCircle}>
                            <MaterialCommunityIcons name="check-circle" size={54} color="#2D6A4F" />
                        </View>
                        <Text style={styles.successTitle}>Complaint Submitted!</Text>
                        <Text style={styles.successBody}>Your complaint has been sent to the admin. You'll receive an update within 24–48 hours.</Text>
                        <TouchableOpacity style={styles.doneBtn} onPress={handleComplaintClose}>
                            <Text style={styles.doneBtnText}>Done</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.sheetBody} keyboardShouldPersistTaps="handled">
                        <View style={styles.sheetHeader}>
                            <View>
                                <Text style={styles.sheetTitle}>File a Complaint</Text>
                                <Text style={styles.sheetSub}>We'll review and respond within 48 hours</Text>
                            </View>
                            <TouchableOpacity style={styles.closeBtn} onPress={handleComplaintClose}>
                                <MaterialCommunityIcons name="close" size={20} color={COLORS.textDark} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.submitterChip}>
                            <View style={styles.submitterAvatar}>
                                <MaterialCommunityIcons name="account-group" size={16} color={COLORS.success} />
                            </View>
                            <Text style={styles.submitterText}>Submitting as <Text style={styles.submitterName}>{ngoName}</Text> · NGO</Text>
                        </View>
                        <Text style={styles.fieldLabel}>Reason <Text style={styles.req}>*</Text></Text>
                        <View style={styles.reasonGrid}>
                            {REASONS.map(r => (
                                <TouchableOpacity key={r.id} style={[styles.reasonChip, reason === r.id && { borderColor: r.color, backgroundColor: r.color + "12" }]} onPress={() => setReason(r.id)} activeOpacity={0.8}>
                                    <MaterialCommunityIcons name={r.icon} size={17} color={reason === r.id ? r.color : COLORS.grayText} />
                                    <Text style={[styles.reasonText, reason === r.id && { color: r.color, fontWeight: "700" }]}>{r.label}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <Text style={styles.fieldLabel}>Description <Text style={styles.req}>*</Text></Text>
                        <View style={[styles.textAreaWrap, description.length > 0 && styles.textAreaActive]}>
                            <TextInput style={styles.textArea} multiline numberOfLines={5} placeholder="Describe the issue in detail... (min. 10 characters)" placeholderTextColor={COLORS.grayText} value={description} onChangeText={t => setDescription(t.slice(0, 500))} textAlignVertical="top" />
                            <Text style={styles.charCount}>{description.length} / 500</Text>
                        </View>
                        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: canSubmit ? COLORS.success : "#CCC" }]} onPress={() => canSubmit && setSubmitted(true)} activeOpacity={canSubmit ? 0.86 : 1}>
                            <MaterialCommunityIcons name="send-outline" size={18} color="#fff" />
                            <Text style={styles.actionBtnText}>Submit Complaint</Text>
                        </TouchableOpacity>
                        <View style={{ height: 24 }} />
                    </ScrollView>
                )}
            </Sheet>

            {/* ════════════════════════════════
          4. HELP & SUPPORT SHEET
      ════════════════════════════════ */}
            <Sheet hook={help}>
                <View style={styles.sheetHeader}>
                    <View>
                        <Text style={styles.sheetTitle}>Help & Support</Text>
                        <Text style={styles.sheetSub}>Find answers or contact us</Text>
                    </View>
                    <TouchableOpacity style={styles.closeBtn} onPress={() => help.close()}>
                        <MaterialCommunityIcons name="close" size={20} color={COLORS.textDark} />
                    </TouchableOpacity>
                </View>
                <ScrollView contentContainerStyle={styles.sheetBody} showsVerticalScrollIndicator={false}>
                    <View style={styles.contactGrid}>
                        {[
                            { icon: "email-outline", label: "Email Us", sub: "support@foodsaver.app", color: COLORS.primary, bg: COLORS.primaryGlow, action: () => Linking.openURL("mailto:support@foodsaver.app") },
                            { icon: "whatsapp", label: "WhatsApp", sub: "+91 98765 00001", color: COLORS.success, bg: "#EAF5EF", action: () => Linking.openURL("https://wa.me/919876500001") },
                        ].map(c => (
                            <TouchableOpacity key={c.label} style={styles.contactCard} onPress={c.action} activeOpacity={0.8}>
                                <View style={[styles.contactIcon, { backgroundColor: c.bg }]}>
                                    <MaterialCommunityIcons name={c.icon} size={22} color={c.color} />
                                </View>
                                <Text style={styles.contactLabel}>{c.label}</Text>
                                <Text style={styles.contactSub}>{c.sub}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <Text style={styles.faqTitle}>Frequently Asked Questions</Text>
                    {FAQS.map((faq, i) => (
                        <TouchableOpacity key={i} style={styles.faqItem} onPress={() => setOpenFaq(openFaq === i ? null : i)} activeOpacity={0.8}>
                            <View style={styles.faqHeader}>
                                <Text style={styles.faqQ}>{faq.q}</Text>
                                <MaterialCommunityIcons name={openFaq === i ? "chevron-up" : "chevron-down"} size={18} color={COLORS.grayText} />
                            </View>
                            {openFaq === i && <Text style={styles.faqA}>{faq.a}</Text>}
                        </TouchableOpacity>
                    ))}
                    <View style={{ height: 20 }} />
                </ScrollView>
            </Sheet>

            {/* ════════════════════════════════
          5. ABOUT SHEET
      ════════════════════════════════ */}
            <Sheet hook={about}>
                <View style={styles.sheetHeader}>
                    <View>
                        <Text style={styles.sheetTitle}>About Food Saver</Text>
                        <Text style={styles.sheetSub}>Version 1.0.0</Text>
                    </View>
                    <TouchableOpacity style={styles.closeBtn} onPress={() => about.close()}>
                        <MaterialCommunityIcons name="close" size={20} color={COLORS.textDark} />
                    </TouchableOpacity>
                </View>
                <ScrollView contentContainerStyle={styles.sheetBody} showsVerticalScrollIndicator={false}>
                    <View style={styles.aboutLogoWrap}>
                        <View style={styles.aboutLogo}>
                            <MaterialCommunityIcons name="food-apple" size={40} color="#fff" />
                        </View>
                        <Text style={styles.aboutAppName}>Food Saver</Text>
                        <Text style={styles.aboutTagline}>Connecting surplus food with those who need it most</Text>
                    </View>
                    {[
                        { icon: "tag-outline", label: "Version", value: "1.0.0" },
                        { icon: "calendar-outline", label: "Released", value: "March 2026" },
                        { icon: "code-tags", label: "Platform", value: "React Native / Expo" },
                        { icon: "account-tie-outline", label: "Developed by", value: "Food Saver Team" },
                        { icon: "email-outline", label: "Contact", value: "hello@foodsaver.app" },
                    ].map((row, i, arr) => (
                        <View key={row.label}>
                            <View style={styles.aboutRow}>
                                <View style={styles.aboutIconWrap}>
                                    <MaterialCommunityIcons name={row.icon} size={16} color={COLORS.success} />
                                </View>
                                <Text style={styles.aboutRowLabel}>{row.label}</Text>
                                <Text style={styles.aboutRowValue}>{row.value}</Text>
                            </View>
                            {i < arr.length - 1 && <View style={styles.rowDivider} />}
                        </View>
                    ))}
                    <View style={styles.aboutLinks}>
                        {[
                            { label: "Privacy Policy", icon: "shield-outline" },
                            { label: "Terms of Service", icon: "file-document-outline" },
                            { label: "Open Source Licenses", icon: "open-source-initiative" },
                        ].map(link => (
                            <TouchableOpacity key={link.label} style={styles.aboutLink} activeOpacity={0.75}>
                                <MaterialCommunityIcons name={link.icon} size={16} color={COLORS.success} />
                                <Text style={styles.aboutLinkText}>{link.label}</Text>
                                <MaterialCommunityIcons name="chevron-right" size={16} color="#CCC" />
                            </TouchableOpacity>
                        ))}
                    </View>
                    <Text style={styles.aboutFooter}>Made with ❤️ to reduce food waste</Text>
                    <View style={{ height: 24 }} />
                </ScrollView>
            </Sheet>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.bg },

    hero: { backgroundColor: COLORS.success, paddingTop: 60, paddingBottom: 36, alignItems: "center", borderBottomLeftRadius: 32, borderBottomRightRadius: 32, overflow: "hidden", shadowColor: COLORS.success, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.25, shadowRadius: 20, elevation: 8 },
    heroBlob1: { position: "absolute", width: 200, height: 200, borderRadius: 100, backgroundColor: "#fff", opacity: 0.06, top: -60, right: -60 },
    heroBlob2: { position: "absolute", width: 140, height: 140, borderRadius: 70, backgroundColor: "#fff", opacity: 0.04, bottom: -30, left: -30 },
    editBtn: { position: "absolute", top: 56, right: 22, width: 40, height: 40, borderRadius: 14, backgroundColor: "rgba(255,255,255,0.2)", justifyContent: "center", alignItems: "center" },
    avatarWrap: { position: "relative", marginBottom: 16 },
    avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: COLORS.white, justifyContent: "center", alignItems: "center", borderWidth: 4, borderColor: "rgba(255,255,255,0.4)", shadowColor: "#000", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.2, shadowRadius: 12, elevation: 8 },
    avatarCameraBtn: { position: "absolute", bottom: 2, right: 2, width: 28, height: 28, borderRadius: 9, backgroundColor: COLORS.primary, justifyContent: "center", alignItems: "center", borderWidth: 2, borderColor: COLORS.white },
    avatarImg: { width: 100, height: 100, borderRadius: 50 },
    heroName: { fontSize: 22, fontWeight: "800", color: COLORS.white, letterSpacing: -0.3, marginBottom: 10 },
    verifiedBadge: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "rgba(255,255,255,0.2)", paddingVertical: 6, paddingHorizontal: 14, borderRadius: 9999 },
    verifiedText: { fontSize: 13, fontWeight: "800", color: COLORS.white },

    impactRow: { flexDirection: "row", backgroundColor: COLORS.white, marginHorizontal: 22, marginTop: -1, borderRadius: 20, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 4, marginBottom: 24 },
    impactCell: { flex: 1, alignItems: "center", paddingVertical: 18, gap: 4 },
    impactCellBorder: { borderRightWidth: 1, borderRightColor: "#F0F0F0" },
    impactIconWrap: { width: 36, height: 36, borderRadius: 12, justifyContent: "center", alignItems: "center", marginBottom: 4 },
    impactNum: { fontSize: 20, fontWeight: "800", color: COLORS.textDark, letterSpacing: -0.3 },
    impactLabel: { fontSize: 11, color: COLORS.grayText, fontWeight: "600" },

    section: { paddingHorizontal: 22, marginBottom: 20 },
    sectionTitle: { fontSize: 14, fontWeight: "800", color: COLORS.grayText, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 },
    infoCard: { backgroundColor: COLORS.white, borderRadius: 18, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2, overflow: "hidden" },
    infoRow: { flexDirection: "row", alignItems: "center", padding: 16, gap: 12 },
    infoIconWrap: { width: 40, height: 40, borderRadius: 12, backgroundColor: COLORS.peach, justifyContent: "center", alignItems: "center" },
    infoContent: { flex: 1 },
    infoLabel: { fontSize: 11, color: COLORS.grayText, fontWeight: "600", marginBottom: 2 },
    infoValue: { fontSize: 14, fontWeight: "700", color: COLORS.textDark },
    rowDivider: { height: 1, backgroundColor: "#F5F5F5", marginLeft: 68 },
    settingRow: { flexDirection: "row", alignItems: "center", padding: 16, gap: 12 },
    settingIcon: { width: 40, height: 40, borderRadius: 12, justifyContent: "center", alignItems: "center" },
    settingLabel: { flex: 1, fontSize: 14, fontWeight: "700", color: COLORS.textDark },
    signOutBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", marginHorizontal: 22, gap: 10, backgroundColor: COLORS.errorLight, paddingVertical: 16, borderRadius: 16, marginBottom: 12, borderWidth: 1.5, borderColor: COLORS.error + "30" },
    signOutText: { fontSize: 15, fontWeight: "800", color: COLORS.error },
    versionText: { textAlign: "center", fontSize: 12, color: COLORS.placeholder },

    // Shared sheet
    overlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)" },
    sheetPositioner: { position: "absolute", bottom: 0, left: 0, right: 0 },
    sheet: { backgroundColor: "#fff", borderTopLeftRadius: 28, borderTopRightRadius: 28, maxHeight: "92%", shadowColor: "#000", shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.15, shadowRadius: 20, elevation: 24 },
    sheetHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: "#DDD", alignSelf: "center", marginTop: 12, marginBottom: 4 },
    sheetHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", paddingHorizontal: 22, paddingTop: 12, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: "#F0F0F0" },
    sheetTitle: { fontSize: 20, fontWeight: "800", color: COLORS.textDark, letterSpacing: -0.3 },
    sheetSub: { fontSize: 12, color: COLORS.grayText, marginTop: 3 },
    closeBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: "#F5F5F8", justifyContent: "center", alignItems: "center" },
    sheetBody: { padding: 22, paddingBottom: 10 },

    // Edit fields
    editField: { marginBottom: 18 },
    editLabel: { fontSize: 12, fontWeight: "700", color: COLORS.grayText, marginBottom: 8 },
    editInputWrap: { flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: "#F5F5F8", borderRadius: 14, borderWidth: 1.5, borderColor: COLORS.border, paddingHorizontal: 14, paddingVertical: 13 },
    editInput: { flex: 1, fontSize: 15, color: COLORS.textDark },

    // Toggles
    toggleRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 4 },
    toggleLabel: { fontSize: 15, fontWeight: "700", color: COLORS.textDark, marginBottom: 3 },
    toggleSub: { fontSize: 12, color: COLORS.grayText },
    infoBanner: { flexDirection: "row", alignItems: "flex-start", gap: 8, backgroundColor: "#EBF2FF", borderRadius: 12, padding: 14, marginTop: 8 },
    infoBannerText: { flex: 1, fontSize: 12, color: COLORS.accentBlue, lineHeight: 18 },
    dangerRow: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 16, paddingVertical: 14, paddingHorizontal: 16, backgroundColor: "#FEF2F2", borderRadius: 14, borderWidth: 1, borderColor: "#FECACA" },
    dangerText: { fontSize: 14, fontWeight: "700", color: "#EF4444" },

    // Complaint
    submitterChip: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "#EAF5EF", borderRadius: 12, paddingVertical: 10, paddingHorizontal: 14, marginBottom: 20 },
    submitterAvatar: { width: 28, height: 28, borderRadius: 8, backgroundColor: "#fff", justifyContent: "center", alignItems: "center" },
    submitterText: { fontSize: 13, color: COLORS.grayText, fontWeight: "500" },
    submitterName: { fontWeight: "800", color: COLORS.textDark },
    fieldLabel: { fontSize: 13, fontWeight: "700", color: COLORS.textDark, marginBottom: 10 },
    req: { color: "#EF4444" },
    reasonGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 20 },
    reasonChip: { flexDirection: "row", alignItems: "center", gap: 7, paddingVertical: 9, paddingHorizontal: 13, borderRadius: 12, backgroundColor: "#F7F7FA", borderWidth: 1.5, borderColor: "transparent" },
    reasonText: { fontSize: 13, fontWeight: "600", color: COLORS.grayText },
    textAreaWrap: { backgroundColor: "#F7F7FA", borderRadius: 16, borderWidth: 1.5, borderColor: "transparent", padding: 14, marginBottom: 20 },
    textAreaActive: { borderColor: COLORS.success, backgroundColor: "#EAF5EF" },
    textArea: { fontSize: 14, color: COLORS.textDark, minHeight: 110, lineHeight: 21 },
    charCount: { fontSize: 11, color: COLORS.grayText, textAlign: "right", marginTop: 6 },
    actionBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, paddingVertical: 16, borderRadius: 16, elevation: 4 },
    actionBtnText: { color: "#fff", fontSize: 15, fontWeight: "800" },
    successWrap: { alignItems: "center", padding: 32, paddingTop: 24 },
    successCircle: { width: 90, height: 90, borderRadius: 45, backgroundColor: "#EAF5EF", justifyContent: "center", alignItems: "center", marginBottom: 20 },
    successTitle: { fontSize: 22, fontWeight: "800", color: COLORS.textDark, marginBottom: 12, letterSpacing: -0.3 },
    successBody: { fontSize: 14, color: COLORS.grayText, textAlign: "center", lineHeight: 21, marginBottom: 28, maxWidth: 280 },
    doneBtn: { backgroundColor: "#2D6A4F", paddingVertical: 14, paddingHorizontal: 48, borderRadius: 14 },
    doneBtnText: { color: "#fff", fontSize: 15, fontWeight: "800" },

    // Help
    contactGrid: { flexDirection: "row", gap: 12, marginBottom: 24 },
    contactCard: { flex: 1, alignItems: "center", backgroundColor: "#F7F7FA", borderRadius: 16, padding: 16, gap: 8 },
    contactIcon: { width: 48, height: 48, borderRadius: 14, justifyContent: "center", alignItems: "center" },
    contactLabel: { fontSize: 14, fontWeight: "800", color: COLORS.textDark },
    contactSub: { fontSize: 11, color: COLORS.grayText, textAlign: "center" },
    faqTitle: { fontSize: 15, fontWeight: "800", color: COLORS.textDark, marginBottom: 12 },
    faqItem: { backgroundColor: "#F7F7FA", borderRadius: 14, padding: 16, marginBottom: 10 },
    faqHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    faqQ: { flex: 1, fontSize: 14, fontWeight: "700", color: COLORS.textDark, paddingRight: 8 },
    faqA: { fontSize: 13, color: COLORS.grayText, lineHeight: 20, marginTop: 10 },

    // About
    aboutLogoWrap: { alignItems: "center", marginBottom: 24 },
    aboutLogo: { width: 72, height: 72, borderRadius: 22, backgroundColor: COLORS.success, justifyContent: "center", alignItems: "center", marginBottom: 12, shadowColor: COLORS.success, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 8 },
    aboutAppName: { fontSize: 22, fontWeight: "800", color: COLORS.textDark, letterSpacing: -0.3 },
    aboutTagline: { fontSize: 13, color: COLORS.grayText, textAlign: "center", marginTop: 4, maxWidth: 260 },
    aboutRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 4 },
    aboutIconWrap: { width: 34, height: 34, borderRadius: 10, backgroundColor: "#EAF5EF", justifyContent: "center", alignItems: "center" },
    aboutRowLabel: { flex: 1, fontSize: 14, color: COLORS.grayText, fontWeight: "600" },
    aboutRowValue: { fontSize: 14, fontWeight: "700", color: COLORS.textDark },
    aboutLinks: { backgroundColor: "#F7F7FA", borderRadius: 16, marginTop: 20, overflow: "hidden" },
    aboutLink: { flexDirection: "row", alignItems: "center", gap: 12, padding: 16, borderBottomWidth: 1, borderBottomColor: "#EFEFEF" },
    aboutLinkText: { flex: 1, fontSize: 14, fontWeight: "600", color: COLORS.textDark },
    aboutFooter: { textAlign: "center", fontSize: 13, color: COLORS.grayText, marginTop: 20 },
});