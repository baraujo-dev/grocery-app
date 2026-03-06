## Mobile App (Expo)

## Run

From the repo root:

- `cd frontend`
- `pnpm run dev:mobile`
- `pnpm run ios:mobile`
- `pnpm run android:mobile`
- `pnpm run web:mobile`
- `pnpm run android:release:mobile`

From this folder:

- `pnpm run start`
- `pnpm run ios`
- `pnpm run android`
- `pnpm run web`

## Environments

Set `EXPO_PUBLIC_APP_ENV` to select config:

- Dev: `EXPO_PUBLIC_APP_ENV=dev pnpm run start`
- Test: `EXPO_PUBLIC_APP_ENV=test pnpm run start`
- Prod: `EXPO_PUBLIC_APP_ENV=prod pnpm run start`

## API Base URL

Set your API base URL for devices:

- copy `.env.example` to `.env`
- update `EXPO_PUBLIC_API_BASE_URL` with your LAN IP (dev only)

## Dependencies

- Install SecureStore for refresh tokens:
  - `pnpm add expo-secure-store`

## Release APK (Android)

1. Generate a release keystore (one time):

```
cd android
keytool -genkeypair -v \
  -keystore grocery-release.keystore \
  -alias grocery-app \
  -keyalg RSA -keysize 2048 -validity 10000
```

2. Configure signing values in `android/gradle.properties`:

```
MYAPP_RELEASE_STORE_FILE=../grocery-release.keystore
MYAPP_RELEASE_KEY_ALIAS=grocery-app
MYAPP_RELEASE_STORE_PASSWORD=CHANGE_ME
MYAPP_RELEASE_KEY_PASSWORD=CHANGE_ME
```

3. Build the release APK:

```
cd /Users/brunoaraujo/dev/app/grocery-app/frontend
pnpm run android:release:mobile
```

Note: release builds set `EXPO_PUBLIC_APP_ENV=prod` automatically via the script.

APK output:

```
android/app/build/outputs/apk/release/app-release.apk
```

Install on a device (USB):

```
adb devices
adb -s DEVICE_ID install -r android/app/build/outputs/apk/release/app-release.apk
```
