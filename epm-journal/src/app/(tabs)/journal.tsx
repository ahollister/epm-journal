import { StyleSheet, Text, View } from "react-native";

export default function JournalScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Practice Journal</Text>
      <Text style={styles.subtitle}>
        Review your practice recordings and session notes.
      </Text>
      <Text style={styles.placeholder}>
        🚧 Journal entries coming soon 🚧
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 32,
  },
  placeholder: {
    fontSize: 14,
    color: "#9CA3AF",
    fontStyle: "italic",
  },
});
