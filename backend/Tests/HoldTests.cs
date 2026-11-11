using System.Net;
using System.Net.Http.Json;
using Xunit;

namespace Admito.Tests;

public class HoldTests(AdmitoFactory factory) : IClassFixture<AdmitoFactory>
{
    private readonly HttpClient client = factory.CreateClient();

    [Fact]
    public async Task Thousand_applications_at_once_never_exceed_the_seats()
    {
        const int seats = 100;
        const int applicants = 1000;
        var classId = await client.CreateClassAsync(seats);

        var codes = await RunTogether(applicants, i => client.ApplyAsync(classId, (100000 + i).ToString()));

        Assert.Equal(seats, codes.Count(c => c == HttpStatusCode.Created));
        Assert.Equal(applicants - seats, codes.Count(c => c == HttpStatusCode.Conflict));

        var summary = await client.GetClassAsync(classId);
        Assert.Equal(seats, summary.HeldSeats);
        Assert.Equal(0, summary.AvailableSeats);
    }

    [Fact]
    public async Task Same_student_cannot_hold_two_seats_in_one_class()
    {
        var classId = await client.CreateClassAsync(5);

        var codes = await RunTogether(10, _ => client.ApplyAsync(classId, "111111"));

        Assert.Equal(1, codes.Count(c => c == HttpStatusCode.Created));
        Assert.Equal(9, codes.Count(c => c == HttpStatusCode.Conflict));
        Assert.Equal(1, (await client.GetClassAsync(classId)).HeldSeats);
    }

    [Fact]
    public async Task Expired_hold_releases_its_seat()
    {
        var classId = await client.CreateClassAsync(1);
        var first = await (await client.ApplyAsync(classId, "111111")).Content.ReadFromJsonAsync<HoldBody>();
        Assert.Equal(HttpStatusCode.Conflict, (await client.ApplyAsync(classId, "222222")).StatusCode);

        factory.Clock.Advance(TimeSpan.FromMinutes(11));

        Assert.Equal("EXPIRED", (await client.GetHoldAsync(first!.HoldId)).Status);
        Assert.Equal(HttpStatusCode.Created, (await client.ApplyAsync(classId, "222222")).StatusCode);
    }

    [Fact]
    public async Task Confirmed_admission_keeps_its_seat_after_the_hold_time_passes()
    {
        var classId = await client.CreateClassAsync(1);
        var hold = await (await client.ApplyAsync(classId, "111111")).Content.ReadFromJsonAsync<HoldBody>();
        Assert.Equal(HttpStatusCode.OK, (await client.ConfirmAsync(hold!.HoldId, "111111")).StatusCode);

        factory.Clock.Advance(TimeSpan.FromMinutes(11));

        Assert.Equal(HttpStatusCode.Conflict, (await client.ApplyAsync(classId, "222222")).StatusCode);
        var summary = await client.GetClassAsync(classId);
        Assert.Equal(1, summary.ConfirmedSeats);
        Assert.Equal(0, summary.AvailableSeats);
    }

    // Holds every request back, then sends them all at the same moment.
    private static async Task<HttpStatusCode[]> RunTogether(int count, Func<int, Task<HttpResponseMessage>> send)
    {
        var start = new TaskCompletionSource(TaskCreationOptions.RunContinuationsAsynchronously);
        var tasks = Enumerable.Range(0, count).Select(async i =>
        {
            await start.Task;
            return (await send(i)).StatusCode;
        }).ToList();

        start.SetResult();
        return await Task.WhenAll(tasks);
    }
}