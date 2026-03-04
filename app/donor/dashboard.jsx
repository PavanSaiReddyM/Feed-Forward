import {
  StyleSheet, Text, View, ScrollView, TouchableOpacity,
  Animated, Platform, Dimensions, Modal, Easing,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../../_constants/colors";

const { width } = Dimensions.get("window");
const CARD_W = (width - 40 - 12) / 2;

// ─── Data ──────────────────────────────────────────────────────────────────────
const STATS = [
  { icon: "food-turkey", value: "125", label: "Food (kg)", color: "#FF6B2B", bg: "#FFF0EB" },
  { icon: "hand-heart", value: "3", label: "Active", color: "#2D6A4F", bg: "#EAF5EF" },
  { icon: "check-circle-outline", value: "42", label: "Completed", color: "#2B7FFF", bg: "#EBF2FF" },
  { icon: "account-group-outline", value: "350", label: "People Fed", color: "#7C3AED", bg: "#F3EEFF" },
];

const ACTIVITY = [
  { icon: "check-circle", color: "#2D6A4F", bg: "#EAF5EF", title: "Donation Completed — 50kg Rice", time: "2 days ago", dot: "#2D6A4F" },
  { icon: "truck-delivery", color: "#2B7FFF", bg: "#EBF2FF", title: "Pickup Scheduled — Fresh Fruits", time: "Today, 2 PM", dot: "#2B7FFF" },
  { icon: "clock-outline", color: "#FF6B2B", bg: "#FFF0EB", title: "Request Pending — Bakery Items", time: "1 hour ago", dot: "#FF6B2B" },
];

const NOTIFICATIONS = [
  { id: 1, icon: "check-circle", title: "Donation Accepted", message: "Hope Foundation accepted your Rice & Curry donation (15 kg).", time: "2 hours ago", color: "#2D6A4F", unread: true },
  { id: 2, icon: "truck-delivery", title: "Pickup Scheduled", message: "Fresh Fruits pickup is confirmed for today at 4:00 PM.", time: "5 hours ago", color: "#2B7FFF", unread: true },
  { id: 3, icon: "clock-alert", title: "Expiry Alert", message: "Bread & Pastries donation expires in 2 hours. Act soon!", time: "3 hours ago", color: "#FF6B2B", unread: false },
  { id: 4, icon: "star-circle", title: "Milestone Reached 🎉", message: "You've helped feed 350 people. Thank you for your impact!", time: "Yesterday", color: "#7C3AED", unread: false },
  { id: 5, icon: "account-check", title: "New NGO Matched", message: "Helping Hands NGO is interested in your Vegetable donation.", time: "2 days ago", color: "#F59E0B", unread: false },
];

// ─── Sub-components ────────────────────────────────────────────────────────────
function StatCard({ stat, anim }) {
  return (
    <Animated.View style={[
      styles.statCard,
      { opacity: anim, transform: [{ scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1] }) }] },
    ]}>
      <View style={[styles.statAccent, { backgroundColor: stat.color }]} />
      <View style={[styles.statIconWrap, { backgroundColor: stat.bg }]}>
        <MaterialCommunityIcons name={stat.icon} size={22} color={stat.color} />
      </View>
      <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
      <Text style={styles.statLabel}>{stat.label}</Text>
    </Animated.View>
  );
}

function ActivityRow({ item, isLast }) {
  return (
    <View style={[styles.actRow, !isLast && styles.actBorder]}>
      <View style={[styles.actIcon, { backgroundColor: item.bg }]}>
        <MaterialCommunityIcons name={item.icon} size={18} color={item.color} />
      </View>
      <View style={styles.actContent}>
        <Text style={styles.actTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.actTime}>{item.time}</Text>
      </View>
      <View style={[styles.actDot, { backgroundColor: item.dot }]} />
    </View>
  );
}

