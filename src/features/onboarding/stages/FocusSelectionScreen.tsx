import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { rankCharacteristics } from '@/domain/onboarding/ranking';
import { detectFlatWheel } from '@/domain/onboarding/wheel';
import { useOnboardingStore } from '@/features/onboarding/store';
import { colors, fontSize, radius, space } from '@/shared/lib/theme';

const FLAT_WHEEL_TIP =
  'Your scores are close together — any area you focus on will raise your overall playing. Pick what feels most motivating.';
const LARGE_GAP_TIP =
  "Your strongest areas can pull your weaker ones up. Or you can double down on what's already working — both approaches are valid.";
const DEFAULT_TIP =
  'Working on a weaker area often unlocks progress in stronger ones too.';
const CAP_FEEDBACK =
  'Pick 1 or 2 focus areas — more than 2 dilutes your focus.';

export function FocusSelectionScreen() {
  const characteristics = useOnboardingStore((state) => state.characteristics);
  const focusAreas = useOnboardingStore((state) => state.focusAreas);
  const setFocusAreas = useOnboardingStore((state) => state.setFocusAreas);
  const next = useOnboardingStore((state) => state.next);
  const [selectedIds, setSelectedIds] = useState(() => {
    const characteristicIds = new Set(
      characteristics.map((characteristic) => characteristic.id),
    );

    return focusAreas
      .filter((id) => characteristicIds.has(id))
      .slice(0, 2);
  });
  const [showCapFeedback, setShowCapFeedback] = useState(false);

  const rankedCharacteristics = rankCharacteristics(characteristics);
  const { isFlat, range } = detectFlatWheel(characteristics);
  const tip = isFlat
    ? FLAT_WHEEL_TIP
    : range >= 5
      ? LARGE_GAP_TIP
      : DEFAULT_TIP;

  function toggleSelection(id: string) {
    setSelectedIds((current) => {
      if (current.includes(id)) {
        setShowCapFeedback(false);
        return current.filter((selectedId) => selectedId !== id);
      }

      if (current.length >= 2) {
        setShowCapFeedback(true);
        return current;
      }

      setShowCapFeedback(false);
      return [...current, id];
    });
  }

  function continueToCompletion() {
    setFocusAreas(selectedIds);
    next();
  }

  function skip() {
    setFocusAreas([]);
    next();
  }

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      style={styles.screen}
    >
      <Text style={styles.eyebrow}>STAGE 6 · FOCUS</Text>
      <Text style={styles.title}>Choose where to focus first</Text>
      <Text style={styles.description}>
        These are your areas, ranked by score. Choose up to two that feel most
        useful for your first practice cycle.
      </Text>

      <View style={styles.list}>
        {rankedCharacteristics.map((characteristic) => {
          const selected = selectedIds.includes(characteristic.id);
          const score = characteristic.score == null
            ? '— / 10'
            : `${characteristic.score} / 10`;

          return (
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected }}
              key={characteristic.id}
              onPress={() => toggleSelection(characteristic.id)}
              style={({ pressed }) => [
                styles.row,
                selected && styles.selectedRow,
                pressed && styles.pressed,
              ]}
              testID={`focus-option-${characteristic.id}`}
            >
              <View
                accessibilityElementsHidden
                importantForAccessibility="no"
                style={[styles.checkbox, selected && styles.selectedCheckbox]}
              >
                {selected ? <Text style={styles.checkmark}>✓</Text> : null}
              </View>
              <Text style={styles.name}>{characteristic.name}</Text>
              <Text style={styles.score}>{score}</Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.counter}>
        {selectedIds.length} of 2 selected
      </Text>

      {showCapFeedback ? (
        <Text accessibilityRole="alert" style={styles.feedback}>
          {CAP_FEEDBACK}
        </Text>
      ) : null}

      <Text style={styles.tip}>{tip}</Text>

      <Pressable
        accessibilityRole="button"
        onPress={continueToCompletion}
        style={({ pressed }) => [
          styles.primaryButton,
          pressed && styles.pressed,
        ]}
      >
        <Text style={styles.primaryButtonLabel}>Continue</Text>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        onPress={skip}
        style={({ pressed }) => [
          styles.secondaryButton,
          pressed && styles.pressed,
        ]}
      >
        <Text style={styles.secondaryButtonLabel}>Skip for now</Text>
      </Pressable>
    </ScrollView>
  );
}

export default FocusSelectionScreen;

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.bgBase, flex: 1 },
  content: { padding: space.xl, paddingBottom: space.xxxl },
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
  list: { gap: space.sm, marginTop: space.xl },
  row: {
    alignItems: 'center',
    backgroundColor: colors.bgRaised,
    borderColor: colors.borderSubtle,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    minHeight: 64,
    paddingHorizontal: space.md,
  },
  selectedRow: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accentPrimary,
  },
  checkbox: {
    alignItems: 'center',
    borderColor: colors.borderStrong,
    borderRadius: radius.xs,
    borderWidth: 1,
    height: 24,
    justifyContent: 'center',
    marginRight: space.md,
    width: 24,
  },
  selectedCheckbox: {
    backgroundColor: colors.accentPrimary,
    borderColor: colors.accentPrimary,
  },
  checkmark: { color: colors.accentOn, fontSize: fontSize.sm, fontWeight: '700' },
  name: { color: colors.textPrimary, flex: 1, fontSize: fontSize.base },
  score: { color: colors.textSecondary, fontSize: fontSize.base, fontWeight: '700' },
  counter: {
    color: colors.textPrimary,
    fontSize: fontSize.base,
    fontWeight: '700',
    marginTop: space.lg,
  },
  feedback: {
    color: colors.statusWarning,
    fontSize: fontSize.sm,
    lineHeight: 20,
    marginTop: space.sm,
  },
  tip: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    fontStyle: 'italic',
    lineHeight: 20,
    marginTop: space.lg,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: colors.accentPrimary,
    borderRadius: radius.full,
    justifyContent: 'center',
    marginTop: space.xl,
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
    borderColor: colors.borderStrong,
    borderRadius: radius.full,
    borderWidth: 1,
    justifyContent: 'center',
    marginTop: space.md,
    minHeight: 52,
    paddingHorizontal: space.lg,
  },
  secondaryButtonLabel: {
    color: colors.textPrimary,
    fontSize: fontSize.base,
    fontWeight: '600',
  },
  pressed: { opacity: 0.75 },
});
