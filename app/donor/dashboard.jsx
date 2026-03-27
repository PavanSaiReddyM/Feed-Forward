import {
  StyleSheet, Text, View, ScrollView, TouchableOpacity,
  Animated, Platform, Dimensions, Modal, Easing, Pressable,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import { getDonorDashboard } from "../services/api";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { COLORS } from "../../_constants/colors";

const { width } = Dimensions.get("window");

// ─── Data from backend ─────────────────────────────────────────────────────


// ─── Animated number counter ─────────────────────────────────────────────────
function useCounter(target, delay = 0) {
  const anim = useRef(new Animated.Value(0)).current;
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(anim, { toValue: target, duration: 900, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start();
    }, delay);
    const id = anim.addListener(({ value }) => setDisplay(Math.round(value)));
    return () => { clearTimeout(timer); anim.removeListener(id); };
  }, []);
  return display;
}

// ─── KPI card with press ripple ──────────────────────────────────────────────
function KpiCard({ stat, index }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const pressAnim = useRef(new Animated.Value(1)).current;
  const count = useCounter(stat.value, 300 + index * 120);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, delay: index * 100, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, tension: 55, friction: 8, delay: index * 100, useNativeDriver: true }),
    ]).start();
  }, []);

  const onPressIn = () => Animated.spring(pressAnim, { toValue: 0.93, useNativeDriver: true }).start();
  const onPressOut = () => Animated.spring(pressAnim, { toValue: 1, useNativeDriver: true }).start();

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }], flex: 1 }}>
      <Pressable onPressIn={onPressIn} onPressOut={onPressOut}>
        <Animated.View style={[styles.kpiCard, { transform: [{ scale: pressAnim }] }]}>
          <View style={[styles.kpiIconWrap, { backgroundColor: stat.bg }]}>
            <MaterialCommunityIcons name={stat.icon} size={19} color={stat.color} />
          </View>
          <Text style={[styles.kpiValue, { color: stat.color }]}>{count}</Text>
          <Text style={styles.kpiLabel}>{stat.label}</Text>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

// ─── Live pulse dot ──────────────────────────────────────────────────────────
function PulseDot({ color }) {
  const pulse = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.6, duration: 700, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1.0, duration: 700, useNativeDriver: true }),
      ])
    ).start();
  }, []);
  return (
    <View style={{ width: 14, height: 14, justifyContent: "center", alignItems: "center" }}>
      <Animated.View style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: color + "30", transform: [{ scale: pulse }], position: "absolute" }} />
      <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: color }} />
    </View>
  );
}

