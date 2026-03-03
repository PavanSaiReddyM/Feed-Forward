

import {
    StyleSheet, Text, View, FlatList, TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../../_constants/colors";

const historyData = [
    {
        id: "1", food: "Vegetable Biryani", donor: "Royal Hotel",
        date: "11 Jan 2026", month: "January 2026",
        quantity: "25kg", beneficiaries: 50,
        category: "Cooked", co2: "12.5kg CO₂ saved",
    },
    {
        id: "2", food: "Milk Packets", donor: "Dairy Farm",
        date: "2 Feb 2026", month: "February 2026",
        quantity: "30 litres", beneficiaries: 40,
        category: "Dairy", co2: "8.4kg CO₂ saved",
    },
    {
        id: "3", food: "Fresh Bread", donor: "City Bakery",
        date: "8 Feb 2026", month: "February 2026",
        quantity: "40 loaves", beneficiaries: 60,
        category: "Bakery", co2: "6.1kg CO₂ saved",
    },
    {
        id: "4", food: "Rice & Dal", donor: "Community Kitchen",
        date: "15 Feb 2026", month: "February 2026",
        quantity: "18kg", beneficiaries: 35,
        category: "Cooked", co2: "9.2kg CO₂ saved",
    },
];

const TOTALS = {
    kg: historyData.reduce((s, d) => s + parseFloat(d.quantity), 0),
    people: historyData.reduce((s, d) => s + d.beneficiaries, 0),
    pickups: historyData.length,
};

function AvatarStack({ count }) {
    const colors = [COLORS.primary, COLORS.success, COLORS.accentBlue, COLORS.warning];
    const visible = Math.min(count > 50 ? 4 : 3, 4);
    return (
        <View style={styles.avatarStack}>
            {Array.from({ length: visible }).map((_, i) => (
                <View key={i} style={[styles.avatar, { backgroundColor: colors[i], marginLeft: i > 0 ? -10 : 0, zIndex: visible - i }]}>
                    <MaterialCommunityIcons name="account" size={12} color={COLORS.white} />
                </View>
            ))}
            {count > visible && (
                <View style={[styles.avatar, styles.avatarMore, { marginLeft: -10 }]}>
                    <Text style={styles.avatarMoreText}>+{count - visible}</Text>
                </View>
            )}
        </View>
    );
}

function HistoryCard({ item, index, isLast }) {
    return (
        <View style={styles.timelineItem}>
            {/* Timeline indicator */}
            <View style={styles.timelineCol}>
                <View style={styles.timelineDot}>
                    <MaterialCommunityIcons name="check" size={11} color={COLORS.white} />
                </View>
                {!isLast && <View style={styles.timelineLine} />}
            </View>

            {/* Card */}
            <View style={styles.card}>
                {/* Top strip */}
                <View style={[styles.cardStrip, { backgroundColor: COLORS.success }]} />

                <View style={styles.cardContent}>
                    <View style={styles.cardHeaderRow}>
                        <View>
                            <Text style={styles.foodName}>{item.food}</Text>
                            <Text style={styles.foodDate}>{item.date}</Text>
                        </View>
                        <View style={styles.completedBadge}>
                            <MaterialCommunityIcons name="check-circle" size={13} color={COLORS.success} />
                            <Text style={styles.completedText}>Done</Text>
                        </View>
                    </View>

                    <View style={styles.infoGrid}>
                        <View style={styles.infoCell}>
                            <MaterialCommunityIcons name="store" size={13} color={COLORS.grayText} />
                            <Text style={styles.infoVal}>{item.donor}</Text>
                        </View>
                        <View style={styles.infoCell}>
                            <MaterialCommunityIcons name="weight" size={13} color={COLORS.grayText} />
                            <Text style={styles.infoVal}>{item.quantity}</Text>
                        </View>
                    </View>

                    <View style={styles.cardFooter}>
                        <View style={styles.benefRow}>
                            <AvatarStack count={item.beneficiaries} />
                            <Text style={styles.benefText}>{item.beneficiaries} people fed</Text>
                        </View>
                        <View style={styles.co2Badge}>
                            <Text style={styles.co2Text}>🌱 {item.co2}</Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
}

export default function History() {
    return (
        <View style={styles.container}>
            <FlatList
                data={historyData}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <>
                        {/* Header */}
                        <View style={styles.header}>
                            <Text style={styles.title}>Pickup History</Text>
                            <Text style={styles.subtitle}>Your impact timeline</Text>
                        </View>

                        {/* Impact summary */}
                        <View style={styles.impactCard}>
                            <View style={styles.impactCardBlob} />
                            <Text style={styles.impactCardTitle}>🏆 Your Total Impact</Text>
                            <View style={styles.impactRow}>
                                <View style={styles.impactStat}>
                                    <Text style={styles.impactNum}>{TOTALS.pickups}</Text>
                                    <Text style={styles.impactLabel}>Pickups</Text>
                                </View>
                                <View style={styles.impactDivider} />
                                <View style={styles.impactStat}>
                                    <Text style={styles.impactNum}>{TOTALS.people}</Text>
                                    <Text style={styles.impactLabel}>People Fed</Text>
                                </View>
                                <View style={styles.impactDivider} />
                                <View style={styles.impactStat}>
                                    <Text style={styles.impactNum}>~113</Text>
                                    <Text style={styles.impactLabel}>kg Saved</Text>
                                </View>
                            </View>
                        </View>

                        <Text style={styles.sectionLabel}>February 2026</Text>
                    </>
                }
                renderItem={({ item, index }) => (
                    <HistoryCard item={item} index={index} isLast={index === historyData.length - 1} />
                )}
                contentContainerStyle={styles.listContent}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.bg },
    header: { paddingHorizontal: 22, paddingTop: 60, paddingBottom: 16 },
    title: { fontSize: 26, fontWeight: "800", color: COLORS.textDark, letterSpacing: -0.3 },
    subtitle: { fontSize: 13, color: COLORS.grayText, marginTop: 3 },
    impactCard: {
        marginHorizontal: 22, marginBottom: 24,
        backgroundColor: COLORS.success,
        borderRadius: 22, padding: 22,
        overflow: "hidden",
        shadowColor: COLORS.success, shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25, shadowRadius: 16, elevation: 8,
    },
    impactCardBlob: {
        position: "absolute", width: 150, height: 150, borderRadius: 75,
        backgroundColor: "#fff", opacity: 0.07, top: -40, right: -20,
    },
    impactCardTitle: { fontSize: 14, fontWeight: "700", color: "rgba(255,255,255,0.8)", marginBottom: 16 },
    impactRow: { flexDirection: "row", alignItems: "center" },
    impactStat: { flex: 1, alignItems: "center" },
    impactNum: { fontSize: 28, fontWeight: "800", color: COLORS.white, letterSpacing: -0.5, marginBottom: 2 },
    impactLabel: { fontSize: 12, color: "rgba(255,255,255,0.7)", fontWeight: "600" },
    impactDivider: { width: 1, height: 40, backgroundColor: "rgba(255,255,255,0.2)" },
    sectionLabel: {
        fontSize: 13, fontWeight: "800",
        color: COLORS.grayText,
        textTransform: "uppercase", letterSpacing: 1.2,
        paddingHorizontal: 22, marginBottom: 12,
    },
    listContent: { paddingBottom: 32 },
    timelineItem: { flexDirection: "row", paddingHorizontal: 22, marginBottom: 16 },
    timelineCol: { alignItems: "center", marginRight: 14, width: 24 },
    timelineDot: {
        width: 24, height: 24, borderRadius: 12,
        backgroundColor: COLORS.success,
        justifyContent: "center", alignItems: "center",
        shadowColor: COLORS.success, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 3,
    },
    timelineLine: { width: 2, flex: 1, backgroundColor: COLORS.successLight, marginTop: 4 },
    card: {
        flex: 1, backgroundColor: COLORS.white,
        borderRadius: 18, overflow: "hidden",
        shadowColor: "#000", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.08, shadowRadius: 10, elevation: 3,
    },
    cardStrip: { height: 4 },
    cardContent: { padding: 16 },
    cardHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 },
    foodName: { fontSize: 16, fontWeight: "800", color: COLORS.textDark, letterSpacing: -0.2 },
    foodDate: { fontSize: 12, color: COLORS.primary, fontWeight: "600", marginTop: 2 },
    completedBadge: {
        flexDirection: "row", alignItems: "center", gap: 4,
        backgroundColor: COLORS.successLight, paddingVertical: 4, paddingHorizontal: 8, borderRadius: 9999,
    },
    completedText: { fontSize: 11, fontWeight: "800", color: COLORS.success },
    infoGrid: { flexDirection: "row", gap: 16, marginBottom: 12 },
    infoCell: { flexDirection: "row", alignItems: "center", gap: 5 },
    infoVal: { fontSize: 13, color: COLORS.grayText, fontWeight: "500" },
    cardFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    benefRow: { flexDirection: "row", alignItems: "center", gap: 8 },
    avatarStack: { flexDirection: "row" },
    avatar: {
        width: 22, height: 22, borderRadius: 11,
        justifyContent: "center", alignItems: "center",
        borderWidth: 2, borderColor: COLORS.white,
    },
    avatarMore: { backgroundColor: COLORS.grayText },
    avatarMoreText: { fontSize: 8, fontWeight: "800", color: COLORS.white },
    benefText: { fontSize: 12, color: COLORS.grayText, fontWeight: "600" },
    co2Badge: {
        backgroundColor: COLORS.successLight,
        paddingVertical: 4, paddingHorizontal: 8, borderRadius: 9999,
    },
    co2Text: { fontSize: 11, fontWeight: "700", color: COLORS.success },
});