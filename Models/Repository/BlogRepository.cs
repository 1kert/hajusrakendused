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

    public async Task<BlogResponse[]> GetAllBlogsResponseAsync()
    {
        var blogs = await dbContext.Blogs
            .Include(x => x.CreatedByUser)
            .ToArrayAsync();
        
        return blogs.Select(x => new BlogResponse
        {
            Id = x.Id,
            Title = x.Title,
            Content = x.Content,
            Author = x.CreatedByUser.UserName ?? "no name",
            UpdatedAt = x.UpdatedAt,
            Comments = []
        }).ToArray();
    }
    
    public async Task<BlogResponse?> GetBlogResponseAsync(long id, string userId, IEnumerable<UserRole> roles)
    {
        var blog = await dbContext.Blogs
            .Include(x => x.Comments)
            .ThenInclude(x => x.CreatedBy)
            .Include(x => x.CreatedByUser)
            .Where(x => x.Id == id)
            .FirstOrDefaultAsync();
        if (blog is null) return null;

        return new BlogResponse
        {
            Id = blog.Id,
            Title = blog.Title,
            Content = blog.Content,
            Author = blog.CreatedByUser.UserName ?? "no name",
            UpdatedAt = blog.UpdatedAt,
            Comments = blog.Comments.Select(comment => new BlogCommentResponse
            {
                Id = comment.Id,
                Content = comment.Content,
                Author = comment.CreatedBy.UserName ?? "no name",
                UpdatedAt = comment.UpdatedAt,
                CanEdit = userId == comment.CreatedBy.Id,
                CanDelete = userId == blog.CreatedBy || roles.Contains(UserRole.Admin) || userId == comment.CreatedBy.UserName
            }).ToArray()
        };
    }
    
    
    
    // todo: CRUD
}