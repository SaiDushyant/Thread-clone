import { tokenCache } from "@/utils/cache";
import {
  ClerkLoaded,
  ClerkProvider,
  useAuth,
  useUser,
} from "@clerk/clerk-expo";
import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_700Bold,
  useFonts,
} from "@expo-google-fonts/dm-sans";
import { Slot, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";

import * as Sentry from "@sentry/react-native";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;
const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});

if (!publishableKey) {
  throw new Error("Add EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env");
}

// const navigationIntegration = Sentry.reactNavigationIntegration();

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  // Set tracesSampleRate to 1.0 to capture 100% of transactions for tracing.
  // We recommend adjusting this value in production.
  // Learn more at
  // https://docs.sentry.io/platforms/javascript/configuration/options/#traces-sample-rate
  tracesSampleRate: 1.0,
  attachScreenshot: true,
  debug: false,
  _experiments: {
    profileSampleRate: 1.0,
    replaysSessionSampleRate: 1.0,
    replaysOnErrorSampleRate: 1.0,
  },
  integrations: [Sentry.mobileReplayIntegration()],
  //[navigationIntegration],
  // enableNativeFramesTracking: true,
});

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

const InitialLayout = () => {
  const [fontLoaded] = useFonts({
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
  });

  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  const user = useUser();

  useEffect(() => {
    if (fontLoaded && isLoaded) {
      SplashScreen.hideAsync();
      setIsReady(true);
    }
  }, [fontLoaded, isLoaded]);

  useEffect(() => {
    if (isReady) {
      if (isSignedIn) {
        router.replace("/(auth)/(tabs)/feed"); // Redirect to authenticated pages
      } else {
        router.replace("/(public)"); // Redirect to public pages
      }
    }
  }, [isReady, isSignedIn]);

  useEffect(() => {
    if (user && user.user) {
      Sentry.setUser({
        id: user.user.id,
        email: user.user.primaryEmailAddress?.emailAddress,
      });
    }
  }, [user]);

  if (!fontLoaded || !isLoaded) return null; // Prevent rendering until everything is loaded

  return <Slot />;
};

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={publishableKey!} tokenCache={tokenCache}>
      <ClerkLoaded>
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
          <InitialLayout />
        </ConvexProviderWithClerk>
      </ClerkLoaded>
    </ClerkProvider>
  );
}
