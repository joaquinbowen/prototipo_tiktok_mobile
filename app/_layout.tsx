import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { MonetizationProvider } from '@/context/MonetizationContext';

export default function RootLayout() {
  return (
    <MonetizationProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#000000' },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="creator-studio" />
        <Stack.Screen name="payment" />
        <Stack.Screen name="wallet" />
        <Stack.Screen name="dm" />
      </Stack>
    </MonetizationProvider>
  );
}
