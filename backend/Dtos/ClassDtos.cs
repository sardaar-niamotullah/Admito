namespace Admito.Dtos;

public record CreateClassRequest(string? Name, int TotalSeats);

public record ClassDto(Guid Id, string Name, int TotalSeats, int HeldSeats, int ConfirmedSeats)
{
    public int AvailableSeats => TotalSeats - HeldSeats - ConfirmedSeats;
}