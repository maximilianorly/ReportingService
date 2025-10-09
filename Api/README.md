# ReportingService API

## Overview
This project hosts the **backend API** and **static SPA assets** for the ReportingService system.  
It exposes versioned REST endpoints and serves the compiled React frontend from `wwwroot` in production.

**Tech stack**
- .NET 9 (ASP.NET Core Web API)
- Serilog for structured logging
- API Versioning (`Asp.Versioning`)
- Swagger / OpenAPI for interactive docs
- Health Checks (`/health`)
- CORS (dev-only for Vite on port 5173)
- Static SPA serving (Vite build → `Api/wwwroot`)
- Hot reload via `dotnet watch`

---

## Repository structure
```text
ReportingService/
├── Api/            # This app
│   ├── Program.cs
│   ├── appsettings*.json
│   ├── Properties/launchSettings.json
│   ├── wwwroot/    # Populated by Vite build
│   └── ...
└── web/            # React + Vite SPA
```

---

## Development

### Prerequisites
- .NET 9 SDK (`dotnet --version`)
- Node 18+ (for the SPA)
- Trusted HTTPS dev cert  
  ```bash
  dotnet dev-certs https --trust
  ```

### Run the API with hot reload
```bash
cd Api
dotnet watch
```

**Endpoints**
- API → `https://localhost:7139/api/v1/hello`
- Swagger → `https://localhost:7139/swagger`
- Health → `https://localhost:7139/health`

During development, the frontend runs on **Vite (`http://localhost:5173`)** and proxies API requests to `http://localhost:5010`.

---

## Production (SPA + API)
1. Build the frontend:
   ```bash
   cd web
   npm ci
   npm run build
   ```
   → outputs static assets to `../Api/wwwroot`

2. Publish the API:
   ```bash
   cd ../Api
   dotnet publish -c Release -o out
   ```

3. Run the published binary:
   ```bash
   ./out/Api
   ```

**Production URLs**
- SPA → `https://localhost:7139/`
- API → `https://localhost:7139/api/v1/hello`
- Swagger → `https://localhost:7139/swagger`

---

## Configuration & secrets

Local secrets use **.NET User Secrets** (`<UserSecretsId>` in `.csproj`):

```bash
cd Api
dotnet user-secrets set "ConnectionStrings:AppDb" "Server=...;Database=..."
dotnet user-secrets list
```

Production secrets should be provided via environment variables or a secret manager.

---

## Logging
- Configured via Serilog (`appsettings*.json`).
- Logs are written to console; extend sinks for file/Seq/ELK as needed.

---

## Health & Monitoring
- `/health` → `200 OK` when healthy.
- Add additional checks (DB, services) via `builder.Services.AddHealthChecks()`.

---

## Testing
Add tests under `/tests` (not included yet):

```bash
dotnet test
```

---

## Deployment
Single service deployment — Kestrel serves both API and SPA.

A typical pipeline:
1. `npm ci && npm run build` (in `web`)
2. `dotnet publish -c Release`
3. Deploy contents of `/Api/out`

Reverse proxy (NGINX, Caddy, or Cloudflare Tunnel) recommended for TLS termination and routing.

---

## Design Notes
- All API calls use relative URLs (`/api/...`) → works in both dev (proxy) and prod (same origin).
- `MapFallbackToFile("index.html")` enables React client-side routing.
- Ready for database integration and DevExpress Reporting modules next.

---

## Future extensions
- EF Core integration and migrations
- Authentication (JWT or cookie)
- DevExpress Report Viewer & Designer endpoints
- Dockerfile + CI/CD pipeline
