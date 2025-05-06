namespace hajusrakendused.Models.Http;

public class BlogCreateRequest
{
    public string? Title { get; set; }
    public string? Content { get; set; }
}

public class BlogCommentUpdateRequest
{
    public long? Id { get; set; }
    public long? BlogId { get; set; }
    public string? Content { get; set; }
}