// ─── Expandable activity card ────────────────────────────────────────────────
function ActivityCard({ item, index }) {
  const [expanded, setExpanded] = useState(false);
  const expandAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pressAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 420, delay: index * 100, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 1, duration: 420, delay: index * 100, useNativeDriver: true }),
    ]).start();
  }, []);

  const toggle = () => {
    const toValue = expanded ? 0 : 1;
    Animated.spring(expandAnim, { toValue, tension: 60, friction: 12, useNativeDriver: false }).start();
    setExpanded(!expanded);
  };

  const detailHeight = expandAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 72] });
  const detailOpacity = expandAnim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 0, 1] });
  const chevronRotate = expandAnim.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "180deg"] });
  const cardTranslate = slideAnim.interpolate({ inputRange: [0, 1], outputRange: [30, 0] });

  const onPressIn = () => Animated.spring(pressAnim, { toValue: 0.97, useNativeDriver: true }).start();
  const onPressOut = () => Animated.spring(pressAnim, { toValue: 1, useNativeDriver: true }).start();

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: cardTranslate }, { scale: pressAnim }] }}>
      <Pressable onPress={toggle} onPressIn={onPressIn} onPressOut={onPressOut}>
        <View style={[styles.actCard, expanded && styles.actCardExpanded]}>
          {/* Colour stripe */}
          <View style={[styles.actStripe, { backgroundColor: item.color }]} />

          <View style={styles.actMain}>
            {/* Icon + live dot */}
            <View style={{ position: "relative" }}>
              <View style={[styles.actIconWrap, { backgroundColor: item.bg }]}>
                <MaterialCommunityIcons name={item.icon} size={20} color={item.color} />
              </View>
              {item.live && (
                <View style={styles.liveDotWrap}>
                  <PulseDot color="#2B7FFF" />
                </View>
              )}
            </View>

            {/* Content */}
            <View style={{ flex: 1 }}>
              <Text style={styles.actTitle}>{item.title}</Text>
              <View style={styles.actMetaRow}>
                <MaterialCommunityIcons name="domain" size={11} color={COLORS.grayText} />
                <Text style={styles.actNgo}>{item.ngo}</Text>
                <View style={styles.actDivider} />
                <Text style={styles.actTime}>{item.time}</Text>
              </View>
            </View>

            {/* Status + chevron */}
            <View style={{ alignItems: "flex-end", gap: 6 }}>
              <View style={[styles.actBadge, { backgroundColor: item.statusBg }]}>
                <Text style={[styles.actBadgeText, { color: item.statusColor }]}>{item.status}</Text>
              </View>
              <Animated.View style={{ transform: [{ rotate: chevronRotate }] }}>
                <MaterialCommunityIcons name="chevron-down" size={16} color={COLORS.grayText} />
              </Animated.View>
            </View>
          </View>

          {/* Expandable detail */}
          <Animated.View style={{ height: detailHeight, overflow: "hidden" }}>
            <Animated.View style={[styles.actDetail, { opacity: detailOpacity }]}>
              <View style={[styles.actDetailInner, { borderColor: item.color + "25", backgroundColor: item.bg }]}>
                <MaterialCommunityIcons name="information-outline" size={14} color={item.color} />
                <Text style={[styles.actDetailText, { color: item.color }]}>{item.detail}</Text>
              </View>
            </Animated.View>
          </Animated.View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

