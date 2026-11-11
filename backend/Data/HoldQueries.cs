using Admito.Models;

namespace Admito.Data;

// The seat rules, written once and reused by every query.
public static class HoldQueries
{
    // Waiting for payment and not expired yet.
    public static IQueryable<Hold> Active(this IQueryable<Hold> holds, DateTime now) =>
        holds.Where(h => h.Status == HoldStatus.Held && h.ExpiresAt > now);

    public static IQueryable<Hold> Confirmed(this IQueryable<Hold> holds) =>
        holds.Where(h => h.Status == HoldStatus.Confirmed);

    // Holds that take a seat: confirmed, or active.
    public static IQueryable<Hold> Live(this IQueryable<Hold> holds, DateTime now) =>
        holds.Where(h => h.Status == HoldStatus.Confirmed ||
                         (h.Status == HoldStatus.Held && h.ExpiresAt > now));
}