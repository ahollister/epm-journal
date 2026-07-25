import { useState } from 'react';
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

const PLACEHOLDER =
  'Name a broad area of your musicianship — e.g., "Tone quality" rather than "Bending on the G string"';

function normaliseName(name: string): string {
  return name.trim().toLocaleLowerCase();
}

export function CharacteristicDefinition() {
  const threeLists = useOnboardingStore((state) => state.threeLists);
  const characteristics = useOnboardingStore((state) => state.characteristics);
  const addCharacteristic = useOnboardingStore((state) => state.addCharacteristic);
  const removeCharacteristic = useOnboardingStore(
    (state) => state.removeCharacteristic,
  );
  const next = useOnboardingStore((state) => state.next);
  const [name, setName] = useState('');
  const [duplicateWarningName, setDuplicateWarningName] = useState<string | null>(
    null,
  );

  const trimmedName = name.trim();
  const hasMinimum = characteristics.length >= 3;
  const duplicateName = characteristics.some(
    (characteristic) => normaliseName(characteristic.name) === normaliseName(name),
  );
  const duplicateWarningStillRelevant =
    duplicateWarningName !== null &&
    characteristics.some(
      (characteristic) =>
        normaliseName(characteristic.name) === normaliseName(duplicateWarningName),
    );
  const visibleDuplicateWarning =
    (duplicateWarningStillRelevant ? duplicateWarningName : null) ??
    (duplicateName && trimmedName.length > 0 ? trimmedName : null);

  function addName() {
    if (trimmedName.length === 0) {
      return;
    }

    if (duplicateName) {
      setDuplicateWarningName(trimmedName);
    }

    addCharacteristic(trimmedName);
    setName('');
  }

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.content}
      style={styles.screen}
    >
      <Text style={styles.eyebrow}>STAGE 3 · DEFINE</Text>
      <Text style={styles.title}>What makes up your musicianship?</Text>
      <Text style={styles.description}>
        Use your reflections for inspiration, then name the broad areas you want
        your wheel to show. The words are yours.
      </Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Your Three Lists</Text>
        <Text style={styles.sectionDescription}>
          Read these for context — they are references, not selections.
        </Text>
        <ScrollView
          nestedScrollEnabled
          style={styles.referenceScroll}
          contentContainerStyle={styles.referenceContent}
        >
          <Text style={styles.heading}>WHO</Text>
          {threeLists.who.length > 0 ? (
            threeLists.who.map((who) => (
              <Text key={`who-${who}`} style={styles.referenceItem}>
                {who}
              </Text>
            ))
          ) : (
            <Text style={styles.emptyReference}>No Who items recorded.</Text>
          )}

          <Text style={styles.heading}>WHY</Text>
          {Object.entries(threeLists.why).length > 0 ? (
            Object.entries(threeLists.why).flatMap(([who, whys]) =>
              whys.map((why, index) => (
                <Text key={`why-${who}-${index}`} style={styles.referenceWhy}>
                  {who} · {why}
                </Text>
              )),
            )
          ) : (
            <Text style={styles.emptyReference}>No Why items recorded.</Text>
          )}

          <Text style={styles.heading}>IMPROVEMENTS</Text>
          {threeLists.improvements.length > 0 ? (
            threeLists.improvements.map((improvement, index) => (
              <Text key={`improvement-${index}`} style={styles.referenceItem}>
                {improvement}
              </Text>
            ))
          ) : (
            <Text style={styles.emptyReference}>
              No improvement items recorded.
            </Text>
          )}
        </ScrollView>
      </View>

      <View style={styles.definitionSection}>
        <Text style={styles.sectionTitle}>Define your characteristics</Text>
        <Text style={styles.sectionDescription}>
          Most musicians define 4–8 characteristics.
        </Text>

        <View style={styles.entryRow}>
          <TextInput
            accessibilityLabel="Characteristic name"
            autoCapitalize="sentences"
            onChangeText={(value) => {
              setName(value);
              setDuplicateWarningName(null);
            }}
            onSubmitEditing={addName}
            placeholder={PLACEHOLDER}
            placeholderTextColor={colors.textMuted}
            returnKeyType="done"
            style={styles.input}
            value={name}
          />
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ disabled: trimmedName.length === 0 }}
            disabled={trimmedName.length === 0}
            onPress={addName}
            style={({ pressed }) => [
              styles.addButton,
              trimmedName.length === 0 && styles.disabledButton,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.addButtonLabel}>Add</Text>
          </Pressable>
        </View>

        {visibleDuplicateWarning ? (
          <Text accessibilityRole="alert" style={styles.warning}>
            You already have a characteristic called '{visibleDuplicateWarning}'. Did
            you mean to combine them?
          </Text>
        ) : null}

        {characteristics.length > 12 ? (
          <Text accessibilityRole="alert" style={styles.warning}>
            That's a lot of dimensions — your wheel may be hard to read. Consider
            combining similar characteristics.
          </Text>
        ) : null}

        <View style={styles.characteristicList}>
          {characteristics.map((characteristic) => (
            <View key={characteristic.id} style={styles.characteristicRow}>
              <Text style={styles.characteristicName}>{characteristic.name}</Text>
              <Pressable
                accessibilityLabel={`Remove ${characteristic.name}`}
                accessibilityRole="button"
                hitSlop={space.sm}
                onPress={() => removeCharacteristic(characteristic.id)}
                style={styles.removeButton}
              >
                <Text style={styles.removeButtonLabel}>✕</Text>
              </Pressable>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.actions}>
        {!hasMinimum ? (
          <Text style={styles.gateCopy}>
            Define at least 3 characteristics to continue.
          </Text>
        ) : null}
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: !hasMinimum }}
          disabled={!hasMinimum}
          onPress={next}
          style={({ pressed }) => [
            styles.nextButton,
            !hasMinimum && styles.disabledButton,
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.nextButtonLabel}>Next</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

export default CharacteristicDefinition;

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
  card: {
    backgroundColor: colors.bgRaised,
    borderColor: colors.borderSubtle,
    borderRadius: radius.lg,
    borderWidth: 1,
    marginTop: space.xl,
    padding: space.lg,
  },
  sectionTitle: { color: colors.textPrimary, fontSize: fontSize.lg, fontWeight: '700' },
  sectionDescription: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    lineHeight: 20,
    marginTop: space.xs,
  },
  referenceScroll: { marginTop: space.md, maxHeight: 250 },
  referenceContent: { gap: space.sm, paddingBottom: space.xs },
  heading: {
    color: colors.accentPrimary,
    fontSize: fontSize.xs,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginTop: space.sm,
  },
  referenceItem: { color: colors.textPrimary, fontSize: fontSize.base, lineHeight: 21 },
  referenceWhy: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    lineHeight: 19,
    paddingLeft: space.md,
  },
  emptyReference: { color: colors.textMuted, fontSize: fontSize.sm, fontStyle: 'italic' },
  definitionSection: { marginTop: space.xl },
  entryRow: { flexDirection: 'row', gap: space.sm, marginTop: space.lg },
  input: {
    backgroundColor: colors.bgRaised,
    borderColor: colors.borderStrong,
    borderRadius: radius.md,
    borderWidth: 1,
    color: colors.textPrimary,
    flex: 1,
    fontSize: fontSize.base,
    minHeight: 52,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
  },
  addButton: {
    alignItems: 'center',
    backgroundColor: colors.accentPrimary,
    borderRadius: radius.md,
    justifyContent: 'center',
    minWidth: 68,
    paddingHorizontal: space.md,
  },
  addButtonLabel: { color: colors.accentOn, fontSize: fontSize.base, fontWeight: '700' },
  disabledButton: { opacity: 0.4 },
  pressed: { opacity: 0.75 },
  warning: {
    color: colors.statusWarning,
    fontSize: fontSize.sm,
    lineHeight: 20,
    marginTop: space.md,
  },
  characteristicList: { gap: space.sm, marginTop: space.lg },
  characteristicRow: {
    alignItems: 'center',
    backgroundColor: colors.bgRaised,
    borderColor: colors.borderSubtle,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 52,
    paddingLeft: space.md,
    paddingRight: space.sm,
  },
  characteristicName: { color: colors.textPrimary, flex: 1, fontSize: fontSize.base },
  removeButton: { alignItems: 'center', height: 36, justifyContent: 'center', width: 36 },
  removeButtonLabel: { color: colors.textSecondary, fontSize: fontSize.md },
  actions: { marginTop: space.xl },
  gateCopy: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    lineHeight: 20,
    marginBottom: space.sm,
  },
  nextButton: {
    alignItems: 'center',
    backgroundColor: colors.accentPrimary,
    borderRadius: radius.full,
    justifyContent: 'center',
    minHeight: 52,
    paddingHorizontal: space.lg,
  },
  nextButtonLabel: { color: colors.accentOn, fontSize: fontSize.base, fontWeight: '700' },
});
