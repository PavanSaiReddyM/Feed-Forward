import {
    StyleSheet, Text, View, TouchableOpacity,
    Platform, Linking, Animated, Easing,
    ActivityIndicator,
} from "react-native";
import { useState, useEffect, useRef } from "react";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { COLORS } from "../../_constants/colors";

const STATUS_STEPS = [
    { key: "approved", label: "Approved", icon: "check-circle-outline" },
    { key: "en_route", label: "En Route", icon: "truck-fast-outline" },
    { key: "arrived", label: "Arrived", icon: "map-marker-check-outline" },
    { key: "collected", label: "Collected", icon: "package-variant-closed" },
];

export default function PickupMap() {
    const router = useRouter();

    // ── Read params passed from available.jsx ──────────────────────────────────
    const params = useLocalSearchParams();

    // If no params (direct open), fall back to Delhi sample data
    const pickup = {
        id: params.pickupId || "PKP-1001",
        foodName: params.foodName || "Dal Makhani (12kg)",
        donor: params.donor || "Moti Mahal Restaurant",
        donorPhone: params.donorPhone || "+91 98100 12345",
        deadline: params.deadline || "Pickup by 5:00 PM",
        address: params.address || "Connaught Place, New Delhi",
        donorLocation: {
            latitude: parseFloat(params.latitude) || 28.6315,
            longitude: parseFloat(params.longitude) || 77.2167,
        },
    };

    const mapRef = useRef(null);
    const cardAnim = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;

    const [myLocation, setMyLocation] = useState(null);
    const [locError, setLocError] = useState(false);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState("approved");
    const [cardOpen, setCardOpen] = useState(true);
    const eta = "~14 min";

    // ── Pulse animation for donor pin ─────────────────────────────────────────
    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, { toValue: 1.35, duration: 900, useNativeDriver: true }),
                Animated.timing(pulseAnim, { toValue: 1.0, duration: 900, useNativeDriver: true }),
            ])
        ).start();
    }, []);

    // ── Card slide animation ───────────────────────────────────────────────────
    useEffect(() => {
        Animated.spring(cardAnim, {
            toValue: cardOpen ? 0 : 170,
            tension: 60, friction: 12, useNativeDriver: true,
        }).start();
    }, [cardOpen]);

    // ── Location permission + watch ───────────────────────────────────────────
    useEffect(() => {
        let sub;
        (async () => {
            try {
                const { status: perm } = await Location.requestForegroundPermissionsAsync();
                if (perm !== "granted") {
                    setLocError(true);
                    setLoading(false);
                    return;
                }

                let loc = null;
                try {
                    loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
                } catch {
                    try {
                        loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Low });
                    } catch {
                        setLocError(true);
                        setLoading(false);
                        return;
                    }
                }

                if (loc) {
                    setMyLocation(loc.coords);
                    setLoading(false);
                }

                try {
                    sub = await Location.watchPositionAsync(
                        { accuracy: Location.Accuracy.Balanced, distanceInterval: 15 },
                        (l) => setMyLocation(l.coords)
                    );
                } catch { /* static pin fine */ }

            } catch {
                setLocError(true);
                setLoading(false);
            }
        })();
        return () => sub && sub.remove();
    }, []);

    // ── Fit map to show NGO + donor ────────────────────────────────────────────
    useEffect(() => {
        if (!myLocation || !mapRef.current) return;
        mapRef.current.fitToCoordinates(
            [
                { latitude: myLocation.latitude, longitude: myLocation.longitude },
                pickup.donorLocation,
            ],
            { edgePadding: { top: 120, right: 60, bottom: 300, left: 60 }, animated: true }
        );
    }, [myLocation]);

    // ── Build route coords: my position → donor (straight line segments for demo)
    // In production replace with Google Directions API polyline decode
    const routeCoords = myLocation
        ? [
            { latitude: myLocation.latitude, longitude: myLocation.longitude },
            {
                latitude: myLocation.latitude + (pickup.donorLocation.latitude - myLocation.latitude) * 0.33,
                longitude: myLocation.longitude + (pickup.donorLocation.longitude - myLocation.longitude) * 0.33,
            },
            {
                latitude: myLocation.latitude + (pickup.donorLocation.latitude - myLocation.latitude) * 0.66,
                longitude: myLocation.longitude + (pickup.donorLocation.longitude - myLocation.longitude) * 0.66,
            },
            pickup.donorLocation,
        ]
        : [pickup.donorLocation];

    const openGoogleMaps = () => {
        const { latitude, longitude } = pickup.donorLocation;
        const url = Platform.select({
            ios: `maps://app?daddr=${latitude},${longitude}`,
            android: `google.navigation:q=${latitude},${longitude}`,
        });
        Linking.openURL(url).catch(() =>
            Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`)
        );
    };

    const callDonor = () => Linking.openURL(`tel:${pickup.donorPhone}`);

    const statusIdx = STATUS_STEPS.findIndex(s => s.key === status);
    const nextStatus = () => {
        if (statusIdx < STATUS_STEPS.length - 1)
            setStatus(STATUS_STEPS[statusIdx + 1].key);
    };

    const centerMap = () => {
        if (!mapRef.current) return;
        const coords = myLocation
            ? [{ latitude: myLocation.latitude, longitude: myLocation.longitude }, pickup.donorLocation]
            : [pickup.donorLocation];
        mapRef.current.fitToCoordinates(coords, {
            edgePadding: { top: 120, right: 60, bottom: 300, left: 60 }, animated: true,
        });
    };

    const initialRegion = {
        latitude: pickup.donorLocation.latitude - 0.01,
        longitude: pickup.donorLocation.longitude + 0.005,
        latitudeDelta: 0.03,
        longitudeDelta: 0.03,
    };

    // ══════════════════════════════════════════════════════════════════════════
    return (
        <View style={styles.root}>

            {/* ── MAP AREA ── */}
            {loading ? (
                <View style={styles.loadingWrap}>
                    <ActivityIndicator size="large" color={COLORS.success} />
                    <Text style={styles.loadingText}>Getting your location…</Text>
                </View>

            ) : locError ? (
                /* Location unavailable fallback */
                <View style={styles.locErrorWrap}>
                    <View style={styles.locErrorIconWrap}>
                        <MaterialCommunityIcons name="map-marker-off-outline" size={44} color="#F59E0B" />
                    </View>
                    <Text style={styles.locErrorTitle}>Location Unavailable</Text>
                    <Text style={styles.locErrorBody}>
                        Enable location services to see your live route. You can still open navigation below.
                    </Text>
                    <TouchableOpacity style={styles.locErrorBtn} onPress={openGoogleMaps} activeOpacity={0.85}>
                        <MaterialCommunityIcons name="navigation" size={18} color="#fff" />
                        <Text style={styles.locErrorBtnText}>Open in Google Maps</Text>
                    </TouchableOpacity>
                </View>

            ) : (
                <MapView
                    ref={mapRef}
                    style={styles.map}
                    provider={PROVIDER_GOOGLE}
                    initialRegion={initialRegion}
                    showsUserLocation
                    showsMyLocationButton={false}
                    showsCompass={false}
                    showsTraffic={false}
                    customMapStyle={mapStyle}
                >
                    {/* Route polyline */}
                    <Polyline
                        coordinates={routeCoords}
                        strokeColor={COLORS.success}
                        strokeWidth={4}
                        lineCap="round"
                        lineJoin="round"
                    />

                    {/* Donor pin */}
                    <Marker coordinate={pickup.donorLocation} anchor={{ x: 0.5, y: 1 }} tracksViewChanges={false}>
                        <View style={styles.donorMarker}>
                            <Animated.View style={[styles.donorPulse, { transform: [{ scale: pulseAnim }] }]} />
                            <View style={styles.donorPin}>
                                <MaterialCommunityIcons name="store" size={20} color="#fff" />
                            </View>
                            <View style={styles.donorPinTail} />
                        </View>
                    </Marker>
                </MapView>
            )}

            {/* ── TOP BAR (always visible) ── */}
            <View style={styles.topBar}>
                <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
                    <MaterialCommunityIcons name="arrow-left" size={22} color={COLORS.textDark} />
                </TouchableOpacity>
                <View style={styles.topBarCenter}>
                    <Text style={styles.topBarTitle}>Pickup Navigation</Text>
                    <Text style={styles.topBarSub}>{pickup.id} · {eta} away</Text>
                </View>
                <TouchableOpacity style={[styles.iconBtn, { backgroundColor: "#EAF5EF" }]} onPress={centerMap}>
                    <MaterialCommunityIcons name="image-filter-center-focus" size={22} color={COLORS.success} />
                </TouchableOpacity>
            </View>

            {/* ── ETA PILL ── */}
            {!locError && !loading && (
                <View style={styles.etaPill}>
                    <MaterialCommunityIcons name="clock-fast" size={15} color={COLORS.success} />
                    <Text style={styles.etaText}>ETA {eta} · {pickup.address}</Text>
                </View>
            )}

            {/* ── BOTTOM CARD ── */}
            <Animated.View style={[styles.card, { transform: [{ translateY: cardAnim }] }]}>

                {/* Drag handle */}
                <TouchableOpacity style={styles.cardHandle} onPress={() => setCardOpen(!cardOpen)} activeOpacity={0.8}>
                    <View style={styles.handleBar} />
                </TouchableOpacity>

                {/* Food + donor row */}
                <View style={styles.foodRow}>
                    <View style={styles.foodIconWrap}>
                        <MaterialCommunityIcons name="food-variant" size={24} color={COLORS.primary} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.foodName}>{pickup.foodName}</Text>
                        <Text style={styles.donorName}>
                            {pickup.donor}
                        </Text>
                    </View>
                    <View style={styles.deadlineBadge}>
                        <MaterialCommunityIcons name="timer-outline" size={12} color="#F59E0B" />
                        <Text style={styles.deadlineText}>{pickup.deadline.replace("Pickup by ", "")}</Text>
                    </View>
                </View>

                {/* Status stepper */}
                <View style={styles.stepperWrap}>
                    {STATUS_STEPS.map((step, i) => {
                        const done = i < statusIdx;
                        const current = i === statusIdx;
                        return (
                            <View key={step.key} style={styles.stepItem}>
                                <View style={[styles.stepCircle, done && styles.stepDone, current && styles.stepCurrent]}>
                                    <MaterialCommunityIcons
                                        name={done ? "check" : step.icon}
                                        size={13}
                                        color={done || current ? "#fff" : COLORS.grayText}
                                    />
                                </View>
                                <Text style={[styles.stepLabel, (done || current) && styles.stepLabelActive]}>
                                    {step.label}
                                </Text>
                                {i < STATUS_STEPS.length - 1 && (
                                    <View style={[styles.stepLine, done && styles.stepLineDone]} />
                                )}
                            </View>
                        );
                    })}
                </View>

                {/* Action buttons */}
                <View style={styles.btnRow}>
                    <TouchableOpacity style={styles.navBtn} onPress={openGoogleMaps} activeOpacity={0.85}>
                        <MaterialCommunityIcons name="navigation" size={18} color="#fff" />
                        <Text style={styles.navBtnText}>Navigate</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.callBtn} onPress={callDonor} activeOpacity={0.85}>
                        <MaterialCommunityIcons name="phone" size={18} color={COLORS.success} />
                    </TouchableOpacity>

                    {status !== "collected" ? (
                        <TouchableOpacity style={styles.statusBtn} onPress={nextStatus} activeOpacity={0.85}>
                            <MaterialCommunityIcons name="arrow-right-circle-outline" size={17} color={COLORS.primary} />
                            <Text style={styles.statusBtnText}>
                                {status === "approved" ? "Start Pickup" :
                                    status === "en_route" ? "Mark Arrived" : "Mark Collected"}
                            </Text>
                        </TouchableOpacity>
                    ) : (
                        <View style={styles.collectedBadge}>
                            <MaterialCommunityIcons name="check-circle" size={17} color="#2D6A4F" />
                            <Text style={styles.collectedText}>Pickup Complete!</Text>
                        </View>
                    )}
                </View>

                {/* Address */}
                <TouchableOpacity
                    style={styles.addressRow}
                    onPress={() => Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${pickup.donorLocation.latitude},${pickup.donorLocation.longitude}`)}
                    activeOpacity={0.75}
                >
                    <MaterialCommunityIcons name="map-marker-outline" size={15} color={COLORS.primary} />
                    <Text style={styles.addressText} numberOfLines={1}>{pickup.address}</Text>
                    <MaterialCommunityIcons name="open-in-new" size={14} color={COLORS.grayText} />
                </TouchableOpacity>

            </Animated.View>
        </View>
    );
}

