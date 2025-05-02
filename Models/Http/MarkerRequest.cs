namespace hajusrakendused.Models.http;

public class MarkerRequest
{
    public string? Title { get; init; }
    public string? Description { get; init; }
    public double? Latitude { get; init; }
    public double? Longitude { get; init; }
}