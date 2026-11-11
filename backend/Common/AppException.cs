namespace Admito.Common;

// Thrown by services for expected failures. AppExceptionHandler turns it into a JSON response.
public class AppException(int statusCode, string message) : Exception(message)
{
    public int StatusCode { get; } = statusCode;

    public static AppException BadRequest(string message) => new(StatusCodes.Status400BadRequest, message);
    public static AppException NotFound(string message) => new(StatusCodes.Status404NotFound, message);
    public static AppException Conflict(string message) => new(StatusCodes.Status409Conflict, message);
}