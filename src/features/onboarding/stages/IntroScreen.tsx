import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import type { Characteristic } from '@/domain/onboarding/types';
import { useOnboardingStore } from '@/features/onboarding/store';
import { SkillWheelChart } from '@/shared/components/skill-wheel/SkillWheelChart';
import { colors, fontSize, radius, space } from '@/shared/lib/theme';

const dummyData: Characteristic[] = [
  { id: 'example-tone', name: 'Tone', order: 1, score: 3 },
  { id: 'example-timing', name: 'Timing', order: 2, score: 6 },
  { id: 'example-technique', name: 'Technique', order: 3, score: 7 },
  { id: 'example-repertoire', name: 'Repertoire', order: 4, score: 4 },
  { id: 'example-improvisation', name: 'Improvisation', order: 5, score: 5 },
  { id: 'example-ear-training', name: 'Ear Training', order: 6, score: 8 },
];

export function IntroScreen() {
  const router = useRouter();
  const store = useOnboardingStore();

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      style={styles.screen}
    >
      <View style={styles.introCopy}>
        <Text style={styles.eyebrow}>THE SKILL WHEEL</Text>
        <Text style={styles.title}>See the shape of your musicianship.</Text>
        <Text style={styles.body}>
          The Skill Wheel is a simple way to see the different parts of playing
          music that matter to you. It helps you spot your strengths and the
          areas where focused practice can make the biggest difference.
        </Text>
      </View>

      <View style={styles.chartCard}>
        <SkillWheelChart characteristics={dummyData} interactive={false} />
        <Text style={styles.caption}>
          This is what a skill wheel looks like after assessment.
        </Text>
      </View>

      <View style={styles.valueProps}>
        <Text style={styles.valueProp}>
          You'll define your own skill dimensions based on who you are as a musician.
        </Text>
        <Text style={styles.valueProp}>
          Be honest — there are no wrong answers. This is your starting point, not a test.
        </Text>
        <Text style={styles.valueProp}>
          Your baseline powers your progress tracking.
        </Text>
      </View>

      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          onPress={() => store.next()}
          style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}
        >
          <Text style={styles.primaryButtonLabel}>Get Started</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.back()}
          style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}
        >
          <Text style={styles.secondaryButtonLabel}>Skip for now</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

export default IntroScreen;

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.bgBase,
    flex: 1,
  },
  content: {
    padding: space.xl,
    paddingBottom: space.xxxl,
  },
  introCopy: {
    marginBottom: space.lg,
  },
  eyebrow: {
    color: colors.accentPrimary,
    fontSize: fontSize.xs,
    fontWeight: '700',
    letterSpacing: 1.8,
    marginBottom: space.sm,
  },
  title: {
    color: colors.textPrimary,
    fontSize: fontSize.xl,
    fontWeight: '700',
    lineHeight: 34,
  },
  body: {
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
    padding: space.md,
  },
  caption: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    lineHeight: 19,
    marginTop: space.md,
    textAlign: 'center',
  },
  valueProps: {
    gap: space.md,
    marginTop: space.xl,
  },
  valueProp: {
    color: colors.textPrimary,
    fontSize: fontSize.base,
    lineHeight: 22,
  },
  actions: {
    gap: space.sm,
    marginTop: space.xl,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: colors.accentPrimary,
    borderRadius: radius.full,
    justifyContent: 'center',
    minHeight: 52,
    paddingHorizontal: space.lg,
  },
  primaryButtonLabel: {
    color: colors.accentOn,
    fontSize: fontSize.base,
    fontWeight: '700',
  },
  secondaryButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: space.lg,
  },
  secondaryButtonLabel: {
    color: colors.textSecondary,
    fontSize: fontSize.base,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.75,
  },
});
