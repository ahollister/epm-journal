import { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useOnboardingStore } from '@/features/onboarding/store';
import { colors, fontSize, radius, space } from '@/shared/lib/theme';

const COVERAGE_QUESTION =
  'If you were a 10 out of 10 in each of these areas, would you be fully satisfied with your playing? Would this allow you to do everything you want to do as a musician?';

export function CharacteristicReview() {
  const characteristics = useOnboardingStore((state) => state.characteristics);
  const moveCharacteristic = useOnboardingStore(
    (state) => state.moveCharacteristic,
  );
  const renameCharacteristic = useOnboardingStore(
    (state) => state.renameCharacteristic,
  );
  const removeCharacteristic = useOnboardingStore(
    (state) => state.removeCharacteristic,
  );
  const back = useOnboardingStore((state) => state.back);
  const next = useOnboardingStore((state) => state.next);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState('');

  const orderedCharacteristics = [...characteristics].sort(
    (a, b) => a.order - b.order,
  );

  function startEditing(id: string, name: string) {
    setEditingId(id);
    setDraftName(name);
  }

  function finishEditing() {
    if (editingId === null) {
      return;
    }

    renameCharacteristic(editingId, draftName);
    setEditingId(null);
    setDraftName('');
  }

  function confirmRemove(id: string) {
    Alert.alert('Remove this characteristic?', 'Its rating will also be removed.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => {
          if (editingId === id) {
            setEditingId(null);
            setDraftName('');
          }
          removeCharacteristic(id);
        },
      },
    ]);
  }

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.content}
      style={styles.screen}
    >
      <Text style={styles.eyebrow}>STAGE 3 · REVIEW</Text>
      <Text style={styles.title}>Shape your characteristics</Text>
      <Text style={styles.description}>
        Put these areas in the order that feels most useful to you. You can
        rename or remove anything before you begin rating.
      </Text>

      <View style={styles.list}>
        {orderedCharacteristics.map((characteristic, index) => {
          const isEditing = characteristic.id === editingId;
          const isFirst = index === 0;
          const isLast = index === orderedCharacteristics.length - 1;

          return (
            <View key={characteristic.id} style={styles.row}>
              <View style={styles.number}>
                <Text style={styles.numberLabel}>{index + 1}</Text>
              </View>

              <View style={styles.nameArea}>
                {isEditing ? (
                  <TextInput
                    accessibilityLabel={`Edit characteristic ${characteristic.name}`}
                    autoFocus
                    onBlur={finishEditing}
                    onChangeText={setDraftName}
                    onSubmitEditing={finishEditing}
                    returnKeyType="done"
                    style={styles.editInput}
                    value={draftName}
                  />
                ) : (
                  <Pressable
                    accessibilityLabel={`Edit ${characteristic.name}`}
                    accessibilityRole="button"
                    onPress={() =>
                      startEditing(characteristic.id, characteristic.name)
                    }
                    style={styles.nameButton}
                  >
                    <Text style={styles.name}>{characteristic.name}</Text>
                  </Pressable>
                )}
              </View>

              <View style={styles.controls}>
                <Pressable
                  accessibilityLabel={`Move ${characteristic.name} up`}
                  accessibilityRole="button"
                  accessibilityState={{ disabled: isFirst }}
                  disabled={isFirst}
                  hitSlop={space.xs}
                  onPress={() => moveCharacteristic(characteristic.id, 'up')}
                  style={({ pressed }) => [
                    styles.arrowButton,
                    isFirst && styles.disabledButton,
                    pressed && styles.pressed,
                  ]}
                >
                  <Text style={styles.arrow}>↑</Text>
                </Pressable>
                <Pressable
                  accessibilityLabel={`Move ${characteristic.name} down`}
                  accessibilityRole="button"
                  accessibilityState={{ disabled: isLast }}
                  disabled={isLast}
                  hitSlop={space.xs}
                  onPress={() => moveCharacteristic(characteristic.id, 'down')}
                  style={({ pressed }) => [
                    styles.arrowButton,
                    isLast && styles.disabledButton,
                    pressed && styles.pressed,
                  ]}
                >
                  <Text style={styles.arrow}>↓</Text>
                </Pressable>
                <Pressable
                  accessibilityLabel={`Remove ${characteristic.name}`}
                  accessibilityRole="button"
                  hitSlop={space.xs}
                  onPress={() => confirmRemove(characteristic.id)}
                  style={({ pressed }) => [
                    styles.removeButton,
                    pressed && styles.pressed,
                  ]}
                >
                  <Text style={styles.removeLabel}>✕</Text>
                </Pressable>
              </View>
            </View>
          );
        })}
      </View>

      <View style={styles.validationCard}>
        <Text style={styles.validationTitle}>Check your coverage</Text>
        <Text style={styles.question}>{COVERAGE_QUESTION}</Text>

        <View style={styles.validationActions}>
          <Pressable
            accessibilityRole="button"
            onPress={back}
            style={({ pressed }) => [
              styles.secondaryButton,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.secondaryLabel}>No, I'm missing something</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={next}
            style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}
          >
            <Text style={styles.primaryLabel}>Yes</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

