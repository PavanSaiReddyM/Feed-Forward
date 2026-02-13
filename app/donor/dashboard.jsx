import { StyleSheet, Text, View, ScrollView } from "react-native";
import { COLORS } from "../../_constants/colors";

export default function Dashboard() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome, Donor 👋</Text>
        <Text style={styles.subtitle}>Your contribution matters</Text>
      </View>

      <View style={styles.stats}>
        <StatCard title="Food Donated" value="125 kg" />
        <StatCard title="Active Donations" value="3" />
        <StatCard title="Completed" value="42" />
      </View>
    </ScrollView>
  );
}

const StatCard = ({ title, value }) => (
  <View style={styles.card}>
    <Text style={styles.value}>{value}</Text>
    <Text style={styles.cardTitle}>{title}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.cream },
  header: { padding: 24, paddingTop: 60 },
  title: { fontSize: 26, fontWeight: "700" },
  subtitle: { opacity: 0.6, marginTop: 6 },
  stats: { paddingHorizontal: 16, gap: 12 },
  card: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
  },
  value: { fontSize: 22, fontWeight: "700", color: COLORS.primary },
  cardTitle: { fontSize: 14, opacity: 0.6 },
});
