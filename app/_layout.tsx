import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';
import * as SystemUI from 'expo-system-ui';

import { colors } from '@/shared/lib/theme';

SystemUI.setBackgroundColorAsync(colors.bgBase);

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
            contentStyle: { backgroundColor: colors.bgBase },
          }}
        />
      </Stack>
    </>
  );
}
