using hajusrakendused.Models.http;
using Microsoft.EntityFrameworkCore;

namespace hajusrakendused.Models.Repository;

public class BlogRepository(DatabaseContext dbContext)
{
    public async Task<bool> AddBlogAsync(BlogEntity blog)
    {
        dbContext.Blogs.Add(blog);
        await dbContext.SaveChangesAsync();
        return true;
    }

    public async Task<BlogResponse[]> GetAllBlogsResponsesAsync()
    {
        var blogs = await dbContext.Blogs
            .Include(x => x.CreatedByUser)
            .ToArrayAsync();
        
        return blogs.Select(x => new BlogResponse
        {
            Title = x.Title,
            Content = x.Content,
            Author = x.CreatedByUser.UserName ?? "no name",
            UpdatedAt = x.UpdatedAt
        }).ToArray();
    }
    //
    // public async Task<BlogResponse?> GetBlogResponseAsync(long id)
    // {
    //     
    // }
}