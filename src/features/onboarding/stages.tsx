import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useOnboardingStore } from '@/features/onboarding/store';
import { colors, fontSize, space } from '@/shared/lib/theme';
import { CompletionScreen } from './stages/CompletionScreen';
import { ImprovementsList } from './stages/ImprovementsList';
import { WhoList } from './stages/WhoList';
import { WhyList } from './stages/WhyList';

export { WhoList } from './stages/WhoList';
export { WhyList } from './stages/WhyList';
export { ImprovementsList } from './stages/ImprovementsList';

interface StageScreenProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  error?: unknown;
}

function errorMessage(error: unknown): string {
  if (error instanceof Error && error.message.length > 0) {
    return `Couldn’t save your baseline: ${error.message}`;
  }

  return 'Couldn’t save your baseline. Please try again.';
}

function StageScreen({
  title,
  description,
  actionLabel = 'Continue',
  onAction,
  error,
}: StageScreenProps) {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {error ? (
        <Text accessibilityRole="alert" style={styles.error}>
          {errorMessage(error)}
        </Text>
      ) : null}
      {onAction ? (
        <Pressable accessibilityRole="button" onPress={onAction} style={styles.button}>
          <Text style={styles.buttonLabel}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function Characteristics() {
  const next = useOnboardingStore((state) => state.next);
  return <StageScreen title="Your characteristics" description="Turn your lists into the skills your wheel will track." onAction={next} />;
}

export function Rating() {
  const next = useOnboardingStore((state) => state.next);
  return <StageScreen title="Rate your skills" description="Give each characteristic an honest starting score." onAction={next} />;
}

export function Confirm() {
  const next = useOnboardingStore((state) => state.next);
  const complete = useOnboardingStore((state) => state.complete);
  const error = useOnboardingStore((state) => state.error);
  const onAction = error
    ? () => void complete().catch(() => undefined)
    : next;

  return (
    <StageScreen
      title="Review your wheel"
      description="Take a look at the shape of your starting point."
      actionLabel={error ? 'Retry' : undefined}
      error={error}
      onAction={onAction}
    />
  );
}

export function Focus() {
  const complete = useOnboardingStore((state) => state.complete);
  const error = useOnboardingStore((state) => state.error);
  const onAction = () => void complete().catch(() => undefined);

  return (
    <StageScreen
      title="Choose a focus"
      description="Pick where you want to begin your first practice cycle."
      actionLabel={error ? 'Retry' : 'Save my baseline'}
      error={error}
      onAction={onAction}
    />
  );
}

export function Complete() {
  return <CompletionScreen />;
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
  error: {
    color: colors.statusDanger,
    fontSize: fontSize.sm,
    lineHeight: 20,
    marginTop: space.lg,
  },
  button: {
    alignSelf: 'flex-start',
    backgroundColor: colors.accentPrimary,
    borderRadius: 9999,
    marginTop: space.xl,
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
  },
  buttonLabel: {
    color: colors.accentOn,
    fontSize: fontSize.base,
    fontWeight: '700',
  },
});
