import { StyleSheet, Text, View } from 'react-native';

import { STAGES } from '@/domain/onboarding/stages';
import { useOnboardingStore } from '@/features/onboarding/store';
import { colors, fontSize, space } from '@/shared/lib/theme';

export function ProgressChrome() {
  const stage = useOnboardingStore((state) => state.stage);
  const subStep = useOnboardingStore((state) => state.subStep);
  const characteristics = useOnboardingStore((state) => state.characteristics);

  if (stage === 'intro' || stage === 'complete') {
    return null;
  }

  const position = subStep + 1;
  const label =
    stage === 'threeLists'
      ? `List ${position} of 3`
      : stage === 'characteristics' || stage === 'rating'
        ? `Characteristic ${position} of ${characteristics.length}`
        : `Step ${STAGES.indexOf(stage) + 1} of 7`;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
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
    fontSize: fontSize.sm,
  },
});
