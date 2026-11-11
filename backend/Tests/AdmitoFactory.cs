using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Time.Testing;

namespace Admito.Tests;

// Starts the real backend in memory, against its own database.
public class AdmitoFactory : WebApplicationFactory<Program>
{
    // A clock the tests can move forward, to expire holds without waiting.
    public FakeTimeProvider Clock { get; } = new(DateTimeOffset.UtcNow);

    public AdmitoFactory()
    {
        // Set before the app starts. A separate database keeps your own data untouched.
        Environment.SetEnvironmentVariable("ConnectionStrings__Default",
            "Host=db;Database=admito_test;Username=admito;Password=admito;Maximum Pool Size=50;Timeout=60;Command Timeout=60");
        Environment.SetEnvironmentVariable("HOLD_MINUTES", "10");
    }

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureLogging(logging => logging.ClearProviders());
        builder.ConfigureTestServices(services =>
        {
            services.RemoveAll<TimeProvider>();
            services.AddSingleton<TimeProvider>(Clock);
        });
    }
}