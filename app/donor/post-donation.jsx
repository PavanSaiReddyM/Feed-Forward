import {
  StyleSheet, Text, View, TextInput, TouchableOpacity,
  ScrollView, KeyboardAvoidingView, Platform, Image,
  Alert, Animated, Easing, Pressable, Modal, ActivityIndicator,
} from "react-native";
import { useState, useRef, useEffect } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { useRouter } from "expo-router";
import { COLORS } from "../../_constants/colors";
import { postDonation } from "../services/api";

// ─── Food type config with icons ─────────────────────────────────────────────
const FOOD_TYPES = [
  { key: "Cooked Meal", icon: "food-fork-drink", color: "#FF6B2B", bg: "#FFF0EB" },
  { key: "Raw Produce", icon: "leaf", color: "#2D6A4F", bg: "#EAF5EF" },
  { key: "Packaged Food", icon: "package-variant", color: "#2B7FFF", bg: "#EBF2FF" },
  { key: "Bakery", icon: "bread-slice-outline", color: "#F59E0B", bg: "#FFF8EB" },
  { key: "Beverages", icon: "cup-outline", color: "#7C3AED", bg: "#F3EEFF" },
  { key: "Other", icon: "dots-horizontal", color: "#6B7280", bg: "#F5F5F8" },
];

// ─── Form steps ───────────────────────────────────────────────────────────────
const STEPS = ["Food Info", "Pickup", "Review"];

// ─── Animated step indicator ──────────────────────────────────────────────────
function StepBar({ step }) {
  return (
    <View style={sb.wrap}>
      {STEPS.map((label, i) => {
        const done = i < step;
        const current = i === step;
        return (
          <View key={label} style={sb.item}>
            <View style={[sb.dot, done && sb.dotDone, current && sb.dotActive]}>
              {done
                ? <MaterialCommunityIcons name="check" size={11} color="#fff" />
                : <Text style={[sb.num, current && sb.numActive]}>{i + 1}</Text>
              }
            </View>
            <Text style={[sb.label, (done || current) && sb.labelActive]}>{label}</Text>
            {i < STEPS.length - 1 && <View style={[sb.line, done && sb.lineDone]} />}
          </View>
        );
      })}
    </View>
  );
}
const sb = StyleSheet.create({
  wrap: { flexDirection: "row", alignItems: "flex-start", paddingHorizontal: 24, paddingVertical: 16 },
  item: { flex: 1, alignItems: "center", position: "relative" },
  dot: { width: 32, height: 32, borderRadius: 16, backgroundColor: "#F0F0F5", justifyContent: "center", alignItems: "center", marginBottom: 6, borderWidth: 2, borderColor: "#E5E7EB" },
  dotActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary, shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 8, elevation: 4 },
  dotDone: { backgroundColor: COLORS.success, borderColor: COLORS.success },
  num: { fontSize: 12, fontWeight: "700", color: "#9CA3AF" },
  numActive: { color: "#fff" },
  label: { fontSize: 10, fontWeight: "600", color: COLORS.grayText, textAlign: "center" },
  labelActive: { color: COLORS.textDark, fontWeight: "800" },
  line: { position: "absolute", top: 15, left: "58%", right: "-42%", height: 2, backgroundColor: "#E5E7EB", zIndex: -1 },
  lineDone: { backgroundColor: COLORS.success },
});

// ─── Focusable input field ────────────────────────────────────────────────────
function Field({ label, icon, value, onChange, placeholder, keyboardType, multiline, required, hint }) {
  const [focused, setFocused] = useState(false);
  const lineAnim = useRef(new Animated.Value(0)).current;

  const onFocus = () => {
    setFocused(true);
    Animated.timing(lineAnim, { toValue: 1, duration: 200, useNativeDriver: false }).start();
  };
  const onBlur = () => {
    setFocused(false);
    Animated.timing(lineAnim, { toValue: 0, duration: 200, useNativeDriver: false }).start();
  };

  const filled = value.length > 0;

  return (
    <View style={fld.group}>
      <View style={fld.labelRow}>
        <Text style={[fld.label, focused && { color: COLORS.primary }]}>
          {label}{required && <Text style={{ color: "#EF4444" }}> *</Text>}
        </Text>
        {filled && <MaterialCommunityIcons name="check-circle" size={14} color={COLORS.success} />}
      </View>
      <View style={[fld.box, focused && fld.boxFocused, filled && !focused && fld.boxFilled,
      multiline && { height: 96, alignItems: "flex-start" }]}>
        <MaterialCommunityIcons name={icon} size={18}
          color={focused ? COLORS.primary : filled ? COLORS.success : COLORS.grayText}
          style={multiline ? { marginTop: 2 } : {}} />
        <TextInput
          style={[fld.input, multiline && { height: 76, textAlignVertical: "top" }]}
          value={value} onChangeText={onChange} placeholder={placeholder}
          placeholderTextColor={COLORS.placeholder}
          keyboardType={keyboardType} multiline={multiline}
          onFocus={onFocus} onBlur={onBlur} autoCapitalize="none"
        />
      </View>
      {/* Animated underline */}
      <View style={fld.lineTrack}>
        <Animated.View style={[fld.lineFill, {
          width: lineAnim.interpolate({ inputRange: [0, 1], outputRange: ["0%", "100%"] }),
        }]} />
      </View>
      {hint && <Text style={fld.hint}>{hint}</Text>}
    </View>
  );
}
const fld = StyleSheet.create({
  group: { marginBottom: 18 },
  labelRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 7 },
  label: { fontSize: 12, fontWeight: "700", color: COLORS.grayText, textTransform: "uppercase", letterSpacing: 0.4 },
  box: { flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: "#F7F7FA", borderRadius: 14, paddingHorizontal: 14, paddingVertical: 14, borderWidth: 1.5, borderColor: "transparent" },
  boxFocused: { backgroundColor: COLORS.primaryGlow, borderColor: COLORS.primary + "50" },
  boxFilled: { backgroundColor: "#F0FFF4", borderColor: COLORS.success + "30" },
  input: { flex: 1, fontSize: 15, color: COLORS.textDark },
  lineTrack: { height: 2, backgroundColor: "#EBEBF0", borderRadius: 1, marginTop: 2, overflow: "hidden" },
  lineFill: { height: "100%", backgroundColor: COLORS.primary, borderRadius: 1 },
  hint: { fontSize: 11, color: COLORS.grayText, marginTop: 5, paddingLeft: 2 },
});

