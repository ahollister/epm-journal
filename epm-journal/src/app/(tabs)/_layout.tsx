import { Tabs } from "expo-router";
import { Text } from "react-native";

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  return (
    <Text
      style={{
        fontSize: 11,
        fontWeight: focused ? "700" : "400",
        color: focused ? "#2563EB" : "#6B7280",
      }}
    >
      {label}
    </Text>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: "#F9FAFB" },
        headerTitleStyle: { fontWeight: "700", color: "#111827" },
        tabBarActiveTintColor: "#2563EB",
        tabBarInactiveTintColor: "#6B7280",
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopColor: "#E5E7EB",
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
      }}
    >
      <Tabs.Screen
        name="practice"
        options={{
          title: "Practice",
          headerTitle: "Practice Session",
          tabBarIcon: ({ focused }) => (
            <TabIcon label="🎯" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="journal"
        options={{
          title: "Journal",
          headerTitle: "Practice Journal",
          tabBarIcon: ({ focused }) => (
            <TabIcon label="📓" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: "Progress",
          headerTitle: "Your Progress",
          tabBarIcon: ({ focused }) => (
            <TabIcon label="📊" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
