

import { Tabs } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { View, Text, StyleSheet, Platform } from "react-native";
import { COLORS } from "../../_constants/colors";

function AdminTabIcon({ name, focused, label, badgeCount }) {
    return (
        <View style={styles.tabItem}>
            <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
                <MaterialCommunityIcons
                    name={name}
                    size={22}
                    color={focused ? COLORS.white : COLORS.grayText}
                />
                {badgeCount > 0 && (
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{badgeCount}</Text>
                    </View>
                )}
            </View>
            <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>
                {label}
            </Text>
        </View>
    );
}

export default function AdminLayout() {
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
                    tabBarIcon: ({ focused }) => (
                        <AdminTabIcon
                            name="view-dashboard-outline"
                            focused={focused}
                            label="Overview"
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="complaints"
                options={{
                    tabBarIcon: ({ focused }) => (
                        <AdminTabIcon
                            name="alert-circle-outline"
                            focused={focused}
                            label="Complaints"
                            badgeCount={2}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="ngos"
                options={{
                    tabBarIcon: ({ focused }) => (
                        <AdminTabIcon
                            name="account-check-outline"
                            focused={focused}
                            label="NGOs"
                            badgeCount={3}
                        />
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
        paddingHorizontal: 16,
        backgroundColor: COLORS.adminDark,
        borderTopWidth: 0,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        shadowColor: COLORS.adminDark,
        shadowOffset: { width: 0, height: -6 },
        shadowOpacity: 0.25,
        shadowRadius: 20,
        elevation: 24,
    },
    tabItem: {
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
        paddingTop: 2,
    },
    iconWrap: {
        width: 44,
        height: 34,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
    },
    iconWrapActive: {
        backgroundColor: COLORS.primary,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 6,
    },
    badge: {
        position: "absolute",
        top: -2,
        right: -2,
        backgroundColor: COLORS.error,
        borderRadius: 9999,
        minWidth: 16,
        height: 16,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 3,
        borderWidth: 1.5,
        borderColor: COLORS.adminDark,
    },
    badgeText: {
        fontSize: 9,
        fontWeight: "800",
        color: COLORS.white,
    },
    tabLabel: {
        fontSize: 10,
        fontWeight: "600",
        color: "rgba(255,255,255,0.4)",
    },
    tabLabelActive: {
        color: COLORS.primary,
        fontWeight: "800",
    },
});