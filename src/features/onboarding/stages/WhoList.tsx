import { useEffect, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useOnboardingStore } from '@/features/onboarding/store';
import { colors, fontSize, radius, space } from '@/shared/lib/theme';

const WHO_LIST_LIMIT = 10;

export function useWhoTimer() {
  const [secondsRemaining, setSecondsRemaining] = useState(180);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsRemaining((seconds) => Math.max(seconds - 1, 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return secondsRemaining;
}

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0');
  const remainingSeconds = (seconds % 60).toString().padStart(2, '0');

  return `${minutes}:${remainingSeconds}`;
}

export function WhoList() {
  const secondsRemaining = useWhoTimer();
  const who = useOnboardingStore((state) => state.threeLists.who);
  const addWhoName = useOnboardingStore((state) => state.addWhoName);
  const removeWhoName = useOnboardingStore((state) => state.removeWhoName);
  const next = useOnboardingStore((state) => state.next);
  const [name, setName] = useState('');

  const hasMinimumNames = who.length >= 5;
  const hasMaximumNames = who.length >= WHO_LIST_LIMIT;

  function submitName() {
    if (hasMaximumNames) {
      return;
    }

    const trimmedName = name.trim();

    if (trimmedName.length === 0) {
      return;
    }

    addWhoName(trimmedName);
    setName('');
  }

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      style={styles.screen}
    >
      <View style={styles.header}>
        <Text style={styles.eyebrow}>THREE LISTS · WHO</Text>
        <Text style={styles.title}>Who are your idols?</Text>
        <Text style={styles.description}>
          Start with the musicians who shape the way you hear and play.
        </Text>
      </View>

      <View style={styles.timerCard}>
        <Text style={styles.timerLabel}>Take three minutes to brainstorm</Text>
        <Text
          accessibilityLabel={`Time remaining ${formatTime(secondsRemaining)}`}
          style={[
            styles.timer,
            secondsRemaining === 0 && styles.timerExpired,
          ]}
        >
          {formatTime(secondsRemaining)}
        </Text>
        {secondsRemaining === 0 ? (
          <Text style={styles.timerMessage}>
            Time&apos;s up — keep going if you need to.
          </Text>
        ) : null}
      </View>

      <View style={styles.prompts}>
        <Text style={styles.sectionLabel}>Need ideas?</Text>
        <Text style={styles.prompt}>
          Who are your idols on your instrument?
        </Text>
        <Text style={styles.prompt}>
          Who amazes you or makes you think &apos;damn, I love this music&apos;?
        </Text>
        <Text style={styles.prompt}>
          If you could build a Frankenstein musician from your influences, who
          would you choose?
        </Text>
      </View>

      <View style={styles.inputRow}>
        <TextInput
          accessibilityLabel="Musician name"
          editable={!hasMaximumNames}
          onChangeText={setName}
          onSubmitEditing={submitName}
          placeholder="Add a musician…"
          placeholderTextColor={colors.textMuted}
          returnKeyType="done"
          style={styles.input}
          value={name}
        />
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: hasMaximumNames || name.trim().length === 0 }}
          disabled={hasMaximumNames || name.trim().length === 0}
          onPress={submitName}
          style={({ pressed }) => [
            styles.addButton,
            (hasMaximumNames || name.trim().length === 0) && styles.disabledButton,
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.addButtonLabel}>Add</Text>
        </Pressable>
      </View>

      {hasMaximumNames ? (
        <Text style={styles.helperText}>10 names is plenty — let&apos;s move on.</Text>
      ) : null}

      <View style={styles.list}>
        {who.map((musician, index) => (
          <View key={`${musician}-${index}`} style={styles.listItem}>
            <Text style={styles.musician}>{musician}</Text>
            <Pressable
              accessibilityLabel={`Remove ${musician}`}
              accessibilityRole="button"
              hitSlop={space.sm}
              onPress={() => removeWhoName(index)}
              style={({ pressed }) => [styles.deleteButton, pressed && styles.pressed]}
            >
              <Text style={styles.deleteLabel}>✕</Text>
            </Pressable>
          </View>
        ))}
      </View>

      {!hasMinimumNames ? (
        <Text style={styles.helperText}>Add at least 5 names to continue.</Text>
      ) : null}

      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: !hasMinimumNames }}
        disabled={!hasMinimumNames}
        onPress={next}
        style={({ pressed }) => [
          styles.nextButton,
          !hasMinimumNames && styles.disabledButton,
          pressed && styles.pressed,
        ]}
      >
        <Text style={styles.nextButtonLabel}>Next</Text>
      </Pressable>
    </ScrollView>
  );
}

export default WhoList;

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
  timerCard: {
    backgroundColor: colors.bgRaised,
    borderColor: colors.borderSubtle,
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: space.lg,
  },
  timerLabel: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
  },
  timer: {
    color: colors.textMuted,
    fontSize: fontSize.display,
    fontWeight: '700',
    marginTop: space.xs,
  },
  timerExpired: {
    color: colors.statusWarning,
  },
  timerMessage: {
    color: colors.statusWarning,
    fontSize: fontSize.sm,
    lineHeight: 20,
    marginTop: space.xs,
  },
  prompts: {
    gap: space.md,
    marginTop: space.xl,
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
    color: colors.textMuted,
    fontSize: fontSize.sm,
    lineHeight: 20,
    marginTop: space.sm,
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
  musician: {
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
  nextButton: {
    alignItems: 'center',
    backgroundColor: colors.accentPrimary,
    borderRadius: radius.full,
    justifyContent: 'center',
    marginTop: space.xl,
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
