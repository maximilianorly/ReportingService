using Asp.Versioning;
using Asp.Versioning.ApiExplorer;
using Microsoft.AspNetCore.Mvc;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

// Logging
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .Enrich.FromLogContext()
    .CreateLogger();
builder.Host.UseSerilog();

// Services
builder.Services
    .AddApiVersioning(opt =>
    {
        opt.DefaultApiVersion = new ApiVersion(1, 0);
        opt.AssumeDefaultVersionWhenUnspecified = true;
        opt.ReportApiVersions = true;
    })
    .AddApiExplorer(opt =>
    {
        opt.GroupNameFormat = "'v'V";
        opt.SubstituteApiVersionInUrl = true;
    });

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddHealthChecks();

// Dev-only CORS for Vite app. In prod the SPA is same-origin.
if (builder.Environment.IsDevelopment())
{
    builder.Services.AddCors(opt =>
    {
        opt.AddPolicy("DevCors", p => p
            .WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod());
    });
}

var app = builder.Build();

app.UseHttpsRedirection();
app.UseSerilogRequestLogging();

if (app.Environment.IsDevelopment())
{
    app.UseCors("DevCors");

    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "ReportingService API v1");
        c.RoutePrefix = "swagger";
    });
}

app.MapHealthChecks("/health");

// API routes under /api
var v1 = app.NewVersionedApi()
    .MapGroup("/api/v{version:apiVersion}")
    .HasApiVersion(1, 0);

v1.MapGet("/hello", () => Results.Ok(new { message = "Hello from v1!" }))
  .WithName("HelloV1")
  .WithOpenApi();

app.MapControllers();

// Static SPA (built by Vite into Api/wwwroot)
app.UseDefaultFiles();
app.UseStaticFiles();

// Client-side routing fallback (does not affect /api, /swagger, /health)
app.MapFallbackToFile("index.html");

app.Run();
