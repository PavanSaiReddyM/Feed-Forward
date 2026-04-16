import {
  StyleSheet, Text, View, FlatList,
  TouchableOpacity, Animated, Platform, Alert,
} from "react-native";
import { useRef, useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../../_constants/colors";
import { getNgoRequests } from "../services/api";

/* ---------- CONFIG ---------- */

const STATUS_CFG = {
  Pending: { color: "#F59E0B", bg: "#FFF8EB", icon: "clock-outline" },
  Approved: { color: "#2B7FFF", bg: "#EBF2FF", icon: "check-circle-outline" },
  Collected: { color: "#2D6A4F", bg: "#EAF5EF", icon: "package-variant-closed" },
  Cancelled: { color: "#EF4444", bg: "#FEF2F2", icon: "close-circle-outline" },
};

const FILTERS = ["All", "Pending", "Approved", "Collected", "Cancelled"];

/* ---------- CARD ---------- */

function RequestCard({ item, index }) {
  const router = useRouter();
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 300, useNativeDriver: true }).start();
  }, []);

  const sc = STATUS_CFG[item.status] || STATUS_CFG.Pending;

  return (
    <Animated.View style={[styles.card, { opacity: fade }]}>

      <Text style={styles.food}>{item.food}</Text>
      <Text>{item.donor}</Text>

      <View style={[styles.status, { backgroundColor: sc.bg }]}>
        <Text style={{ color: sc.color }}>{item.status}</Text>
      </View>

    </Animated.View>
  );
}

/* ---------- MAIN COMPONENT ---------- */

export default function NGORequests() {

  const [filter, setFilter] = useState("All");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNgoRequests()
      .then(data => setRequests(data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const mappedRequests = requests.map(r => ({
    id: r._id,
    food: r.foodId?.name || "Food",
    donor: r.foodId?.donor || "Donor",
    status: r.status?.charAt(0).toUpperCase() + r.status?.slice(1),
  }));

  const filtered = filter === "All"
    ? mappedRequests
    : mappedRequests.filter(r => r.status === filter);

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>

      {/* HEADER */}
      <Text style={styles.title}>My Requests</Text>

      {/* FILTER */}
      <FlatList
        data={FILTERS}
        horizontal
        keyExtractor={i => i}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => setFilter(item)}>
            <Text style={styles.filter}>{item}</Text>
          </TouchableOpacity>
        )}
      />

      {/* LIST */}
      <FlatList
        data={filtered}
        keyExtractor={r => r.id}
        renderItem={({ item, index }) => (
          <RequestCard item={item} index={index} />
        )}
      />

    </View>
  );
}

/* ---------- STYLES ---------- */

const styles = StyleSheet.create({
  root: { flex: 1, padding: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },

  filter: {
    marginRight: 10,
    padding: 8,
    backgroundColor: "#eee",
    borderRadius: 10,
  },

  card: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 10,
  },

  food: { fontSize: 16, fontWeight: "bold" },

  status: {
    marginTop: 10,
    padding: 6,
    borderRadius: 6,
  },
});