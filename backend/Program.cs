using Npgsql;

var builder = WebApplication.CreateBuilder(args);

var dataSource = NpgsqlDataSource.Create(builder.Configuration.GetConnectionString("Default")!);
builder.Services.AddSingleton(dataSource);
builder.Services.AddCors(o => o.AddDefaultPolicy(p => p.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod()));

var app = builder.Build();
app.UseCors();

app.MapGet("/api/hello", async (NpgsqlDataSource db) =>
{
    await using var cmd = db.CreateCommand("SELECT 'Hello World daw'");
    var message = (string?)await cmd.ExecuteScalarAsync();
    return Results.Ok(new { message });
});

app.Run();

public partial class Program { }