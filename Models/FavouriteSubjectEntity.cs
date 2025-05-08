namespace hajusrakendused.Models;

public class FavoriteGameEntity
{
    public long Id { get; set; }
    public required string Title { get; set; }
    public required string Description { get; set; }
    public required string Image { get; set; }
    public required string GenreJson { get; set; }
    public required DateTime ReleaseDate { get; set; }
    public required DateTime CreatedAt { get; set; }
    public required DateTime UpdatedAt { get; set; }
}