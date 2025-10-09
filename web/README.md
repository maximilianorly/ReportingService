# ReportingService Web (Vite + React + Tailwind v4)

## Overview
This is the **React SPA** frontend for the ReportingService platform.  
It provides the UI for interacting with the .NET API and will eventually host the DevExpress Report Designer/Viewer.

**Tech stack**
- Vite
- React 18 + TypeScript
- Tailwind CSS v4
- PostCSS + Autoprefixer
- Proxy integration with ASP.NET Core API

---

## Development

### Prerequisites
- Node 18+ and npm
- Backend API running at `http://localhost:5010` or `https://localhost:7139`

### Start the SPA (dev)
```bash
cd web
npm ci
npm run dev
```

**Dev server**
- URL: `http://localhost:5173`
- HMR: ✅
- API requests (`/api`, `/health`, `/swagger`) proxied to Kestrel via `vite.config.ts`.

### Proxy config
```ts
// vite.config.ts (excerpt)
server: {
  proxy: {
    '/api': 'http://localhost:5010',
    '/swagger': 'http://localhost:5010',
    '/health': 'http://localhost:5010'
  }
}
```

Use **relative URLs** (`/api/...`) in fetch or Axios — no host or port hardcoded.

---

## Building for production
```bash
npm run build
```
- Output path: `../Api/wwwroot`
- Kestrel serves these files in production.

Preview production build:
```bash
npm run preview
```

---

## Testing
Add frontend tests using Vitest, React Testing Library, or Playwright.

```bash
npm run test
```

---

## Deployment
This app is bundled into the API deployment process.  
CI/CD will:
1. Build this project
2. Copy artifacts to `Api/wwwroot`
3. Publish and deploy the API

If hosting separately (e.g., CDN), set `base` in `vite.config.ts` and configure your API base URL in `.env`.

---

## Styling
Tailwind v4 setup:
```js
// postcss.config.js
export default {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
};
```

`src/index.css`
```css
@import "tailwindcss";
```

---

## Environment variables
Optional `.env` values:
```
VITE_API_BASE=/api
VITE_ENV=development
```

Use in code:
```ts
import.meta.env.VITE_API_BASE
```

---

## Production
Served statically by Kestrel.

| Environment | SPA URL | API URL | HMR | Notes |
|-------------|---------|---------|-----|-------|
| **Dev**     | http://localhost:5173 | proxied to http://localhost:5010 | ✅ | Vite proxy handles API |
| **Prod**    | https://localhost:7139 | same origin | ❌ | Built assets served by Kestrel |

---

## Folder structure
```text
web/
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   └── lib/
│       └── api.ts
├── public/
│   └── favicon.ico
├── vite.config.ts
├── postcss.config.js
└── tailwind.config.ts (optional)
```

---

## Contributor notes
- Always use relative API paths (`/api/...`).
- Never commit `/dist`, `/node_modules`, or generated files.
- Prefer feature branches and meaningful commits.

---

## Summary
| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (HMR) |
| `npm run build` | Build static assets to `Api/wwwroot` |
| `npm run preview` | Preview production build |
| `dotnet watch` | Run backend API with hot reload |
| `dotnet publish` | Build for production |

---

In production, **one Kestrel process serves both the SPA and API**, making deployment simple and self-contained.
