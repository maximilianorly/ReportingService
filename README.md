# 🧩 ReportingService

A full-stack **reporting platform** built with **.NET 9 (ASP.NET Core)** and **React (Vite + Tailwind)**.  
It provides a modern foundation for generating and viewing SQL-based reports, designed for performance, versioned APIs, and extensibility.

---

## 🏗️ Project Structure
```text
ReportingService/
├── Api/   # ASP.NET Core backend + SPA hosting
└── web/   # React + Vite + Tailwind frontend
```

- **Api/** → Handles API endpoints, health checks, logging (Serilog), Swagger docs, and serves the built SPA.  
- **web/** → Frontend SPA with React, Tailwind CSS, and Vite for fast HMR development.

---

## 🚀 Quick Start

### Option 1: Local Development (without Docker)
```bash
# Backend API (http://localhost:8080)
cd Api
dotnet watch --launch-profile http

# Frontend SPA (http://localhost:5173) - in separate terminal
cd web
npm ci
npm run dev
```
Vite automatically proxies `/api`, `/swagger`, and `/health` to the API.

### Option 2: Docker Development (Recommended)
**Matches production Ubuntu environment** for platform-specific dependencies (e.g., DevExpress reporting).

**First time setup:**
```bash
# Create .env file from example
cp .env.example .env
# Edit .env and set MSSQL_SA_PASSWORD to a secure password
```

**Start services:**
```bash
# Build and start all containers (API, Web, MSSQL)
docker compose -f docker-compose.dev.yml up --build -d

# View logs
docker compose -f docker-compose.dev.yml logs -f

# View specific service logs
docker compose -f docker-compose.dev.yml logs -f api
```

**Access the app:**
- Frontend: http://localhost:5173
- API: http://localhost:8080/health
- Swagger: http://localhost:8080/swagger
- Database: localhost:1433

**Managing containers:**
```bash
# Stop (keeps containers & data)
docker compose -f docker-compose.dev.yml stop

# Start stopped containers
docker compose -f docker-compose.dev.yml start

# Rebuild after code changes
docker compose -f docker-compose.dev.yml up --build -d

# View container health
docker compose -f docker-compose.dev.yml ps

# Completely remove containers & volumes (⚠️ deletes DB data)
docker compose -f docker-compose.dev.yml down -v
```

### Production Deployment
```bash
# Build production image
docker build -t reportingservice-api:latest -f Api/Dockerfile .

# Run in production (use docker-compose.prod.yml or direct docker run)
docker compose -f docker-compose.prod.yml up -d
```

---

## 🧰 Tech Stack
- **Backend:** .NET 9, ASP.NET Core, Serilog, API Versioning, Swagger
- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS v4
- **Dev Workflow:** `dotnet watch` + Vite HMR  
- **Deployment:** Single Kestrel service serving both SPA & API

---

## 📄 License
MIT © [Your Name or Organization]
