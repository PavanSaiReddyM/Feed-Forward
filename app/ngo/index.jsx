import {
  StyleSheet, Text, View, ScrollView, TouchableOpacity,
  Modal, Animated, Easing,
} from "react-native";
import { useState, useEffect, useRef } from "react";
import { getNgoDashboard } from "../services/api";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../../_constants/colors";

/* ---------- SMALL COMPONENTS ---------- */

function ActivityItem({ icon, title, time, color }) {
  return (
    <View style={styles.activityItem}>
      <View style={[styles.activityIcon, { backgroundColor: color + "20" }]}>
        <MaterialCommunityIcons name={icon} size={18} color={color} />
      </View>
      <View style={styles.activityContent}>
        <Text style={styles.activityTitle}>{title}</Text>
        <Text style={styles.activityTime}>{time}</Text>
      </View>
    </View>
  );
}

function NotificationItem({ title, msg, createdAt }) {
  return (
    <View style={styles.notifItem}>
      <View style={styles.notifContent}>
        <Text style={styles.notifTitle}>{title || "Notification"}</Text>
        <Text style={styles.notifMessage}>{msg}</Text>
        <Text style={styles.notifTime}>{createdAt}</Text>
      </View>
    </View>
  );
}

function StatCard({ icon, number, label, color }) {
  return (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={[styles.statIconWrap, { backgroundColor: color + "20" }]}>
        <MaterialCommunityIcons name={icon} size={20} color={color} />
      </View>
      <Text style={styles.statNumber}>{number}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

/* ---------- MAIN COMPONENT ---------- */

export default function NGO() {

  const [showNotifications, setShowNotifications] = useState(false);
  const slideAnim = useRef(new Animated.Value(400)).current;

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifs, setNotifs] = useState([]);

  useEffect(() => {
    getNgoDashboard()
      .then(data => {
        setDashboard(data || {});
        setNotifs(data?.notifications || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const openNotifs = () => {
    setShowNotifications(true);
    Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true }).start();
  };

  const closeNotifs = () => {
    Animated.timing(slideAnim, {
      toValue: 400,
      duration: 200,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(() => setShowNotifications(false));
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const stats = dashboard?.stats || {};
  const activity = dashboard?.activity || [];

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>

        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good morning 👋</Text>
            <Text style={styles.orgName}>NGO</Text>
          </View>

          <TouchableOpacity style={styles.notifBtn} onPress={openNotifs}>
            <MaterialCommunityIcons name="bell-outline" size={22} />
            <View style={styles.notifBadge} />
          </TouchableOpacity>
        </View>

        {/* STATS */}
        <View style={styles.statsGrid}>
          <StatCard icon="food-variant" number={stats.active || 0} label="Active" color="#FF6B2B" />
          <StatCard icon="check-circle" number={stats.completed || 0} label="Completed" color="#2D6A4F" />
          <StatCard icon="truck-delivery" number={stats.totalPickups || 0} label="Pickups" color="#2B7FFF" />
          <StatCard icon="account-group" number={stats.peopleFed || 0} label="People" color="#8B5CF6" />
        </View>

        {/* ACTIVITY */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityCard}>
            {activity.map((item, i) => (
              <ActivityItem
                key={i}
                icon="check-circle"
                title={item.foodName || "Activity"}
                time={item.updatedAt || ""}
                color="#2D6A4F"
              />
            ))}
          </View>
        </View>

      </ScrollView>

      {/* NOTIFICATIONS */}
      <Modal visible={showNotifications} transparent>
        <TouchableOpacity style={styles.modalOverlay} onPress={closeNotifs} />
        <Animated.View style={[styles.bottomSheet, { transform: [{ translateY: slideAnim }] }]}>
          <Text style={styles.sheetTitle}>Notifications</Text>

          <ScrollView>
            {notifs.map((n, i) => (
              <NotificationItem key={i} {...n} />
            ))}
          </ScrollView>
        </Animated.View>
      </Modal>

    </View>
  );
}

/* ---------- STYLES ---------- */

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  greeting: { color: "#777" },
  orgName: { fontSize: 22, fontWeight: "bold" },

  notifBtn: { padding: 10 },
  notifBadge: {
    position: "absolute", top: 6, right: 6,
    width: 8, height: 8, borderRadius: 4, backgroundColor: "red",
  },

  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  statCard: {
    width: "47%",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
  },
  statIconWrap: { marginBottom: 10 },
  statNumber: { fontSize: 20, fontWeight: "bold" },
  statLabel: { color: "#777" },

  section: { marginTop: 20 },
  sectionTitle: { fontWeight: "bold", marginBottom: 10 },

  activityCard: { backgroundColor: "#fff", borderRadius: 10 },
  activityItem: { flexDirection: "row", padding: 10 },
  activityIcon: { padding: 10, borderRadius: 10, marginRight: 10 },
  activityTitle: { fontWeight: "bold" },
  activityTime: { color: "#777" },

  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)" },
  bottomSheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  sheetTitle: { fontWeight: "bold", marginBottom: 10 },

  notifItem: { padding: 10 },
  notifTitle: { fontWeight: "bold" },
  notifMessage: { color: "#555" },
  notifTime: { fontSize: 12, color: "#999" },
});