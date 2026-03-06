<h1 align="center">Grocery App</h1>

<p align="center">
  <img src="https://img.shields.io/badge/Backend-Spring%20Boot-6DB33F?logo=springboot&logoColor=white" alt="Backend" />
  <img src="https://img.shields.io/badge/Frontend-React%20%2B%20Expo-61DAFB?logo=react&logoColor=black" alt="Frontend" />
  <img src="https://img.shields.io/badge/Database-PostgreSQL-336791?logo=postgresql&logoColor=white" alt="Database" />
  <img src="https://img.shields.io/badge/Package%20Manager-pnpm-F69220?logo=pnpm&logoColor=white" alt="pnpm" />
</p>

<p align="center">A full-stack grocery list app with authentication, shared lists, and item management. Built with a React (web) + Expo (mobile) frontend and a Spring Boot API.<p>

## Highlights

- Token-based auth with refresh rotation
- Shared grocery lists and item management
- Spring Boot + PostgreSQL backend
- React web app and Expo mobile app

## Tech Stack

<p>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" height="36" alt="Java" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg" height="36" alt="Spring" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" height="36" alt="PostgreSQL" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" height="36" alt="React" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" height="36" alt="TypeScript" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" height="36" alt="JavaScript" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vitejs/vitejs-original.svg" height="36" alt="Vite" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/android/android-original.svg" height="36" alt="Android" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apple/apple-original.svg" height="36" alt="iOS" />
</p>

## Screenshots

### Web

<table>
    <tr>
      <th width="20%">Login</th>
      <th width="20%">Home</th>
      <th width="20%">List</th>
    </tr>
    <tr>
      <td width="20%"><img src="frontend/docs/screenshots/placeholder-web-login.png" alt="Login" /></td>
      <td width="20%"><img src="frontend/docs/screenshots/placeholder-web-home.png" alt="Home" /></td>
      <td width="20%"><img src="frontend/docs/screenshots/placeholder-web-list.png" alt="List" /></td>
    </tr>
</table>

<table>
    <tr>
      <th width="33%">Share</th>
      <th width="33%">Settings</th>
      <th width="33%">Dark Mode</th>
    </tr>
    <tr>
      <td width="33%"><img src="frontend/docs/screenshots/placeholder-web-share.png" alt="List" /></td>
      <td width="33%"><img src="frontend/docs/screenshots/placeholder-web-settings.png" alt="Settings" /></td>
      <td width="33%"><img src="frontend/docs/screenshots/placeholder-web-dark-mode.png" alt="Dark Mode" /></td>
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
        <td width="25%"><img src="frontend/docs/screenshots/placeholder-mobile-login.png" alt="Login" height="400" /></td>
        <td width="25%"><img src="frontend/docs/screenshots/placeholder-mobile-home.png" alt="Home" height="400" /></td>
        <td width="25%"><img src="frontend/docs/screenshots/placeholder-mobile-list.png" alt="List" height="400" /></td>
        <td width="25%"><img src="frontend/docs/screenshots/placeholder-mobile-settings.png" alt="Settings" height="400" /></td>
    </tr>
</table>

## Quick Start

### Backend

```bash
cd backend/spring
./mvnw spring-boot:run
```

### Frontend (Web)

```bash
cd frontend
pnpm install
pnpm run dev:web
```

### Frontend (Mobile)

```bash
cd frontend
pnpm install
pnpm run dev:mobile
```

## Documentation

- Backend: `backend/spring/README.md`
- Frontend: `frontend/README.md`

## License

MIT
