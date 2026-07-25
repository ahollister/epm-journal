import { useEffect, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useOnboardingStore } from '@/features/onboarding/store';
import type { Characteristic } from '@/domain/onboarding/types';
import { colors, fontSize, radius, space } from '@/shared/lib/theme';
import { RATING_PROMPTS } from './ratingPrompts';

export const SCALE_MIN = 0;
export const SCALE_MAX = 10;

const NAME_TRUNCATE_LENGTH = 80;
const MIDPOINT_NUDGE_COPY =
  "5 is the hardest score to learn from. Do you lean closer to 'I can do this sometimes' (4) or 'I can usually do this' (6)?";

function orderedCharacteristics(characteristics: Characteristic[]) {
  return [...characteristics].sort((a, b) => a.order - b.order);
}

function displayName(name: string, expanded: boolean): string {
  if (expanded || name.length <= NAME_TRUNCATE_LENGTH) {
    return name;
  }

  return `${name.slice(0, NAME_TRUNCATE_LENGTH)}…`;
}

export function RatingScreen() {
  const subStep = useOnboardingStore((state) => state.subStep);
  const characteristics = useOnboardingStore((state) => state.characteristics);
  const rateCharacteristic = useOnboardingStore(
    (state) => state.rateCharacteristic,
  );
  const next = useOnboardingStore((state) => state.next);
  const back = useOnboardingStore((state) => state.back);
  const [nameExpanded, setNameExpanded] = useState(false);
  const [showMidpointNudge, setShowMidpointNudge] = useState(false);

  const ordered = orderedCharacteristics(characteristics);
  const characteristic = ordered[subStep];

  useEffect(() => {
    setNameExpanded(false);
    setShowMidpointNudge(false);
  }, [characteristic?.id]);

  if (!characteristic) {
    return (
      <View style={styles.emptyScreen}>
        <Text style={styles.emptyTitle}>No characteristic to rate</Text>
      </View>
    );
  }

  const midpoint = Math.floor((SCALE_MIN + SCALE_MAX) / 2);
  const isLastCharacteristic = subStep === ordered.length - 1;
  const hasScore = characteristic.score != null;

  function selectScore(score: number) {
    rateCharacteristic(characteristic.id, score);
    setShowMidpointNudge(score === midpoint);
  }

  function chooseNudgeScore(score: number) {
    rateCharacteristic(characteristic.id, score);
    setShowMidpointNudge(false);
  }

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      style={styles.screen}
    >
      <View style={styles.headingBlock}>
        {characteristic.name.length > NAME_TRUNCATE_LENGTH ? (
          <Pressable
            accessibilityLabel={
              nameExpanded
                ? 'Collapse characteristic name'
                : 'Expand characteristic name'
            }
            accessibilityRole="button"
            onPress={() => setNameExpanded((expanded) => !expanded)}
          >
            <Text style={styles.characteristicName}>
              {displayName(characteristic.name, nameExpanded)}
            </Text>
          </Pressable>
        ) : (
          <Text style={styles.characteristicName}>{characteristic.name}</Text>
        )}
        <Text style={styles.pictureHeader}>
          Picture a 10 in "{characteristic.name}". Really go there for a
          second.
        </Text>
      </View>

      <View style={styles.promptList}>
        {RATING_PROMPTS.map((prompt) => (
          <View key={prompt} style={styles.promptCard}>
            <Text style={styles.prompt}>{prompt}</Text>
          </View>
        ))}
      </View>

      <View style={styles.ratingSection}>
        <Text style={styles.sectionLabel}>Your gut-check score</Text>
        <View style={styles.scaleRow}>
          {Array.from(
            { length: SCALE_MAX - SCALE_MIN + 1 },
            (_, index) => SCALE_MIN + index,
          ).map((score) => {
            const selected = characteristic.score === score;

            return (
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ selected }}
                key={score}
                onPress={() => selectScore(score)}
                style={({ pressed }) => [
                  styles.scoreButton,
                  selected && styles.selectedScoreButton,
                  pressed && styles.pressed,
                ]}
              >
                <Text
                  style={[
                    styles.scoreLabel,
                    selected && styles.selectedScoreLabel,
                  ]}
                >
                  {score}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.gutCheck}>
          Don't overthink it. Your gut knows. You can always adjust later.
        </Text>

        {showMidpointNudge ? (
          <View style={styles.nudgeCard}>
            <Text style={styles.nudgeCopy}>{MIDPOINT_NUDGE_COPY}</Text>
            <View style={styles.nudgeActions}>
              <Pressable
                accessibilityRole="button"
                onPress={() => chooseNudgeScore(midpoint - 1)}
                style={({ pressed }) => [
                  styles.nudgeButton,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={styles.nudgeButtonLabel}>
                  I can do this sometimes (4)
                </Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                onPress={() => chooseNudgeScore(midpoint + 1)}
                style={({ pressed }) => [
                  styles.nudgeButton,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={styles.nudgeButtonLabel}>
                  I can usually do this (6)
                </Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                onPress={() => setShowMidpointNudge(false)}
                style={({ pressed }) => [
                  styles.keepButton,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={styles.keepButtonLabel}>Keep 5</Text>
              </Pressable>
            </View>
          </View>
        ) : null}
      </View>

      <View style={styles.navigation}>
        <Pressable
          accessibilityRole="button"
          onPress={back}
          style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
        >
          <Text style={styles.backLabel}>Back</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: !hasScore }}
          disabled={!hasScore}
          onPress={next}
          style={({ pressed }) => [
            styles.nextButton,
            !hasScore && styles.disabledButton,
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.nextLabel}>
            {isLastCharacteristic ? 'Next' : 'Rate next'}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

export default RatingScreen;

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.bgBase, flex: 1 },
  content: { padding: space.xl, paddingBottom: space.xxxl },
  emptyScreen: {
    alignItems: 'center',
    backgroundColor: colors.bgBase,
    flex: 1,
    justifyContent: 'center',
    padding: space.xl,
  },
  emptyTitle: { color: colors.textPrimary, fontSize: fontSize.lg, fontWeight: '700' },
  headingBlock: { gap: space.md },
  characteristicName: {
    color: colors.textPrimary,
    fontSize: fontSize.xl,
    fontWeight: '700',
    lineHeight: 34,
  },
  pictureHeader: {
    color: colors.textSecondary,
    fontSize: fontSize.md,
    lineHeight: 25,
  },
  promptList: { gap: space.sm, marginTop: space.xl },
  promptCard: {
    backgroundColor: colors.bgRaised,
    borderColor: colors.borderSubtle,
    borderRadius: radius.md,
    borderWidth: 1,
    padding: space.md,
  },
  prompt: { color: colors.textPrimary, fontSize: fontSize.base, lineHeight: 22 },
  ratingSection: { marginTop: space.xl },
  sectionLabel: { color: colors.textPrimary, fontSize: fontSize.lg, fontWeight: '700' },
  scaleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: space.md,
  },
  scoreButton: {
    alignItems: 'center',
    backgroundColor: colors.bgRaised,
    borderColor: colors.borderStrong,
    borderRadius: radius.sm,
    borderWidth: 1,
    height: 40,
    justifyContent: 'center',
    minWidth: 28,
    paddingHorizontal: space.xs,
  },
  selectedScoreButton: {
    backgroundColor: colors.accentPrimary,
    borderColor: colors.accentPrimary,
  },
  scoreLabel: { color: colors.textSecondary, fontSize: fontSize.sm, fontWeight: '700' },
  selectedScoreLabel: { color: colors.accentOn },
  gutCheck: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    fontStyle: 'italic',
    lineHeight: 20,
    marginTop: space.md,
  },
  nudgeCard: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accentPrimary,
    borderRadius: radius.md,
    borderWidth: 1,
    marginTop: space.lg,
    padding: space.md,
  },
  nudgeCopy: { color: colors.textPrimary, fontSize: fontSize.sm, lineHeight: 20 },
  nudgeActions: { gap: space.sm, marginTop: space.md },
  nudgeButton: {
    backgroundColor: colors.bgRaised,
    borderColor: colors.borderStrong,
    borderRadius: radius.sm,
    borderWidth: 1,
    padding: space.md,
  },
  nudgeButtonLabel: { color: colors.textPrimary, fontSize: fontSize.sm, fontWeight: '600' },
  keepButton: { alignSelf: 'flex-start', paddingVertical: space.xs },
  keepButtonLabel: { color: colors.textSecondary, fontSize: fontSize.sm },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: space.xxl,
  },
  backButton: { padding: space.md },
  backLabel: { color: colors.textSecondary, fontSize: fontSize.base, fontWeight: '600' },
  nextButton: {
    backgroundColor: colors.accentPrimary,
    borderRadius: radius.full,
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
  },
  nextLabel: { color: colors.accentOn, fontSize: fontSize.base, fontWeight: '700' },
  disabledButton: { opacity: 0.45 },
  pressed: { opacity: 0.75 },
});