// ── Clean grey map style ───────────────────────────────────────────────────────
const mapStyle = [
    { elementType: "geometry", stylers: [{ color: "#f5f5f5" }] },
    { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#f5f5f5" }] },
    { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
    { featureType: "road.arterial", elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
    { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#dadada" }] },
    { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
    { featureType: "road.local", elementType: "labels.text.fill", stylers: [{ color: "#9e9e9e" }] },
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#c9e8f5" }] },
    { featureType: "poi", stylers: [{ visibility: "off" }] },
    { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#e5f5e0", visibility: "on" }] },
    { featureType: "transit", stylers: [{ visibility: "off" }] },
];

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: "#F5F5F5" },
    map: { flex: 1 },

    loadingWrap: { flex: 1, justifyContent: "center", alignItems: "center", gap: 14 },
    loadingText: { fontSize: 14, color: COLORS.grayText, fontWeight: "600" },

    locErrorWrap: { flex: 1, justifyContent: "center", alignItems: "center", padding: 36, gap: 14 },
    locErrorIconWrap: { width: 88, height: 88, borderRadius: 44, backgroundColor: "#FFF8EB", justifyContent: "center", alignItems: "center", marginBottom: 4 },
    locErrorTitle: { fontSize: 20, fontWeight: "800", color: COLORS.textDark, letterSpacing: -0.3 },
    locErrorBody: { fontSize: 14, color: COLORS.grayText, textAlign: "center", lineHeight: 21, maxWidth: 280 },
    locErrorBtn: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: COLORS.success, paddingVertical: 14, paddingHorizontal: 28, borderRadius: 16, marginTop: 8, shadowColor: COLORS.success, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 6 },
    locErrorBtnText: { color: "#fff", fontSize: 15, fontWeight: "800" },

    // Top bar
    topBar: {
        position: "absolute", top: Platform.OS === "ios" ? 54 : 36,
        left: 16, right: 16,
        flexDirection: "row", alignItems: "center", gap: 10,
        backgroundColor: "#fff",
        borderRadius: 20, paddingVertical: 10, paddingHorizontal: 12,
        shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 12, elevation: 8,
    },
    iconBtn: { width: 40, height: 40, borderRadius: 13, backgroundColor: "#F5F5F8", justifyContent: "center", alignItems: "center" },
    topBarCenter: { flex: 1, alignItems: "center" },
    topBarTitle: { fontSize: 15, fontWeight: "800", color: COLORS.textDark, letterSpacing: -0.2 },
    topBarSub: { fontSize: 11, color: COLORS.grayText, marginTop: 1 },

    // ETA pill
    etaPill: {
        position: "absolute",
        top: Platform.OS === "ios" ? 118 : 100,
        alignSelf: "center",
        flexDirection: "row", alignItems: "center", gap: 6,
        backgroundColor: "#fff",
        paddingVertical: 7, paddingHorizontal: 14, borderRadius: 9999,
        shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4,
        maxWidth: "88%",
    },
    etaText: { fontSize: 12, fontWeight: "700", color: COLORS.textDark, flexShrink: 1 },

    // Donor pin
    donorMarker: { alignItems: "center" },
    donorPulse: { position: "absolute", width: 54, height: 54, borderRadius: 27, backgroundColor: COLORS.success + "30", top: -7 },
    donorPin: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.success, justifyContent: "center", alignItems: "center", borderWidth: 3, borderColor: "#fff", shadowColor: COLORS.success, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8, elevation: 6 },
    donorPinTail: { width: 0, height: 0, borderLeftWidth: 7, borderRightWidth: 7, borderTopWidth: 10, borderLeftColor: "transparent", borderRightColor: "transparent", borderTopColor: COLORS.success, marginTop: -1 },

    // Bottom card
    card: {
        position: "absolute", bottom: 0, left: 0, right: 0,
        backgroundColor: "#fff",
        borderTopLeftRadius: 28, borderTopRightRadius: 28,
        paddingBottom: Platform.OS === "ios" ? 34 : 18,
        shadowColor: "#000", shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.12, shadowRadius: 20, elevation: 24,
    },
    cardHandle: { alignItems: "center", paddingTop: 12, paddingBottom: 6 },
    handleBar: { width: 40, height: 4, borderRadius: 2, backgroundColor: "#DDD" },

    foodRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 20, paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: "#F0F0F0" },
    foodIconWrap: { width: 46, height: 46, borderRadius: 14, backgroundColor: "#FFF0EB", justifyContent: "center", alignItems: "center" },
    foodName: { fontSize: 16, fontWeight: "800", color: COLORS.textDark, letterSpacing: -0.2 },
    donorName: { fontSize: 13, color: COLORS.grayText, marginTop: 3 },
    deadlineBadge: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "#FFF8EB", borderRadius: 10, paddingVertical: 5, paddingHorizontal: 9 },
    deadlineText: { fontSize: 11, fontWeight: "700", color: "#F59E0B" },

    // Stepper
    stepperWrap: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", paddingHorizontal: 20, paddingVertical: 14 },
    stepItem: { flex: 1, alignItems: "center", position: "relative" },
    stepCircle: { width: 30, height: 30, borderRadius: 15, backgroundColor: "#F0F0F5", justifyContent: "center", alignItems: "center", marginBottom: 5, borderWidth: 1.5, borderColor: "transparent" },
    stepDone: { backgroundColor: COLORS.success, borderColor: COLORS.success },
    stepCurrent: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
    stepLabel: { fontSize: 9, color: COLORS.grayText, fontWeight: "600", textAlign: "center" },
    stepLabelActive: { color: COLORS.textDark, fontWeight: "800" },
    stepLine: { position: "absolute", top: 14, left: "58%", right: "-42%", height: 2, backgroundColor: "#E5E7EB", zIndex: -1 },
    stepLineDone: { backgroundColor: COLORS.success },

    // Buttons
    btnRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 20, gap: 10, marginBottom: 10 },
    navBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: COLORS.success, paddingVertical: 13, borderRadius: 15, shadowColor: COLORS.success, shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 5 },
    navBtnText: { color: "#fff", fontSize: 14, fontWeight: "800" },
    callBtn: { width: 48, height: 48, borderRadius: 14, backgroundColor: "#EAF5EF", justifyContent: "center", alignItems: "center", borderWidth: 1.5, borderColor: COLORS.success + "40" },
    statusBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 7, backgroundColor: COLORS.primaryGlow || "#FFF0EB", paddingVertical: 13, borderRadius: 15, borderWidth: 1.5, borderColor: COLORS.primary + "30" },
    statusBtnText: { color: COLORS.primary, fontSize: 12, fontWeight: "800" },
    collectedBadge: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 7, backgroundColor: "#EAF5EF", paddingVertical: 13, borderRadius: 15 },
    collectedText: { color: "#2D6A4F", fontSize: 13, fontWeight: "800" },

    // Address
    addressRow: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 20, paddingTop: 2 },
    addressText: { flex: 1, fontSize: 12, color: COLORS.grayText, lineHeight: 18 },
});