function NotificationItem({ icon, title, message, time, color, unread }) {
  return (
    <TouchableOpacity style={[styles.notifItem, unread && styles.notifUnread]} activeOpacity={0.75}>
      <View style={[styles.notifIcon, { backgroundColor: color + "18" }]}>
        <MaterialCommunityIcons name={icon} size={22} color={color} />
      </View>
      <View style={styles.notifContent}>
        <View style={styles.notifHeader}>
          <Text style={styles.notifTitle}>{title}</Text>
          {unread && <View style={[styles.unreadDot, { backgroundColor: color }]} />}
        </View>
        <Text style={styles.notifMessage} numberOfLines={2}>{message}</Text>
        <Text style={styles.notifTime}>{time}</Text>
      </View>
    </TouchableOpacity>
  );
}

// ─── Main Screen ───────────────────────────────────────────────────────────────
export default function Dashboard() {
  const headerAnim = useRef(new Animated.Value(0)).current;
  const bannerAnim = useRef(new Animated.Value(0)).current;
  const cardAnims = useRef(STATS.map(() => new Animated.Value(0))).current;

  // Notification bottom sheet
  const [showNotifications, setShowNotifications] = useState(false);
  const slideAnim = useRef(new Animated.Value(400)).current;

  const openNotifs = () => {
    setShowNotifications(true);
    Animated.spring(slideAnim, {
      toValue: 0, tension: 65, friction: 11, useNativeDriver: true,
    }).start();
  };

  const closeNotifs = () => {
    Animated.timing(slideAnim, {
      toValue: 400, duration: 250,
      easing: Easing.in(Easing.cubic), useNativeDriver: true,
    }).start(() => setShowNotifications(false));
  };

  useEffect(() => {
    Animated.timing(headerAnim, { toValue: 1, duration: 480, useNativeDriver: true }).start();
    Animated.sequence([
      Animated.delay(180),
      Animated.timing(bannerAnim, { toValue: 1, duration: 480, useNativeDriver: true }),
    ]).start();
    cardAnims.forEach((a, i) =>
      Animated.sequence([
        Animated.delay(280 + i * 80),
        Animated.timing(a, { toValue: 1, duration: 400, useNativeDriver: true }),
      ]).start()
    );
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={styles.root}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* ── HEADER ── */}
        <Animated.View style={[styles.header, { opacity: headerAnim }]}>
          <View>
            <Text style={styles.greeting}>Good morning 👋</Text>
            <Text style={styles.title}>Your Contribution</Text>
          </View>
          <TouchableOpacity style={styles.bellBtn} activeOpacity={0.8} onPress={openNotifs}>
            <MaterialCommunityIcons name="bell-outline" size={22} color={COLORS.textDark} />
            <View style={styles.bellDot} />
          </TouchableOpacity>
        </Animated.View>

        {/* ── IMPACT BANNER ── */}
        <Animated.View style={[styles.banner, {
          opacity: bannerAnim,
          transform: [{ translateY: bannerAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }],
        }]}>
          <View style={styles.bannerBlob1} />
          <View style={styles.bannerBlob2} />
          <View style={styles.bannerRow}>
            <View style={styles.bannerIconWrap}>
              <Text style={{ fontSize: 26 }}>🍽️</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.bannerSub}>Your total impact</Text>
              <Text style={styles.bannerMain}>
                You've donated{" "}
                <Text style={styles.bannerHighlight}>125 kg</Text> of food
              </Text>
            </View>
          </View>
          <View style={styles.bannerBadge}>
            <MaterialCommunityIcons name="leaf" size={11} color="#fff" />
            <Text style={styles.bannerBadgeTxt}>Top Donor</Text>
          </View>
        </Animated.View>

        {/* ── STAT CARDS ── */}
        <View style={styles.grid}>
          {STATS.map((s, i) => <StatCard key={i} stat={s} anim={cardAnims[i]} />)}
        </View>

        {/* ── POST DONATION CTA ── */}
        <TouchableOpacity style={styles.ctaBtn} activeOpacity={0.86}>
          <View style={styles.ctaIconWrap}>
            <MaterialCommunityIcons name="plus-circle" size={26} color="#fff" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.ctaTitle}>Post a Donation</Text>
            <Text style={styles.ctaSub}>Share surplus food with those in need</Text>
          </View>
          <MaterialCommunityIcons name="arrow-right" size={20} color="rgba(255,255,255,0.7)" />
        </TouchableOpacity>

        {/* ── RECENT DONATIONS ── */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Recent Donations</Text>
          <TouchableOpacity><Text style={styles.seeAll}>See all</Text></TouchableOpacity>
        </View>

        <View style={styles.actCard}>
          {ACTIVITY.map((item, i) => (
            <ActivityRow key={i} item={item} isLast={i === ACTIVITY.length - 1} />
          ))}
        </View>

        <View style={{ height: 95 }} />
      </ScrollView>

      {/* ── NOTIFICATION BOTTOM SHEET ── */}
      <Modal
        visible={showNotifications}
        transparent
        animationType="none"
        onRequestClose={closeNotifs}
      >
        {/* Overlay — tap to close */}
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={closeNotifs}
        />

        {/* Sheet */}
        <Animated.View style={[styles.bottomSheet, { transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.sheetHandle} />

          {/* Sheet header */}
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Notifications</Text>
            <TouchableOpacity onPress={closeNotifs}>
              <MaterialCommunityIcons name="close" size={22} color={COLORS.textDark} />
            </TouchableOpacity>
          </View>

          {/* Notification list */}
          <ScrollView showsVerticalScrollIndicator={false}>
            {NOTIFICATIONS.map((n) => (
              <NotificationItem key={n.id} {...n} />
            ))}
          </ScrollView>

          {/* Mark all read */}
          <TouchableOpacity style={styles.markAllBtn} onPress={closeNotifs}>
            <Text style={styles.markAllText}>Mark All as Read</Text>
          </TouchableOpacity>
        </Animated.View>
      </Modal>
    </View>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F5F0EB" },
  content: { paddingHorizontal: 20, paddingTop: Platform.OS === "ios" ? 56 : 44 },

  // Header
  header: {
    flexDirection: "row", justifyContent: "space-between",
    alignItems: "center", marginBottom: 20,
  },
  greeting: { fontSize: 14, color: COLORS.grayText, fontWeight: "500", marginBottom: 3 },
  title: { fontSize: 24, fontWeight: "800", color: COLORS.textDark, letterSpacing: -0.4 },
  bellBtn: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: "#fff", justifyContent: "center", alignItems: "center",
    shadowColor: "#000", shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1, shadowRadius: 8, elevation: 4,
  },
  bellDot: {
    position: "absolute", top: 10, right: 10,
    width: 9, height: 9, borderRadius: 5,
    backgroundColor: "#FF3B30", borderWidth: 1.5, borderColor: "#fff",
  },

  // Banner
  banner: {
    backgroundColor: COLORS.primary,
    borderRadius: 22, padding: 18, marginBottom: 20, overflow: "hidden",
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.30, shadowRadius: 18, elevation: 10,
  },
  bannerBlob1: {
    position: "absolute", width: 180, height: 180, borderRadius: 90,
    backgroundColor: "rgba(255,255,255,0.07)", top: -60, right: -40,
  },
  bannerBlob2: {
    position: "absolute", width: 100, height: 100, borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.05)", bottom: -30, left: 90,
  },
  bannerRow: { flexDirection: "row", alignItems: "center", gap: 14, marginBottom: 14 },
  bannerIconWrap: {
    width: 52, height: 52, borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.18)",
    justifyContent: "center", alignItems: "center",
  },
  bannerSub: { fontSize: 12, color: "rgba(255,255,255,0.7)", fontWeight: "600", marginBottom: 4 },
  bannerMain: { fontSize: 15, color: "#fff", fontWeight: "700", lineHeight: 21 },
  bannerHighlight: { color: "#FFD5B8", fontWeight: "800" },
  bannerBadge: {
    flexDirection: "row", alignItems: "center", gap: 5,
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.18)",
    paddingVertical: 5, paddingHorizontal: 12,
    borderRadius: 9999, borderWidth: 1, borderColor: "rgba(255,255,255,0.22)",
  },
  bannerBadgeTxt: { fontSize: 11, fontWeight: "800", color: "#fff" },

  // Stat grid
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 20 },
  statCard: {
    width: CARD_W, backgroundColor: "#fff",
    borderRadius: 20, padding: 18, overflow: "hidden",
    shadowColor: "#000", shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07, shadowRadius: 10, elevation: 3,
  },
  statAccent: {
    position: "absolute", left: 0, top: 16, bottom: 16, width: 4,
    borderTopRightRadius: 4, borderBottomRightRadius: 4,
  },
  statIconWrap: { width: 44, height: 44, borderRadius: 14, justifyContent: "center", alignItems: "center", marginBottom: 14 },
  statValue: { fontSize: 30, fontWeight: "800", letterSpacing: -0.5, marginBottom: 4 },
  statLabel: { fontSize: 13, color: COLORS.grayText, fontWeight: "600" },

  // CTA
  ctaBtn: {
    backgroundColor: "#2D6A4F",
    borderRadius: 20, padding: 18,
    flexDirection: "row", alignItems: "center", gap: 14,
    marginBottom: 26,
    shadowColor: "#2D6A4F", shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28, shadowRadius: 14, elevation: 8,
  },
  ctaIconWrap: {
    width: 46, height: 46, borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.18)",
    justifyContent: "center", alignItems: "center",
  },
  ctaTitle: { fontSize: 16, fontWeight: "800", color: "#fff", marginBottom: 3 },
  ctaSub: { fontSize: 12, color: "rgba(255,255,255,0.72)" },

  // Section
  sectionRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  sectionTitle: { fontSize: 18, fontWeight: "800", color: COLORS.textDark, letterSpacing: -0.3 },
  seeAll: { fontSize: 14, fontWeight: "700", color: COLORS.primary },

  // Activity
  actCard: {
    backgroundColor: "#fff", borderRadius: 20, paddingHorizontal: 16,
    shadowColor: "#000", shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07, shadowRadius: 10, elevation: 3,
  },
  actRow: { flexDirection: "row", alignItems: "center", paddingVertical: 14, gap: 12 },
  actBorder: { borderBottomWidth: 1, borderBottomColor: "#F3F3F7" },
  actIcon: { width: 40, height: 40, borderRadius: 13, justifyContent: "center", alignItems: "center", flexShrink: 0 },
  actContent: { flex: 1 },
  actTitle: { fontSize: 14, fontWeight: "700", color: COLORS.textDark, lineHeight: 19, marginBottom: 3 },
  actTime: { fontSize: 12, color: COLORS.grayText, fontWeight: "500" },
  actDot: { width: 8, height: 8, borderRadius: 4, flexShrink: 0 },

  // Modal overlay
  modalOverlay: {
    position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.45)",
  },

  // Bottom sheet
  bottomSheet: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    maxHeight: "80%", paddingBottom: 32,
    shadowColor: "#000", shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12, shadowRadius: 20, elevation: 24,
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

  // Notification items
  notifItem: {
    flexDirection: "row", padding: 16,
    borderBottomWidth: 1, borderBottomColor: "#F5F5F5",
  },
  notifUnread: { backgroundColor: "#FAFAF8" },
  notifIcon: {
    width: 46, height: 46, borderRadius: 14,
    justifyContent: "center", alignItems: "center", marginRight: 14,
  },
  notifContent: { flex: 1 },
  notifHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 },
  notifTitle: { fontSize: 14, fontWeight: "700", color: COLORS.textDark },
  unreadDot: { width: 8, height: 8, borderRadius: 4 },
  notifMessage: { fontSize: 13, color: COLORS.grayText, lineHeight: 18, marginBottom: 4 },
  notifTime: { fontSize: 11, color: COLORS.grayText, opacity: 0.6 },

  // Mark all
  markAllBtn: {
    margin: 16, backgroundColor: COLORS.primary,
    borderRadius: 14, padding: 16, alignItems: "center",
  },
  markAllText: { color: "#fff", fontWeight: "800", fontSize: 15 },
});