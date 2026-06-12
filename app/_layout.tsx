import "@/global.css";
import { ClerkProvider, useAuth, useUser } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { useFonts } from "expo-font";
import { SplashScreen, Stack, usePathname } from "expo-router";
import { useEffect, type ReactNode } from "react";
import { Platform } from "react-native";

SplashScreen.preventAutoHideAsync();

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
const posthogPackageName = "posthog" + "-react-native";
const PostHogProvider: any =
  Platform.OS === "web"
    ? ({ children }: { children: ReactNode }) => <>{children}</>
    : require(posthogPackageName).PostHogProvider;
if (!publishableKey) {
  throw new Error(
    "Add your Clerk Publishable Key to the .env file as EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY",
  );
}

function ScreenTracker() {
  if (Platform.OS === "web") return null;

  const { usePostHog } = require(posthogPackageName);
  const posthog = usePostHog();
  const pathname = usePathname();

  useEffect(() => {
    posthog?.screen(pathname);
  }, [posthog, pathname]);

  return null;
}

function UserTracker() {
  if (Platform.OS === "web") return null;

  const { usePostHog } = require(posthogPackageName);
  const posthog: any = usePostHog();
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();

  const userId = user?.id;
  const email =
    user?.primaryEmailAddress?.emailAddress ??
    user?.emailAddresses?.[0]?.emailAddress;
  const username = user?.username ?? user?.fullName ?? user?.firstName;

  useEffect(() => {
    if (!posthog || !isLoaded) return;

    if (isSignedIn && userId) {
      const distinctId = email ?? username ?? userId;
      const personProperties: Record<string, string> = {};

      if (email) personProperties.email = email;
      if (username) personProperties.username = username;
      if (userId) personProperties.userId = userId;

      posthog.identify(distinctId, { $set: personProperties });
      return;
    }

    posthog.reset?.();
  }, [posthog, isLoaded, isSignedIn, userId, email, username]);

  return null;
}

export default function RootLayout() {
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

  return (
    <PostHogProvider
      apiKey={process.env.EXPO_PUBLIC_POSTHOG_KEY!}
      options={{ host: process.env.EXPO_PUBLIC_POSTHOG_HOST }}
      autocapture={{
        captureTouches: true,
        captureScreens: false,
      }}
    >
      <ScreenTracker />
      <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
        <UserTracker />
        <Stack screenOptions={{ headerShown: false }} />
      </ClerkProvider>
    </PostHogProvider>
  );
}
