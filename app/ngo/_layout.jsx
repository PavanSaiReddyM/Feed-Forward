import { Tabs } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { View, Text, StyleSheet, Platform } from "react-native";
import { COLORS } from "../../_constants/colors";

// Key fix: tabBarIcon gets a fixed container height from expo-router.
// We must NOT use a custom View wrapper for labels here.
// Instead, use tabBarShowLabel: true with tabBarLabel for native labels,
// and only use tabBarIcon for the icon itself.

export default function NgoLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarHideOnKeyboard: true,
                tabBarActiveTintColor: COLORS.primary,
                tabBarInactiveTintColor: COLORS.grayText,
                tabBarLabelStyle: styles.label,
                tabBarIconStyle: styles.icon,
                tabBarStyle: styles.tabBar,
                tabBarItemStyle: styles.tabItem,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    tabBarLabel: "Home",
                    tabBarIcon: ({ color, focused }) => (
                        <View style={[styles.iconBg, focused && styles.iconBgActive]}>
                            <MaterialCommunityIcons
                                name="view-dashboard-outline"
                                size={22}
                                color={color}
                            />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="available"
                options={{
                    tabBarLabel: "Browse",
                    tabBarIcon: ({ color, focused }) => (
                        <View style={[styles.iconBg, focused && styles.iconBgActive]}>
                            <MaterialCommunityIcons
                                name="food-fork-drink"
                                size={22}
                                color={color}
                            />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="requests"
                options={{
                    tabBarLabel: "Requests",
                    tabBarIcon: ({ color, focused }) => (
                        <View style={[styles.iconBg, focused && styles.iconBgActive]}>
                            <MaterialCommunityIcons
                                name="clipboard-list-outline"
                                size={22}
                                color={color}
                            />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="history"
                options={{
                    tabBarLabel: "History",
                    tabBarIcon: ({ color, focused }) => (
                        <View style={[styles.iconBg, focused && styles.iconBgActive]}>
                            <MaterialCommunityIcons
                                name="history"
                                size={22}
                                color={color}
                            />
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
                            <MaterialCommunityIcons
                                name="account-circle-outline"
                                size={22}
                                color={color}
                            />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="pickup-map"
                options={{ href: null }}
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

    tabItem: {
        paddingTop: 0,
    },

    // Native label style — this is guaranteed to show
    label: {
        fontSize: 10,
        fontWeight: "600",
        marginTop: -2,
        marginBottom: 0,
        includeFontPadding: false,
    },

    // Just controls vertical alignment of icon
    icon: {
        marginBottom: -2,
    },

    // Subtle pill behind active icon
    iconBg: {
        width: 38,
        height: 28,
        borderRadius: 9,
        justifyContent: "center",
        alignItems: "center",
    },
    iconBgActive: {
        backgroundColor: COLORS.primaryGlow,
    },
});