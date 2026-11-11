using Admito.Common;
using Admito.Services;

namespace Admito.Endpoints;

public static class HoldEndpoints
{
    public static void MapHoldEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapPost("/classes/{classId:guid}/holds", async (Guid classId, StudentId student, HoldService holds) =>
        {
            var hold = await holds.ApplyAsync(classId, student);
            return Results.Created($"/holds/{hold.HoldId}", hold);
        });

        var group = app.MapGroup("/holds");

        group.MapGet("/{holdId:guid}", (Guid holdId, HoldService holds) => holds.GetAsync(holdId));

        group.MapPost("/{holdId:guid}/confirm",
            (Guid holdId, StudentId student, HoldService holds) => holds.ConfirmAsync(holdId, student));

        group.MapDelete("/{holdId:guid}", async (Guid holdId, StudentId student, HoldService holds) =>
        {
            await holds.CancelAsync(holdId, student);
            return Results.NoContent();
        });

        app.MapGet("/me/holds", (StudentId student, HoldService holds) => holds.GetMineAsync(student));
    }
}