namespace hajusrakendused.Models.http;

public class BlogResponse
{
    public required string Title { get; set; }
    public required string Content { get; set; }
    public required string Author { get; set; }
    public required DateTime UpdatedAt { get; set; }
}