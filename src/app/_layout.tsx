import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";
import { useColorScheme } from "react-native";

import { AnimatedSplashOverlay } from "@/components/animated-icon";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      {/* Mantém a sua animação de splash screen intacta */}
      <AnimatedSplashOverlay />

      {/* Substituímos o AppTabs pela navegação em Stack para o nosso Dashboard */}
      <Stack
        screenOptions={{
          headerShown: false, // Remove a barra preta superior em todas as telas
          contentStyle: { backgroundColor: "#121212" },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="corpo/index" />
        <Stack.Screen name="mente/index" />
        <Stack.Screen name="bolso/index" />
        <Stack.Screen name="estudos/index" />
        <Stack.Screen name="roteiros/index" />
      </Stack>
    </ThemeProvider>
  );
}
