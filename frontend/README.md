<h1 align="center">Grocery App Frontend</h1>

<p align="center">
  <img src="https://img.shields.io/badge/Monorepo-pnpm-F69220?logo=pnpm&logoColor=white" alt="pnpm" />
  <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Expo-React%20Native-000020?logo=expo&logoColor=white" alt="Expo" />
</p>

<p align="center">A frontend monorepo for the Grocery App, with a fast web client and a mobile app.</p>

## Apps and Packages

- `apps/web` — React web app (Vite)
- `apps/mobile` — Expo/React Native app
- `packages/shared` — Shared logic

## Screenshots

### Web

<table>
    <tr>
      <th width="20%">Login</th>
      <th width="20%">Home</th>
      <th width="20%">List</th>
    </tr>
    <tr>
      <td width="20%"><img src="docs/screenshots/placeholder-web-login.png" alt="Login" /></td>
      <td width="20%"><img src="docs/screenshots/placeholder-web-home.png" alt="Home" /></td>
      <td width="20%"><img src="docs/screenshots/placeholder-web-list.png" alt="List" /></td>
    </tr>
</table>

<table>
    <tr>
      <th width="33%">Share</th>
      <th width="33%">Settings</th>
      <th width="33%">Dark Mode</th>
    </tr>
    <tr>
      <td width="33%"><img src="docs/screenshots/placeholder-web-share.png" alt="List" /></td>
      <td width="33%"><img src="docs/screenshots/placeholder-web-settings.png" alt="Settings" /></td>
      <td width="33%"><img src="docs/screenshots/placeholder-web-dark-mode.png" alt="Dark Mode" /></td>
    </tr>
</table>

### Mobile

<table>
    <tr>
        <th width="25%">Login</th>
        <th width="25%">Home</th>
        <th width="25%">List</th>
        <th width="25%">Settings</th>
    </tr>
    <tr>
        <td width="25%"><img src="docs/screenshots/placeholder-mobile-login.png" alt="Login" height="400" /></td>
        <td width="25%"><img src="docs/screenshots/placeholder-mobile-home.png" alt="Home" height="400" /></td>
        <td width="25%"><img src="docs/screenshots/placeholder-mobile-list.png" alt="List" height="400" /></td>
        <td width="25%"><img src="docs/screenshots/placeholder-mobile-settings.png" alt="Settings" height="400" /></td>
    </tr>
</table>

## Quick Start

Pick one:

- Web: `apps/web/README.md`
- Mobile: `apps/mobile/README.md`

See each app for commands and environment notes:

- `apps/web/README.md`
- `apps/mobile/README.md`

## Root Scripts

- `pnpm run dev:web`
- `pnpm run build:web`
- `pnpm run lint:web`
- `pnpm run dev:mobile`
- `pnpm run ios:mobile`
- `pnpm run android:mobile`
- `pnpm run web:mobile`
- `pnpm run android:release:mobile`

## Recommended Workflow

- Start the backend from `../backend/spring`.
- Run the web app from `apps/web`.
- Add API base URL and auth values in app-specific `.env` files.

## Repo Layout

```text
apps/
  web/
  mobile/
packages/
  shared/
```

## License

MIT
