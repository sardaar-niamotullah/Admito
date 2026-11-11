namespace Admito.Common;

// Endpoint parameters of this type are filled from the X-Student-Id header (see BindAsync).
public sealed record StudentId(string Value)
{
    public const string Header = "X-Student-Id";
    public const int Length = 6;

    public static ValueTask<StudentId?> BindAsync(HttpContext context)
    {
        var value = context.Request.Headers[Header].ToString();
        if (value.Length != Length || !value.All(char.IsAsciiDigit))
            throw AppException.BadRequest($"{Header} header must be {Length} digits");

        return ValueTask.FromResult<StudentId?>(new StudentId(value));
    }
}