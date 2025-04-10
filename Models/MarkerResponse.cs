namespace hajusrakendused.Models;

public class MarkerResponse
{
    public required string Title { get; set; }
    public required string Description { get; set; }
    public required double Latitude { get; set; }
    public required double Longitude { get; set; }
}