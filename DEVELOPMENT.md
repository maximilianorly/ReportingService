# Development Guide

## Architecture Overview

### Configuration Strategy

This project follows .NET configuration best practices with environment-specific settings:

#### Configuration Hierarchy (lowest to highest priority)
1. `appsettings.json` - Base configuration
2. `appsettings.{Environment}.json` - Environment-specific overrides
3. User Secrets (Development only) - Local machine secrets
4. Environment Variables - Container/deployment configuration
5. Command Line Arguments

#### Environment Management

**Local Development (No Docker):**
- Uses `launchSettings.json` profiles (`http` or `https`)
- Uses User Secrets for sensitive data (`dotnet user-secrets set "ConnectionStrings:ReportingDb" "..."`)
- Loads `appsettings.Development.json`

**Docker Development:**
- Does NOT use `launchSettings.json` (excluded via `.dockerignore`)
- Uses `--no-launch-profile` flag
- Configuration via environment variables in `docker-compose.dev.yml`
- Requires `.env` file for secrets (copy from `.env.example`)

**Production:**
- Uses `appsettings.Production.json`
- All configuration via environment variables
- Never commit secrets to source control

### Docker vs Local Development

#### When to use Docker Development:
- ✅ Testing platform-specific dependencies (DevExpress rendering on Ubuntu)
- ✅ Testing with real SQL Server
- ✅ Mimicking production environment
- ✅ Testing container orchestration

#### When to use Local Development:
- ✅ Faster iteration (no container rebuilds)
- ✅ Easier debugging in IDE
- ✅ Working on frontend-only changes
- ✅ When platform differences don't matter

## Security Best Practices

### Secrets Management

**DO:**
- ✅ Use User Secrets for local development: `dotnet user-secrets set "Key" "Value"`
- ✅ Use `.env` files for Docker (never commit `.env`, only `.env.example`)
- ✅ Use environment variables in production
- ✅ Use Azure Key Vault, AWS Secrets Manager, or similar in cloud deployments

**DON'T:**
- ❌ Commit passwords in `appsettings.json`
- ❌ Commit `.env` files
- ❌ Use default passwords in production
- ❌ Include connection strings with credentials in config files

### Connection String Management

```bash
# Local Development (User Secrets)
dotnet user-secrets set "ConnectionStrings:ReportingDb" "Server=localhost;Database=ReportingDemo;User ID=sa;Password=YourPassword"

# Docker Development (.env file)
MSSQL_SA_PASSWORD=P@ssw0rd123!

# Production (environment variables or secrets manager)
ConnectionStrings__ReportingDb="Server=prod-server;Database=ReportingProd;..."
```

## Health Checks

All services include health checks:

- **API**: `http://localhost:8080/health` - Checks if API is responsive
- **MSSQL**: SQL query check in docker-compose
- **Web**: Depends on API health

Use `docker compose ps` to see health status of all containers.

## Logging Strategy

### Development
- Console output with detailed logs
- Log level: Information

### Production
- Structured JSON logging (Compact JSON format)
- Log level: Warning
- Consider adding:
  - Application Insights
  - Elasticsearch + Kibana
  - Seq for structured logs

### Example Queries
```csharp
// Structured logging with Serilog
Log.Information("Processing order {OrderId} for customer {CustomerId}", orderId, customerId);
```

## Database Migrations

*Note: Add migration strategy when implementing EF Core or database schema management*

## API Versioning

The API uses URL-based versioning:
- Current version: `v1`
- Base path: `/api/v1/`
- Example: `GET /api/v1/hello`

To add a new version:
```csharp
var v2 = app.NewVersionedApi()
    .MapGroup("/api/v{version:apiVersion}")
    .HasApiVersion(2, 0);

v2.MapGet("/hello", () => Results.Ok(new { message = "Hello from v2!" }));
```

## Testing Strategy

*TODO: Add testing documentation when unit/integration tests are implemented*

### Recommended Testing Layers
1. Unit tests for business logic
2. Integration tests for API endpoints
3. End-to-end tests for critical user flows

## Performance Considerations

### Docker Performance
- Use volume mounts for hot reload in development
- Use named volumes for node_modules and NuGet packages (faster than bind mounts)
- Consider Docker BuildKit for faster builds

### Production Optimization
- Multi-stage builds minimize image size
- Static SPA assets served via Kestrel (consider nginx for high-traffic scenarios)
- Health checks prevent routing to unhealthy instances
- Response compression enabled

## Troubleshooting

### "HTTPS certificate not found" in Docker
**Solution:** We use HTTP only in Docker. The configuration correctly sets `ASPNETCORE_URLS=http://0.0.0.0:8080`.

### "Connection refused" from web container
**Cause:** API container isn't ready yet.  
**Solution:** Web container now waits for API health check before starting.

### Database connection fails
1. Check `.env` file exists with correct password
2. Verify MSSQL container is healthy: `docker compose -f docker-compose.dev.yml ps`
3. Check logs: `docker compose -f docker-compose.dev.yml logs mssql`

### Hot reload not working in Docker
**Solution:** `DOTNET_USE_POLLING_FILE_WATCHER=true` is set in Dockerfile.dev

## Git Workflow

### Branch Strategy
- `main` - Production-ready code
- `develop` - Integration branch
- `feature/*` - Feature branches
- `hotfix/*` - Production hotfixes

### Commit Messages
Follow conventional commits:
```
feat: Add order summary endpoint
fix: Resolve HTTPS configuration in Docker
docs: Update README with Docker instructions
refactor: Simplify configuration loading
```

## Code Quality Standards

### C# Conventions
- Follow Microsoft C# coding conventions
- Use nullable reference types
- Enable ImplicitUsings
- Async/await for I/O operations
- Dependency injection for services

### TypeScript/React Conventions
- Use functional components with hooks
- TypeScript strict mode enabled
- Props interfaces for all components
- Tailwind for styling (avoid inline styles)

## Production Deployment Checklist

Before deploying to production:

- [ ] Remove or secure Swagger UI (currently only in Development)
- [ ] Configure proper CORS origins (not wildcards)
- [ ] Set secure connection strings via environment variables
- [ ] Enable HTTPS with proper certificates
- [ ] Configure proper logging sink (not just console)
- [ ] Set up application monitoring (Application Insights, etc.)
- [ ] Configure database backups
- [ ] Test health check endpoints
- [ ] Review and minimize image size
- [ ] Set resource limits in docker-compose/k8s
- [ ] Configure proper AllowedHosts in appsettings.Production.json
- [ ] Enable response compression
- [ ] Configure rate limiting for APIs

## Resources

- [ASP.NET Core Documentation](https://docs.microsoft.com/en-us/aspnet/core/)
- [Serilog Best Practices](https://github.com/serilog/serilog/wiki/Configuration-Basics)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [API Versioning Guidelines](https://github.com/dotnet/aspnet-api-versioning)


