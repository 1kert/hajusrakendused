namespace hajusrakendused.Models.http;

public class BlogResponse
{
    public required long Id { get; set; }
    public required string Title { get; set; }
    public required string Content { get; set; }
    public required string Author { get; set; }
    public bool CanEdit { get; set; }
    public bool CanDelete { get; set; }
    public required DateTime UpdatedAt { get; set; }
    public required BlogCommentResponse[] Comments { get; set; }
}

public class BlogCommentResponse
{
    public required long Id { get; set; }
    public required string Content { get; set; }
    public required string Author { get; set; }
    public required DateTime UpdatedAt { get; set; }
    public required bool CanEdit { get; set; }
    public required bool CanDelete { get; set; }
}