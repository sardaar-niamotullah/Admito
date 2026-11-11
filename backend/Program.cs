using System.Text.Json;
using System.Text.Json.Serialization;
using Admito.Common;
using Admito.Data;
using Admito.Endpoints;
using Admito.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDb>(o => o
    .UseNpgsql(builder.Configuration.GetConnectionString("Default"))
    .UseSnakeCaseNamingConvention());

builder.Services.Configure<HoldOptions>(o => o.Minutes = builder.Configuration.GetValue("HOLD_MINUTES", 10));
builder.Services.AddSingleton(TimeProvider.System);
builder.Services.AddScoped<ClassService>();
builder.Services.AddScoped<HoldService>();

// Enums are sent as HELD, CONFIRMED, EXPIRED, CANCELLED.
builder.Services.ConfigureHttpJsonOptions(o =>
    o.SerializerOptions.Converters.Add(new JsonStringEnumConverter(JsonNamingPolicy.SnakeCaseUpper)));

builder.Services.AddCors(o => o.AddDefaultPolicy(p => p.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod()));
builder.Services.AddExceptionHandler<AppExceptionHandler>();
builder.Services.AddProblemDetails();

var app = builder.Build();

app.UseExceptionHandler();
app.UseCors();

app.MapClassEndpoints();
app.MapHoldEndpoints();

using (var scope = app.Services.CreateScope())
    scope.ServiceProvider.GetRequiredService<AppDb>().Database.EnsureCreated();

app.Run();

public partial class Program { }