// ─── Food type chip ───────────────────────────────────────────────────────────
function TypeChip({ item, selected, onPress }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const onPressIn = () => Animated.spring(scaleAnim, { toValue: 0.92, useNativeDriver: true }).start();
  const onPressOut = () => Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();

  return (
    <Pressable onPress={onPress} onPressIn={onPressIn} onPressOut={onPressOut}>
      <Animated.View style={[
        tc.chip,
        selected && { backgroundColor: item.bg, borderColor: item.color },
        { transform: [{ scale: scaleAnim }] },
      ]}>
        <MaterialCommunityIcons name={item.icon} size={18} color={selected ? item.color : COLORS.grayText} />
        <Text style={[tc.label, selected && { color: item.color, fontWeight: "800" }]}>{item.key}</Text>
      </Animated.View>
    </Pressable>
  );
}
const tc = StyleSheet.create({
  chip: { flexDirection: "row", alignItems: "center", gap: 7, paddingVertical: 10, paddingHorizontal: 14, borderRadius: 14, backgroundColor: "#F5F5F8", borderWidth: 1.5, borderColor: "transparent" },
  label: { fontSize: 13, fontWeight: "600", color: COLORS.grayText },
});

// ─── Review row ───────────────────────────────────────────────────────────────
function ReviewRow({ icon, label, value, color }) {
  if (!value) return null;
  return (
    <View style={rv.row}>
      <View style={[rv.iconWrap, { backgroundColor: (color || COLORS.primary) + "18" }]}>
        <MaterialCommunityIcons name={icon} size={15} color={color || COLORS.primary} />
      </View>
      <Text style={rv.label}>{label}</Text>
      <Text style={rv.value} numberOfLines={2}>{value}</Text>
    </View>
  );
}
const rv = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: "#F3F3F7" },
  iconWrap: { width: 32, height: 32, borderRadius: 10, justifyContent: "center", alignItems: "center" },
  label: { fontSize: 12, fontWeight: "600", color: COLORS.grayText, width: 80 },
  value: { flex: 1, fontSize: 14, fontWeight: "700", color: COLORS.textDark, textAlign: "right" },
});

