import "@/global.css";
import { ClerkProvider } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { useFonts } from "expo-font";
import { SplashScreen, Stack, useNavigationContainerRef } from "expo-router";
import { PostHogProvider } from "posthog-react-native";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
if (!publishableKey) {
  throw new Error(
    "Add your Clerk Publishable Key to the .env file as EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY",
  );
}

// PostHog configuration (optional)
const hasPostHog = Boolean(
  process.env.EXPO_PUBLIC_POSTHOG_KEY && process.env.EXPO_PUBLIC_POSTHOG_HOST,
);

if (
  !hasPostHog &&
  (process.env.EXPO_PUBLIC_POSTHOG_KEY || process.env.EXPO_PUBLIC_POSTHOG_HOST)
) {
  console.warn(
    "PostHog is partially configured. Please set both EXPO_PUBLIC_POSTHOG_KEY and EXPO_PUBLIC_POSTHOG_HOST to enable analytics.",
  );
}

export default function RootLayout() {
  const navigationRef = useNavigationContainerRef();

  const [fontsLoaded] = useFonts({
    "sans-regular": require("../assets/fonts/PlusJakartaSans-Regular.ttf"),
    "sans-bold": require("../assets/fonts/PlusJakartaSans-Bold.ttf"),
    "sans-medium": require("../assets/fonts/PlusJakartaSans-Medium.ttf"),
    "sans-semibold": require("../assets/fonts/PlusJakartaSans-SemiBold.ttf"),
    "sans-extrabold": require("../assets/fonts/PlusJakartaSans-ExtraBold.ttf"),
    "sans-light": require("../assets/fonts/PlusJakartaSans-Light.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  const clerkStack = (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <Stack screenOptions={{ headerShown: false }} />
    </ClerkProvider>
  );

  if (hasPostHog) {
    return (
      <PostHogProvider
        apiKey={process.env.EXPO_PUBLIC_POSTHOG_KEY}
        options={{ host: process.env.EXPO_PUBLIC_POSTHOG_HOST }}
        navigationRef={navigationRef}
      >
        {clerkStack}
      </PostHogProvider>
    );
  }

  return clerkStack;
}
