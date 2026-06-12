# Clerk Authentication Setup Guide

## Overview

This Recurly app now includes a complete production-grade Clerk authentication system with custom-branded sign-in and sign-up screens that match the app's design system.

## Features Implemented

✅ **ClerkProvider** wraps the entire app at the root layout  
✅ **Custom Sign-In Flow** with email/password and optional MFA  
✅ **Custom Sign-Up Flow** with email verification  
✅ **Auth Guards** - Tabs require sign-in, auth routes redirect signed-in users  
✅ **Settings Integration** - Sign-out button with account display  
✅ **NativeWind Styled** - All screens use the existing color palette, typography, and spacing  
✅ **Brand Identity** - "Recurly" branding, no generic Clerk UI

## Prerequisites

1. A Clerk account with a Publishable Key
2. Expo 54+ setup (already configured)
3. SDK 54 or later

## Configuration Steps

### 1. Set Your Clerk Publishable Key

First, copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Then add your Clerk Publishable Key to `.env`:

```env
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
```

**To find your key:**

- Go to [Clerk Dashboard](https://dashboard.clerk.com)
- Navigate to **API Keys**
- Copy your **Publishable Key** from the Quick Copy section

> **Note:** Keep your `.env` file local and private. It's already in `.gitignore` to prevent accidental commits.

### 2. Install Dependencies (Already Done)

The following were installed:

- `@clerk/expo@^3.3.1` - Clerk SDK
- `expo-secure-store@^13.0.0` - Secure token storage

### 3. Update app.json (Already Done)

The `app.json` now includes:

```json
"plugins": [
  "expo-router",
  "expo-secure-store",
  "@clerk/expo",
  ...
]
```

## How It Works

### Authentication Flow

1. **Unauthenticated users** landing on `/` → redirected to `/sign-in`
2. **Sign-In** → Email verification (optional MFA) → Tabs navigation
3. **Sign-Up** → Email verification → Tabs navigation
4. **Signed-In Users** → Access tabs (`/`, insights, subscriptions, settings)
5. **Settings Tab** → Shows signed-in email, Sign Out button

### Route Protection

- `app/(auth)/*` - Protected by `AuthLayout`, redirects signed-in users to home
- `app/(tabs)/*` - Protected by `TabLayout`, redirects unsigned users to sign-in
- `app/(auth)/_layout.tsx` - Uses `useAuth()` to enforce protection

### Key Components

#### `app/_layout.tsx`

- Wraps app with `<ClerkProvider>`
- Manages fonts and splash screen

#### `app/(auth)/sign-in.tsx`

- Email/password sign-in
- Optional MFA verification via email
- Client trust flow for second factor
- Inline validation with error states

#### `app/(auth)/sign-up.tsx`

- Email/password account creation
- Password strength hint (8+ characters)
- Email verification code
- Conversion-focused messaging

#### `app/(tabs)/_layout.tsx`

- Enforces `useAuth()` check
- Redirects unsigned users to `/sign-in`

#### `app/(tabs)/settings.tsx`

- Displays signed-in user email
- Sign-out button
- Account information card

## Styling

All auth screens use the existing Recurly design system:

- **Colors**: `#081126` (primary), `#ea7a53` (accent), `#fff9e3` (background)
- **Font**: Plus Jakarta Sans (all weights)
- **Components**: `auth-*` NativeWind classes in `global.css`
- **Layout**: Rounded corners, card-based, spacious padding

## Customization

### Changing Button Colors

Edit `global.css`:

```css
.auth-button {
  @apply mt-1 items-center rounded-2xl bg-accent py-4;
}
```

### Changing Text Copy

Edit sign-in/sign-up screens:

```tsx
<Text className="auth-subtitle">Your custom message here</Text>
```

### Changing Form Validation

Edit the `emailRegex` and `passwordIsValid` logic in sign-in/sign-up files.

## Testing

### Sign Up

1. Run `npm start`
2. Navigate to sign-up screen
3. Enter email and password (8+ chars)
4. Verify email code
5. Auto-redirects to home screen

### Sign In

1. Sign out from settings
2. Enter previously signed-up credentials
3. Verify email if MFA enabled
4. Returns to home screen

### Navigation Guards

- Try accessing tabs without signing in → redirects to sign-in
- Sign in → tabs become accessible
- Sign out → redirected to sign-in

## Error Handling

The auth screens include:

- **Email validation** - Real-time feedback
- **Password requirements** - 8 character minimum
- **API errors** - User-friendly error messages
- **Network errors** - Graceful fallback messages
- **Loading states** - Activity indicator on submit

## Session Management

Clerk handles:

- Session tokens → encrypted in `expo-secure-store`
- Automatic token refresh → built-in
- Session validation → checked on app launch

## Security Notes

✅ Tokens stored securely via `expo-secure-store`  
✅ All network requests to Clerk over HTTPS  
✅ No sensitive data in logs  
✅ Password fields use `secureTextEntry`  
✅ CSRF protection via Clerk backend

## Troubleshooting

### "Add your Clerk Publishable Key" error

- Missing `.env` file or `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` variable
- Solution: Add key to `.env` and restart dev server

### Cannot find module '@clerk/expo'

- Language server cache issue
- Solution: Save a file or restart VS Code

### Sign-up succeeds but doesn't verify

- Verification code not sent
- Solution: Check Clerk Dashboard for email configuration

### MFA not triggering on sign-in

- Must be enabled in Clerk Dashboard → User & Authentication → Multi-factor Authentication
- Solution: Enable email code as MFA strategy

## Next Steps

1. **Custom OAuth** - Add Sign in with Google/Apple
   - See: [Sign in with Google Guide](https://clerk.com/docs/expo/guides/configure/auth-strategies/sign-in-with-google.md)
   - See: [Sign in with Apple Guide](https://clerk.com/docs/expo/guides/configure/auth-strategies/sign-in-with-apple.md)

2. **Additional User Data** - Extend sign-up with name, organization, etc.
   - Modify `handleSubmit()` in sign-up.tsx
   - Use `signUp.unsafeMetadata()` for custom fields

3. **Password Reset** - Add forgot password flow
   - Create `app/(auth)/forgot-password.tsx`
   - Use `useSignIn().create({ strategy: 'reset_password_email' })`

4. **Social Logins** - Native OAuth buttons
   - Install `expo-auth-session`, `expo-web-browser`
   - Implement `useSignInWithGoogle()`, `useSignInWithApple()`

5. **Profile Editing** - Allow users to update account info
   - Use `useUser()` hook and `user.update()`
   - Create settings page for email/password changes

## Resources

- [Clerk Expo Documentation](https://clerk.com/docs/expo/overview)
- [Clerk Custom Flows](https://clerk.com/docs/guides/development/custom-flows/overview)
- [Clerk API Reference](https://clerk.com/docs/reference/expo/overview)
- [NativeWind Documentation](https://www.nativewind.dev/)
- [Expo Router Guide](https://docs.expo.dev/router/introduction/)

---

**Last Updated**: 2026-06-09  
**App Version**: 1.0.0  
**Clerk SDK**: ^3.3.1  
**Expo Version**: ~54.0.34
