import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { AuthProvider, useAuth } from '@/context/AuthContext';
import { DeliveryProvider, useDeliveries } from '@/context/DeliveryContext';
import { useColorScheme } from '@/hooks/useColorScheme';

function LayoutNavigator() {
  const colorScheme = useColorScheme();
  const { user } = useAuth();
  const { startTracking } = useDeliveries();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }

  if (user) {
    // Start tracking location when logged in
    startTracking().catch(() => {});
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        {user ? (
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        ) : (
          <Stack.Screen name="login" options={{ headerShown: false }} />
        )}
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <DeliveryProvider>
        <LayoutNavigator />
      </DeliveryProvider>
    </AuthProvider>
  );
}
