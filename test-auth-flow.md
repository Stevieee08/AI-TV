# Authentication Flow Test Instructions

## Testing User Data Isolation

### 1. Clear Existing Data
- The app preserves user sessions across app restarts
- User stays logged in unless explicitly clicking logout
- User bookmarks, courses, and profile images persist across app restarts
- Use unique emails for testing different users

### 2. Test User 1 Registration
1. Open the app
2. Register with: username: "user1", email: "user1@test.com", password: "password123"
3. Verify you can access the app
4. Bookmark some courses
5. Enroll in some courses
6. Go to profile and upload a profile picture
7. Log out

### 3. Test User 2 Registration  
1. Register with: username: "user2", email: "user2@test.com", password: "password123"
2. Verify you see NO bookmarks or enrolled courses from User 1
3. Verify you see NO profile picture from User 1 (should be empty/default)
4. Bookmark different courses
5. Enroll in different courses
6. Upload a DIFFERENT profile picture
7. Log out

### 4. Test Session Persistence
1. With User 1 still logged in, navigate to any screen (profile, bookmarks, etc.)
2. Close and reopen the app
3. Verify you're still logged in and taken to the home screen (/(tabs))
4. Navigate to profile/bookmarks to verify all your data is still there

### 5. Test User 1 Login After Logout
1. Click logout button explicitly
2. Log back in as User 1
3. Verify you see YOUR bookmarks and enrolled courses (not User 2's data)
4. Verify you see YOUR profile picture (not User 2's picture)

### 5. Test Duplicate Email
1. Try to register with email "user1@test.com" again
2. Should show error message about email already existing

## Key Features Implemented

✅ **User-Specific Storage**: Each user's bookmarks and enrolled courses are stored with unique keys (e.g., `aitv_bookmarks_userId123`)

✅ **Proper Logout**: When logging out, user-specific data is cleared and user is redirected to login screen

✅ **Session Restoration**: When logging back in, user-specific data is loaded correctly

✅ **Data Isolation**: Different users cannot see each other's data

✅ **Data Persistence**: User bookmarks, courses, and profile images persist across logout/login

✅ **User-Specific Profile Images**: Each user has their own profile picture storage (e.g., `aitv_local_avatar_userId123`) that appears consistently across all profile screens

✅ **Username Persistence**: Username updates are preserved across logout/login cycles

✅ **Session Persistence**: Users stay logged in across app restarts unless explicitly logging out

✅ **Simple Navigation**: App always goes to home screen when opened (if logged in) or login screen (if logged out)

## Storage Keys Used

- User bookmarks: `aitv_bookmarks_${userId}`
- User enrolled courses: `aitv_enrolled_${userId}`
- User profile avatar: `aitv_local_avatar_${userId}`
- Auth tokens: `aitv_access_token`, `aitv_refresh_token`
- User data: `aitv_user_data`

## Files Modified

1. `store/courseStore.ts` - Updated to use user-specific storage keys and added reapplyCourseStatus function
2. `store/authStore.ts` - Added user data loading/clearing with course status reapplication
3. `app/_layout.tsx` - Simplified routing logic for clean navigation
4. `app/index.tsx` - Updated to check authentication state before redirecting
5. `lib/clearUserData.ts` - New utility for clearing user data
6. `app/(tabs)/profile.tsx` - Updated to use user-specific avatar storage
7. `app/profile/settings.tsx` - Updated to use user-specific avatar storage
8. `hooks/useCourses.ts` - Fixed race condition in course data loading
