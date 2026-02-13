import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../../_constants/colors";

export default function Dashboard() {
  const StatCard = ({ icon, number, label, iconBg }) => (
    <View style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: iconBg }]}>
        <MaterialCommunityIcons name={icon} size={28} color="#fff" />
      </View>
      <Text style={styles.statNumber}>{number}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  const QuickAction = ({ icon, label, color }) => (
    <TouchableOpacity style={styles.actionButton}>
      <View style={[styles.actionIcon, { backgroundColor: color }]}>
        <MaterialCommunityIcons name={icon} size={24} color="#fff" />
      </View>
      <Text style={styles.actionLabel}>{label}</Text>
    </TouchableOpacity>
  );

  const ActivityItem = ({ icon, title, time, iconColor }) => (
    <View style={styles.activityItem}>
      <View style={[styles.activityIcon, { backgroundColor: iconColor + "20" }]}>
        <MaterialCommunityIcons name={icon} size={20} color={iconColor} />
      </View>
      <View style={styles.activityContent}>
        <Text style={styles.activityTitle}>{title}</Text>
        <Text style={styles.activityTime}>{time}</Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome, Donor 👋</Text>
          <Text style={styles.orgName}>Your Contribution</Text>
        </View>
        <TouchableOpacity style={styles.notificationBtn}>
          <MaterialCommunityIcons name="bell-outline" size={24} color={COLORS.textDark} />
          <View style={styles.notificationBadge} />
        </TouchableOpacity>
      </View>

      {/* STATS GRID */}
      <View style={styles.statsGrid}>
        <StatCard
          icon="food-turkey"
          number="125"
          label="Food (kg)"
          iconBg={COLORS.primary}
        />
        <StatCard
          icon="hand-heart"
          number="3"
          label="Active"
          iconBg={COLORS.success}
        />
        <StatCard
          icon="check-circle"
          number="42"
          label="Completed"
          iconBg={COLORS.accentBlue}
        />
        <StatCard
          icon="account-group"
          number="350"
          label="People Fed"
          iconBg={COLORS.warning}
        />
      </View>



      {/* RECENT DONATIONS */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Donations</Text>
        <View style={styles.activityCard}>
          <ActivityItem
            icon="check-circle"
            title="Donation Completed - 50kg Rice"
            time="2 days ago"
            iconColor={COLORS.success}
          />
          <ActivityItem
            icon="truck-delivery"
            title="Pickup Scheduled - Fresh Fruits"
            time="Today, 2:00 PM"
            iconColor={COLORS.accentBlue}
          />
          <ActivityItem
            icon="clock-outline"
            title="Request Pending - Bakery Items"
            time="1 hour ago"
            iconColor={COLORS.warning}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.peach,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  greeting: {
    fontSize: 16,
    color: COLORS.grayText,
    fontWeight: "500",
  },
  orgName: {
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.textDark,
    marginTop: 4,
  },
  notificationBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  notificationBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
    borderWidth: 2,
    borderColor: "#fff",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    gap: 12,
  },
  statCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    elevation: 3,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  statIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.textDark,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: COLORS.grayText,
    fontWeight: "600",
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textDark,
    marginBottom: 16,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  actionButton: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  actionLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.textDark,
    textAlign: "center",
  },
  activityCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    marginBottom: 20,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textDark,
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: COLORS.grayText,
    fontWeight: "500",
  },
});
