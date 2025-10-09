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

### Development
```bash
# Backend API (https://localhost:7139)
cd Api
dotnet watch
```

```bash
# Frontend SPA (http://localhost:5173)
cd web
npm ci
npm run dev
```
Vite automatically proxies `/api`, `/swagger`, and `/health` to the API.

### Production
```bash
cd web && npm run build     # build SPA → ../Api/wwwroot
cd ../Api && dotnet run     # serve API + SPA via Kestrel
```

Visit → `https://localhost:7139/`

---

## 🧰 Tech Stack
- **Backend:** .NET 9, ASP.NET Core, Serilog, API Versioning, Swagger
- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS v4
- **Dev Workflow:** `dotnet watch` + Vite HMR  
- **Deployment:** Single Kestrel service serving both SPA & API

---

## 📄 License
MIT © [Your Name or Organization]
