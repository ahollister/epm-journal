import { useRouter } from 'expo-router';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { useBaseline } from '@/features/onboarding/useBaseline';
import { SkillWheelChart } from '@/shared/components/skill-wheel/SkillWheelChart';
import { colors, fontSize, space } from '@/shared/lib/theme';

export default function ProgressScreen() {
  const router = useRouter();
  const { baseline, loading } = useBaseline();

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator
          accessibilityLabel="Loading progress"
          color={colors.accentPrimary}
          testID="progress-loading"
        />
      </View>
    );
  }

  if (baseline === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Progress</Text>
        <Text style={styles.subtitle}>Complete onboarding to see your skill wheel.</Text>
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
    <View style={styles.wheelContainer}>
      <Text style={styles.title}>Progress</Text>
      <SkillWheelChart characteristics={baseline.characteristics} interactive={false} />
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
  wheelContainer: {
    flex: 1,
    backgroundColor: colors.bgBase,
    alignItems: 'center',
    justifyContent: 'center',
    padding: space.base,
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
