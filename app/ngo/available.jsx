import {
    StyleSheet, Text, View, FlatList,
    TouchableOpacity, Animated, Platform,
} from "react-native";
import { useRef, useEffect } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { COLORS } from "../../_constants/colors";

const DONATIONS = [
    {
        id: "1",
        name: "Dal Makhani & Roti",
        quantity: "12 kg",
        location: "Connaught Place, New Delhi",
        donor: "Moti Mahal Restaurant",
        time: "Pickup by 4:00 PM",
        category: "Cooked Meal",
        distance: "1.1 km",
        urgent: true,
        donorLocation: { latitude: 28.6315, longitude: 77.2167 },
    },
    {
        id: "2",
        name: "Bread & Pastries",
        quantity: "30 pcs",
        location: "Karol Bagh, New Delhi",
        donor: "Delhi Bakers",
        time: "Pickup by 6:00 PM",
        category: "Bakery",
        distance: "2.8 km",
        urgent: false,
        donorLocation: { latitude: 28.6519, longitude: 77.1909 },
    },
    {
        id: "3",
        name: "Fresh Vegetables",
        quantity: "18 kg",
        location: "INA Market, New Delhi",
        donor: "INA Sabzi Wala",
        time: "Pickup by 5:30 PM",
        category: "Produce",
        distance: "3.2 km",
        urgent: false,
        donorLocation: { latitude: 28.5733, longitude: 77.2090 },
    },
    {
        id: "4",
        name: "Biryani (Event Leftover)",
        quantity: "10 kg",
        location: "Lajpat Nagar, New Delhi",
        donor: "Spice Route Caterers",
        time: "Pickup by 3:30 PM",
        category: "Cooked Meal",
        distance: "0.9 km",
        urgent: true,
        donorLocation: { latitude: 28.5677, longitude: 77.2433 },
    },
];

const CATEGORY_COLORS = {
    "Cooked Meal": { color: "#FF6B2B", bg: "#FFF0EB", icon: "food-fork-drink" },
    "Bakery": { color: "#F59E0B", bg: "#FFF8EB", icon: "bread-slice-outline" },
    "Produce": { color: "#2D6A4F", bg: "#EAF5EF", icon: "leaf" },
};

function DonationCard({ item, index, onNavigate, onRequest }) {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(24)).current;
    const cat = CATEGORY_COLORS[item.category] || { color: COLORS.primary, bg: "#FFF0EB", icon: "food-variant" };

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 420, delay: index * 90, useNativeDriver: true }),
            Animated.timing(slideAnim, { toValue: 0, duration: 420, delay: index * 90, useNativeDriver: true }),
        ]).start();
    }, []);

    return (
        <Animated.View style={[styles.card, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>

            {/* Urgent ribbon */}
            {item.urgent && (
                <View style={styles.urgentBadge}>
                    <MaterialCommunityIcons name="clock-alert-outline" size={11} color="#fff" />
                    <Text style={styles.urgentText}>Urgent</Text>
                </View>
            )}

            {/* Card top row */}
            <View style={styles.cardTop}>
                <View style={[styles.catIcon, { backgroundColor: cat.bg }]}>
                    <MaterialCommunityIcons name={cat.icon} size={26} color={cat.color} />
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={styles.foodName}>{item.name}</Text>
                    <View style={[styles.catBadge, { backgroundColor: cat.bg }]}>
                        <Text style={[styles.catBadgeText, { color: cat.color }]}>{item.category}</Text>
                    </View>
                </View>
                <View style={styles.distancePill}>
                    <MaterialCommunityIcons name="map-marker-distance" size={13} color={COLORS.success} />
                    <Text style={styles.distanceText}>{item.distance}</Text>
                </View>
            </View>

            {/* Info grid */}
            <View style={styles.infoGrid}>
                <View style={styles.infoItem}>
                    <MaterialCommunityIcons name="weight-kilogram" size={14} color={COLORS.primary} />
                    <Text style={styles.infoText}>{item.quantity}</Text>
                </View>
                <View style={styles.infoItem}>
                    <MaterialCommunityIcons name="store-outline" size={14} color={COLORS.primary} />
                    <Text style={styles.infoText}>{item.donor}</Text>
                </View>
                <View style={styles.infoItem}>
                    <MaterialCommunityIcons name="map-marker-outline" size={14} color={COLORS.primary} />
                    <Text style={styles.infoText}>{item.location}</Text>
                </View>
                <View style={styles.infoItem}>
                    <MaterialCommunityIcons name="timer-outline" size={14} color={item.urgent ? "#F59E0B" : COLORS.primary} />
                    <Text style={[styles.infoText, item.urgent && { color: "#F59E0B", fontWeight: "700" }]}>{item.time}</Text>
                </View>
            </View>

            {/* Action buttons */}
            <View style={styles.btnRow}>
                <TouchableOpacity style={styles.mapBtn} onPress={() => onNavigate(item)} activeOpacity={0.8}>
                    <MaterialCommunityIcons name="map-marker-radius-outline" size={17} color={COLORS.success} />
                    <Text style={styles.mapBtnText}>View Map</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.requestBtn} onPress={() => onRequest(item)} activeOpacity={0.85}>
                    <MaterialCommunityIcons name="hand-heart-outline" size={17} color="#fff" />
                    <Text style={styles.requestText}>Request</Text>
                </TouchableOpacity>
            </View>
        </Animated.View>
    );
}

