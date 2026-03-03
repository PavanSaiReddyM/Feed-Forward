


import { Tabs } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { View, Text, StyleSheet, Platform } from "react-native";
import { COLORS } from "../../_constants/colors";

function TabIcon({ name, color, focused, label }) {
    return (
        <View style={[styles.tabItem, focused && styles.tabItemActive]}>
            <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
                <MaterialCommunityIcons
                    name={name}
                    size={22}
                    color={focused ? COLORS.primary : COLORS.grayText}
                />
            </View>
            <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>
                {label}
            </Text>
        </View>
    );
}

export default function NgoLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: styles.tabBar,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    tabBarIcon: ({ color, focused }) => (
                        <TabIcon name="view-dashboard-outline" color={color} focused={focused} label="Home" />
                    ),
                }}
            />
            <Tabs.Screen
                name="available"
                options={{
                    tabBarIcon: ({ color, focused }) => (
                        <TabIcon name="food-fork-drink" color={color} focused={focused} label="Available" />
                    ),
                }}
            />
            <Tabs.Screen
                name="requests"
                options={{
                    tabBarIcon: ({ color, focused }) => (
                        <TabIcon name="clipboard-list-outline" color={color} focused={focused} label="Requests" />
                    ),
                }}
            />
            <Tabs.Screen
                name="history"
                options={{
                    tabBarIcon: ({ color, focused }) => (
                        <TabIcon name="history" color={color} focused={focused} label="History" />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    tabBarIcon: ({ color, focused }) => (
                        <TabIcon name="account-circle-outline" color={color} focused={focused} label="Profile" />
                    ),
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: Platform.OS === "ios" ? 84 : 68,
        paddingBottom: Platform.OS === "ios" ? 20 : 8,
        paddingTop: 8,
        paddingHorizontal: 8,
        backgroundColor: COLORS.white,
        borderTopWidth: 0,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 20,
    },
    tabItem: {
        alignItems: "center",
        justifyContent: "center",
        gap: 3,
        paddingTop: 2,
    },
    tabItemActive: {},
    iconWrap: {
        width: 40,
        height: 32,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    iconWrapActive: {
        backgroundColor: COLORS.primaryGlow,
    },
    tabLabel: {
        fontSize: 10,
        fontWeight: "600",
        color: COLORS.grayText,
    },
    tabLabelActive: {
        color: COLORS.primary,
        fontWeight: "800",
    },
});