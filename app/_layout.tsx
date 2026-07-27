import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';

import { colors } from '@/shared/lib/theme';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" backgroundColor={colors.bgBase} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.bgBase },
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="onboarding"
          options={{
            presentation: 'fullScreenModal',
            headerShown: false,
            gestureEnabled: false,
          }}
        />
      </Stack>
    </>
  );
}
