# --- Build SPA ---
FROM node:20-bookworm AS webbuild
WORKDIR /src
COPY web/package*.json web/
RUN --mount=type=cache,target=/root/.npm npm --prefix web ci
COPY web web
COPY Api Api
RUN npm --prefix web run build   # emits into Api/wwwroot via your Vite config

# --- Publish .NET ---
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS publish
WORKDIR /src
COPY NuGet.Config ./
COPY Api Api
COPY Reporting Reporting
RUN dotnet restore Api/Api.csproj
RUN dotnet publish Api/Api.csproj -c Release -o /out

# --- Runtime (Ubuntu) ---
FROM mcr.microsoft.com/dotnet/aspnet:9.0-jammy AS runtime
RUN apt-get update && apt-get install -y --no-install-recommends fontconfig && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY --from=publish /out ./
ENV ASPNETCORE_URLS=http://+:8080 \
    ASPNETCORE_ENVIRONMENT=Production \
    DOTNET_SYSTEM_GLOBALIZATION_INVARIANT=false
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s --retries=3 CMD wget -qO- http://localhost:8080/health || exit 1
ENTRYPOINT ["dotnet","Api.dll"]
