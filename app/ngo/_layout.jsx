import { Tabs } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../../_constants/colors";

export default function NgoLayout() {
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
                name="available"
                options={{
                    title: "Available",
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons
                            name="food"
                            size={24}
                            color={color}
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="requests"
                options={{
                    title: "Requests",
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons
                            name="clipboard-list"
                            size={24}
                            color={color}
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="history"
                options={{
                    title: "History",
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons
                            name="history"
                            size={24}
                            color={color}
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons
                            name="account"
                            size={24}
                            color={color}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}
