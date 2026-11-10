using Npgsql;

var builder = WebApplication.CreateBuilder(args);

var dataSource = NpgsqlDataSource.Create(builder.Configuration.GetConnectionString("Default")!);
builder.Services.AddSingleton(dataSource);

var app = builder.Build();

app.MapGet("/api/hello", async (NpgsqlDataSource db) =>
{
    await using var cmd = db.CreateCommand("SELECT 'Hello World'");
    var message = (string?)await cmd.ExecuteScalarAsync();
    return Results.Ok(new { message });
});

app.Run();