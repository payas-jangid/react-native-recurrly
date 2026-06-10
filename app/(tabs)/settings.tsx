import { useClerk, useUser } from "@clerk/expo";
import { styled } from "nativewind";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const Setting = () => {
  const { signOut } = useClerk();
  const { user } = useUser();

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <View className="rounded-3xl bg-card p-6 shadow-lg shadow-black/5">
        <Text className="text-2xl font-sans-bold text-primary">Account</Text>
        <Text className="mt-2 text-sm font-sans-medium text-muted-foreground">
          Signed in as{" "}
          {user?.primaryEmailAddress?.emailAddress ??
            user?.emailAddresses?.[0]?.emailAddress ??
            "your account"}
        </Text>
      </View>

      <Pressable
        className="mt-6 rounded-3xl bg-accent py-4 items-center"
        onPress={() => signOut()}
      >
        <Text className="text-base font-sans-bold text-background">
          Sign out
        </Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default Setting;
