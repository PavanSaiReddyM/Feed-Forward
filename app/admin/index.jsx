import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Modal,
  FlatList,
  Animated,
  Easing,
  Alert,
} from "react-native";
import { useState, useRef, useEffect } from "react";
import { getAdminDashboard } from "../services/api";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../../_constants/colors";

/* ---------- FALLBACK DATA ---------- */
const FALLBACK = {
  stats: {},
  topDonors: [],
  topNGOs: [],
  activity: [],
  notifications: [],
};

/* ---------- MAIN COMPONENT ---------- */
export default function AdminDashboard() {
  const router = useRouter();

  const [showNotif, setShowNotif] = useState(false);
  const slideAnim = useRef(new Animated.Value(400)).current;

  const [dashboard, setDashboard] = useState(FALLBACK);
  const [loading, setLoading] = useState(true);
  const [notifs, setNotifs] = useState([]);

  /* ---------- FETCH DATA ---------- */
  useEffect(() => {
    getAdminDashboard()
      .then((data) => {
        const safeData = data || FALLBACK;
        setDashboard(safeData);
        setNotifs(safeData.notifications || []);
      })
      .catch((err) => {
        console.log("Dashboard Error:", err);
        Alert.alert("Error", "Failed to load dashboard");
      })
      .finally(() => setLoading(false));
  }, []);

  /* ---------- NOTIFICATIONS ---------- */
  const openNotifs = () => {
    setShowNotif(true);
    Animated.spring(slideAnim, {
      toValue: 0,
      tension: 65,
      friction: 11,
      useNativeDriver: true,
    }).start();
  };

  const closeNotifs = () => {
    Animated.timing(slideAnim, {
      toValue: 400,
      duration: 250,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(() => setShowNotif(false));
  };

  const unreadCount = notifs.length;

  /* ---------- LOADING ---------- */
  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );
  }

  /* ---------- DATA ---------- */
  const stats = dashboard?.stats || {};
  const topDonors = dashboard?.topDonors || [];
  const topNGOs = dashboard?.topNGOs || [];
  const activity = dashboard?.activity || [];

  const KPI = [
    {
      id: "meals",
      label: "Meals Saved",
      value: stats.totalMeals || 0,
      icon: "food-variant",
      color: "#FF6B2B",
      bg: "#FFF0EB",
    },
    {
      id: "donors",
      label: "Active Donors",
      value: stats.totalDonors || 0,
      icon: "account-heart",
      color: "#2B7FFF",
      bg: "#EBF2FF",
    },
    {
      id: "ngos",
      label: "Verified NGOs",
      value: stats.totalNGOs || 0,
      icon: "domain",
      color: "#2D6A4F",
      bg: "#EAF5EF",
    },
    {
      id: "pending",
      label: "Pending Review",
      value: stats.pending || 0,
      icon: "clock-alert-outline",
      color: "#F59E0B",
      bg: "#FFF8EB",
    },
  ];

  /* ---------- UI ---------- */
  return (
    <View style={styles.root}>
      <ScrollView style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.title}>Admin Dashboard</Text>

          <TouchableOpacity onPress={openNotifs}>
            <MaterialCommunityIcons
              name="bell-outline"
              size={24}
              color={COLORS.textDark}
            />
            {unreadCount > 0 && <View style={styles.badge} />}
          </TouchableOpacity>
        </View>

        {/* KPI GRID */}
        <View style={styles.kpiGrid}>
          {KPI.map((k) => (
            <View key={k.id} style={[styles.kpiCard, { backgroundColor: k.bg }]}>
              <MaterialCommunityIcons
                name={k.icon}
                size={22}
                color={k.color}
              />
              <Text style={[styles.kpiValue, { color: k.color }]}>
                {k.value}
              </Text>
              <Text style={styles.kpiLabel}>{k.label}</Text>
            </View>
          ))}
        </View>

        {/* TOP DONORS */}
        <Text style={styles.sectionTitle}>Top Donors</Text>
        <FlatList
          data={topDonors}
          keyExtractor={(item, i) => i.toString()}
          horizontal
          renderItem={({ item, index }) => (
            <View style={styles.card}>
              <Text>
                {index + 1}. {item.name}
              </Text>
              <Text>{item.meals} meals</Text>
            </View>
          )}
        />

        {/* TOP NGOs */}
        <Text style={styles.sectionTitle}>Top NGOs</Text>
        <FlatList
          data={topNGOs}
          keyExtractor={(item, i) => i.toString()}
          horizontal
          renderItem={({ item, index }) => (
            <View style={styles.card}>
              <Text>
                {index + 1}. {item.name}
              </Text>
              <Text>{item.pickups} pickups</Text>
            </View>
          )}
        />

        {/* ACTIVITY */}
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <FlatList
          data={activity}
          keyExtractor={(item, i) => i.toString()}
          horizontal
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text>{item.foodName || item.title}</Text>
              <Text style={{ color: "gray" }}>{item.updatedAt}</Text>
            </View>
          )}
        />

        <View style={{ height: 50 }} />
      </ScrollView>

      {/* NOTIFICATIONS */}
      <Modal visible={showNotif} transparent>
        <TouchableOpacity style={styles.overlay} onPress={closeNotifs} />

        <Animated.View
          style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}
        >
          <Text style={styles.sheetTitle}>Notifications</Text>

          <ScrollView>
            {notifs.map((n, i) => (
              <View key={i} style={styles.notifItem}>
                <Text>{n.title || n.msg}</Text>
                <Text style={{ color: "gray" }}>{n.createdAt}</Text>
              </View>
            ))}
          </ScrollView>
        </Animated.View>
      </Modal>
    </View>
  );
}

/* ---------- STYLES ---------- */
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F5F0EB" },
  container: { padding: 16 },

  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  title: { fontSize: 22, fontWeight: "bold" },

  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "red",
  },

  kpiGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 16,
  },

  kpiCard: {
    width: "47%",
    padding: 16,
    borderRadius: 12,
  },

  kpiValue: {
    fontSize: 20,
    fontWeight: "bold",
  },

  kpiLabel: {
    fontSize: 12,
    color: "#555",
  },

  sectionTitle: {
    marginTop: 20,
    fontWeight: "bold",
  },

  card: {
    marginRight: 12,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },

  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
  },

  sheetTitle: {
    fontWeight: "bold",
    marginBottom: 10,
  },

  notifItem: {
    marginBottom: 10,
  },
});