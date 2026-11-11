namespace Admito.Common;

public static class TimeProviderExtensions
{
    public static DateTime UtcNow(this TimeProvider clock) => clock.GetUtcNow().UtcDateTime;
}