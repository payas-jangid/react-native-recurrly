import { useAuth, useClerk, useUser } from "@clerk/expo";
import { useCallback, useMemo } from "react";

/**
 * Email validation regex - allows most valid email formats
 */
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates an email address format
 */
export const isValidEmail = (email: string): boolean => {
  return emailRegex.test(email);
};

/**
 * Validates password meets minimum requirements
 * Minimum 8 characters
 */
export const isValidPassword = (password: string): boolean => {
  return password.length >= 8;
};

/**
 * Validates password strength with optional scoring
 * Returns true if password meets strength requirements
 */
export const isStrongPassword = (password: string): boolean => {
  // Minimum 8 characters
  if (password.length < 8) return false;

  // Should contain uppercase
  if (!/[A-Z]/.test(password)) return false;

  // Should contain lowercase
  if (!/[a-z]/.test(password)) return false;

  // Should contain number
  if (!/\d/.test(password)) return false;

  return true;
};

/**
 * Hook to get formatted user email for display
 */
export const useDisplayEmail = (): string => {
  const { user } = useUser();

  return useMemo(() => {
    if (!user) return "";
    return (
      user.primaryEmailAddress?.emailAddress ??
      user.emailAddresses?.[0]?.emailAddress ??
      ""
    );
  }, [user]);
};

/**
 * Hook to check if user is authenticated
 */
export const useIsAuthenticated = (): boolean => {
  const { isSignedIn, isLoaded } = useAuth();
  return isLoaded && isSignedIn;
};

/**
 * Hook to get auth state with loading indicator
 */
export const useAuthState = () => {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();

  return useMemo(
    () => ({
      isLoaded,
      isSignedIn,
      user,
      isAuthenticating: isLoaded && !isSignedIn,
      isAuthenticated: isLoaded && isSignedIn,
    }),
    [isLoaded, isSignedIn, user],
  );
};

/**
 * Hook to handle sign out with cleanup
 */
export const useSignOutHandler = () => {
  const { signOut } = useClerk();

  const handleSignOut = useCallback(async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Sign out error:", error);
    }
  }, [signOut]);

  return handleSignOut;
};

/**
 * Formats error messages for display
 */
export const formatAuthError = (error: any): string | undefined => {
  if (!error) return undefined;

  // Clerk error with long message
  if (error.longMessage) return error.longMessage;

  // Clerk error with message
  if (error.message) return error.message;

  // String error
  if (typeof error === "string") return error;

  return undefined;
};

export type RunClerkActionOptions = {
  setFormError: (message: string) => void;
  setStatusMessage?: (message: string) => void;
  defaultErrorMessage?: string;
};

export async function runClerkAction<T>(
  action: () => Promise<T>,
  {
    setFormError,
    setStatusMessage,
    defaultErrorMessage = "An error occurred. Please try again.",
  }: RunClerkActionOptions,
): Promise<T | undefined> {
  try {
    return await action();
  } catch (error) {
    const message = formatAuthError(error) || defaultErrorMessage;
    setFormError(message);
    if (setStatusMessage) {
      setStatusMessage("");
    }
    return undefined;
  }
}

/**
 * Check if an error is a specific Clerk error code
 */
export const isClerkErrorCode = (error: any, code: string): boolean => {
  return error?.code === code || error?.errors?.[0]?.code === code;
};

/**
 * Common Clerk error codes
 */
export const CLERK_ERROR_CODES = {
  USER_NOT_FOUND: "form_identifier_not_found",
  INVALID_PASSWORD: "form_password_incorrect",
  PASSWORD_TOO_SHORT: "password_too_short",
  EMAIL_EXISTS: "form_identifier_exists",
  INVALID_EMAIL: "form_param_format_invalid",
  TOO_MANY_ATTEMPTS: "too_many_attempts",
  SESSION_EXPIRED: "session_expired",
} as const;

/**
 * Debounce function for input validation
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number,
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

/**
 * Get user initials for avatar display
 */
export const getUserInitials = (email?: string): string => {
  if (!email) return "?";

  const parts = email.split("@")[0].split(".");
  if (parts.length > 1) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }

  return email.slice(0, 2).toUpperCase();
};

/**
 * Mask email for privacy (show first char, hide middle)
 */
export const maskEmail = (email: string): string => {
  const [localPart, domain] = email.split("@");
  const visibleLength = Math.max(1, Math.floor(localPart.length / 3));
  const masked =
    localPart.slice(0, visibleLength) +
    "*".repeat(Math.max(0, localPart.length - visibleLength * 2)) +
    localPart.slice(-visibleLength);
  return `${masked}@${domain}`;
};
