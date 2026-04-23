# AITV — Mini LMS Mobile App

A mobile-first micro-learning platform built with React Native Expo.

## Tech Stack

- **Framework**: Expo SDK 54 + Expo Router (file-based navigation)
- **Language**: TypeScript (strict mode)
- **Styling**: NativeWind v4 (Tailwind CSS for React Native)
- **State Management**: Zustand
- **Data Fetching**: TanStack React Query v5 + Axios
- **Storage**: Expo SecureStore (tokens) + AsyncStorage (app data)
- **Notifications**: expo-notifications (FCM/APNs)
- **WebView**: react-native-webview with bidirectional postMessage bridge
- **Forms**: React Hook Form + Zod validation
- **Network**: @react-native-community/netinfo

## Setup Instructions

### Prerequisites

- Node.js 18+
- npm
- Expo Go app on your device, or Android Studio / Xcode for emulators

### Installation

```bash
git clone <repo-url>
cd aitv-lms
npm install
npx expo start
```

Scan the QR code with Expo Go (Android) or Camera app (iOS).

### Environment Variables

No `.env` file required. The app uses the public FreeAPI:

```
API Base URL: https://api.freeapi.app
```

### Running on Device

```bash
npx expo start --android
npx expo start --ios
```

### Building APK (Development)

```bash
npx eas build --platform android --profile development
```

## Architecture Decisions

### Why Zustand over Redux?
Zustand gives a minimal, boilerplate-free global store. For an app this size, Redux adds unnecessary complexity. Zustand colocates state and actions cleanly.

### Why React Query for data fetching?
Handles caching, background refetching, retry logic, and loading/error states out of the box. Avoids manual useEffect data fetching anti-patterns.

### Why split SecureStore and AsyncStorage?
SecureStore is encrypted at the OS level — used exclusively for auth tokens. AsyncStorage holds non-sensitive app data (bookmarks, preferences) where performance matters more than encryption.

### Token Refresh Strategy
Axios interceptor catches 401 responses, silently refreshes the access token using the stored refresh token, and retries the original request. If refresh fails, the user is logged out automatically.

### WebView Bridge
Course content is rendered as a local HTML string (not a remote URL) for offline reliability. The native app injects course data into the HTML at render time. The WebView communicates back to native via `window.ReactNativeWebView.postMessage`. The app handles the `continue_learning` and `go_back` actions from the WebView.

### Notification Triggers
- **Bookmark milestone**: Fires immediately when user reaches 5+ bookmarks
- **Daily reminder**: Scheduled 24h after last app open, cancelled and rescheduled on each launch

## Folder Structure

```
app/
  (auth)/             Login & Register screens
  (tabs)/             Main tab screens (Courses, Bookmarks, Profile)
  course/[id].tsx     Course detail with enroll + bookmark
  webview/[id].tsx    WebView content viewer with native bridge
  profile/
    my-courses.tsx    Enrolled courses list
    notifications.tsx Notification toggle settings
    settings.tsx      Edit username + change password
    help.tsx          FAQ accordion + support contact
    privacy.tsx       Full privacy policy
  _layout.tsx         Root layout with auth guard & QueryClient

components/
  ui/                 OfflineBanner, ErrorView, LoadingSpinner
  course/             CourseCard (memoized), CourseCardSkeleton

hooks/
  useCourses.ts       Fetches + adapts course data
  useNotifications.ts Push notification logic
  useNetwork.ts       Offline detection

store/
  authStore.ts        Auth state + token management
  courseStore.ts      Courses, bookmarks, enrollment

lib/
  api.ts              Axios client with interceptors + retry
  secureStorage.ts    Typed wrappers for SecureStore + AsyncStorage
  courseAdapter.ts    Maps RandomUsers + RandomProducts → Course[]

types/                Shared TypeScript interfaces
constants/            Storage keys, API URL, notification IDs
```

## Known Limitations

- Profile picture upload is wired with ActionSheet UI but requires `expo-image-picker` to be installed and added to `app.json` plugins for full functionality
- OTA updates require EAS configuration with a project ID
- Push notifications on iOS require a physical device and proper APNs certificates in production

## Screenshots

_See demo video for full walkthrough._
