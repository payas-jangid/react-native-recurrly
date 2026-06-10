import { useAuth, useSignIn } from "@clerk/expo";
import { Link, useRouter, type Href } from "expo-router";
import { styled } from "nativewind";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  Text,
  TextInput,
  View,
} from "react-native";

const SafeArea = styled(SafeAreaView);
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Page() {
  const { signIn, fetchStatus } = useSignIn();
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [formError, setFormError] = useState("");

  const emailIsValid = useMemo(
    () => emailRegex.test(emailAddress),
    [emailAddress],
  );
  const passwordIsValid = useMemo(() => password.length >= 8, [password]);
  const canSubmit =
    emailIsValid && passwordIsValid && fetchStatus !== "fetching";
  const isVerifying =
    signIn.status === "needs_client_trust" ||
    signIn.status === "needs_second_factor";

  const navigateAfterAuth = async () => {
    await signIn.finalize({
      navigate: ({ session, decorateUrl }) => {
        if (session?.currentTask) {
          return;
        }

        const destination = decorateUrl("/");
        if (destination.startsWith("http") && typeof window !== "undefined") {
          window.location.href = destination;
          return;
        }

        router.push(destination as Href);
      },
    });
  };

  const handleSubmit = async () => {
    setFormError("");
    setStatusMessage("");

    if (!emailAddress || !emailIsValid) {
      setFormError("Enter a valid email address.");
      return;
    }

    if (!passwordIsValid) {
      setFormError("Use a password with at least 8 characters.");
      return;
    }

    const { error } = await signIn.password({ emailAddress, password });
    if (error) {
      setFormError(error.longMessage ?? error.message ?? "Unable to sign in.");
      return;
    }

    if (signIn.status === "complete") {
      await navigateAfterAuth();
      return;
    }

    if (
      signIn.status === "needs_client_trust" ||
      signIn.status === "needs_second_factor"
    ) {
      const emailFactor = signIn.supportedSecondFactors?.find(
        (factor) => factor.strategy === "email_code",
      );
      if (emailFactor) {
        await signIn.mfa.sendEmailCode();
        setStatusMessage("A verification code was sent to your email.");
      } else {
        setFormError("A verification step is required to complete sign in.");
      }
      return;
    }

    setFormError("Unable to continue sign in. Please try again.");
  };

  const handleVerify = async () => {
    setFormError("");
    setStatusMessage("");

    if (!code.trim()) {
      setFormError("Enter the code from your email.");
      return;
    }

    await signIn.mfa.verifyEmailCode({ code });

    if (signIn.status === "complete") {
      await navigateAfterAuth();
      return;
    }

    setFormError("The code did not match. Please try again.");
  };

  const handleReset = async () => {
    await signIn.reset();
    setEmailAddress("");
    setPassword("");
    setCode("");
    setFormError("");
    setStatusMessage("");
  };

  if (isSignedIn) {
    return null;
  }

  return (
    <SafeArea className="auth-safe-area">
      <View className="auth-content">
        <View className="auth-brand-block">
          <View className="auth-logo-wrap">
            <View className="auth-logo-mark">
              <Text className="auth-logo-mark-text">R</Text>
            </View>
            <View>
              <Text className="auth-wordmark">Recurly</Text>
              <Text className="auth-wordmark-sub">Smart billing</Text>
            </View>
          </View>

          <Text className="auth-title">Welcome back</Text>
          <Text className="auth-subtitle">
            Sign in to keep your subscriptions on track and make billing
            effortless.
          </Text>
        </View>

        <View className="auth-card">
          <View className="auth-form">
            <View className="auth-field">
              <Text className="auth-label">Email address</Text>
              <TextInput
                className={`auth-input ${!emailIsValid && emailAddress ? "auth-input-error" : ""}`}
                placeholder="Enter your email"
                placeholderTextColor="#8f8f8f"
                autoCapitalize="none"
                keyboardType="email-address"
                value={emailAddress}
                onChangeText={setEmailAddress}
              />
            </View>

            <View className="auth-field">
              <Text className="auth-label">Password</Text>
              <TextInput
                className={`auth-input ${!passwordIsValid && password ? "auth-input-error" : ""}`}
                placeholder="Enter your password"
                placeholderTextColor="#8f8f8f"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>

            {formError ? <Text className="auth-error">{formError}</Text> : null}
            {statusMessage ? (
              <Text className="auth-helper">{statusMessage}</Text>
            ) : null}

            {!isVerifying ? (
              <Pressable
                className={`auth-button ${!canSubmit ? "auth-button-disabled" : ""}`}
                onPress={handleSubmit}
                disabled={!canSubmit}
              >
                {fetchStatus === "fetching" ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="auth-button-text">Continue</Text>
                )}
              </Pressable>
            ) : (
              <>
                <View className="auth-field">
                  <Text className="auth-label">Verification code</Text>
                  <TextInput
                    className="auth-input"
                    placeholder="Enter code"
                    placeholderTextColor="#8f8f8f"
                    keyboardType="numeric"
                    value={code}
                    onChangeText={setCode}
                  />
                </View>

                <Pressable
                  className={`auth-button ${fetchStatus === "fetching" ? "auth-button-disabled" : ""}`}
                  onPress={handleVerify}
                  disabled={fetchStatus === "fetching"}
                >
                  {fetchStatus === "fetching" ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text className="auth-button-text">Verify</Text>
                  )}
                </Pressable>

                <Pressable
                  className="auth-secondary-button"
                  onPress={() => signIn.mfa.sendEmailCode()}
                >
                  <Text className="auth-secondary-button-text">
                    Resend code
                  </Text>
                </Pressable>
                <Pressable
                  className="auth-secondary-button"
                  onPress={handleReset}
                >
                  <Text className="auth-secondary-button-text">Start over</Text>
                </Pressable>
              </>
            )}

            <View className="auth-link-row">
              <Text className="auth-link-copy">New to Recurly?</Text>
              <Link href="/sign-up">
                <Text className="auth-link">Create an account</Text>
              </Link>
            </View>
          </View>
        </View>
      </View>
    </SafeArea>
  );
}
