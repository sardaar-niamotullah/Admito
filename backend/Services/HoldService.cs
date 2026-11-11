using Admito.Common;
using Admito.Data;
using Admito.Dtos;
using Admito.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace Admito.Services;

public class HoldService(AppDb db, TimeProvider clock, IOptions<HoldOptions> options)
{
    public async Task<HoldDto> ApplyAsync(Guid classId, StudentId student)
    {
        await using var tx = await db.Database.BeginTransactionAsync();
        var schoolClass = await LockClassAsync(classId);

        // Read the time after the lock, so it follows the order in which requests got the lock.
        var now = clock.UtcNow();
        var live = db.Holds.Where(h => h.ClassId == classId).Live(now);

        if (await live.AnyAsync(h => h.StudentId == student.Value))
            throw AppException.Conflict("You already applied to this class");

        if (await live.CountAsync() >= schoolClass.TotalSeats)
            throw AppException.Conflict("No seats available");

        var hold = new Hold
        {
            ClassId = classId,
            StudentId = student.Value,
            ExpiresAt = now.AddMinutes(options.Value.Minutes),
        };
        db.Holds.Add(hold);
        await db.SaveChangesAsync();
        await tx.CommitAsync();

        return HoldDto.From(hold, now);
    }

    public async Task<HoldDto> GetAsync(Guid holdId)
    {
        var hold = await db.Holds.AsNoTracking().FirstOrDefaultAsync(h => h.Id == holdId)
            ?? throw AppException.NotFound("Hold not found");

        return HoldDto.From(hold, clock.UtcNow());
    }

    public async Task<HoldDto> ConfirmAsync(Guid holdId, StudentId student)
    {
        var hold = await FindOwnedAsync(holdId, student);

        // Same lock as applying, so a hold cannot be confirmed while its seat is being given away.
        await using var tx = await db.Database.BeginTransactionAsync();
        await LockClassAsync(hold.ClassId);

        var now = clock.UtcNow();
        if (!await ChangeStatusAsync(holdId, HoldStatus.Confirmed, now))
            throw AppException.Conflict("Hold is no longer active");

        await tx.CommitAsync();
        return HoldDto.From(hold, now) with { Status = HoldStatus.Confirmed };
    }

    public async Task CancelAsync(Guid holdId, StudentId student)
    {
        await FindOwnedAsync(holdId, student);

        if (!await ChangeStatusAsync(holdId, HoldStatus.Cancelled, clock.UtcNow()))
            throw AppException.Conflict("Only an active hold can be cancelled");
    }

    public async Task<List<MyHoldDto>> GetMineAsync(StudentId student)
    {
        var now = clock.UtcNow();
        var holds = await db.Holds.AsNoTracking()
            .Include(h => h.Class)
            .Where(h => h.StudentId == student.Value)
            .OrderByDescending(h => h.ExpiresAt)
            .ToListAsync();

        return holds
            .Select(h => new MyHoldDto(h.Id, h.ClassId, h.Class.Name, h.StudentId, h.StatusAt(now), h.ExpiresAt))
            .ToList();
    }

    // Locks the class row until the transaction ends: requests for one class run one at a time.
    private async Task<SchoolClass> LockClassAsync(Guid classId) =>
        await db.Classes
            .FromSql($"SELECT * FROM classes WHERE id = {classId} FOR UPDATE")
            .AsNoTracking()
            .SingleOrDefaultAsync()
        ?? throw AppException.NotFound("Class not found");

    // A missing hold and another student's hold both give 404.
    private async Task<Hold> FindOwnedAsync(Guid holdId, StudentId student) =>
        await db.Holds.AsNoTracking().FirstOrDefaultAsync(h => h.Id == holdId && h.StudentId == student.Value)
        ?? throw AppException.NotFound("Hold not found");

    // Changes the status only if the hold is still active. Returns false if it was not.
    private async Task<bool> ChangeStatusAsync(Guid holdId, HoldStatus status, DateTime now) =>
        await db.Holds.Active(now)
            .Where(h => h.Id == holdId)
            .ExecuteUpdateAsync(s => s.SetProperty(h => h.Status, status)) == 1;
}