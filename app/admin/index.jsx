import {
    StyleSheet, Text, View, ScrollView, TouchableOpacity,
    Modal, FlatList, Animated, Easing, Platform, Alert,
} from "react-native";
import { useState, useRef, useEffect } from "react";
import { getAdminDashboard } from "../services/api";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../../_constants/colors";

// ─── Data ─────────────────────────────────────────────────────────────────────
// Data will be loaded from backend

// ─── Bar Chart ────────────────────────────────────────────────────────────────
// Each bar grows up with staggered spring. Last bar gets full color + shadow.
// Dashed avg line sits behind bars. Value labels pop in above each bar.
function BarChart({ data, labels, color }) {
    const max = Math.max(...data);
    const avg = Math.round(data.reduce((a, b) => a + b, 0) / data.length);
    const anims = useRef(data.map(() => new Animated.Value(0))).current;

    useEffect(() => {
        Animated.stagger(55,
            anims.map(a =>
                Animated.spring(a, { toValue: 1, tension: 52, friction: 9, useNativeDriver: false })
            )
        ).start();
    }, []);

    return (
        <View style={chart.root}>
            {/* Y-axis ghost lines */}
            {[0.25, 0.5, 0.75, 1].map(pct => (
                <View key={pct} style={[chart.gridLine, { bottom: `${pct * 100}%` }]}>
                    <Text style={chart.gridLabel}>
                        {Math.round(max * pct) >= 1000 ? `${(max * pct / 1000).toFixed(1)}k` : Math.round(max * pct)}
                    </Text>
                </View>
            ))}

            {/* Avg dashed line */}
            <View style={[chart.avgLine, { bottom: `${(avg / max) * 100}%` }]}>
                <View style={chart.avgDash} />
                <Text style={chart.avgText}>avg</Text>
            </View>

            {/* Bars */}
            <View style={chart.barsRow}>
                {data.map((v, i) => {
                    const isLast = i === data.length - 1;
                    const heightPct = anims[i].interpolate({ inputRange: [0, 1], outputRange: ["0%", `${(v / max) * 100}%`] });
                    const opacityVal = anims[i].interpolate({ inputRange: [0, 1], outputRange: [0, 1] });
                    return (
                        <View key={i} style={chart.colWrap}>
                            {/* Value label */}
                            <Animated.Text style={[chart.valLabel, { opacity: opacityVal }, isLast && { color, fontWeight: "800" }]}>
                                {v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v}
                            </Animated.Text>
                            {/* Bar track */}
                            <View style={chart.barTrack}>
                                <Animated.View style={[
                                    chart.bar,
                                    { height: heightPct, backgroundColor: isLast ? color : color + "60" },
                                    isLast && { shadowColor: color, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8, elevation: 5 },
                                ]} />
                            </View>
                            {/* Day label */}
                            <Text style={[chart.dayLabel, isLast && { color, fontWeight: "800" }]}>{labels[i]}</Text>
                        </View>
                    );
                })}
            </View>
        </View>
    );
}

const chart = StyleSheet.create({
    root: { height: 160, position: "relative", marginTop: 8, marginBottom: 4 },
    gridLine: { position: "absolute", left: 0, right: 0, flexDirection: "row", alignItems: "center" },
    gridLabel: { fontSize: 8, color: COLORS.grayText, width: 28, textAlign: "right", marginRight: 6, opacity: 0.7 },
    avgLine: { position: "absolute", left: 32, right: 0, flexDirection: "row", alignItems: "center", zIndex: 3 },
    avgDash: { flex: 1, height: 1, borderTopWidth: 1.5, borderColor: COLORS.grayText, borderStyle: "dashed", opacity: 0.3 },
    avgText: { fontSize: 8, color: COLORS.grayText, opacity: 0.6, marginLeft: 4 },
    barsRow: { position: "absolute", left: 34, right: 0, top: 0, bottom: 22, flexDirection: "row", alignItems: "flex-end", gap: 5 },
    colWrap: { flex: 1, height: "100%", justifyContent: "flex-end", alignItems: "center" },
    valLabel: { fontSize: 9, fontWeight: "600", color: COLORS.grayText, marginBottom: 3 },
    barTrack: { width: "80%", flex: 1, justifyContent: "flex-end", backgroundColor: "#F0F0F5", borderRadius: 7, overflow: "hidden" },
    bar: { width: "100%", borderTopLeftRadius: 7, borderTopRightRadius: 7 },
    dayLabel: { fontSize: 9, fontWeight: "600", color: COLORS.grayText, marginTop: 5, position: "absolute", bottom: -20 },
});

