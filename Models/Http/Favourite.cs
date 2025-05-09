namespace hajusrakendused.Models.Http;

public class FavoriteGameRequest
{
    public string? Title { get; set; }
    public string? Description { get; set; }
    public string? Image { get; set; }
    public string[]? Genres { get; set; }
    public DateTime? ReleaseDate { get; set; }
}

public class FavoriteGameResponse
{
    public long Id { get; set; }
    public string? Title { get; set; }
    public string? Description { get; set; }
    public string? Image { get; set; }
    public string? Genres { get; set; }
    public DateTime? ReleaseDate { get; set; } 
}