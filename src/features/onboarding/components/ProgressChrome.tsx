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

  const stageIndex = STAGES.indexOf(stage);
  const position = subStep + 1;

  let label = '';

  switch (stage) {
    case 'threeLists':
      label = `List ${position} of 3`;
      break;
    case 'characteristics':
    case 'rating':
      label = `Characteristic ${position} of ${characteristics.length}`;
      break;
    case 'confirm':
    case 'focus':
      label = `Step ${stageIndex + 1} of 7`;
      break;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: space.xl,
    paddingTop: space.md,
    paddingBottom: space.sm,
  },
  label: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
  },
});
