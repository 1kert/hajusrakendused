using Microsoft.AspNetCore.Identity;

namespace hajusrakendused.Models;

public class MarkerEntity
{
    public int Id { get; init; }
    public required DateTime UpdatedAt { get; set; }
    public required DateTime CreatedAt { get; init; }
    public required string Title { get; set; } // todo: max size
    public required string Description { get; set; }
    public required double Latitude { get; set; }
    public required double Longitude { get; set; }
    public required Guid UserId { get; init; }
}