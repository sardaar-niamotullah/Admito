namespace Admito.Models;

public enum HoldStatus
{
    Held,
    Confirmed,
    Expired, // never stored, derived when a Held hold passes its expiry time
    Cancelled,
}