export default CharacteristicReview;

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
    paddingHorizontal: space.sm,
  },
  number: {
    alignItems: 'center',
    backgroundColor: colors.accentSoft,
    borderRadius: radius.full,
    height: 32,
    justifyContent: 'center',
    marginRight: space.sm,
    width: 32,
  },
  numberLabel: { color: colors.accentPrimary, fontSize: fontSize.sm, fontWeight: '700' },
  nameArea: { flex: 1, minWidth: 0 },
  nameButton: { justifyContent: 'center', minHeight: 48 },
  name: { color: colors.textPrimary, fontSize: fontSize.base },
  editInput: {
    borderColor: colors.accentPrimary,
    borderRadius: radius.sm,
    borderWidth: 1,
    color: colors.textPrimary,
    fontSize: fontSize.base,
    minHeight: 44,
    paddingHorizontal: space.sm,
    paddingVertical: space.xs,
  },
  controls: { alignItems: 'center', flexDirection: 'row', gap: space.xs },
  arrowButton: { alignItems: 'center', height: 36, justifyContent: 'center', width: 30 },
  arrow: { color: colors.textSecondary, fontSize: fontSize.lg },
  removeButton: { alignItems: 'center', height: 36, justifyContent: 'center', marginLeft: space.xs, width: 30 },
  removeLabel: { color: colors.statusDanger, fontSize: fontSize.md },
  disabledButton: { opacity: 0.3 },
  pressed: { opacity: 0.7 },
  validationCard: {
    backgroundColor: colors.bgRaised,
    borderColor: colors.borderStrong,
    borderRadius: radius.lg,
    borderWidth: 1,
    marginTop: space.xxl,
    padding: space.lg,
  },
  validationTitle: { color: colors.textPrimary, fontSize: fontSize.lg, fontWeight: '700' },
  question: {
    color: colors.textSecondary,
    fontSize: fontSize.md,
    lineHeight: 25,
    marginTop: space.md,
  },
  validationActions: { gap: space.sm, marginTop: space.lg },
  secondaryButton: {
    alignItems: 'center',
    borderColor: colors.borderStrong,
    borderRadius: radius.md,
    borderWidth: 1,
    minHeight: 52,
    justifyContent: 'center',
    paddingHorizontal: space.md,
  },
  secondaryLabel: { color: colors.textPrimary, fontSize: fontSize.base, fontWeight: '700' },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: colors.accentPrimary,
    borderRadius: radius.md,
    minHeight: 52,
    justifyContent: 'center',
    paddingHorizontal: space.md,
  },
  primaryLabel: { color: colors.accentOn, fontSize: fontSize.base, fontWeight: '700' },
});
