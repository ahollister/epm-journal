import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useOnboardingStore } from '@/features/onboarding/store';
import { colors, fontSize, space } from '@/shared/lib/theme';

interface StageScreenProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

function StageScreen({
  title,
  description,
  actionLabel = 'Continue',
  onAction,
}: StageScreenProps) {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {onAction ? (
        <Pressable accessibilityRole="button" onPress={onAction} style={styles.button}>
          <Text style={styles.buttonLabel}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function Intro() {
  const next = useOnboardingStore((state) => state.next);
  return (
    <StageScreen
      title="Build your skill wheel"
      description="Define the skills that matter to you, then create an honest starting point for your progress."
      actionLabel="Get started"
      onAction={next}
    />
  );
}

export function WhoList() {
  const next = useOnboardingStore((state) => state.next);
  return <StageScreen title="Who am I?" description="Start with your musical identity and current abilities." onAction={next} />;
}

export function WhyList() {
  const next = useOnboardingStore((state) => state.next);
  return <StageScreen title="Why am I practicing?" description="Capture what motivates you to make music." onAction={next} />;
}

export function ImprovementsList() {
  const next = useOnboardingStore((state) => state.next);
  return <StageScreen title="What do I want to improve?" description="Name the areas where you want to grow." onAction={next} />;
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
  return <StageScreen title="Review your wheel" description="Take a look at the shape of your starting point." onAction={next} />;
}

export function Focus() {
  const next = useOnboardingStore((state) => state.next);
  return <StageScreen title="Choose a focus" description="Pick where you want to begin your first practice cycle." onAction={next} />;
}

export function Complete() {
  return <StageScreen title="You’re ready" description="Your starting point is saved. Let’s make your next practice count." />;
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
