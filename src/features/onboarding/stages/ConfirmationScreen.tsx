import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { detectFlatWheel } from '@/domain/onboarding/wheel';
import { useOnboardingStore } from '@/features/onboarding/store';
import { SkillWheelChart } from '@/shared/components/skill-wheel/SkillWheelChart';
import { colors, fontSize, radius, space } from '@/shared/lib/theme';

const FLAT_WHEEL_NUDGE =
  'Your scores are very close together. Every musician has relative strengths and weaknesses. Would you like to review your ratings?';

export function ConfirmationScreen() {
  const store = useOnboardingStore();
  const { isFlat } = detectFlatWheel(store.characteristics);

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      style={styles.screen}
    >
      <Text style={styles.eyebrow}>STAGE 5 · CONFIRMATION</Text>
      <Text style={styles.title}>Your skill wheel is ready</Text>
      <Text style={styles.description}>
        Tap any area of your wheel to revisit its rating, or continue when it
        feels right.
      </Text>

      <View style={styles.chartCard}>
        <SkillWheelChart
          characteristics={store.characteristics}
          interactive
          onWedgeTap={(id) => store.goToCharacteristicRating(id)}
        />
      </View>

      {isFlat ? (
        <View style={styles.nudgeCard}>
          <Text style={styles.nudgeCopy}>{FLAT_WHEEL_NUDGE}</Text>
          <View style={styles.actions}>
            <Pressable
              accessibilityRole="button"
              onPress={() => store.back()}
              style={({ pressed }) => [
                styles.secondaryButton,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.secondaryButtonLabel}>Review ratings</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={() => store.next()}
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.primaryButtonLabel}>Proceed anyway</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <Pressable
          accessibilityRole="button"
          onPress={() => store.next()}
          style={({ pressed }) => [
            styles.primaryButton,
            styles.continueButton,
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.primaryButtonLabel}>Continue</Text>
        </Pressable>
      )}
    </ScrollView>
  );
}

export default ConfirmationScreen;

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.bgBase,
    flex: 1,
  },
  content: {
    padding: space.xl,
    paddingBottom: space.xxxl,
  },
  eyebrow: {
    color: colors.accentPrimary,
    fontSize: fontSize.xs,
    fontWeight: '700',
    letterSpacing: 1.8,
  },
  title: {
    color: colors.textPrimary,
    fontSize: fontSize.xl,
    fontWeight: '700',
    lineHeight: 34,
    marginTop: space.sm,
  },
  description: {
    color: colors.textSecondary,
    fontSize: fontSize.md,
    lineHeight: 25,
    marginTop: space.md,
  },
  chartCard: {
    backgroundColor: colors.bgRaised,
    borderColor: colors.borderSubtle,
    borderRadius: radius.lg,
    borderWidth: 1,
    marginTop: space.xl,
    padding: space.md,
  },
  nudgeCard: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accentPrimary,
    borderRadius: radius.lg,
    borderWidth: 1,
    marginTop: space.xl,
    padding: space.lg,
  },
  nudgeCopy: {
    color: colors.textPrimary,
    fontSize: fontSize.base,
    lineHeight: 23,
  },
  actions: {
    gap: space.sm,
    marginTop: space.lg,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: colors.accentPrimary,
    borderRadius: radius.full,
    justifyContent: 'center',
    minHeight: 52,
    paddingHorizontal: space.lg,
  },
  continueButton: {
    marginTop: space.xl,
  },
  primaryButtonLabel: {
    color: colors.accentOn,
    fontSize: fontSize.base,
    fontWeight: '700',
  },
  secondaryButton: {
    alignItems: 'center',
    borderColor: colors.borderStrong,
    borderRadius: radius.full,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 52,
    paddingHorizontal: space.lg,
  },
  secondaryButtonLabel: {
    color: colors.textPrimary,
    fontSize: fontSize.base,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.75,
  },
});