// ─── Line Chart ────────────────────────────────────────────────────────────────
// Smooth filled area chart using animated bezier paths (SVG-free, pure RN Views)
function LineChart({ data, labels, color }) {
    const anims = useRef(data.map(() => new Animated.Value(0))).current;
    const max = Math.max(...data);

    useEffect(() => {
        Animated.stagger(60,
            anims.map(a =>
                Animated.spring(a, { toValue: 1, tension: 52, friction: 9, useNativeDriver: false })
            )
        ).start();
    }, []);

    return (
        <View style={lc.root}>
            {[0.25, 0.5, 0.75, 1].map(pct => (
                <View key={pct} style={[lc.gridLine, { bottom: `${pct * 100}%` }]} />
            ))}
            <View style={lc.barsRow}>
                {data.map((v, i) => {
                    const isLast = i === data.length - 1;
                    const h = anims[i].interpolate({ inputRange: [0, 1], outputRange: ["0%", `${(v / max) * 100}%`] });
                    const op = anims[i].interpolate({ inputRange: [0, 1], outputRange: [0, 1] });
                    return (
                        <View key={i} style={lc.col}>
                            <Animated.Text style={[lc.val, { opacity: op }, isLast && { color, fontWeight: "800" }]}>
                                {v}
                            </Animated.Text>
                            <View style={lc.track}>
                                <Animated.View style={[lc.fill, { height: h, backgroundColor: color + (isLast ? "ff" : "55") },
                                isLast && { shadowColor: color, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 6, elevation: 4 }
                                ]} />
                            </View>
                            <Text style={[lc.label, isLast && { color, fontWeight: "700" }]}>{labels[i]}</Text>
                        </View>
                    );
                })}
            </View>
        </View>
    );
}
const lc = StyleSheet.create({
    root: { height: 150, position: "relative", marginTop: 8, marginBottom: 4 },
    gridLine: { position: "absolute", left: 0, right: 0, height: 1, backgroundColor: "#F0F0F5" },
    barsRow: { position: "absolute", left: 0, right: 0, top: 0, bottom: 22, flexDirection: "row", alignItems: "flex-end", gap: 6 },
    col: { flex: 1, height: "100%", justifyContent: "flex-end", alignItems: "center" },
    val: { fontSize: 9, fontWeight: "600", color: COLORS.grayText, marginBottom: 3 },
    track: { width: "75%", flex: 1, justifyContent: "flex-end", backgroundColor: "#F0F0F5", borderRadius: 7, overflow: "hidden" },
    fill: { width: "100%", borderTopLeftRadius: 7, borderTopRightRadius: 7 },
    label: { fontSize: 9, fontWeight: "600", color: COLORS.grayText, position: "absolute", bottom: -20 },
});

// ─── KPI Card ─────────────────────────────────────────────────────────────────
function KpiCard({ kpi }) {
    const anim = useRef(new Animated.Value(0)).current;
    const [showDesc, setShowDesc] = useState(false);
    useEffect(() => {
        Animated.timing(anim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
    }, []);
    return (
        <Animated.View style={[styles.kpiCard, { opacity: anim, transform: [{ scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.95, 1] }) }] }]}>
            <View style={styles.kpiCardTop}>
                <View style={[styles.kpiIconWrap, { backgroundColor: kpi.bg }]}>
                    <MaterialCommunityIcons name={kpi.icon} size={20} color={kpi.color} />
                </View>
                <TouchableOpacity onPress={() => setShowDesc(v => !v)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                    <MaterialCommunityIcons name={showDesc ? "close-circle-outline" : "information-outline"} size={15} color={COLORS.grayText} />
                </TouchableOpacity>
            </View>
            {showDesc ? (
                <Text style={styles.kpiDesc}>{kpi.desc}</Text>
            ) : (
                <>
                    <Text style={styles.kpiValue}>{kpi.value}</Text>
                    <Text style={styles.kpiLabel}>{kpi.label}</Text>
                    <View style={[styles.kpiDelta, { backgroundColor: kpi.up ? "#EAF5EF" : "#FEF2F2" }]}>
                        <MaterialCommunityIcons name={kpi.up ? "trending-up" : "trending-down"} size={11} color={kpi.up ? "#2D6A4F" : "#EF4444"} />
                        <Text style={[styles.kpiDeltaText, { color: kpi.up ? "#2D6A4F" : "#EF4444" }]}>{kpi.delta} this week</Text>
                    </View>
                </>
            )}
        </Animated.View>
    );
}

