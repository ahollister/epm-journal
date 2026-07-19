import { StyleSheet, Text, View } from 'react-native';

import { STAGES } from '@/domain/onboarding/stages';
import { useOnboardingStore } from '@/features/onboarding/store';
import { colors, fontSize, space } from '@/shared/lib/theme';

export function ProgressChrome() {
  const stage = useOnboardingStore((state) => state.stage);
  const stageNumber = Math.max(1, STAGES.indexOf(stage) + 1);
  const progress = (stageNumber - 1) / (STAGES.length - 2);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>ONBOARDING</Text>
      <Text style={styles.count}>Step {stageNumber - 1} of 5</Text>
      <View accessibilityRole="progressbar" style={styles.track}>
        <View style={[styles.fill, { width: `${Math.min(1, progress) * 100}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.bgBase,
    paddingHorizontal: space.xl,
    paddingTop: space.lg,
  },
  label: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  count: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    marginTop: space.xs,
  },
  track: {
    backgroundColor: colors.bgRaised,
    borderRadius: 9999,
    height: 4,
    marginTop: space.md,
    overflow: 'hidden',
  },
  fill: {
    backgroundColor: colors.accentPrimary,
    height: '100%',
  },
});