export default function AvailableFood() {
    const router = useRouter();

    const onNavigate = (item) => {
        router.push({
            pathname: "/ngo/pickup-map",
            params: {
                pickupId: item.id,
                foodName: item.name,
                donor: item.donor,
                address: item.location,
                deadline: item.time,
                latitude: item.donorLocation.latitude,
                longitude: item.donorLocation.longitude,
            },
        });
    };

    const onRequest = (item) => {
        // TODO: POST /api/requests — { foodId: item.id, ngoId: currentUser._id }
        alert(`Request sent for ${item.name}!`);
    };

    const headerFade = useRef(new Animated.Value(0)).current;
    const headerSlide = useRef(new Animated.Value(-16)).current;
    useEffect(() => {
        Animated.parallel([
            Animated.timing(headerFade, { toValue: 1, duration: 500, useNativeDriver: true }),
            Animated.timing(headerSlide, { toValue: 0, duration: 500, useNativeDriver: true }),
        ]).start();
    }, []);

    return (
        <View style={styles.container}>

            {/* ── HEADER ── */}
            <Animated.View style={[styles.header, { opacity: headerFade, transform: [{ translateY: headerSlide }] }]}>
                <View style={styles.headerBlob} />
                <View>
                    <Text style={styles.title}>Available Food</Text>
                    <Text style={styles.subtitle}>{DONATIONS.length} donations near you</Text>
                </View>
                <View style={styles.statPill}>
                    <MaterialCommunityIcons name="clock-alert-outline" size={13} color="#F59E0B" />
                    <Text style={styles.statPillText}>{DONATIONS.filter(d => d.urgent).length} urgent</Text>
                </View>
            </Animated.View>

            {/* ── LIST ── */}
            <FlatList
                data={DONATIONS}
                keyExtractor={(item) => item.id}
                renderItem={({ item, index }) => (
                    <DonationCard
                        item={item}
                        index={index}
                        onNavigate={onNavigate}
                        onRequest={onRequest}
                    />
                )}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F5F0EB" },

    header: {
        flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between",
        backgroundColor: COLORS.success,
        paddingTop: Platform.OS === "ios" ? 58 : 44,
        paddingBottom: 24, paddingHorizontal: 22,
        borderBottomLeftRadius: 28, borderBottomRightRadius: 28,
        marginBottom: 20, overflow: "hidden",
        shadowColor: COLORS.success, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.22, shadowRadius: 16, elevation: 8,
    },
    headerBlob: { position: "absolute", width: 160, height: 160, borderRadius: 80, backgroundColor: "#fff", opacity: 0.07, top: -40, right: -30 },
    title: { fontSize: 28, fontWeight: "800", color: "#fff", letterSpacing: -0.5, marginBottom: 4 },
    subtitle: { fontSize: 14, color: "rgba(255,255,255,0.78)", fontWeight: "600" },
    statPill: { flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: "rgba(255,255,255,0.2)", paddingVertical: 6, paddingHorizontal: 12, borderRadius: 9999 },
    statPillText: { fontSize: 12, fontWeight: "700", color: "#fff" },

    listContent: { paddingHorizontal: 18, paddingBottom: 100 },

    card: {
        backgroundColor: "#fff", borderRadius: 22, marginBottom: 16,
        shadowColor: "#000", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 4,
        overflow: "hidden",
    },
    urgentBadge: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "#F59E0B", paddingVertical: 5, paddingHorizontal: 14, alignSelf: "flex-start", borderBottomRightRadius: 12 },
    urgentText: { fontSize: 11, fontWeight: "800", color: "#fff" },
    cardTop: { flexDirection: "row", alignItems: "center", gap: 14, padding: 18, paddingBottom: 12 },
    catIcon: { width: 56, height: 56, borderRadius: 18, justifyContent: "center", alignItems: "center" },
    foodName: { fontSize: 18, fontWeight: "800", color: COLORS.textDark, letterSpacing: -0.2, marginBottom: 6 },
    catBadge: { paddingVertical: 3, paddingHorizontal: 10, borderRadius: 8, alignSelf: "flex-start" },
    catBadgeText: { fontSize: 11, fontWeight: "700" },
    distancePill: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "#EAF5EF", paddingVertical: 5, paddingHorizontal: 10, borderRadius: 10 },
    distanceText: { fontSize: 12, fontWeight: "800", color: COLORS.success },

    infoGrid: { flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 18, paddingBottom: 14, gap: 10, borderBottomWidth: 1, borderBottomColor: "#F3F3F7" },
    infoItem: { flexDirection: "row", alignItems: "center", gap: 5, width: "47%" },
    infoText: { fontSize: 13, color: COLORS.grayText, fontWeight: "500", flex: 1 },

    btnRow: { flexDirection: "row", gap: 10, padding: 16 },
    mapBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 7, paddingVertical: 13, borderRadius: 14, backgroundColor: "#EAF5EF", borderWidth: 1.5, borderColor: COLORS.success + "40" },
    mapBtnText: { fontSize: 14, fontWeight: "800", color: COLORS.success },
    requestBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 7, paddingVertical: 13, borderRadius: 14, backgroundColor: COLORS.primary, shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.28, shadowRadius: 8, elevation: 4 },
    requestText: { fontSize: 14, fontWeight: "800", color: "#fff" },
});