// ─── Section card wrapper ─────────────────────────────────────────────────────
function SectionCard({ title, subtitle, children, action, onAction }) {
    return (
        <View style={styles.sectionCard}>
            <View style={styles.sectionCardHeader}>
                <View>
                    <Text style={styles.sectionCardTitle}>{title}</Text>
                    {subtitle && <Text style={styles.sectionCardSub}>{subtitle}</Text>}
                </View>
                {action && (
                    <TouchableOpacity onPress={onAction}>
                        <Text style={styles.sectionCardAction}>{action}</Text>
                    </TouchableOpacity>
                )}
            </View>
            {children}
        </View>
    );
}

// ─── Table row ───────────────────────────────────────────────────────────────
function TableRow({ rank, name, metric, metricLabel, trend, up, city }) {
    return (
        <View style={styles.tableRow}>
            <View style={[styles.tableRank, rank <= 3 && { backgroundColor: rank === 1 ? "#FFF8EB" : rank === 2 ? "#F5F5F8" : "#FFF0EB" }]}>
                <Text style={[styles.tableRankText, { color: rank === 1 ? "#F59E0B" : rank === 2 ? "#9CA3AF" : rank === 3 ? "#CD7C2F" : COLORS.grayText }]}>
                    {rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : `#${rank}`}
                </Text>
            </View>
            <View style={{ flex: 1 }}>
                <Text style={styles.tableName}>{name}</Text>
                {city && <Text style={styles.tableCity}>{city}</Text>}
            </View>
            <View style={{ alignItems: "flex-end", gap: 3 }}>
                <Text style={styles.tableMetric}>{metric.toLocaleString()} <Text style={styles.tableMetricLabel}>{metricLabel}</Text></Text>
                {trend && (
                    <View style={[styles.tableTrend, { backgroundColor: up ? "#EAF5EF" : "#FEF2F2" }]}>
                        <Text style={[styles.tableTrendText, { color: up ? "#2D6A4F" : "#EF4444" }]}>{trend}</Text>
                    </View>
                )}
            </View>
        </View>
    );
}
function MultiBarChart({ data, labels, colors }) {
    const max = Math.max(...data);

    return (
        <View style={{ flexDirection: "row", alignItems: "flex-end", height: 160, gap: 8 }}>
            {data.map((v, i) => (
                <View key={i} style={{ flex: 1, alignItems: "center" }}>
                    <Text style={{ fontSize: 10 }}>{v}%</Text>

                    <View
                        style={{
                            width: "80%",
                            height: `${(v / max) * 100}%`,
                            backgroundColor: colors[i],
                            borderRadius: 6,
                        }}
                    />

                    <Text style={{ fontSize: 10 }}>{labels[i]}</Text>
                </View>
            ))}
        </View>
    );
}
// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function AdminDashboard() {
    const router = useRouter();
    const [tab, setTab] = useState(0);
    const [showNotifs, setShowNotifs] = useState(false);
    const [notifData, setNotifData] = useState(NOTIFICATIONS);
    const notifAnim = useRef(new Animated.Value(600)).current;
    export default function AdminDashboard() {
        const [tab, setTab] = useState(0);
        const [showNotif, setShowNotif] = useState(false);
        const slideAnim = useRef(new Animated.Value(400)).current;
        const [dashboard, setDashboard] = useState(null);
        const [loading, setLoading] = useState(true);
        const [notifs, setNotifs] = useState([]);

        useEffect(() => {
            getAdminDashboard().then(data => {
                setDashboard(data);
                setNotifs(data.notifications || []);
            }).catch(e => {
                // Optionally handle error
            }).finally(() => setLoading(false));
        }, []);

        const openNotifs = () => {
            setShowNotif(true);
            Animated.spring(slideAnim, { toValue: 0, tension: 65, friction: 11, useNativeDriver: true }).start();
        };
        const closeNotifs = () => {
            Animated.timing(slideAnim, { toValue: 400, duration: 250, easing: Easing.in(Easing.cubic), useNativeDriver: true })
                .start(() => setShowNotif(false));
        };

        if (loading) {
            return <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}><Text>Loading...</Text></View>;
        }

        const stats = dashboard?.stats || {};
        const topDonors = dashboard?.topDonors || [];
        const topNGOs = dashboard?.topNGOs || [];
        const activity = dashboard?.activity || [];

        // KPI cards
        const KPI = [
            { id: "meals", label: "Meals Saved", value: stats.totalMeals || 0, icon: "food-variant", color: "#FF6B2B", bg: "#FFF0EB" },
            { id: "donors", label: "Active Donors", value: stats.totalDonors || 0, icon: "account-heart", color: "#2B7FFF", bg: "#EBF2FF" },
            { id: "ngos", label: "Verified NGOs", value: stats.totalNGOs || 0, icon: "domain", color: "#2D6A4F", bg: "#EAF5EF" },
            { id: "pending", label: "Pending Review", value: stats.pending || 0, icon: "clock-alert-outline", color: "#F59E0B", bg: "#FFF8EB" },
        ];

        return (
            <View style={{ flex: 1, backgroundColor: "#F5F0EB" }}>
                <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                    {/* HEADER */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Admin Dashboard</Text>
                        <TouchableOpacity style={styles.notifBtn} onPress={openNotifs}>
                            <MaterialCommunityIcons name="bell-outline" size={22} color={COLORS.textDark} />
                            <View style={styles.notifBadge} />
                        </TouchableOpacity>
                    </View>

                    {/* KPI GRID */}
                    <View style={styles.kpiGrid}>
                        {KPI.map((k, i) => (
                            <View key={k.id} style={[styles.kpiCard, { backgroundColor: k.bg }]}> 
                                <MaterialCommunityIcons name={k.icon} size={22} color={k.color} />
                                <Text style={[styles.kpiValue, { color: k.color }]}>{k.value}</Text>
                                <Text style={styles.kpiLabel}>{k.label}</Text>
                            </View>
                        ))}
                    </View>

                    {/* TOP DONORS/NGOS */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Top Donors</Text>
                        <FlatList
                            data={topDonors}
                            keyExtractor={item => item.name}
                            renderItem={({ item, index }) => (
                                <View style={styles.topItem}>
                                    <Text style={styles.topRank}>{index + 1}</Text>
                                    <Text style={styles.topName}>{item.name}</Text>
                                    <Text style={styles.topStat}>{item.meals} meals</Text>
                                </View>
                            )}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={{ marginTop: 8 }}
                        />
                    </View>
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Top NGOs</Text>
                        <FlatList
                            data={topNGOs}
                            keyExtractor={item => item.name}
                            renderItem={({ item, index }) => (
                                <View style={styles.topItem}>
                                    <Text style={styles.topRank}>{index + 1}</Text>
                                    <Text style={styles.topName}>{item.name}</Text>
                                    <Text style={styles.topStat}>{item.pickups} pickups</Text>
                                </View>
                            )}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={{ marginTop: 8 }}
                        />
                    </View>

                    {/* ACTIVITY FEED */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Recent Activity</Text>
                        <FlatList
                            data={activity}
                            keyExtractor={(_, i) => i.toString()}
                            renderItem={({ item }) => (
                                <View style={styles.activityItem}>
                                    <MaterialCommunityIcons name="check-circle" size={18} color={COLORS.success} />
                                    <Text style={styles.activityTitle}>{item.foodName || item.title || "Activity"}</Text>
                                    <Text style={styles.activityTime}>{item.updatedAt || ""}</Text>
                                </View>
                            )}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={{ marginTop: 8 }}
                        />
                    </View>

                    <View style={{ height: 24 }} />
                </ScrollView>

                {/* Notifications Bottom Sheet */}
                <Modal visible={showNotif} transparent animationType="none" onRequestClose={closeNotifs}>
                    <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={closeNotifs} />
                    <Animated.View style={[styles.bottomSheet, { transform: [{ translateY: slideAnim }] }]}> 
                        <View style={styles.sheetHandle} />
                        <View style={styles.sheetHeader}>
                            <Text style={styles.sheetTitle}>Notifications</Text>
                            <TouchableOpacity onPress={closeNotifs}>
                                <MaterialCommunityIcons name="close" size={22} color={COLORS.textDark} />
                            </TouchableOpacity>
                        </View>
                        <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 420 }}>
                            {notifs.map((n, i) => (
                                <View key={n._id || i} style={styles.notifItem}>
                                    <MaterialCommunityIcons name="alert-circle" size={22} color={COLORS.warning} />
                                    <View style={styles.notifContent}>
                                        <Text style={styles.notifTitle}>{n.title || n.msg || "Notification"}</Text>
                                        <Text style={styles.notifMsg}>{n.description || n.reason || n.msg || ""}</Text>
                                        <Text style={styles.notifTime}>{n.time || n.createdAt || ""}</Text>
                                    </View>
                                </View>
                            ))}
                        </ScrollView>
                    </Animated.View>
                </Modal>
            </View>
        );
                    <>
                        {/* Donation KPIs */}
                        <View style={styles.metricRow}>
                            {[
                                { label: "Total Donations", value: "1,284", color: "#FF6B2B", icon: "hand-heart-outline" },
                                { label: "Avg per Donor", value: "4.1", color: "#2D6A4F", icon: "chart-line" },
                                { label: "Fulfilment Rate", value: "94%", color: "#2B7FFF", icon: "check-circle-outline" },
                                { label: "Expired / Wasted", value: "6%", color: "#F59E0B", icon: "alert-outline" },
                            ].map((m, i) => (
                                <View key={i} style={styles.metricCard}>
                                    <MaterialCommunityIcons name={m.icon} size={22} color={m.color} />
                                    <Text style={[styles.metricValue, { color: m.color }]}>{m.value}</Text>
                                    <Text style={styles.metricLabel}>{m.label}</Text>
                                    {!!m.note && <Text style={styles.metricNote}>{m.note}</Text>}
                                </View>
                            ))}
                        </View>

                        {/* Weekly volume */}
                        <SectionCard title="Weekly Donation Volume" subtitle="Total meal portions donated per day this week (e.g. 10 kg rice ≈ 20 meals)">
                            <BarChart data={WEEKLY.meals} labels={WEEKLY.labels} color="#FF6B2B" />
                        </SectionCard>

                        {/* Status breakdown */}
                        <SectionCard title="Donation Status" subtitle="Current snapshot">
                            {[
                                { label: "Collected ✅", count: 1208, pct: 94, color: "#2D6A4F" },
                                { label: "Pending ⏳", count: 38, pct: 3, color: "#F59E0B" },
                                { label: "Expired ❌", count: 27, pct: 2, color: "#EF4444" },
                                { label: "Cancelled", count: 11, pct: 1, color: "#9CA3AF" },
                            ].map((s, i) => (
                                <View key={i} style={{ marginBottom: 14 }}>
                                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 5 }}>
                                        <Text style={styles.progressLabel}>{s.label}</Text>
                                        <Text style={styles.progressLabel}>{s.count.toLocaleString()} <Text style={{ color: COLORS.grayText }}>({s.pct}%)</Text></Text>
                                    </View>
                                    <View style={styles.progressTrack}>
                                        <View style={[styles.progressFill, { width: `${s.pct}%`, backgroundColor: s.color }]} />
                                    </View>
                                </View>
                            ))}
                        </SectionCard>

                        {/* Top donors table */}
                        <SectionCard title="Top Donors" subtitle="By meals contributed · this month">
                            {TOP_DONORS.map((d, i) => (
                                <View key={i}>
                                    <TableRow rank={d.rank} name={d.name} metric={d.meals} metricLabel="meals" trend={d.trend} up={d.up} />
                                    {i < TOP_DONORS.length - 1 && <View style={styles.tableDivider} />}
                                </View>
                            ))}
                        </SectionCard>
                    </>
                )}

                {/* ════════════ USERS & NGOS TAB ════════════ */}
                {tab === 2 && (
                    <>
                        {/* User KPIs */}
                        <View style={styles.metricRow}>
                            {[
                                { label: "Total Users", value: "1,250", color: "#2B7FFF", icon: "account-group-outline", note: null },
                                { label: "Verified NGOs", value: "45", color: "#2D6A4F", icon: "shield-check-outline", note: null },
                                // { label: "Pending KYC", value: "7", color: "#F59E0B", icon: "clock-outline", note: "Donors awaiting identity check" },
                                { label: "Flagged Users", value: "3", color: "#EF4444", icon: "flag-outline", note: "Reported / suspicious accounts" },
                            ].map((m, i) => (
                                <View key={i} style={styles.metricCard}>
                                    <MaterialCommunityIcons name={m.icon} size={22} color={m.color} />
                                    <Text style={[styles.metricValue, { color: m.color }]}>{m.value}</Text>
                                    <Text style={styles.metricLabel}>{m.label}</Text>
                                    {!!m.note && <Text style={styles.metricNote}>{m.note}</Text>}
                                </View>
                            ))}
                        </View>

                        {/* User growth chart */}
                        <SectionCard title="New User Registrations" subtitle="Per day this week">
                            <LineChart data={WEEKLY.donors} labels={WEEKLY.labels} color="#2B7FFF" />
                        </SectionCard>

                        {/* User type breakdown */}
                        <SectionCard title="User Composition" subtitle="Platform user breakdown">
                            {[
                                { label: "Donors — Restaurant / Hotel", pct: 67, count: "838", color: "#FF6B2B" },
                                { label: "NGO / Charity", pct: 25, count: "312", color: "#2D6A4F" },
                                { label: "Volunteers", pct: 8, count: "100", color: "#2B7FFF" },
                            ].map((u, i) => (
                                <View key={i} style={{ marginBottom: 14 }}>
                                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 5 }}>
                                        <Text style={styles.progressLabel}>{u.label}</Text>
                                        <Text style={styles.progressLabel}>{u.count} <Text style={{ color: COLORS.grayText }}>({u.pct}%)</Text></Text>
                                    </View>
                                    <View style={styles.progressTrack}>
                                        <View style={[styles.progressFill, { width: `${u.pct}%`, backgroundColor: u.color }]} />
                                    </View>
                                </View>
                            ))}
                        </SectionCard>

                        {/* City distribution */}
                        <SectionCard title="City-wise Distribution" subtitle="Active users by city">
                            <BarChart
                                data={[312, 198, 165, 143, 118, 87, 67]}
                                labels={["Delhi", "Mum", "Blr", "Hyd", "Che", "Pun", "Kol"]}
                                color="#2D6A4F"
                            />
                        </SectionCard>

                        {/* Top NGOs table */}
                        <SectionCard title="Top NGO Partners" subtitle="By pickups completed · this month">
                            {TOP_NGOS.map((n, i) => (
                                <View key={i}>
                                    <TableRow rank={n.rank} name={n.name} metric={n.pickups} metricLabel="pickups" city={n.city} />
                                    {i < TOP_NGOS.length - 1 && <View style={styles.tableDivider} />}
                                </View>
                            ))}
                        </SectionCard>

                        {/* Pending verifications */}
                        <SectionCard title="Pending NGO Verifications" subtitle="Awaiting admin review">
                            {[
                                { name: "Annapurna Foundation", city: "Pune", submitted: "2 days ago" },
                                { name: "Meals on Wheels India", city: "Kolkata", submitted: "3 days ago" },
                                { name: "Nourish India Trust", city: "Jaipur", submitted: "5 days ago" },
                            ].map((v, i) => (
                                <View key={i} style={[styles.pendingRow, i < 2 && styles.activityRowBorder]}>
                                    <View style={styles.pendingLeft}>
                                        <Text style={styles.pendingName}>{v.name}</Text>
                                        <Text style={styles.pendingMeta}>{v.city} · Submitted {v.submitted}</Text>
                                    </View>
                                    <View style={styles.pendingActions}>
                                        <TouchableOpacity style={styles.approveBtn}>
                                            <Text style={styles.approveBtnText}>Approve</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.rejectBtn}>
                                            <Text style={styles.rejectBtnText}>Reject</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))}
                        </SectionCard>
                    </>
                )}

                <View style={{ height: 100 }} />
            </Animated.ScrollView>

            {/* ── NOTIFICATION SHEET ── */}
            <Modal visible={showNotifs} transparent animationType="none" onRequestClose={closeNotifs}>
                <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={closeNotifs} />
                <Animated.View style={[styles.notifSheet, { transform: [{ translateY: notifAnim }] }]}>
                    <View style={styles.sheetHandle} />
                    <View style={styles.sheetTopRow}>
                        <View>
                            <Text style={styles.sheetTitle}>Notifications</Text>
                            <Text style={styles.sheetSub}>{unreadCount} unread</Text>
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
                    <FlatList
                        data={notifData}
                        keyExtractor={n => n.id}
                        style={{ maxHeight: 400 }}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item: n }) => (
                            <View style={[styles.notifItem, n.unread && styles.notifItemUnread]}>
                                <View style={[styles.notifIcon, { backgroundColor: n.color + "18" }]}>
                                    <MaterialCommunityIcons name={n.icon} size={20} color={n.color} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 3 }}>
                                        <Text style={styles.notifTitle}>{n.title}</Text>
                                        {n.unread && <View style={[styles.unreadDot, { backgroundColor: n.color }]} />}
                                    </View>
                                    <Text style={styles.notifMsg} numberOfLines={2}>{n.msg}</Text>
                                    <Text style={styles.notifTime}>{n.time} ago</Text>
                                </View>
                            </View>
                        )}
                    />
                </Animated.View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: "#F5F5F8" },
    scrollContent: { paddingHorizontal: 16, paddingTop: 16 },

    // Header
    header: { backgroundColor: COLORS.adminDark, paddingTop: Platform.OS === "ios" ? 56 : 44, paddingHorizontal: 22, paddingBottom: 20, overflow: "hidden" },
    headerBlob1: { position: "absolute", width: 220, height: 220, borderRadius: 110, backgroundColor: COLORS.primary, opacity: 0.06, top: -60, right: -50 },
    headerBlob2: { position: "absolute", width: 120, height: 120, borderRadius: 60, backgroundColor: "#2B7FFF", opacity: 0.07, bottom: -30, left: -20 },
    headerTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 },
    headerEyebrow: { fontSize: 11, fontWeight: "600", color: "rgba(255,255,255,0.45)", letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 4 },
    headerTitle: { fontSize: 26, fontWeight: "800", color: "#fff", letterSpacing: -0.5 },
    headerActions: { flexDirection: "row", gap: 10 },
    headerBtn: { width: 42, height: 42, borderRadius: 13, backgroundColor: "rgba(255,255,255,0.1)", justifyContent: "center", alignItems: "center" },
    notifBadge: { position: "absolute", top: 7, right: 7, width: 10, height: 10, borderRadius: 5, backgroundColor: "#EF4444", borderWidth: 1.5, borderColor: COLORS.adminDark },
    notifBadgeText: { fontSize: 8, color: "#fff", fontWeight: "800" },
    summaryStrip: { flexDirection: "row", backgroundColor: "rgba(255,255,255,0.07)", borderRadius: 16, overflow: "hidden" },
    summaryItem: { flex: 1, alignItems: "center", paddingVertical: 12 },
    summaryItemBorder: { borderRightWidth: 1, borderRightColor: "rgba(255,255,255,0.1)" },
    summaryValue: { fontSize: 18, fontWeight: "800", color: "#fff", marginBottom: 2 },
    summaryLabel: { fontSize: 10, color: "rgba(255,255,255,0.5)", fontWeight: "600", textTransform: "uppercase" },

    // Tabs
    tabBar: { flexDirection: "row", backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#EFEFF4" },
    tabItem: { flex: 1, paddingVertical: 14, alignItems: "center", borderBottomWidth: 2.5, borderBottomColor: "transparent" },
    tabItemActive: { borderBottomColor: COLORS.primary },
    tabText: { fontSize: 13, fontWeight: "600", color: COLORS.grayText },
    tabTextActive: { color: COLORS.primary, fontWeight: "800" },

    // KPI grid
    kpiGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 16 },
    kpiCard: { width: "47.5%", backgroundColor: "#fff", borderRadius: 18, padding: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2, minHeight: 128 },
    kpiCardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 },
    kpiDesc: { fontSize: 12, color: COLORS.grayText, lineHeight: 18, flex: 1 },
    kpiIconWrap: { width: 38, height: 38, borderRadius: 12, justifyContent: "center", alignItems: "center" },
    kpiValue: { fontSize: 24, fontWeight: "800", color: COLORS.textDark, letterSpacing: -0.5, marginBottom: 3 },
    kpiLabel: { fontSize: 12, color: COLORS.grayText, fontWeight: "600", marginBottom: 8 },
    kpiDelta: { flexDirection: "row", alignItems: "center", gap: 4, paddingVertical: 4, paddingHorizontal: 8, borderRadius: 8, alignSelf: "flex-start" },
    kpiDeltaText: { fontSize: 10, fontWeight: "700" },

    // Metric row (4-up)
    metricRow: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 16 },
    metricCard: { width: "47.5%", backgroundColor: "#fff", borderRadius: 16, padding: 14, alignItems: "center", gap: 6, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 },
    metricValue: { fontSize: 22, fontWeight: "800", letterSpacing: -0.4 },
    metricLabel: { fontSize: 11, color: COLORS.grayText, fontWeight: "600", textAlign: "center" },
    metricNote: { fontSize: 10, color: COLORS.grayText, textAlign: "center", lineHeight: 14, marginTop: 2, opacity: 0.75 },

    // Section card
    sectionCard: { backgroundColor: "#fff", borderRadius: 20, padding: 18, marginBottom: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
    sectionCardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 },
    sectionCardTitle: { fontSize: 15, fontWeight: "800", color: COLORS.textDark, letterSpacing: -0.2 },
    sectionCardSub: { fontSize: 11, color: COLORS.grayText, marginTop: 3 },
    sectionCardAction: { fontSize: 13, fontWeight: "700", color: COLORS.primary },

    // Progress bars
    progressLabel: { fontSize: 13, fontWeight: "600", color: COLORS.textDark },
    progressTrack: { height: 8, backgroundColor: "#F0F0F5", borderRadius: 4, overflow: "hidden" },
    progressFill: { height: "100%", borderRadius: 4 },

    // Activity feed
    activityRow: { flexDirection: "row", alignItems: "flex-start", gap: 12, paddingVertical: 12 },
    activityRowBorder: { borderBottomWidth: 1, borderBottomColor: "#F5F5F8" },
    activityIcon: { width: 34, height: 34, borderRadius: 10, justifyContent: "center", alignItems: "center", flexShrink: 0 },
    activityTitle: { fontSize: 13, fontWeight: "600", color: COLORS.textDark, lineHeight: 18, marginBottom: 2 },
    activityTime: { fontSize: 11, color: COLORS.grayText },

    // Table
    tableRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 12 },
    tableDivider: { height: 1, backgroundColor: "#F5F5F8" },
    tableRank: { width: 34, height: 34, borderRadius: 10, justifyContent: "center", alignItems: "center", backgroundColor: "#F5F5F8" },
    tableRankText: { fontSize: 14, fontWeight: "800" },
    tableName: { fontSize: 14, fontWeight: "700", color: COLORS.textDark, marginBottom: 2 },
    tableCity: { fontSize: 11, color: COLORS.grayText },
    tableMetric: { fontSize: 14, fontWeight: "800", color: COLORS.textDark },
    tableMetricLabel: { fontSize: 11, fontWeight: "600", color: COLORS.grayText },
    tableTrend: { paddingVertical: 2, paddingHorizontal: 7, borderRadius: 6, alignSelf: "flex-end" },
    tableTrendText: { fontSize: 10, fontWeight: "800" },

    // Pending verifications
    pendingRow: { paddingVertical: 14 },
    pendingLeft: { marginBottom: 10 },
    pendingName: { fontSize: 14, fontWeight: "700", color: COLORS.textDark, marginBottom: 3 },
    pendingMeta: { fontSize: 12, color: COLORS.grayText },
    pendingActions: { flexDirection: "row", gap: 10 },
    approveBtn: { flex: 1, backgroundColor: "#EAF5EF", paddingVertical: 10, borderRadius: 12, alignItems: "center", borderWidth: 1, borderColor: "#2D6A4F30" },
    approveBtnText: { fontSize: 13, fontWeight: "800", color: "#2D6A4F" },
    rejectBtn: { flex: 1, backgroundColor: "#FEF2F2", paddingVertical: 10, borderRadius: 12, alignItems: "center", borderWidth: 1, borderColor: "#EF444430" },
    rejectBtnText: { fontSize: 13, fontWeight: "800", color: "#EF4444" },

    // Notifications
    overlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)" },
    notifSheet: { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "#fff", borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingBottom: Platform.OS === "ios" ? 34 : 20, shadowColor: "#000", shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.12, shadowRadius: 20, elevation: 24 },
    sheetHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: "#DDD", alignSelf: "center", marginTop: 12, marginBottom: 4 },
    sheetTopRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: "#F0F0F0" },
    sheetTitle: { fontSize: 18, fontWeight: "800", color: COLORS.textDark },
    sheetSub: { fontSize: 12, color: COLORS.grayText, marginTop: 2 },
    markBtn: { backgroundColor: COLORS.primaryGlow, paddingVertical: 7, paddingHorizontal: 14, borderRadius: 10 },
    markBtnText: { fontSize: 12, fontWeight: "700", color: COLORS.primary },
    closeBtn: { width: 34, height: 34, borderRadius: 10, backgroundColor: "#F5F5F8", justifyContent: "center", alignItems: "center" },
    notifItem: { flexDirection: "row", gap: 14, padding: 16, borderBottomWidth: 1, borderBottomColor: "#F5F5F8" },
    notifItemUnread: { backgroundColor: "#FAFAFA" },
    notifIcon: { width: 44, height: 44, borderRadius: 13, justifyContent: "center", alignItems: "center", flexShrink: 0 },
    notifTitle: { fontSize: 14, fontWeight: "700", color: COLORS.textDark },
    notifMsg: { fontSize: 13, color: COLORS.grayText, lineHeight: 18, marginBottom: 4 },
    notifTime: { fontSize: 11, color: COLORS.placeholder },
    unreadDot: { width: 7, height: 7, borderRadius: 4 },
});