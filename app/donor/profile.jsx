import {
  StyleSheet, Text, View, TouchableOpacity, Switch,
  TextInput, ScrollView, Platform, Modal, Animated, Easing,
  KeyboardAvoidingView, Linking, Image, Alert,
} from "react-native";
import { useState, useRef, useEffect } from "react";
import { getProfile, updateProfile, getDonorDashboard } from "../services/api";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../../_constants/colors";
import * as ImagePicker from "expo-image-picker";

// Static UI configuration - not data
const SETTINGS = [
  { icon: "bell-outline", label: "Notifications", color: "#FF6B2B", bg: "#FFF0EB" },
  { icon: "shield-lock-outline", label: "Privacy", color: "#2B7FFF", bg: "#EBF2FF" },
  { icon: "alert-circle-outline", label: "File a Complaint", color: "#F59E0B", bg: "#FFF8EB" },
  { icon: "help-circle-outline", label: "Help & Support", color: "#2D6A4F", bg: "#EAF5EF" },
  { icon: "information-outline", label: "About", color: "#7C3AED", bg: "#F3EEFF" },
];

const REASONS = [
  { id: "app_bug", label: "App Bug", icon: "bug-outline", color: "#EF4444" },
  { id: "wrong_info", label: "Wrong Info", icon: "file-alert-outline", color: "#F59E0B" },
  { id: "ngo_behavior", label: "NGO Behavior", icon: "account-alert-outline", color: "#FF6B2B" },
  { id: "pickup_issue", label: "Pickup Issue", icon: "truck-alert-outline", color: "#2B7FFF" },
  { id: "payment_issue", label: "Payment Issue", icon: "cash-remove", color: "#7C3AED" },
  { id: "account_issue", label: "Account Issue", icon: "account-lock-outline", color: "#2D6A4F" },
  { id: "other", label: "Other", icon: "dots-horizontal-circle", color: "#6B7280" },
];

const FAQS = [
  { q: "How do I post a donation?", a: "Go to the Home tab and tap 'Post a Donation'. Fill in food details, quantity, expiry, and pickup time. NGOs nearby will be notified." },
  { q: "Can I cancel a scheduled pickup?", a: "Yes. Go to Active Donations, select the donation, and tap 'Cancel Pickup'. Please cancel at least 2 hours before the scheduled time." },
  { q: "How are NGOs verified?", a: "Every NGO on Food Saver is manually reviewed and verified by our admin team before being approved to request donations." },
  { q: "What food items can I donate?", a: "You can donate cooked meals, raw produce, packaged food, bakery items, and beverages — as long as they are within expiry and safe to consume." },
  { q: "How do I track my donation history?", a: "Tap the History tab in the bottom navigation to see all your past and active donations with full status details." },
];

function InfoRow({ icon, label, value, isEditing, onChange }) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoIconWrap}>
        <MaterialCommunityIcons name={icon} size={18} color={COLORS.primary} />
      </View>
      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        {isEditing ? (
          <TextInput style={styles.infoInput} value={value} onChangeText={onChange} autoCapitalize="none" />
        ) : (
          <Text style={styles.infoValue}>{value}</Text>
        )}
      </View>
      {!isEditing && <MaterialCommunityIcons name="chevron-right" size={18} color="#CCC" />}
    </View>
  );
}

// Reusable sheet open/close helper
function useSheet(initial = 600) {
  const anim = useRef(new Animated.Value(initial)).current;
  const [visible, setVisible] = useState(false);
  const open = () => { setVisible(true); Animated.spring(anim, { toValue: 0, tension: 65, friction: 11, useNativeDriver: true }).start(); };
  const close = (cb) => Animated.timing(anim, { toValue: initial, duration: 260, easing: Easing.in(Easing.cubic), useNativeDriver: true }).start(() => { setVisible(false); cb && cb(); });
  return { anim, visible, open, close };
}

