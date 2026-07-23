import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fontSize, space } from '@/shared/lib/theme';

export default function ProgressScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Progress</Text>
      <Text style={styles.subtitle}>Complete onboarding to see your skill wheel.</Text>
      <Pressable
        accessibilityRole="button"
        onPress={() => router.push('/onboarding')}
        style={styles.button}
      >
        <Text style={styles.buttonLabel}>Start Onboarding</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgBase,
    alignItems: 'center',
    justifyContent: 'center',
    padding: space.xl,
  },
  title: {
    color: colors.textPrimary,
    fontSize: fontSize.xl,
    fontWeight: '600',
  },
  subtitle: {
    color: colors.textSecondary,
    marginTop: space.sm,
    textAlign: 'center',
  },
  button: {
    backgroundColor: colors.accentPrimary,
    borderRadius: 9999,
    marginTop: space.xl,
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
  },
  buttonLabel: {
    color: colors.accentOn,
    fontWeight: '700',
  },
});
