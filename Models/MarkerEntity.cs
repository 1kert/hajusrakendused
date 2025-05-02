using Microsoft.AspNetCore.Identity;

namespace hajusrakendused.Models;

public class MarkerEntity
{
    public int Id { get; init; }
    public required DateTime UpdatedAt { get; init; }
    public required DateTime CreatedAt { get; init; }
    public required string Title { get; init; } // todo: max size
    public required string Description { get; init; }
    public required double Latitude { get; init; }
    public required double Longitude { get; init; }
    
    public required Guid UserId { get; init; }
}