export default function DonorProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [stats, setStats] = useState([
    { value: "0", label: "Donations", color: "#FF6B2B", bg: "#FFF0EB", icon: "food-fork-drink" },
    { value: "0", label: "People Fed", color: "#2D6A4F", bg: "#EAF5EF", icon: "account-group" },
    { value: "0", label: "kg Donated", color: "#2B7FFF", bg: "#EBF2FF", icon: "weight-kilogram" },
  ]);
  const router = useRouter();
  const [photoUri, setPhotoUri] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch profile and stats on mount
  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch profile data
        const profileData = await getProfile();
        if (mounted) {
          setName(profileData.name || "");
          setEmail(profileData.email || "");
          setPhone(profileData.phone || "");
          setAddress(profileData.address || profileData.location || "");
        }

        // Fetch dashboard data for stats
        const dashboardData = await getDonorDashboard();
        if (mounted && dashboardData) {
          setStats([
            { 
              value: String(dashboardData.totalDonations || 0), 
              label: "Donations", 
              color: "#FF6B2B", 
              bg: "#FFF0EB", 
              icon: "food-fork-drink" 
            },
            { 
              value: String(dashboardData.peopleFed || 0), 
              label: "People Fed", 
              color: "#2D6A4F", 
              bg: "#EAF5EF", 
              icon: "account-group" 
            },
            { 
              value: String(dashboardData.foodQuantity || 0), 
              label: "kg Donated", 
              color: "#2B7FFF", 
              bg: "#EBF2FF", 
              icon: "weight-kilogram" 
            },
          ]);
        }
      } catch (err) {
        if (mounted) setError("Failed to load profile");
      }
      if (mounted) setLoading(false);
    })();
    return () => { mounted = false; };
  }, []);

  // Save profile changes
  const handleSave = async () => {
    setLoading(true);
    setError(null);
    try {
      const updated = await updateProfile({ name, email, phone, address });
      setName(updated.name || "");
      setEmail(updated.email || "");
      setPhone(updated.phone || "");
      setAddress(updated.address || updated.location || "");
      setIsEditing(false);
      Alert.alert("Profile updated");
    } catch (err) {
      setError("Failed to update profile");
      Alert.alert("Error", err.message || "Failed to update profile");
    }
    setLoading(false);
  };

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

  // ── Sheet hooks ──
  const notif = useSheet();
  const privacy = useSheet();
  const complaint = useSheet();
  const help = useSheet();
  const about = useSheet();

  // Notification toggles
  const [notifDonation, setNotifDonation] = useState(true);
  const [notifPickup, setNotifPickup] = useState(true);
  const [notifReminder, setNotifReminder] = useState(true);
  const [notifPromo, setNotifPromo] = useState(false);

  // Privacy toggles
  const [privProfile, setPrivProfile] = useState(true);
  const [privActivity, setPrivActivity] = useState(false);
  const [privLocation, setPrivLocation] = useState(true);
  const [privData, setPrivData] = useState(true);

  // Complaint form
  const [reason, setReason] = useState(null);
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const canSubmit = reason && description.trim().length >= 10;

  // Help FAQ expand
  const [openFaq, setOpenFaq] = useState(null);

  const handleComplaintClose = () => complaint.close(() => {
    setTimeout(() => { setReason(null); setDescription(""); setSubmitted(false); }, 100);
  });

  const settingHandler = (label) => {
    if (label === "Notifications") return notif.open;
    if (label === "Privacy") return privacy.open;
    if (label === "File a Complaint") return complaint.open;
    if (label === "Help & Support") return help.open;
    if (label === "About") return about.open;
    return undefined;
  };

  // ── Shared Sheet wrapper ──
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
      <ScrollView style={styles.root} showsVerticalScrollIndicator={false}>

        {/* ── HERO ── */}
        <View style={styles.hero}>
          <View style={styles.heroBlob1} />
          <View style={styles.heroBlob2} />
          <TouchableOpacity style={styles.editBtn} onPress={() => setIsEditing(!isEditing)} activeOpacity={0.8}>
            <MaterialCommunityIcons name={isEditing ? "check" : "pencil-outline"} size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.avatarWrap} onPress={openPhotoPicker} activeOpacity={0.85}>
            <View style={styles.avatar}>
              {photoUri
                ? <Image source={{ uri: photoUri }} style={styles.avatarImg} />
                : <MaterialCommunityIcons name="account" size={52} color={COLORS.primary} />
              }
            </View>
            <View style={styles.avatarBadge}>
              <MaterialCommunityIcons name="camera" size={14} color="#fff" />
            </View>
          </TouchableOpacity>
          {isEditing
            ? <TextInput style={styles.nameInput} value={name} onChangeText={setName} />
            : <Text style={styles.heroName}>{name}</Text>
          }
          <View style={styles.badgeRow}>
            <View style={styles.roleBadge}><Text style={styles.roleBadgeText}>🍽️  Donor</Text></View>
            <View style={styles.verifiedBadge}>
              <MaterialCommunityIcons name="shield-check" size={13} color="#fff" />
              <Text style={styles.verifiedText}>Verified</Text>
            </View>
          </View>
        </View>

        {/* ── STATS ── */}
        <View style={styles.statsCard}>
          {stats.map((s, i) => (
            <View key={i} style={[styles.statItem, i < stats.length - 1 && styles.statItemBorder]}>
              <View style={[styles.statIconWrap, { backgroundColor: s.bg }]}>
                <MaterialCommunityIcons name={s.icon} size={15} color={s.color} />
              </View>
              <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* ── ACCOUNT INFO ── */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Account Info</Text>
          <InfoRow icon="email-outline" label="Email" value={email} isEditing={isEditing} onChange={setEmail} />
          <View style={styles.rowDivider} />
          <InfoRow icon="phone-outline" label="Phone" value={phone} isEditing={isEditing} onChange={setPhone} />
          <View style={styles.rowDivider} />
          <InfoRow icon="map-marker-outline" label="Address" value={address} isEditing={isEditing} onChange={setAddress} />
        </View>

        {isEditing && (
          <TouchableOpacity style={styles.saveBtn} onPress={() => setIsEditing(false)} activeOpacity={0.86}>
            <MaterialCommunityIcons name="content-save-outline" size={20} color="#fff" />
            <Text style={styles.saveBtnText}>Save Changes</Text>
          </TouchableOpacity>
        )}

        {/* ── SETTINGS ── */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Settings</Text>
          {SETTINGS.map((s, i) => (
            <View key={i}>
              <TouchableOpacity style={styles.settingRow} activeOpacity={0.75} onPress={settingHandler(s.label)}>
                <View style={[styles.settingIconWrap, { backgroundColor: s.bg }]}>
                  <MaterialCommunityIcons name={s.icon} size={18} color={s.color} />
                </View>
                <Text style={styles.settingLabel}>{s.label}</Text>
                <MaterialCommunityIcons name="chevron-right" size={18} color="#CCC" />
              </TouchableOpacity>
              {i < SETTINGS.length - 1 && <View style={styles.rowDivider} />}
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={styles.signOutBtn}
          activeOpacity={0.86}
          onPress={() =>
            Alert.alert("Sign Out", "Are you sure you want to sign out?", [
              { text: "Cancel", style: "cancel" },
              { text: "Sign Out", style: "destructive", onPress: () => router.replace("/welcome") },
            ])
          }
        >
          <MaterialCommunityIcons name="logout" size={20} color="#D32F2F" />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
        <View style={{ height: 95 }} />
      </ScrollView>

      {/* ══════════════════════════════════════
          1. NOTIFICATIONS SHEET
      ══════════════════════════════════════ */}
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
            { label: "Donation Accepted", sub: "When an NGO accepts your donation", val: notifDonation, set: setNotifDonation, color: "#FF6B2B" },
            { label: "Pickup Reminders", sub: "Reminders before scheduled pickups", val: notifPickup, set: setNotifPickup, color: "#2B7FFF" },
            { label: "Expiry Alerts", sub: "When your donation is about to expire", val: notifReminder, set: setNotifReminder, color: "#F59E0B" },
            { label: "Promotions & Updates", sub: "App news, tips and announcements", val: notifPromo, set: setNotifPromo, color: "#7C3AED" },
          ].map((item, i, arr) => (
            <View key={item.label}>
              <View style={styles.toggleRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.toggleLabel}>{item.label}</Text>
                  <Text style={styles.toggleSub}>{item.sub}</Text>
                </View>
                <Switch
                  value={item.val}
                  onValueChange={item.set}
                  trackColor={{ false: "#E5E7EB", true: item.color + "55" }}
                  thumbColor={item.val ? item.color : "#9CA3AF"}
                />
              </View>
              {i < arr.length - 1 && <View style={styles.rowDivider} />}
            </View>
          ))}
          <View style={styles.infoBanner}>
            <MaterialCommunityIcons name="information-outline" size={16} color="#2B7FFF" />
            <Text style={styles.infoBannerText}>Push notifications must be enabled in your device settings for these to work.</Text>
          </View>
        </ScrollView>
      </Sheet>

      {/* ══════════════════════════════════════
          2. PRIVACY SHEET
      ══════════════════════════════════════ */}
      <Sheet hook={privacy}>
        <View style={styles.sheetHeader}>
          <View>
            <Text style={styles.sheetTitle}>Privacy</Text>
            <Text style={styles.sheetSub}>Control how your data is used</Text>
          </View>
          <TouchableOpacity style={styles.closeBtn} onPress={() => privacy.close()}>
            <MaterialCommunityIcons name="close" size={20} color={COLORS.textDark} />
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={styles.sheetBody} showsVerticalScrollIndicator={false}>
          {[
            { label: "Public Profile", sub: "Allow NGOs to see your donor profile", val: privProfile, set: setPrivProfile, color: "#FF6B2B" },
            { label: "Activity Visible", sub: "Show your donation activity to NGOs", val: privActivity, set: setPrivActivity, color: "#2D6A4F" },
            { label: "Location Access", sub: "Share location for nearby NGO matching", val: privLocation, set: setPrivLocation, color: "#2B7FFF" },
            { label: "Analytics Sharing", sub: "Help improve the app with usage data", val: privData, set: setPrivData, color: "#7C3AED" },
          ].map((item, i, arr) => (
            <View key={item.label}>
              <View style={styles.toggleRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.toggleLabel}>{item.label}</Text>
                  <Text style={styles.toggleSub}>{item.sub}</Text>
                </View>
                <Switch
                  value={item.val}
                  onValueChange={item.set}
                  trackColor={{ false: "#E5E7EB", true: item.color + "55" }}
                  thumbColor={item.val ? item.color : "#9CA3AF"}
                />
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

      {/* ══════════════════════════════════════
          3. COMPLAINT SHEET
      ══════════════════════════════════════ */}
      <Sheet hook={complaint} onClose={handleComplaintClose}>
        <View style={styles.sheetHandle} />
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
                <MaterialCommunityIcons name="account" size={16} color={COLORS.primary} />
              </View>
              <Text style={styles.submitterText}>Submitting as <Text style={styles.submitterName}>{name}</Text> · Donor</Text>
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
            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: canSubmit ? COLORS.primary : "#CCC" }]} onPress={() => canSubmit && setSubmitted(true)} activeOpacity={canSubmit ? 0.86 : 1}>
              <MaterialCommunityIcons name="send-outline" size={18} color="#fff" />
              <Text style={styles.actionBtnText}>Submit Complaint</Text>
            </TouchableOpacity>
            <View style={{ height: 24 }} />
          </ScrollView>
        )}
      </Sheet>

      {/* ══════════════════════════════════════
          4. HELP & SUPPORT SHEET
      ══════════════════════════════════════ */}
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
          {/* Contact options */}
          <View style={styles.contactGrid}>
            {[
              { icon: "email-outline", label: "Email Us", sub: "support@foodsaver.app", color: "#FF6B2B", bg: "#FFF0EB", action: () => Linking.openURL("mailto:support@foodsaver.app") },
              { icon: "whatsapp", label: "WhatsApp", sub: "+91 98765 00001", color: "#2D6A4F", bg: "#EAF5EF", action: () => Linking.openURL("https://wa.me/919876500001") },
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

          {/* FAQs */}
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

      {/* ══════════════════════════════════════
          5. ABOUT SHEET
      ══════════════════════════════════════ */}
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
          {/* App logo block */}
          <View style={styles.aboutLogoWrap}>
            <View style={styles.aboutLogo}>
              <MaterialCommunityIcons name="food-apple" size={40} color="#fff" />
            </View>
            <Text style={styles.aboutAppName}>Food Saver</Text>
            <Text style={styles.aboutTagline}>Connecting surplus food with those who need it most</Text>
          </View>

          {/* Info rows */}
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
                  <MaterialCommunityIcons name={row.icon} size={16} color={COLORS.primary} />
                </View>
                <Text style={styles.aboutRowLabel}>{row.label}</Text>
                <Text style={styles.aboutRowValue}>{row.value}</Text>
              </View>
              {i < arr.length - 1 && <View style={styles.rowDivider} />}
            </View>
          ))}

          {/* Links */}
          <View style={styles.aboutLinks}>
            {[
              { label: "Privacy Policy", icon: "shield-outline" },
              { label: "Terms of Service", icon: "file-document-outline" },
              { label: "Open Source Licenses", icon: "open-source-initiative" },
            ].map(link => (
              <TouchableOpacity key={link.label} style={styles.aboutLink} activeOpacity={0.75}>
                <MaterialCommunityIcons name={link.icon} size={16} color={COLORS.primary} />
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
  root: { flex: 1, backgroundColor: "#F5F0EB" },

  hero: { backgroundColor: COLORS.primary, paddingTop: Platform.OS === "ios" ? 56 : 44, paddingBottom: 36, alignItems: "center", overflow: "hidden", shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.28, shadowRadius: 18, elevation: 10, marginBottom: 20 },
  heroBlob1: { position: "absolute", width: 220, height: 220, borderRadius: 110, backgroundColor: "rgba(255,255,255,0.07)", top: -60, right: -60 },
  heroBlob2: { position: "absolute", width: 130, height: 130, borderRadius: 65, backgroundColor: "rgba(0,0,0,0.08)", bottom: -40, left: -30 },
  editBtn: { position: "absolute", top: Platform.OS === "ios" ? 58 : 46, right: 20, width: 40, height: 40, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.2)", justifyContent: "center", alignItems: "center" },
  avatarWrap: { marginBottom: 14, position: "relative" },
  avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: "#fff", justifyContent: "center", alignItems: "center", borderWidth: 3, borderColor: "rgba(255,255,255,0.3)", shadowColor: "#000", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 6 },
  avatarBadge: { position: "absolute", bottom: 2, right: 2, width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.primary, justifyContent: "center", alignItems: "center", borderWidth: 2, borderColor: "#fff" },
  avatarImg: { width: 100, height: 100, borderRadius: 50 },
  heroName: { fontSize: 22, fontWeight: "800", color: "#fff", letterSpacing: -0.3, marginBottom: 10 },
  nameInput: { fontSize: 20, fontWeight: "800", color: "#fff", borderBottomWidth: 1.5, borderBottomColor: "rgba(255,255,255,0.5)", marginBottom: 10, minWidth: 160, textAlign: "center" },
  badgeRow: { flexDirection: "row", gap: 10 },
  roleBadge: { backgroundColor: "rgba(255,255,255,0.18)", paddingVertical: 6, paddingHorizontal: 14, borderRadius: 9999, borderWidth: 1, borderColor: "rgba(255,255,255,0.25)" },
  roleBadgeText: { fontSize: 13, fontWeight: "700", color: "#fff" },
  verifiedBadge: { flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: "#2D6A4F", paddingVertical: 6, paddingHorizontal: 12, borderRadius: 9999 },
  verifiedText: { fontSize: 12, fontWeight: "700", color: "#fff" },

  statsCard: { flexDirection: "row", backgroundColor: "#fff", marginHorizontal: 20, borderRadius: 20, padding: 16, marginBottom: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.07, shadowRadius: 10, elevation: 3 },
  statItem: { flex: 1, alignItems: "center", gap: 5 },
  statItemBorder: { borderRightWidth: 1, borderRightColor: "#F0F0F5" },
  statIconWrap: { width: 32, height: 32, borderRadius: 10, justifyContent: "center", alignItems: "center" },
  statValue: { fontSize: 18, fontWeight: "800", letterSpacing: -0.3 },
  statLabel: { fontSize: 10, color: COLORS.grayText, fontWeight: "600", textAlign: "center" },

  card: { backgroundColor: "#fff", marginHorizontal: 20, borderRadius: 20, padding: 18, marginBottom: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.07, shadowRadius: 10, elevation: 3 },
  cardTitle: { fontSize: 12, fontWeight: "800", color: COLORS.grayText, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 16 },
  infoRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  infoIconWrap: { width: 38, height: 38, borderRadius: 12, backgroundColor: COLORS.primaryGlow, justifyContent: "center", alignItems: "center" },
  infoContent: { flex: 1 },
  infoLabel: { fontSize: 11, color: COLORS.grayText, fontWeight: "600", marginBottom: 2 },
  infoValue: { fontSize: 14, fontWeight: "700", color: COLORS.textDark },
  infoInput: { fontSize: 14, fontWeight: "700", color: COLORS.textDark, borderBottomWidth: 1.5, borderBottomColor: COLORS.primary + "66", paddingBottom: 2 },
  rowDivider: { height: 1, backgroundColor: "#F3F3F7", marginVertical: 12 },
  saveBtn: { marginHorizontal: 20, backgroundColor: COLORS.primary, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, paddingVertical: 16, borderRadius: 16, marginBottom: 16, shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.28, shadowRadius: 12, elevation: 6 },
  saveBtnText: { color: "#fff", fontSize: 15, fontWeight: "800" },
  settingRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  settingIconWrap: { width: 38, height: 38, borderRadius: 12, justifyContent: "center", alignItems: "center" },
  settingLabel: { flex: 1, fontSize: 15, fontWeight: "600", color: COLORS.textDark },
  signOutBtn: { marginHorizontal: 20, backgroundColor: "#fff", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, paddingVertical: 16, borderRadius: 16, marginBottom: 10, borderWidth: 1.5, borderColor: "#FFCDD2" },
  signOutText: { color: "#D32F2F", fontSize: 15, fontWeight: "800" },

  // ── Shared sheet ──
  overlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)" },
  sheetPositioner: { position: "absolute", bottom: 0, left: 0, right: 0 },
  sheet: { backgroundColor: "#fff", borderTopLeftRadius: 28, borderTopRightRadius: 28, maxHeight: "92%", shadowColor: "#000", shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.15, shadowRadius: 20, elevation: 24 },
  sheetHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: "#DDD", alignSelf: "center", marginTop: 12, marginBottom: 4 },
  sheetHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", paddingHorizontal: 22, paddingTop: 12, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: "#F0F0F0" },
  sheetTitle: { fontSize: 20, fontWeight: "800", color: COLORS.textDark, letterSpacing: -0.3 },
  sheetSub: { fontSize: 12, color: COLORS.grayText, marginTop: 3 },
  closeBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: "#F5F5F8", justifyContent: "center", alignItems: "center" },
  sheetBody: { padding: 22, paddingBottom: 10 },

  // Notifications & Privacy toggles
  toggleRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 4 },
  toggleLabel: { fontSize: 15, fontWeight: "700", color: COLORS.textDark, marginBottom: 3 },
  toggleSub: { fontSize: 12, color: COLORS.grayText },
  infoBanner: { flexDirection: "row", alignItems: "flex-start", gap: 8, backgroundColor: "#EBF2FF", borderRadius: 12, padding: 14, marginTop: 8 },
  infoBannerText: { flex: 1, fontSize: 12, color: "#2B7FFF", lineHeight: 18 },
  dangerRow: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 16, paddingVertical: 14, paddingHorizontal: 16, backgroundColor: "#FEF2F2", borderRadius: 14, borderWidth: 1, borderColor: "#FECACA" },
  dangerText: { fontSize: 14, fontWeight: "700", color: "#EF4444" },

  // Complaint
  submitterChip: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: COLORS.primaryGlow, borderRadius: 12, paddingVertical: 10, paddingHorizontal: 14, marginBottom: 20 },
  submitterAvatar: { width: 28, height: 28, borderRadius: 8, backgroundColor: "#fff", justifyContent: "center", alignItems: "center" },
  submitterText: { fontSize: 13, color: COLORS.grayText, fontWeight: "500" },
  submitterName: { fontWeight: "800", color: COLORS.textDark },
  fieldLabel: { fontSize: 13, fontWeight: "700", color: COLORS.textDark, marginBottom: 10 },
  req: { color: "#EF4444" },
  reasonGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 20 },
  reasonChip: { flexDirection: "row", alignItems: "center", gap: 7, paddingVertical: 9, paddingHorizontal: 13, borderRadius: 12, backgroundColor: "#F7F7FA", borderWidth: 1.5, borderColor: "transparent" },
  reasonText: { fontSize: 13, fontWeight: "600", color: COLORS.grayText },
  textAreaWrap: { backgroundColor: "#F7F7FA", borderRadius: 16, borderWidth: 1.5, borderColor: "transparent", padding: 14, marginBottom: 20 },
  textAreaActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primaryGlow },
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

  // Help & Support
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
  aboutLogo: { width: 72, height: 72, borderRadius: 22, backgroundColor: COLORS.primary, justifyContent: "center", alignItems: "center", marginBottom: 12, shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 8 },
  aboutAppName: { fontSize: 22, fontWeight: "800", color: COLORS.textDark, letterSpacing: -0.3 },
  aboutTagline: { fontSize: 13, color: COLORS.grayText, textAlign: "center", marginTop: 4, maxWidth: 260 },
  aboutRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 4 },
  aboutIconWrap: { width: 34, height: 34, borderRadius: 10, backgroundColor: COLORS.primaryGlow, justifyContent: "center", alignItems: "center" },
  aboutRowLabel: { flex: 1, fontSize: 14, color: COLORS.grayText, fontWeight: "600" },
  aboutRowValue: { fontSize: 14, fontWeight: "700", color: COLORS.textDark },
  aboutLinks: { backgroundColor: "#F7F7FA", borderRadius: 16, marginTop: 20, overflow: "hidden" },
  aboutLink: { flexDirection: "row", alignItems: "center", gap: 12, padding: 16, borderBottomWidth: 1, borderBottomColor: "#EFEFEF" },
  aboutLinkText: { flex: 1, fontSize: 14, fontWeight: "600", color: COLORS.textDark },
  aboutFooter: { textAlign: "center", fontSize: 13, color: COLORS.grayText, marginTop: 20 },
});