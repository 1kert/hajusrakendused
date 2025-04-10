namespace hajusrakendused.Models;

public class Marker
{
    public int? Id { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public string? Title { get; set; }
    public string? Description { get; set; }
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }
}