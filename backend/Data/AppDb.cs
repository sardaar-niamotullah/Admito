using Admito.Models;
using Microsoft.EntityFrameworkCore;

namespace Admito.Data;

public class AppDb(DbContextOptions<AppDb> options) : DbContext(options)
{
    public DbSet<SchoolClass> Classes => Set<SchoolClass>();
    public DbSet<Hold> Holds => Set<Hold>();

    protected override void OnModelCreating(ModelBuilder model)
    {
        model.Entity<Hold>(hold =>
        {
            // Stored as HELD, CONFIRMED, CANCELLED text.
            hold.Property(h => h.Status).HasConversion(
                status => status.ToString().ToUpperInvariant(),
                text => Enum.Parse<HoldStatus>(text, true));

            hold.HasIndex(h => new { h.ClassId, h.Status });
            hold.HasIndex(h => h.StudentId);
        });
    }
}