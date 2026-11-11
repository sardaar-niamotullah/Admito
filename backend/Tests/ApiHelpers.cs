using System.Net.Http.Json;

namespace Admito.Tests;

public record ClassBody(Guid Id, int TotalSeats, int HeldSeats, int ConfirmedSeats, int AvailableSeats);
public record HoldBody(Guid HoldId, string Status);

public static class ApiHelpers
{
    public static async Task<Guid> CreateClassAsync(this HttpClient client, int totalSeats)
    {
        var response = await client.PostAsJsonAsync("/classes", new { name = $"Class {Guid.NewGuid():N}", totalSeats });
        response.EnsureSuccessStatusCode();
        return (await response.Content.ReadFromJsonAsync<ClassBody>())!.Id;
    }

    public static async Task<ClassBody> GetClassAsync(this HttpClient client, Guid classId) =>
        (await client.GetFromJsonAsync<ClassBody>($"/classes/{classId}"))!;

    public static async Task<HoldBody> GetHoldAsync(this HttpClient client, Guid holdId) =>
        (await client.GetFromJsonAsync<HoldBody>($"/holds/{holdId}"))!;

    public static Task<HttpResponseMessage> ApplyAsync(this HttpClient client, Guid classId, string studentId) =>
        Send(client, HttpMethod.Post, $"/classes/{classId}/holds", studentId);

    public static Task<HttpResponseMessage> ConfirmAsync(this HttpClient client, Guid holdId, string studentId) =>
        Send(client, HttpMethod.Post, $"/holds/{holdId}/confirm", studentId);

    // Every call that needs a student sends the X-Student-Id header.
    private static Task<HttpResponseMessage> Send(HttpClient client, HttpMethod method, string url, string studentId)
    {
        var request = new HttpRequestMessage(method, url);
        request.Headers.Add("X-Student-Id", studentId);
        return client.SendAsync(request);
    }
}