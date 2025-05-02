namespace hajusrakendused.Models.http;

public class MarkerResponse
{
    public required string Title { get; init; }
    public required string Description { get; init; }
    public required double Latitude { get; init; }
    public required double Longitude { get; init; }
    public required bool IsOwn { get; set; }
}