using Microsoft.AspNetCore.Diagnostics;

namespace Admito.Common;

public class AppExceptionHandler : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(HttpContext context, Exception exception, CancellationToken ct)
    {
        if (exception is not AppException app) return false;

        context.Response.StatusCode = app.StatusCode;
        await context.Response.WriteAsJsonAsync(new { error = app.Message }, ct);
        return true;
    }
}