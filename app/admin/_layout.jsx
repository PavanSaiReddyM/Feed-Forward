import { Tabs } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../../_constants/colors";

export default function AdminLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: COLORS.primary,
                tabBarStyle: {
                    height: 65,
                    paddingBottom: 8,
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons
                            name="view-dashboard"
                            size={24}
                            color={color}
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="complaints"
                options={{
                    title: "Complaints",
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons
                            name="alert-circle-outline"
                            size={24}
                            color={color}
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="ngos"
                options={{
                    title: "NGOs",
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons
                            name="account-check-outline"
                            size={24}
                            color={color}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}
