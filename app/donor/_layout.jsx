import { Tabs } from "expo-router";
import { View, StyleSheet, Platform } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../../_constants/colors";

export default function DonorLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.grayText,
        tabBarLabelStyle: styles.label,
        tabBarStyle: styles.tabBar,
        tabBarItemStyle: styles.tabItem,
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconBg, focused && styles.iconBgActive]}>
              <MaterialCommunityIcons name="view-dashboard-outline" size={22} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="active-donations"
        options={{
          tabBarLabel: "Active",
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconBg, focused && styles.iconBgActive]}>
              <MaterialCommunityIcons name="clock-outline" size={22} color={color} />
            </View>
          ),
        }}
      />
      {/* CENTER FAB */}
      <Tabs.Screen
        name="post-donation"
        options={{
          tabBarLabel: "",
          tabBarIcon: () => (
            <View style={styles.fab}>
              <MaterialCommunityIcons name="plus" size={28} color="#fff" />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="donation-history"
        options={{
          tabBarLabel: "History",
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconBg, focused && styles.iconBgActive]}>
              <MaterialCommunityIcons name="history" size={22} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconBg, focused && styles.iconBgActive]}>
              <MaterialCommunityIcons name="account-circle-outline" size={22} color={color} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: Platform.OS === "ios" ? 85 : 65,
    paddingBottom: Platform.OS === "ios" ? 20 : 8,
    paddingTop: 6,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.08)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 14,
  },
  tabItem: { paddingTop: 0 },
  label: {
    fontSize: 10,
    fontWeight: "600",
    marginTop: -2,
    includeFontPadding: false,
  },
  iconBg: {
    width: 38, height: 28, borderRadius: 9,
    justifyContent: "center", alignItems: "center",
  },
  iconBgActive: {
    backgroundColor: COLORS.primaryGlow,
  },
  fab: {
    width: 54, height: 54,
    borderRadius: 27,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Platform.OS === "ios" ? 18 : 22,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
  },
});