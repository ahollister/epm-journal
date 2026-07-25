import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { useOnboardingStore } from '@/features/onboarding/store';
import { colors, fontSize, radius, space } from '@/shared/lib/theme';

const IMPROVEMENT_NUDGE_THRESHOLD = 12;

const prompts = [
  'Where do you feel you want to grow?',
  'Have you hit obstacles during a rehearsal or performance? What were they?',
  'Have you received feedback from other musicians that you thought was fair?',
  'Is there something that bothers you when you listen to your own recordings?',
];

export function ImprovementsList() {
  const improvements = useOnboardingStore(
    (state) => state.threeLists.improvements,
  );
  const addImprovement = useOnboardingStore((state) => state.addImprovement);
  const removeImprovement = useOnboardingStore(
    (state) => state.removeImprovement,
  );
  const next = useOnboardingStore((state) => state.next);
  const back = useOnboardingStore((state) => state.back);
  const [improvement, setImprovement] = useState('');

  const hasMinimumImprovements = improvements.length >= 3;

  function submitImprovement() {
    const trimmedImprovement = improvement.trim();

    if (trimmedImprovement.length === 0) {
      return;
    }

    addImprovement(trimmedImprovement);
    setImprovement('');
  }

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      style={styles.screen}
    >
      <View style={styles.header}>
        <Text style={styles.eyebrow}>THREE LISTS · IMPROVEMENTS</Text>
        <Text style={styles.title}>What do you want to improve?</Text>
        <Text style={styles.description}>
          All skills are freely available — take everything you want and put it
          on your plate. Don&apos;t worry about feasibility or realism yet.
        </Text>
      </View>

      <View style={styles.prompts}>
        <Text style={styles.sectionLabel}>Need ideas?</Text>
        {prompts.map((prompt) => (
          <Text key={prompt} style={styles.prompt}>
            {prompt}
          </Text>
        ))}
      </View>

      <View style={styles.inputRow}>
        <TextInput
          accessibilityLabel="Improvement"
          onChangeText={setImprovement}
          onSubmitEditing={submitImprovement}
          placeholder="Add an improvement…"
          placeholderTextColor={colors.textMuted}
          returnKeyType="done"
          style={styles.input}
          value={improvement}
        />
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: improvement.trim().length === 0 }}
          disabled={improvement.trim().length === 0}
          onPress={submitImprovement}
          style={({ pressed }) => [
            styles.addButton,
            improvement.trim().length === 0 && styles.disabledButton,
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.addButtonLabel}>Add</Text>
        </Pressable>
      </View>

      <View style={styles.list}>
        {improvements.map((item, index) => (
          <View key={`${item}-${index}`} style={styles.listItem}>
            <Text style={styles.improvement}>{item}</Text>
            <Pressable
              accessibilityLabel={`Remove ${item}`}
              accessibilityRole="button"
              hitSlop={space.sm}
              onPress={() => removeImprovement(index)}
              style={({ pressed }) => [styles.deleteButton, pressed && styles.pressed]}
            >
              <Text style={styles.deleteLabel}>✕</Text>
            </Pressable>
          </View>
        ))}
      </View>

      {improvements.length >= IMPROVEMENT_NUDGE_THRESHOLD ? (
        <Text style={styles.nudge}>
          That&apos;s a lot — remember you&apos;ll distill these into characteristics
          next.
        </Text>
      ) : null}

      {!hasMinimumImprovements ? (
        <Text style={styles.helperText}>Add at least 3 improvements to continue.</Text>
      ) : null}

      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          onPress={back}
          style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
        >
          <Text style={styles.backButtonLabel}>Back</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: !hasMinimumImprovements }}
          disabled={!hasMinimumImprovements}
          onPress={next}
          style={({ pressed }) => [
            styles.nextButton,
            !hasMinimumImprovements && styles.disabledButton,
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.nextButtonLabel}>Next</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

export default ImprovementsList;

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.bgBase,
    flex: 1,
  },
  content: {
    padding: space.xl,
    paddingBottom: space.xxxl,
  },
  header: {
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
  },
  description: {
    color: colors.textSecondary,
    fontSize: fontSize.md,
    lineHeight: 25,
    marginTop: space.md,
  },
  prompts: {
    backgroundColor: colors.bgRaised,
    borderColor: colors.borderSubtle,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: space.md,
    padding: space.lg,
  },
  sectionLabel: {
    color: colors.textPrimary,
    fontSize: fontSize.base,
    fontWeight: '700',
  },
  prompt: {
    color: colors.textSecondary,
    fontSize: fontSize.base,
    lineHeight: 22,
  },
  inputRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: space.sm,
    marginTop: space.xl,
  },
  input: {
    backgroundColor: colors.bgRaised,
    borderColor: colors.borderStrong,
    borderRadius: radius.sm,
    borderWidth: 1,
    color: colors.textPrimary,
    flex: 1,
    fontSize: fontSize.base,
    minHeight: 48,
    paddingHorizontal: space.md,
  },
  addButton: {
    alignItems: 'center',
    backgroundColor: colors.accentPrimary,
    borderRadius: radius.sm,
    justifyContent: 'center',
    minHeight: 48,
    paddingHorizontal: space.lg,
  },
  addButtonLabel: {
    color: colors.accentOn,
    fontSize: fontSize.base,
    fontWeight: '700',
  },
  disabledButton: {
    opacity: 0.45,
  },
  helperText: {
    color: colors.statusWarning,
    fontSize: fontSize.sm,
    lineHeight: 20,
    marginTop: space.md,
  },
  nudge: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    lineHeight: 20,
    marginTop: space.md,
  },
  list: {
    gap: space.sm,
    marginTop: space.lg,
  },
  listItem: {
    alignItems: 'center',
    backgroundColor: colors.bgRaised,
    borderColor: colors.borderSubtle,
    borderRadius: radius.sm,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 48,
    paddingLeft: space.md,
    paddingRight: space.sm,
  },
  improvement: {
    color: colors.textPrimary,
    flex: 1,
    fontSize: fontSize.base,
  },
  deleteButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 40,
    minWidth: 40,
  },
  deleteLabel: {
    color: colors.textMuted,
    fontSize: fontSize.md,
  },
  actions: {
    flexDirection: 'row',
    gap: space.sm,
    marginTop: space.xl,
  },
  backButton: {
    alignItems: 'center',
    borderColor: colors.borderStrong,
    borderRadius: radius.full,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 52,
    paddingHorizontal: space.lg,
  },
  backButtonLabel: {
    color: colors.textPrimary,
    fontSize: fontSize.base,
    fontWeight: '700',
  },
  nextButton: {
    alignItems: 'center',
    backgroundColor: colors.accentPrimary,
    borderRadius: radius.full,
    flex: 1,
    justifyContent: 'center',
    minHeight: 52,
    paddingHorizontal: space.lg,
  },
  nextButtonLabel: {
    color: colors.accentOn,
    fontSize: fontSize.base,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.75,
  },
});
