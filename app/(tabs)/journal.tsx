import { StyleSheet, Text, View } from 'react-native';

import { colors, fontSize, space } from '@/shared/lib/theme';

export default function JournalScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Journal</Text>
      <Text style={styles.subtitle}>Practice journal and recordings coming soon.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bgBase,
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
});
