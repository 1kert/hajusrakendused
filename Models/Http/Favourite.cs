namespace hajusrakendused.Models.Http;

public class FavouriteGameRequest
{
    public string? Title { get; set; }
    public string? Description { get; set; }
    public string? Image { get; set; }
    public string[]? Genres { get; set; }
    public string? Developer { get; set; }
}

public class FavouriteGameResponse
{
    public long Id { get; set; }
    public string? Title { get; set; }
    public string? Description { get; set; }
    public string? Image { get; set; }
    public string[]? Genres { get; set; }
    public string? Developer { get; set; }
}

public class FavouriteGameUpdateRequest
{
    public long? Id { get; set; }
    public string? Title { get; set; }
    public string? Description { get; set; }
    public string? Image { get; set; }
    public string[]? Genres { get; set; }
    public string? Developer { get; set; }
}