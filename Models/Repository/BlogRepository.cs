using hajusrakendused.Models.http;

namespace hajusrakendused.Models.Repository;

public class BlogRepository
{
    private static List<BlogEntity> blogs = []; // todo: use db

    public async Task<bool> AddBlogAsync(BlogEntity blog)
    {
        await Task.Delay(500);
        blogs.Add(blog);
        return true;
    }

    public async Task<BlogResponse[]> GetAllBlogsResponsesAsync()
    {
        await Task.Delay(500);
        return blogs.Select(x => new BlogResponse
        {
            Title = x.Title,
            Content = x.Content,
            Author = "who knows",
            UpdatedAt = x.UpdatedAt
        }).ToArray();
    }
}