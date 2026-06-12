/**
 * Authentication Type Definitions
 */

import type { UserResource } from "@clerk/types";

/**
 * Auth state for the application
 */
export type AuthState = {
  isLoaded: boolean;
  isSignedIn: boolean;
  user: UserResource | null | undefined;
  isAuthenticating: boolean;
  isAuthenticated: boolean;
};

/**
 * Sign-up form state
 */
export type SignUpFormState = {
  emailAddress: string;
  password: string;
  code: string;
  isVerifying: boolean;
  errors: Record<string, string>;
  statusMessage: string;
};

/**
 * Sign-in form state
 */
export type SignInFormState = {
  emailAddress: string;
  password: string;
  code: string;
  isVerifying: boolean;
  errors: Record<string, string>;
  statusMessage: string;
};

/**
 * User profile for display
 */
export type UserProfile = {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  fullName?: string;
  imageUrl?: string;
  createdAt: Date;
};

/**
 * Auth error response
 */
export type AuthError = {
  code?: string;
  message: string;
  longMessage?: string;
  fieldName?: string;
};

/**
 * MFA verification status
 */
export type MFAStatus =
  | "not_required"
  | "pending_verification"
  | "verified"
  | "failed";

/**
 * Session task type from Clerk
 */
export type SessionTask =
  | "verify_email"
  | "verify_phone_number"
  | "update_password"
  | "update_profile";
