using Admito.Common;
using Admito.Data;
using Admito.Dtos;
using Admito.Models;
using Microsoft.EntityFrameworkCore;

namespace Admito.Services;

public class ClassService(AppDb db, TimeProvider clock)
{
    public async Task<ClassDto> CreateAsync(CreateClassRequest request)
    {
        var name = request.Name?.Trim();
        if (string.IsNullOrEmpty(name) || request.TotalSeats < 1)
            throw AppException.BadRequest("name is required and totalSeats must be at least 1");

        var schoolClass = new SchoolClass { Name = name, TotalSeats = request.TotalSeats };
        db.Classes.Add(schoolClass);
        await db.SaveChangesAsync();

        return new ClassDto(schoolClass.Id, schoolClass.Name, schoolClass.TotalSeats, 0, 0);
    }

    public Task<List<ClassDto>> GetAllAsync() =>
        WithSeatCounts(db.Classes.OrderBy(c => c.Name)).ToListAsync();

    public async Task<ClassDto> GetAsync(Guid classId) =>
        await WithSeatCounts(db.Classes.Where(c => c.Id == classId)).FirstOrDefaultAsync()
        ?? throw AppException.NotFound("Class not found");

    // Adds the held and confirmed counts to each class.
    private IQueryable<ClassDto> WithSeatCounts(IQueryable<SchoolClass> classes)
    {
        var held = db.Holds.Active(clock.UtcNow());
        var confirmed = db.Holds.Confirmed();

        return classes.Select(c => new ClassDto(
            c.Id, c.Name, c.TotalSeats,
            held.Count(h => h.ClassId == c.Id),
            confirmed.Count(h => h.ClassId == c.Id)));
    }
}