import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { useOnboardingStore } from '@/features/onboarding/store';
import { colors, fontSize, radius, space } from '@/shared/lib/theme';

function hasQuality(qualities: string[] | undefined): boolean {
  return qualities?.some((quality) => quality.trim().length > 0) ?? false;
}

export function WhyList() {
  const who = useOnboardingStore((state) => state.threeLists.who);
  const why = useOnboardingStore((state) => state.threeLists.why);
  const setWhyQuality = useOnboardingStore((state) => state.setWhyQuality);
  const addWhyQuality = useOnboardingStore((state) => state.addWhyQuality);
  const next = useOnboardingStore((state) => state.next);
  const back = useOnboardingStore((state) => state.back);

  const canContinue = who.every((name) => hasQuality(why[name]));

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      style={styles.screen}
    >
      <View style={styles.header}>
        <Text style={styles.eyebrow}>THREE LISTS · WHY</Text>
        <Text style={styles.title}>Why do they stay with you?</Text>
        <Text style={styles.description}>
          Name the qualities that make each musician a favourite. A few clear
          details are more useful than a sprawling list.
        </Text>
      </View>

      <View style={styles.prompts}>
        <Text style={styles.sectionLabel}>Let the details come to mind</Text>
        <Text style={styles.prompt}>
          Why is this person a favourite? What struck you about their playing?
        </Text>
        <Text style={styles.prompt}>What does their playing represent to you?</Text>
        <Text style={styles.prompt}>
          What are they particularly good at? Is there something specific you&apos;ve
          seen them do?
        </Text>
        <Text style={styles.prompt}>What have they really mastered?</Text>
      </View>

      <View style={styles.list}>
        {who.map((musician, rowIndex) => {
          const qualities = why[musician]?.length ? why[musician] : [''];
          const complete = hasQuality(why[musician]);

          return (
            <View
              key={`${musician}-${rowIndex}`}
              style={[styles.row, !complete && styles.incompleteRow]}
            >
              <View style={styles.nameColumn}>
                <Text style={styles.musician}>{musician}</Text>
                {!complete ? (
                  <Text
                    accessibilityLabel={`Missing a why entry for ${musician}`}
                    style={styles.warning}
                  >
                    ⚠
                  </Text>
                ) : null}
              </View>

              <View style={styles.qualitiesColumn}>
                {qualities.map((quality, qualityIndex) => (
                  <TextInput
                    accessibilityLabel={`Why for ${musician}, entry ${qualityIndex + 1}`}
                    key={`${musician}-quality-${qualityIndex}`}
                    multiline
                    onChangeText={(value) =>
                      setWhyQuality(musician, qualityIndex, value)
                    }
                    placeholder={qualityIndex === 0 ? 'A quality or moment…' : 'Another quality…'}
                    placeholderTextColor={colors.textMuted}
                    style={styles.input}
                    textAlignVertical="top"
                    value={quality}
                  />
                ))}
                <Pressable
                  accessibilityRole="button"
                  onPress={() => addWhyQuality(musician)}
                  style={({ pressed }) => [styles.addAnother, pressed && styles.pressed]}
                >
                  <Text style={styles.addAnotherLabel}>Add another</Text>
                </Pressable>
              </View>
            </View>
          );
        })}
      </View>

      {!canContinue ? (
        <Text style={styles.helperText}>
          Add at least one quality for every musician to continue.
        </Text>
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
          accessibilityState={{ disabled: !canContinue }}
          disabled={!canContinue}
          onPress={next}
          style={({ pressed }) => [
            styles.nextButton,
            !canContinue && styles.disabledButton,
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.nextButtonLabel}>Next</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

export default WhyList;

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
  list: {
    gap: space.md,
    marginTop: space.xl,
  },
  row: {
    backgroundColor: colors.bgRaised,
    borderColor: colors.borderSubtle,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    padding: space.md,
  },
  incompleteRow: {
    borderColor: colors.statusWarning,
  },
  nameColumn: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: space.xs,
    paddingRight: space.sm,
    paddingTop: space.sm,
    width: '34%',
  },
  musician: {
    color: colors.textPrimary,
    flex: 1,
    fontSize: fontSize.base,
    fontWeight: '700',
  },
  warning: {
    color: colors.statusWarning,
    fontSize: fontSize.base,
  },
  qualitiesColumn: {
    flex: 1,
    gap: space.sm,
  },
  input: {
    backgroundColor: colors.bgBase,
    borderColor: colors.borderStrong,
    borderRadius: radius.sm,
    borderWidth: 1,
    color: colors.textPrimary,
    fontSize: fontSize.base,
    lineHeight: 22,
    minHeight: 76,
    padding: space.md,
  },
  addAnother: {
    alignSelf: 'flex-start',
    minHeight: 36,
    justifyContent: 'center',
    paddingHorizontal: space.xs,
  },
  addAnotherLabel: {
    color: colors.accentPrimary,
    fontSize: fontSize.sm,
    fontWeight: '700',
  },
  helperText: {
    color: colors.statusWarning,
    fontSize: fontSize.sm,
    lineHeight: 20,
    marginTop: space.md,
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
  disabledButton: {
    opacity: 0.45,
  },
  pressed: {
    opacity: 0.75,
  },
});
