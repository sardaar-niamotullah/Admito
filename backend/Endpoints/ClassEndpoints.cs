using Admito.Dtos;
using Admito.Services;

namespace Admito.Endpoints;

public static class ClassEndpoints
{
    public static void MapClassEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/classes");

        group.MapPost("/", async (CreateClassRequest request, ClassService classes) =>
        {
            var created = await classes.CreateAsync(request);
            return Results.Created($"/classes/{created.Id}", created);
        });

        group.MapGet("/", (ClassService classes) => classes.GetAllAsync());

        group.MapGet("/{classId:guid}", (Guid classId, ClassService classes) => classes.GetAsync(classId));
    }
}