import { useRouter } from 'expo-router';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { useBaseline } from '@/features/onboarding/useBaseline';
import { colors, fontSize, space } from '@/shared/lib/theme';

export default function PracticeScreen() {
  const router = useRouter();
  const { baseline, loading } = useBaseline();

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator
          accessibilityLabel="Loading practice"
          color={colors.accentPrimary}
          testID="practice-loading"
        />
      </View>
    );
  }

  if (baseline === null && !loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Get your baseline</Text>
        <Text style={styles.subtitle}>
          Take a 10-minute self-assessment to create your baseline and power progress tracking over time.
        </Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push('/onboarding')}
          style={styles.button}
        >
          <Text style={styles.buttonLabel}>Start Onboarding</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Practice</Text>
      <Text style={styles.subtitle}>Session runner coming soon.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgBase,
    alignItems: 'center',
    justifyContent: 'center',
    padding: space.xl,
  },
  title: {
    color: colors.textPrimary,
    fontSize: fontSize.xl,
    fontWeight: '600',
  },
  subtitle: {
    color: colors.textSecondary,
    marginTop: space.sm,
    textAlign: 'center',
  },
  button: {
    backgroundColor: colors.accentPrimary,
    borderRadius: 9999,
    marginTop: space.xl,
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
  },
  buttonLabel: {
    color: colors.accentOn,
    fontWeight: '700',
  },
});