// ─── Circular progress ring ──────────────────────────────────────────────────
function ImpactRing({ pct = 72, size = 80, color = "#FF6B2B" }) {
  const anim = useRef(new Animated.Value(0)).current;
  const [arc, setArc] = useState(0);
  const stroke = 7;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;

  useEffect(() => {
    Animated.timing(anim, { toValue: pct, duration: 1200, delay: 400, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start();
    anim.addListener(({ value }) => setArc(value));
  }, []);

  const dash = (arc / 100) * circ;

  return (
    <View style={{ width: size, height: size, justifyContent: "center", alignItems: "center" }}>
      {/* SVG-free ring using border trick */}
      <View style={{
        width: size, height: size, borderRadius: size / 2,
        borderWidth: stroke, borderColor: color + "25",
        position: "absolute",
      }} />
      {/* Filled arc approximation using rotation */}
      <View style={{
        width: size, height: size, borderRadius: size / 2,
        borderWidth: stroke,
        borderTopColor: color,
        borderRightColor: arc > 25 ? color : "transparent",
        borderBottomColor: arc > 50 ? color : "transparent",
        borderLeftColor: arc > 75 ? color : "transparent",
        position: "absolute",
        transform: [{ rotate: "-90deg" }],
      }} />
      <Text style={{ fontSize: 16, fontWeight: "800", color }}>72%</Text>
      <Text style={{ fontSize: 9, color: COLORS.grayText, fontWeight: "600" }}>of goal</Text>
    </View>
  );
}

// ─── Notification item ───────────────────────────────────────────────────────
function NotifItem({ item }) {
  const pressAnim = useRef(new Animated.Value(1)).current;
  return (
    <Pressable
      onPressIn={() => Animated.spring(pressAnim, { toValue: 0.97, useNativeDriver: true }).start()}
      onPressOut={() => Animated.spring(pressAnim, { toValue: 1, useNativeDriver: true }).start()}
    >
      <Animated.View style={[styles.notifItem, item.unread && styles.notifUnread, { transform: [{ scale: pressAnim }] }]}>
        <View style={[styles.notifIcon, { backgroundColor: item.color + "18" }]}>
          <MaterialCommunityIcons name={item.icon} size={20} color={item.color} />
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.notifTop}>
            <Text style={styles.notifTitle}>{item.title}</Text>
            {item.unread && <View style={[styles.unreadDot, { backgroundColor: item.color }]} />}
          </View>
          <Text style={styles.notifMsg} numberOfLines={2}>{item.msg}</Text>
          <Text style={styles.notifTime}>{item.time}</Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

// ─── Main Screen ─────────────────────────────────────────────────────────────
export default function Dashboard() {
  const router = useRouter();
  const heroAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(500)).current;
  const [showNotifs, setShowNotifs] = useState(false);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifs, setNotifs] = useState([]);
  const unread = notifs.filter(n => n.unread).length;

  useEffect(() => {
    Animated.timing(heroAnim, { toValue: 1, duration: 600, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
    getDonorDashboard().then(data => {
      setDashboard(data);
      setNotifs(data.notifications || []);
    }).catch(e => {
      // Optionally handle error
    }).finally(() => setLoading(false));
  }, []);

  const openNotifs = () => {
    setShowNotifs(true);
    Animated.spring(slideAnim, { toValue: 0, tension: 65, friction: 11, useNativeDriver: true }).start();
  };
  const closeNotifs = () => {
    Animated.timing(slideAnim, { toValue: 500, duration: 260, easing: Easing.in(Easing.cubic), useNativeDriver: true })
      .start(() => setShowNotifs(false));
  };
  const markAllRead = () => setNotifs(n => n.map(x => ({ ...x, unread: false })));

  if (loading) {
    return <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}><Text>Loading...</Text></View>;
  }

  const stats = dashboard?.stats || {};
  const activity = dashboard?.activity || [];

  // Map backend stats to UI cards
  const STATS = [
    { icon: "weight-kilogram", value: stats.totalDonations || 0, label: "Donations", color: "#FF6B2B", bg: "#FFF0EB" },
    { icon: "hand-heart-outline", value: stats.active || 0, label: "Active Now", color: "#2D6A4F", bg: "#EAF5EF" },
    { icon: "check-decagram", value: stats.completed || 0, label: "Completed", color: "#2B7FFF", bg: "#EBF2FF" },
    { icon: "account-group", value: stats.peopleFed || 0, label: "People Fed", color: "#7C3AED", bg: "#F3EEFF" },
  ];

  return (
    <View style={styles.root}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 110 }}>

        {/* ══ HERO ══ */}
        <Animated.View style={[styles.hero, {
          opacity: heroAnim,
          transform: [{ translateY: heroAnim.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }) }],
        }]}> 
          <View style={styles.blob1} />
          <View style={styles.blob2} />

          {/* Top row */}
          <View style={styles.heroTop}>
            <View>
              <Text style={styles.heroGreeting}>Good morning 👋</Text>
              {/* TODO: Replace with actual user name */}
              <Text style={styles.heroName}>Donor</Text>
            </View>
            <TouchableOpacity style={styles.bellBtn} onPress={openNotifs} activeOpacity={0.8}>
              <MaterialCommunityIcons name="bell-outline" size={22} color="#fff" />
              {unread > 0 && (
                <View style={styles.bellBadge}>
                  <Text style={styles.bellBadgeText}>{unread}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Impact row — ring + stats */}
          <View style={styles.heroImpact}>
            <View style={styles.heroImpactLeft}>
              <ImpactRing pct={72} size={82} color="#FFD5B8" />
            </View>
            <View style={styles.heroImpactRight}>
              <Text style={styles.heroImpactLabel}>Your total impact</Text>
              <Text style={styles.heroImpactMain}>
                <Text style={styles.heroImpactHighlight}>{stats.totalDonations || 0} kg</Text> donated
              </Text>
              <Text style={styles.heroImpactSub}>≈ {stats.peopleFed || 0} meals served to people in need</Text>
              <View style={styles.heroBadge}>
                <MaterialCommunityIcons name="leaf" size={11} color="#fff" />
                <Text style={styles.heroBadgeTxt}>Top Donor · This Month</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* ══ KPI STRIP ══ */}
        <View style={styles.kpiGrid}>
          {STATS.map((s, i) => <KpiCard key={i} stat={s} index={i} />)}
        </View>

        {/* ══ POST DONATION CTA ══ */}
        <TouchableOpacity
          style={styles.ctaBtn}
          onPress={() => router.push("/donor/post-donation")}
          activeOpacity={0.86}
        >
          <View style={styles.ctaBlob} />
          <View style={styles.ctaIconWrap}>
            <MaterialCommunityIcons name="plus-circle" size={28} color="#fff" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.ctaTitle}>Post a Donation</Text>
            <Text style={styles.ctaSub}>Share surplus food · reduce waste · feed someone</Text>
          </View>
          <View style={styles.ctaArrow}>
            <MaterialCommunityIcons name="arrow-right" size={18} color={COLORS.success} />
          </View>
        </TouchableOpacity>

        {/* ══ FOOD EXPIRY WARNING ══ */}
        <View style={styles.expiryBanner}>
          <View style={styles.expiryIconWrap}>
            <MaterialCommunityIcons name="clock-alert-outline" size={20} color="#EF4444" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.expiryTitle}>Bread & Pastries expiring soon</Text>
            <Text style={styles.expirySub}>Expires in 3 hours · 3 NGOs notified nearby</Text>
          </View>
          <TouchableOpacity style={styles.expiryBtn} activeOpacity={0.8}>
            <Text style={styles.expiryBtnText}>View</Text>
          </TouchableOpacity>
        </View>

        {/* ══ RECENT DONATIONS (expandable) ══ */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Donations</Text>
          <TouchableOpacity onPress={() => router.push("/donor/donation-history")}> 
            <Text style={styles.seeAll}>See all →</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.sectionHint}>Tap a card to see details</Text>

        <View style={{ paddingHorizontal: 20, gap: 12 }}>
          {activity.map((item, i) => (
            <ActivityCard key={item._id || item.id || i} item={item} index={i} />
          ))}
        </View>

        {/* ══ MILESTONE BANNER ══ */}
        <View style={styles.milestoneBanner}>
          <View style={styles.milestoneIconWrap}>
            <MaterialCommunityIcons name="trophy" size={22} color="#F59E0B" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.milestoneTitle}>You're making a difference!</Text>
            <Text style={styles.milestoneSub}>{stats.completed || 0} donations · {stats.peopleFed || 0} people fed this year</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={18} color="#F59E0B" />
        </View>

      </ScrollView>

      {/* ══ NOTIFICATION SHEET ══ */}
      <Modal visible={showNotifs} transparent animationType="none" onRequestClose={closeNotifs}>
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={closeNotifs} />
        <Animated.View style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}> 
          <View style={styles.sheetHandle} />
          <View style={styles.sheetTopRow}>
            <View>
              <Text style={styles.sheetTitle}>Notifications</Text>
              <Text style={styles.sheetSub}>{unread} unread</Text>
            </View>
            <View style={{ flexDirection: "row", gap: 10 }}>
              <TouchableOpacity style={styles.markBtn} onPress={markAllRead}>
                <Text style={styles.markBtnText}>Mark all read</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.closeBtn} onPress={closeNotifs}>
                <MaterialCommunityIcons name="close" size={18} color={COLORS.textDark} />
              </TouchableOpacity>
            </View>
          </View>
          <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 420 }}>
            {notifs.map(n => <NotifItem key={n.id || n._id} item={n} />)}
          </ScrollView>
        </Animated.View>
      </Modal>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F5F0EB" },

  // Hero
  hero: {
    backgroundColor: COLORS.primary,
    paddingTop: Platform.OS === "ios" ? 58 : 44,
    paddingHorizontal: 22, paddingBottom: 28,
    overflow: "hidden",
    borderBottomLeftRadius: 34, borderBottomRightRadius: 34,
    marginBottom: 20,
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 14 }, shadowOpacity: 0.34, shadowRadius: 22, elevation: 14,
  },
  blob1: { position: "absolute", width: 230, height: 230, borderRadius: 115, backgroundColor: "rgba(255,255,255,0.07)", top: -70, right: -60 },
  blob2: { position: "absolute", width: 110, height: 110, borderRadius: 55, backgroundColor: "rgba(0,0,0,0.08)", bottom: -30, left: -20 },

  heroTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 },
  heroGreeting: { fontSize: 13, color: "rgba(255,255,255,0.65)", fontWeight: "600", marginBottom: 3 },
  heroName: { fontSize: 23, fontWeight: "800", color: "#fff", letterSpacing: -0.4 },
  bellBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: "rgba(255,255,255,0.18)", justifyContent: "center", alignItems: "center" },
  bellBadge: { position: "absolute", top: 8, right: 8, minWidth: 16, height: 16, borderRadius: 8, backgroundColor: "#EF4444", justifyContent: "center", alignItems: "center", paddingHorizontal: 3, borderWidth: 1.5, borderColor: COLORS.primary },
  bellBadgeText: { fontSize: 9, fontWeight: "800", color: "#fff" },

  heroImpact: { flexDirection: "row", alignItems: "center", gap: 18, backgroundColor: "rgba(255,255,255,0.13)", borderRadius: 22, padding: 16, borderWidth: 1, borderColor: "rgba(255,255,255,0.18)" },
  heroImpactLeft: { flexShrink: 0 },
  heroImpactRight: { flex: 1, gap: 4 },
  heroImpactLabel: { fontSize: 11, color: "rgba(255,255,255,0.62)", fontWeight: "600" },
  heroImpactMain: { fontSize: 18, color: "#fff", fontWeight: "800", letterSpacing: -0.3 },
  heroImpactHighlight: { color: "#FFD5B8" },
  heroImpactSub: { fontSize: 11, color: "rgba(255,255,255,0.55)", lineHeight: 16 },
  heroBadge: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "rgba(255,255,255,0.2)", paddingVertical: 5, paddingHorizontal: 10, borderRadius: 9999, alignSelf: "flex-start", marginTop: 4 },
  heroBadgeTxt: { fontSize: 10, fontWeight: "800", color: "#fff" },

  // KPI
  kpiGrid: { flexDirection: "row", paddingHorizontal: 20, gap: 10, marginBottom: 20 },
  kpiCard: { backgroundColor: "#fff", borderRadius: 18, padding: 13, alignItems: "center", gap: 5, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  kpiIconWrap: { width: 38, height: 38, borderRadius: 12, justifyContent: "center", alignItems: "center" },
  kpiValue: { fontSize: 21, fontWeight: "800", letterSpacing: -0.4 },
  kpiLabel: { fontSize: 9, color: COLORS.grayText, fontWeight: "600", textAlign: "center" },

  // CTA
  ctaBtn: { marginHorizontal: 20, marginBottom: 16, backgroundColor: COLORS.success, borderRadius: 22, padding: 18, flexDirection: "row", alignItems: "center", gap: 14, overflow: "hidden", shadowColor: COLORS.success, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.28, shadowRadius: 16, elevation: 8 },
  ctaBlob: { position: "absolute", width: 140, height: 140, borderRadius: 70, backgroundColor: "rgba(255,255,255,0.07)", top: -50, right: -20 },
  ctaIconWrap: { width: 50, height: 50, borderRadius: 16, backgroundColor: "rgba(255,255,255,0.18)", justifyContent: "center", alignItems: "center" },
  ctaTitle: { fontSize: 16, fontWeight: "800", color: "#fff", marginBottom: 3 },
  ctaSub: { fontSize: 12, color: "rgba(255,255,255,0.7)", lineHeight: 17 },
  ctaArrow: { width: 34, height: 34, borderRadius: 11, backgroundColor: "#fff", justifyContent: "center", alignItems: "center" },

  // Expiry warning
  expiryBanner: { flexDirection: "row", alignItems: "center", gap: 12, marginHorizontal: 20, marginBottom: 20, backgroundColor: "#FEF2F2", borderRadius: 16, padding: 14, borderWidth: 1, borderColor: "#FECACA" },
  expiryIconWrap: { width: 38, height: 38, borderRadius: 12, backgroundColor: "#FEE2E2", justifyContent: "center", alignItems: "center" },
  expiryTitle: { fontSize: 13, fontWeight: "800", color: "#DC2626", marginBottom: 2 },
  expirySub: { fontSize: 11, color: "#EF4444" },
  expiryBtn: { backgroundColor: "#EF4444", paddingVertical: 7, paddingHorizontal: 14, borderRadius: 10 },
  expiryBtnText: { fontSize: 12, fontWeight: "800", color: "#fff" },

  // Section
  section: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, marginBottom: 6 },
  sectionTitle: { fontSize: 17, fontWeight: "800", color: COLORS.textDark, letterSpacing: -0.3 },
  seeAll: { fontSize: 13, fontWeight: "700", color: COLORS.primary },
  sectionHint: { fontSize: 11, color: COLORS.grayText, paddingHorizontal: 20, marginBottom: 12 },

  // Activity cards
  actCard: { backgroundColor: "#fff", borderRadius: 18, overflow: "hidden", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 10, elevation: 3 },
  actCardExpanded: { shadowOpacity: 0.11, elevation: 5 },
  actStripe: { position: "absolute", left: 0, top: 0, bottom: 0, width: 4 },
  actMain: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14, paddingLeft: 18 },
  actIconWrap: { width: 44, height: 44, borderRadius: 14, justifyContent: "center", alignItems: "center", flexShrink: 0 },
  liveDotWrap: { position: "absolute", top: -3, right: -3 },
  actTitle: { fontSize: 14, fontWeight: "700", color: COLORS.textDark, marginBottom: 5 },
  actMetaRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  actNgo: { fontSize: 11, color: COLORS.grayText, fontWeight: "500" },
  actDivider: { width: 3, height: 3, borderRadius: 2, backgroundColor: COLORS.grayText },
  actTime: { fontSize: 11, color: COLORS.grayText },
  actBadge: { paddingVertical: 4, paddingHorizontal: 9, borderRadius: 8 },
  actBadgeText: { fontSize: 10, fontWeight: "800" },
  actDetail: { paddingHorizontal: 18, paddingBottom: 14 },
  actDetailInner: { flexDirection: "row", alignItems: "flex-start", gap: 8, padding: 10, borderRadius: 12, borderWidth: 1 },
  actDetailText: { flex: 1, fontSize: 12, fontWeight: "600", lineHeight: 18 },

  // Milestone
  milestoneBanner: { flexDirection: "row", alignItems: "center", gap: 14, backgroundColor: "#FFF8EB", marginHorizontal: 20, marginTop: 24, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: "#F59E0B30" },
  milestoneIconWrap: { width: 44, height: 44, borderRadius: 14, backgroundColor: "#FFF0D0", justifyContent: "center", alignItems: "center" },
  milestoneTitle: { fontSize: 14, fontWeight: "800", color: COLORS.textDark, marginBottom: 3 },
  milestoneSub: { fontSize: 12, color: COLORS.grayText },

  // Notification sheet
  overlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)" },
  sheet: { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "#fff", borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingBottom: Platform.OS === "ios" ? 34 : 20, shadowColor: "#000", shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.12, shadowRadius: 20, elevation: 24 },
  sheetHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: "#DDD", alignSelf: "center", marginTop: 12, marginBottom: 4 },
  sheetTopRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: "#F0F0F0" },
  sheetTitle: { fontSize: 18, fontWeight: "800", color: COLORS.textDark },
  sheetSub: { fontSize: 12, color: COLORS.grayText, marginTop: 2 },
  markBtn: { backgroundColor: COLORS.primaryGlow, paddingVertical: 7, paddingHorizontal: 14, borderRadius: 10 },
  markBtnText: { fontSize: 12, fontWeight: "700", color: COLORS.primary },
  closeBtn: { width: 34, height: 34, borderRadius: 10, backgroundColor: "#F5F5F8", justifyContent: "center", alignItems: "center" },
  notifItem: { flexDirection: "row", gap: 14, padding: 16, borderBottomWidth: 1, borderBottomColor: "#F5F5F8" },
  notifUnread: { backgroundColor: "#FAFAF8" },
  notifIcon: { width: 44, height: 44, borderRadius: 13, justifyContent: "center", alignItems: "center", flexShrink: 0 },
  notifTop: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 3 },
  notifTitle: { fontSize: 14, fontWeight: "700", color: COLORS.textDark, flex: 1 },
  unreadDot: { width: 7, height: 7, borderRadius: 4, flexShrink: 0 },
  notifMsg: { fontSize: 13, color: COLORS.grayText, lineHeight: 18, marginBottom: 4 },
  notifTime: { fontSize: 11, color: COLORS.grayText, opacity: 0.7 },
});