import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useOnboardingStore } from '@/features/onboarding/store';
import { colors, fontSize, space } from '@/shared/lib/theme';

export function CompletionScreen() {
  const router = useRouter();
  const focusAreas = useOnboardingStore((state) => state.focusAreas);
  const characteristics = useOnboardingStore((state) => state.characteristics);

  const focusAreaNames = focusAreas
    .map(
      (focusAreaId) =>
        characteristics.find((characteristic) => characteristic.id === focusAreaId)
          ?.name,
    )
    .filter((name): name is string => name !== undefined);

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Your baseline is saved</Text>
      <Text style={styles.description}>
        Your starting point is ready. Let’s make your next practice count.
      </Text>

      {focusAreaNames.length > 0 ? (
        <Text style={styles.focus}>
          Your focus for your first cycle: {focusAreaNames.join(', ')}
        </Text>
      ) : null}

      <Pressable
        accessibilityRole="button"
        onPress={() => router.replace('/(tabs)')}
        style={styles.primaryButton}
      >
        <Text style={styles.primaryButtonLabel}>Start your first session</Text>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        onPress={() => router.replace('/(tabs)/progress')}
        style={styles.secondaryButton}
      >
        <Text style={styles.secondaryButtonLabel}>Explore your Progress</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bgBase,
    padding: space.xl,
    justifyContent: 'center',
  },
  title: {
    color: colors.textPrimary,
    fontSize: fontSize.xl,
    fontWeight: '700',
  },
  description: {
    color: colors.textSecondary,
    fontSize: fontSize.md,
    lineHeight: 25,
    marginTop: space.md,
  },
  focus: {
    color: colors.textPrimary,
    fontSize: fontSize.base,
    lineHeight: 23,
    marginTop: space.xl,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: colors.accentPrimary,
    borderRadius: 9999,
    marginTop: space.xxl,
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
  },
  primaryButtonLabel: {
    color: colors.accentOn,
    fontSize: fontSize.base,
    fontWeight: '700',
  },
  secondaryButton: {
    alignItems: 'center',
    borderColor: colors.borderStrong,
    borderRadius: 9999,
    borderWidth: 1,
    marginTop: space.md,
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
  },
  secondaryButtonLabel: {
    color: colors.textPrimary,
    fontSize: fontSize.base,
    fontWeight: '600',
  },
});

