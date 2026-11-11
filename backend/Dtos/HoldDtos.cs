using Admito.Models;

namespace Admito.Dtos;

public record HoldDto(Guid HoldId, Guid ClassId, string StudentId, HoldStatus Status, DateTime ExpiresAt)
{
    public static HoldDto From(Hold hold, DateTime now) =>
        new(hold.Id, hold.ClassId, hold.StudentId, hold.StatusAt(now), hold.ExpiresAt);
}

public record MyHoldDto(
    Guid HoldId, Guid ClassId, string ClassName, string StudentId, HoldStatus Status, DateTime ExpiresAt);