namespace Admito.Models;

public class Hold
{
    public Guid Id { get; set; }
    public Guid ClassId { get; set; }
    public SchoolClass Class { get; set; } = null!;
    public string StudentId { get; set; } = "";
    public HoldStatus Status { get; set; } = HoldStatus.Held;
    public DateTime ExpiresAt { get; set; }

    // A Held hold whose time has passed is reported as Expired.
    public HoldStatus StatusAt(DateTime now) =>
        Status == HoldStatus.Held && ExpiresAt <= now ? HoldStatus.Expired : Status;
}