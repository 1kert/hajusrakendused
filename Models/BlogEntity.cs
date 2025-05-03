namespace hajusrakendused.Models;

public class BlogEntity
{
    public long Id { get; set; }
    public required string Title { get; set; } // todo: min max
    public required string Content { get; set; }
    public required DateTime CreatedAt { get; set; }
    public required DateTime UpdatedAt { get; set; }
    public required Guid CreatedBy { get; set; }
}