// ─── Success Screen ───────────────────────────────────────────────────────────
function SuccessView({ onReset, data }) {
  const scaleAnim = useRef(new Animated.Value(0.4)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, tension: 55, friction: 8, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 450, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 450, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[suc.wrap, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      {/* Confetti ring */}
      <Animated.View style={[suc.ring, { transform: [{ scale: scaleAnim }] }]}>
        <View style={suc.ringInner}>
          <MaterialCommunityIcons name="check" size={44} color="#fff" />
        </View>
      </Animated.View>

      <Text style={suc.title}>Donation Posted! 🎉</Text>
      <Text style={suc.body}>
        Your donation has been listed. Verified NGOs nearby will be notified and can request pickup.
      </Text>

      {/* Summary card */}
      <View style={suc.summaryCard}>
        <View style={suc.summaryRow}>
          <MaterialCommunityIcons name="food-outline" size={15} color={COLORS.primary} />
          <Text style={suc.summaryLabel}>{data.foodName}</Text>
          <Text style={suc.summaryVal}>{data.quantity}</Text>
        </View>
        {data.pickupTime && (
          <View style={[suc.summaryRow, { borderTopWidth: 1, borderTopColor: "#F0F0F0", marginTop: 8, paddingTop: 8 }]}>
            <MaterialCommunityIcons name="clock-outline" size={15} color={COLORS.success} />
            <Text style={suc.summaryLabel}>Pickup</Text>
            <Text style={suc.summaryVal}>{data.pickupTime}</Text>
          </View>
        )}
      </View>

      <View style={suc.notifBanner}>
        <MaterialCommunityIcons name="bell-ring-outline" size={16} color={COLORS.primary} />
        <Text style={suc.notifText}>You'll be notified when an NGO accepts your donation.</Text>
      </View>

      <TouchableOpacity style={suc.btn} onPress={onReset} activeOpacity={0.86}>
        <MaterialCommunityIcons name="plus-circle-outline" size={20} color="#fff" />
        <Text style={suc.btnText}>Post Another Donation</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}
const suc = StyleSheet.create({
  wrap: { flex: 1, alignItems: "center", justifyContent: "center", padding: 28, paddingTop: 16 },
  ring: { width: 110, height: 110, borderRadius: 55, backgroundColor: COLORS.success + "20", justifyContent: "center", alignItems: "center", marginBottom: 24 },
  ringInner: { width: 82, height: 82, borderRadius: 41, backgroundColor: COLORS.success, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 26, fontWeight: "800", color: COLORS.textDark, letterSpacing: -0.4, marginBottom: 12, textAlign: "center" },
  body: { fontSize: 14, color: COLORS.grayText, textAlign: "center", lineHeight: 21, marginBottom: 24, maxWidth: 300 },
  summaryCard: { width: "100%", backgroundColor: "#fff", borderRadius: 18, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: "#F0F0F0" },
  summaryRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  summaryLabel: { flex: 1, fontSize: 13, color: COLORS.grayText, fontWeight: "600" },
  summaryVal: { fontSize: 14, fontWeight: "800", color: COLORS.textDark },
  notifBanner: { flexDirection: "row", alignItems: "flex-start", gap: 10, backgroundColor: COLORS.primaryGlow, borderRadius: 14, padding: 14, marginBottom: 28, width: "100%" },
  notifText: { flex: 1, fontSize: 13, color: COLORS.primary, fontWeight: "600", lineHeight: 18 },
  btn: { flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: COLORS.primary, paddingVertical: 16, paddingHorizontal: 32, borderRadius: 18, shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.28, shadowRadius: 14, elevation: 6 },
  btnText: { fontSize: 15, fontWeight: "800", color: "#fff" },
});

// ─── Main Component ───────────────────────────────────────────────────────────
export default function PostDonation() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  // Step 0 — food info
  const [foodName, setFoodName] = useState("");
  const [foodType, setFoodType] = useState("");
  const [quantity, setQuantity] = useState("");
  const [expiry, setExpiry] = useState("");
  const [imageUri, setImageUri] = useState(null);

  // Step 1 — pickup
  const [location, setLocation] = useState("");
  const [locationCoords, setLocationCoords] = useState(null); // { latitude, longitude }
  const [pickupTime, setPickupTime] = useState("");
  const [note, setNote] = useState("");

  // Map picker modal
  const [showMap, setShowMap] = useState(false);
  const [mapRegion, setMapRegion] = useState({
    latitude: 28.6139, longitude: 77.2090,   // default: New Delhi
    latitudeDelta: 0.02, longitudeDelta: 0.02,
  });
  const [pinCoords, setPinCoords] = useState(null);
  const [geocoding, setGeocoding] = useState(false);
  const mapRef = useRef(null);

  const openMapPicker = async () => {
    // Try to centre on user's current location
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        const region = {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };
        setMapRegion(region);
        if (!pinCoords) setPinCoords({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
      }
    } catch { /* use default Delhi coords */ }
    setShowMap(true);
  };

  const handleMapPress = (e) => {
    setPinCoords(e.nativeEvent.coordinate);
  };

  const confirmMapLocation = async () => {
    if (!pinCoords) { Alert.alert("Pin a location", "Tap on the map to drop a pin first."); return; }
    setGeocoding(true);
    try {
      const results = await Location.reverseGeocodeAsync(pinCoords);
      if (results?.length > 0) {
        const r = results[0];
        const parts = [r.name, r.street, r.district, r.city, r.region].filter(Boolean);
        const addr = parts.join(", ");
        setLocation(addr);
        setLocationCoords(pinCoords);
      } else {
        setLocation(`${pinCoords.latitude.toFixed(5)}, ${pinCoords.longitude.toFixed(5)}`);
        setLocationCoords(pinCoords);
      }
    } catch {
      setLocation(`${pinCoords.latitude.toFixed(5)}, ${pinCoords.longitude.toFixed(5)}`);
      setLocationCoords(pinCoords);
    } finally {
      setGeocoding(false);
      setShowMap(false);
    }
  };

  // UI state
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const slideAnim = useRef(new Animated.Value(0)).current;

  const canStep0 = foodName.trim().length > 1 && quantity.trim().length > 0;
  const canStep1 = location.trim().length > 3;
  const canSubmit = canStep0 && canStep1;

  const transition = (dir, cb) => {
    Animated.timing(slideAnim, { toValue: dir * -30, duration: 150, useNativeDriver: true }).start(() => {
      cb();
      slideAnim.setValue(dir * 30);
      Animated.timing(slideAnim, { toValue: 0, duration: 250, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
    });
  };

  const goNext = () => transition(1, () => setStep(s => s + 1));
  const goBack = () => transition(-1, () => setStep(s => s - 1));

  // Image picker
  const pickImage = async (source) => {
    try {
      let result;
      if (source === "camera") {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") { Alert.alert("Permission needed", "Please allow camera access in Settings."); return; }
        result = await ImagePicker.launchCameraAsync({ mediaTypes: ["images"], allowsEditing: true, aspect: [4, 3], quality: 0.8 });
      } else {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") { Alert.alert("Permission needed", "Please allow photo library access in Settings."); return; }
        result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], allowsEditing: true, aspect: [4, 3], quality: 0.8 });
      }
      if (result && !result.canceled && result.assets?.length > 0) setImageUri(result.assets[0].uri);
    } catch { Alert.alert("Error", "Could not open photo picker. Please try again."); }
  };

  const openImageOptions = () => Alert.alert("Add Food Photo", "Choose an option", [
    { text: "Take Photo", onPress: () => pickImage("camera") },
    { text: "Choose from Library", onPress: () => pickImage("library") },
    { text: "Remove Photo", onPress: () => setImageUri(null), style: imageUri ? "destructive" : "cancel" },
    { text: "Cancel", style: "cancel" },
  ]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Validate location has coordinates
      if (!locationCoords) {
        Alert.alert("Location Error", "Please select a location on the map with proper coordinates.");
        setLoading(false);
        return;
      }

      // Prepare payload - location must be an object with latitude/longitude
      const payload = {
        foodName,
        foodType,
        quantity,
        expiry,
        location: locationCoords, // Send as object, not string
        pickupTime,
        note,
        imageUri,
      };
      const food = await postDonation(payload);
      setLoading(false);
      setSubmitted(food);
    } catch (err) {
      setLoading(false);
      Alert.alert("Error", err.message || "Could not post donation. Please try again.");
    }
  };

  const handleReset = () => {
    setFoodName(""); setFoodType(""); setQuantity(""); setExpiry("");
    setLocation(""); setPickupTime(""); setNote(""); setImageUri(null);
    setSubmitted(false); setStep(0);
  };

  // ── Success screen
 if (submitted) {
  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <View style={styles.headerBlob} />
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <MaterialCommunityIcons name="arrow-left" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <SuccessView
        onReset={handleReset}
        data={{
          foodName: submitted.foodName,
          quantity: submitted.quantity,
          pickupTime: submitted.pickupTime,
        }}
      />
    </View>
  );
}

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === "ios" ? "padding" : "height"}>

      {/* ── HEADER ── */}
      <View style={styles.header}>
        <View style={styles.headerBlob} />
        <View style={styles.headerBlob2} />
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.backBtn} onPress={() => step === 0 ? router.back() : goBack()}>
            <MaterialCommunityIcons name="arrow-left" size={20} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Post Donation</Text>
            <Text style={styles.headerSub}>Step {step + 1} of {STEPS.length}</Text>
          </View>
          <View style={{ width: 40 }} />
        </View>
      </View>

      {/* ── STEP BAR ── */}
      <View style={styles.stepBarWrap}>
        <StepBar step={step} />
      </View>

      {/* ── FORM CONTENT ── */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View style={{ transform: [{ translateX: slideAnim }] }}>

          {/* ══ STEP 0 — FOOD INFO ══ */}
          {step === 0 && (
            <View style={styles.card}>
              <View style={styles.cardTitleRow}>
                <View style={styles.cardTitleIcon}>
                  <MaterialCommunityIcons name="food-outline" size={18} color={COLORS.primary} />
                </View>
                <Text style={styles.cardTitle}>Food Details</Text>
              </View>

              {/* Photo upload */}
              <TouchableOpacity
                style={[styles.imgUpload, imageUri && styles.imgUploadFilled]}
                onPress={openImageOptions} activeOpacity={0.8}
              >
                {imageUri ? (
                  <>
                    <Image source={{ uri: imageUri }} style={styles.imgPreview} />
                    <View style={styles.imgEditBadge}>
                      <MaterialCommunityIcons name="pencil" size={13} color="#fff" />
                      <Text style={styles.imgEditText}>Change Photo</Text>
                    </View>
                  </>
                ) : (
                  <View style={styles.imgPlaceholder}>
                    <View style={styles.imgIconBg}>
                      <MaterialCommunityIcons name="camera-plus-outline" size={28} color={COLORS.primary} />
                    </View>
                    <Text style={styles.imgTitle}>Add Food Photo</Text>
                    <Text style={styles.imgSub}>Optional · Helps NGOs identify the food</Text>
                  </View>
                )}
              </TouchableOpacity>

              <Field label="Food Name" icon="food-outline" value={foodName} onChange={setFoodName}
                placeholder="e.g. Biryani, Rice & Dal" required />

              <Field label="Quantity" icon="weight-kilogram" value={quantity} onChange={setQuantity}
                placeholder="e.g. 10 kg or 20 pcs" keyboardType="default" required
                hint="Include unit — kg, litres, packets, pieces" />

              <Field label="Expiry / Best Before" icon="clock-alert-outline" value={expiry} onChange={setExpiry}
                placeholder="e.g. Today 6 PM" hint="Leave blank if unsure" />

              {/* Food type chips */}
              <View style={{ marginBottom: 8 }}>
                <Text style={fld.label}>Food Type</Text>
                <View style={styles.typeGrid}>
                  {FOOD_TYPES.map(t => (
                    <TypeChip
                      key={t.key} item={t}
                      selected={foodType === t.key}
                      onPress={() => setFoodType(foodType === t.key ? "" : t.key)}
                    />
                  ))}
                </View>
              </View>
            </View>
          )}

          {/* ══ STEP 1 — PICKUP DETAILS ══ */}
          {step === 1 && (
            <View style={styles.card}>
              <View style={styles.cardTitleRow}>
                <View style={[styles.cardTitleIcon, { backgroundColor: "#EAF5EF" }]}>
                  <MaterialCommunityIcons name="map-marker-outline" size={18} color={COLORS.success} />
                </View>
                <Text style={styles.cardTitle}>Pickup Details</Text>
              </View>

              {/* Location picker — tap to open map */}
              <View style={styles.locGroup}>
                <View style={styles.locLabelRow}>
                  <Text style={styles.locLabel}>
                    Pickup Location <Text style={{ color: "#EF4444" }}>*</Text>
                  </Text>
                  {locationCoords && <MaterialCommunityIcons name="check-circle" size={14} color={COLORS.success} />}
                </View>

                <TouchableOpacity
                  style={[styles.locBox, locationCoords && styles.locBoxFilled]}
                  onPress={openMapPicker}
                  activeOpacity={0.8}
                >
                  <View style={[styles.locIconWrap, { backgroundColor: locationCoords ? "#EAF5EF" : COLORS.primaryGlow }]}>
                    <MaterialCommunityIcons
                      name={locationCoords ? "map-marker-check" : "map-marker-plus-outline"}
                      size={22}
                      color={locationCoords ? COLORS.success : COLORS.primary}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    {locationCoords ? (
                      <>
                        <Text style={styles.locAddress} numberOfLines={2}>{location}</Text>
                        <Text style={styles.locCoords}>
                          {locationCoords.latitude.toFixed(4)}, {locationCoords.longitude.toFixed(4)}
                        </Text>
                      </>
                    ) : (
                      <>
                        <Text style={styles.locPlaceholder}>Set location on map</Text>
                        <Text style={styles.locSub}>Tap to pin your pickup address</Text>
                      </>
                    )}
                  </View>
                  <View style={[styles.locChevron, locationCoords && { backgroundColor: "#EAF5EF" }]}>
                    <MaterialCommunityIcons
                      name={locationCoords ? "pencil-outline" : "chevron-right"}
                      size={16}
                      color={locationCoords ? COLORS.success : COLORS.primary}
                    />
                  </View>
                </TouchableOpacity>
              </View>

              <Field label="Preferred Pickup Time" icon="calendar-clock" value={pickupTime} onChange={setPickupTime}
                placeholder="e.g. Today 4:00 – 6:00 PM"
                hint="NGO will confirm the final time" />

              <Field label="Note for NGO" icon="note-text-outline" value={note} onChange={setNote}
                placeholder="e.g. Ask for Ravi at the main gate, ground floor" multiline
                hint="Optional — any special instructions for pickup" />

              {/* Info tip */}
              <View style={styles.tipBanner}>
                <MaterialCommunityIcons name="lightbulb-outline" size={16} color="#F59E0B" />
                <Text style={styles.tipText}>
                  Make sure someone is available at the pickup address during the preferred time window.
                </Text>
              </View>
            </View>
          )}

          {/* ══ STEP 2 — REVIEW ══ */}
          {step === 2 && (
            <View>
              {/* Food photo preview */}
              {imageUri && (
                <Image source={{ uri: imageUri }} style={styles.reviewImg} />
              )}

              <View style={styles.card}>
                <View style={styles.cardTitleRow}>
                  <View style={[styles.cardTitleIcon, { backgroundColor: "#EBF2FF" }]}>
                    <MaterialCommunityIcons name="clipboard-check-outline" size={18} color="#2B7FFF" />
                  </View>
                  <Text style={styles.cardTitle}>Review & Confirm</Text>
                </View>

                <ReviewRow icon="food-outline" label="Food" value={foodName} color={COLORS.primary} />
                <ReviewRow icon="weight-kilogram" label="Quantity" value={quantity} color={COLORS.primary} />
                {foodType && <ReviewRow icon="tag-outline" label="Type" value={foodType} color="#7C3AED" />}
                {expiry && <ReviewRow icon="clock-outline" label="Expiry" value={expiry} color="#F59E0B" />}
                <ReviewRow icon="map-marker-outline" label="Location" value={location} color={COLORS.success} />
                {pickupTime && <ReviewRow icon="calendar-clock" label="Pickup" value={pickupTime} color={COLORS.success} />}
                {note && <ReviewRow icon="note-text-outline" label="Note" value={note} color={COLORS.grayText} />}
              </View>

              {/* Impact estimate */}
              <View style={styles.impactCard}>
                <MaterialCommunityIcons name="account-group-outline" size={22} color="#7C3AED" />
                <View style={{ flex: 1 }}>
                  <Text style={styles.impactTitle}>Estimated Impact</Text>
                  <Text style={styles.impactSub}>
                    {quantity
                      ? `~${Math.max(1, Math.round(parseFloat(quantity) * 2))} meals could be served from this donation`
                      : "Fill in quantity to see estimated meals"}
                  </Text>
                </View>
              </View>

              <Text style={styles.disclaimer}>
                By submitting, you confirm this food is safe to consume and pickup details are correct.
              </Text>
            </View>
          )}
        </Animated.View>
      </ScrollView>

      {/* ── BOTTOM ACTIONS ── */}
      <View style={styles.bottomBar}>
        {/* Progress bar */}
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressFill, { width: `${((step + 1) / STEPS.length) * 100}%` }]} />
        </View>

        <View style={styles.btnRow}>
          {step > 0 && (
            <TouchableOpacity style={styles.backBtnBottom} onPress={goBack} activeOpacity={0.8}>
              <MaterialCommunityIcons name="arrow-left" size={18} color={COLORS.primary} />
              <Text style={styles.backBtnText}>Back</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[
              styles.nextBtn,
              step < 2 && !(step === 0 ? canStep0 : canStep1) && styles.nextBtnDisabled,
              { flex: step > 0 ? 1 : undefined },
            ]}
            onPress={step < 2 ? goNext : handleSubmit}
            disabled={loading || (step === 0 && !canStep0) || (step === 1 && !canStep1)}
            activeOpacity={0.86}
          >
            {loading ? (
              <Text style={styles.nextBtnText}>Submitting…</Text>
            ) : step === 2 ? (
              <>
                <MaterialCommunityIcons name="send-check-outline" size={20} color="#fff" />
                <Text style={styles.nextBtnText}>Post Donation</Text>
              </>
            ) : (
              <>
                <Text style={styles.nextBtnText}>Continue</Text>
                <MaterialCommunityIcons name="arrow-right" size={20} color="#fff" />
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
      {/* ── MAP PICKER MODAL ── */}
      <Modal visible={showMap} animationType="slide" onRequestClose={() => setShowMap(false)}>
        <View style={{ flex: 1 }}>

          {/* Map header */}
          <View style={styles.mapHeader}>
            <TouchableOpacity style={styles.mapCloseBtn} onPress={() => setShowMap(false)}>
              <MaterialCommunityIcons name="arrow-left" size={20} color={COLORS.textDark} />
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
              <Text style={styles.mapHeaderTitle}>Set Pickup Location</Text>
              <Text style={styles.mapHeaderSub}>Tap anywhere on the map to drop a pin</Text>
            </View>
          </View>

          {/* Map */}
          <MapView
            ref={mapRef}
            style={{ flex: 1 }}
            provider={PROVIDER_GOOGLE}
            initialRegion={mapRegion}
            onPress={handleMapPress}
            showsUserLocation
            showsMyLocationButton={false}
            showsCompass={false}
          >
            {pinCoords && (
              <Marker coordinate={pinCoords} anchor={{ x: 0.5, y: 1 }}>
                <View style={styles.pinWrap}>
                  <View style={styles.pinBubble}>
                    <MaterialCommunityIcons name="map-marker" size={28} color={COLORS.primary} />
                  </View>
                  <View style={styles.pinShadow} />
                </View>
              </Marker>
            )}
          </MapView>

          {/* Instruction pill overlay */}
          {!pinCoords && (
            <View style={styles.mapHintPill}>
              <MaterialCommunityIcons name="gesture-tap" size={16} color="#fff" />
              <Text style={styles.mapHintText}>Tap on the map to place a pin</Text>
            </View>
          )}

          {/* Bottom confirm bar */}
          <View style={styles.mapBottomBar}>
            {pinCoords ? (
              <>
                <View style={styles.mapPinInfo}>
                  <View style={styles.mapPinIconWrap}>
                    <MaterialCommunityIcons name="map-marker-check" size={20} color={COLORS.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.mapPinLabel}>Pin placed</Text>
                    <Text style={styles.mapPinCoords}>
                      {pinCoords.latitude.toFixed(5)}, {pinCoords.longitude.toFixed(5)}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => setPinCoords(null)} style={styles.mapClearBtn}>
                    <MaterialCommunityIcons name="close" size={16} color="#EF4444" />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  style={[styles.mapConfirmBtn, geocoding && { opacity: 0.7 }]}
                  onPress={confirmMapLocation}
                  disabled={geocoding}
                  activeOpacity={0.86}
                >
                  {geocoding ? (
                    <>
                      <ActivityIndicator size="small" color="#fff" />
                      <Text style={styles.mapConfirmText}>Getting address…</Text>
                    </>
                  ) : (
                    <>
                      <MaterialCommunityIcons name="check-circle-outline" size={20} color="#fff" />
                      <Text style={styles.mapConfirmText}>Confirm Location</Text>
                    </>
                  )}
                </TouchableOpacity>
              </>
            ) : (
              <View style={styles.mapNoPin}>
                <MaterialCommunityIcons name="map-marker-off-outline" size={20} color={COLORS.grayText} />
                <Text style={styles.mapNoPinText}>No pin placed yet — tap the map above</Text>
              </View>
            )}
          </View>
        </View>
      </Modal>

    </KeyboardAvoidingView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F5F0EB" },
  content: { paddingHorizontal: 20, paddingTop: 4, paddingBottom: 20 },

  // Header
  header: { backgroundColor: COLORS.primary, paddingTop: Platform.OS === "ios" ? 52 : 38, paddingHorizontal: 20, paddingBottom: 20, overflow: "hidden", shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.28, shadowRadius: 16, elevation: 10 },
  headerBlob: { position: "absolute", width: 200, height: 200, borderRadius: 100, backgroundColor: "rgba(255,255,255,0.07)", top: -60, right: -40 },
  headerBlob2: { position: "absolute", width: 100, height: 100, borderRadius: 50, backgroundColor: "rgba(0,0,0,0.07)", bottom: -30, left: 60 },
  headerTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  headerCenter: { alignItems: "center" },
  backBtn: { width: 40, height: 40, borderRadius: 13, backgroundColor: "rgba(255,255,255,0.18)", justifyContent: "center", alignItems: "center" },
  headerTitle: { fontSize: 18, fontWeight: "800", color: "#fff", letterSpacing: -0.2 },
  headerSub: { fontSize: 11, color: "rgba(255,255,255,0.6)", marginTop: 2 },

  // Step bar
  stepBarWrap: { backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#F0F0F0" },

  // Card
  card: { backgroundColor: "#fff", borderRadius: 22, padding: 20, marginBottom: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.07, shadowRadius: 12, elevation: 3 },
  cardTitleRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 20, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: "#F5F5F8" },
  cardTitleIcon: { width: 36, height: 36, borderRadius: 11, backgroundColor: COLORS.primaryGlow, justifyContent: "center", alignItems: "center" },
  cardTitle: { fontSize: 15, fontWeight: "800", color: COLORS.textDark, letterSpacing: -0.2 },

  // Image
  imgUpload: { borderRadius: 16, borderWidth: 1.5, borderStyle: "dashed", borderColor: COLORS.primary + "50", overflow: "hidden", marginBottom: 20, backgroundColor: "#FAFAFA" },
  imgUploadFilled: { borderStyle: "solid", borderColor: COLORS.primary },
  imgPreview: { width: "100%", height: 172 },
  imgEditBadge: { position: "absolute", bottom: 10, right: 10, flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: "rgba(0,0,0,0.6)", paddingVertical: 6, paddingHorizontal: 12, borderRadius: 9999 },
  imgEditText: { color: "#fff", fontSize: 12, fontWeight: "700" },
  imgPlaceholder: { alignItems: "center", gap: 6, paddingVertical: 22 },
  imgIconBg: { width: 56, height: 56, borderRadius: 18, backgroundColor: COLORS.primaryGlow, justifyContent: "center", alignItems: "center", marginBottom: 4 },
  imgTitle: { fontSize: 14, fontWeight: "700", color: COLORS.textDark },
  imgSub: { fontSize: 12, color: COLORS.grayText },

  // Food type grid
  typeGrid: { flexDirection: "row", flexWrap: "wrap", gap: 9, marginTop: 8 },

  // Tip banner
  tipBanner: { flexDirection: "row", alignItems: "flex-start", gap: 10, backgroundColor: "#FFF8EB", borderRadius: 14, padding: 14, borderWidth: 1, borderColor: "#F59E0B30" },
  tipText: { flex: 1, fontSize: 12, color: "#92400E", lineHeight: 18, fontWeight: "500" },

  // Review
  reviewImg: { width: "100%", height: 180, borderRadius: 18, marginBottom: 14, backgroundColor: "#F0F0F0" },
  impactCard: { backgroundColor: "#F3EEFF", borderRadius: 16, padding: 16, flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 14, borderWidth: 1, borderColor: "#7C3AED20" },
  impactTitle: { fontSize: 14, fontWeight: "800", color: "#5B21B6", marginBottom: 3 },
  impactSub: { fontSize: 12, color: "#7C3AED", lineHeight: 17 },
  disclaimer: { fontSize: 12, color: COLORS.grayText, textAlign: "center", lineHeight: 18 },

  // Location picker
  locGroup: { marginBottom: 18 },
  locLabelRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 7 },
  locLabel: { fontSize: 12, fontWeight: "700", color: COLORS.grayText, textTransform: "uppercase", letterSpacing: 0.4 },
  locBox: { flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: "#F7F7FA", borderRadius: 16, padding: 14, borderWidth: 1.5, borderColor: "transparent" },
  locBoxFilled: { backgroundColor: "#F0FFF4", borderColor: COLORS.success + "40" },
  locIconWrap: { width: 46, height: 46, borderRadius: 14, justifyContent: "center", alignItems: "center" },
  locPlaceholder: { fontSize: 15, fontWeight: "700", color: COLORS.textDark, marginBottom: 2 },
  locSub: { fontSize: 12, color: COLORS.grayText },
  locAddress: { fontSize: 14, fontWeight: "700", color: COLORS.textDark, marginBottom: 2, lineHeight: 20 },
  locCoords: { fontSize: 11, color: COLORS.success, fontWeight: "600" },
  locChevron: { width: 32, height: 32, borderRadius: 10, backgroundColor: COLORS.primaryGlow, justifyContent: "center", alignItems: "center" },

  // Map modal
  mapHeader: { flexDirection: "row", alignItems: "center", gap: 12, paddingTop: Platform.OS === "ios" ? 54 : 40, paddingHorizontal: 18, paddingBottom: 14, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#F0F0F0" },
  mapCloseBtn: { width: 40, height: 40, borderRadius: 13, backgroundColor: "#F5F5F8", justifyContent: "center", alignItems: "center" },
  mapHeaderTitle: { fontSize: 16, fontWeight: "800", color: COLORS.textDark },
  mapHeaderSub: { fontSize: 12, color: COLORS.grayText, marginTop: 2 },

  mapHintPill: { position: "absolute", top: 130, alignSelf: "center", flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "rgba(0,0,0,0.7)", paddingVertical: 10, paddingHorizontal: 18, borderRadius: 9999 },
  mapHintText: { fontSize: 13, fontWeight: "700", color: "#fff" },

  pinWrap: { alignItems: "center" },
  pinBubble: { backgroundColor: "#fff", borderRadius: 22, padding: 4, shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8, elevation: 6 },
  pinShadow: { width: 10, height: 5, borderRadius: 5, backgroundColor: "rgba(0,0,0,0.2)", marginTop: -2 },

  mapBottomBar: { backgroundColor: "#fff", paddingHorizontal: 20, paddingTop: 16, paddingBottom: Platform.OS === "ios" ? 36 : 20, borderTopWidth: 1, borderTopColor: "#F0F0F0", gap: 12 },
  mapPinInfo: { flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: COLORS.primaryGlow, borderRadius: 14, padding: 12 },
  mapPinIconWrap: { width: 38, height: 38, borderRadius: 11, backgroundColor: "#fff", justifyContent: "center", alignItems: "center" },
  mapPinLabel: { fontSize: 13, fontWeight: "700", color: COLORS.textDark, marginBottom: 2 },
  mapPinCoords: { fontSize: 11, color: COLORS.primary, fontWeight: "600" },
  mapClearBtn: { width: 32, height: 32, borderRadius: 10, backgroundColor: "#FEF2F2", justifyContent: "center", alignItems: "center" },
  mapConfirmBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, backgroundColor: COLORS.primary, paddingVertical: 16, borderRadius: 16, shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.28, shadowRadius: 14, elevation: 6 },
  mapConfirmText: { fontSize: 15, fontWeight: "800", color: "#fff" },
  mapNoPin: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, paddingVertical: 16, borderRadius: 14, backgroundColor: "#F5F5F8" },
  mapNoPinText: { fontSize: 13, fontWeight: "600", color: COLORS.grayText },

  // Bottom bar
  bottomBar: { backgroundColor: "#fff", borderTopWidth: 1, borderTopColor: "#F0F0F0", paddingHorizontal: 20, paddingTop: 12, paddingBottom: Platform.OS === "ios" ? 32 : 18 },
  progressTrack: { height: 3, backgroundColor: "#F0F0F5", borderRadius: 2, marginBottom: 14, overflow: "hidden" },
  progressFill: { height: "100%", backgroundColor: COLORS.primary, borderRadius: 2 },
  btnRow: { flexDirection: "row", gap: 12 },
  backBtnBottom: { flexDirection: "row", alignItems: "center", gap: 6, paddingVertical: 15, paddingHorizontal: 18, borderRadius: 16, backgroundColor: COLORS.primaryGlow, borderWidth: 1.5, borderColor: COLORS.primary + "30" },
  backBtnText: { fontSize: 14, fontWeight: "700", color: COLORS.primary },
  nextBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, paddingVertical: 16, borderRadius: 16, backgroundColor: COLORS.primary, shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.28, shadowRadius: 14, elevation: 6 },
  nextBtnDisabled: { backgroundColor: "#D1D5DB", shadowOpacity: 0, elevation: 0 },
  nextBtnText: { fontSize: 15, fontWeight: "800", color: "#fff", letterSpacing: 0.2 },
});