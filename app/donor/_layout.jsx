import { Tabs } from "expo-router";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../_constants/colors";

export default function DonorLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: styles.tabBar,
      }}
    >
      {/* HOME */}
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />

      {/* ACTIVE */}
      <Tabs.Screen
        name="active-donations"
        options={{
          title: "Active",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="time-outline" size={size} color={color} />
          ),
        }}
      />

      {/* CENTER POST BUTTON */}
      <Tabs.Screen
        name="post-donation"
        options={{
          title: "",
          tabBarIcon: () => (
            <View style={styles.centerButton}>
              <Ionicons name="add" size={28} color="#fff" />
            </View>
          ),
        }}
      />

      {/* HISTORY */}
      <Tabs.Screen
        name="donation-history"
        options={{
          title: "History",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="refresh" size={size} color={color} />
          ),
        }}
      />

      {/* PROFILE */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 70,
    paddingBottom: 8,
  },
  centerButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30, // makes it float
  },
});
