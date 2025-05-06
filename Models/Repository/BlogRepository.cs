using hajusrakendused.Models.http;
using Microsoft.EntityFrameworkCore;

namespace hajusrakendused.Models.Repository;

public class BlogRepository(DatabaseContext dbContext)
{
    private static bool CanEditComment(BlogCommentEntity comment, string userId) => comment.CreatedById.Equals(userId);

    private static bool CanDeleteComment(
        BlogEntity blog, 
        BlogCommentEntity comment, 
        string userId,
        ICollection<UserRole> roles
    ) => userId.Equals(blog.CreatedBy) || roles.Contains(UserRole.Admin) || userId.Equals(comment.CreatedBy.Id);
    
    private static bool CanEditBlog(BlogEntity blog, string userId) => userId.Equals(blog.CreatedBy);

    private static bool CanDeleteBlog(BlogEntity blog, string userId, ICollection<UserRole> roles)
        => userId.Equals(blog.CreatedBy) || roles.Contains(UserRole.Admin);
    
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
    
    public async Task<BlogResponse?> GetBlogByIdResponse(long id, string userId, ICollection<UserRole> roles)
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
            CanEdit = blog.CreatedBy == userId,
            CanDelete = blog.CreatedBy == userId || roles.Contains(UserRole.Admin),
            Comments = blog.Comments.Select(comment => new BlogCommentResponse
            {
                Id = comment.Id,
                Content = comment.Content,
                Author = comment.CreatedBy.UserName ?? "no name",
                UpdatedAt = comment.UpdatedAt,
                CanEdit = CanEditComment(comment, userId),
                CanDelete = CanDeleteComment(blog, comment, userId, roles)
            }).ToArray()
        };
    }

    public async Task<bool> UpdateBlogAsync(long blogId, string title, string content, string userId)
    {
        try
        {
            var blog = await dbContext.Blogs.FindAsync(blogId);
            if (blog == null) return false;
            if (!CanEditBlog(blog, userId)) return false;
            
            blog.Title = title;
            blog.Content = content;
            blog.UpdatedAt = DateTime.Now;
            await dbContext.SaveChangesAsync();
            return true;
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            return false;
        }
    }
    
    public async Task<bool> DeleteBlogAsync(long blogId, string userId, ICollection<UserRole> userRoles)
    {
        try
        {
            var blog = await dbContext.Blogs.FindAsync(blogId);
            if (blog == null) return false;
            if (!CanDeleteBlog(blog, userId, userRoles)) return false;
            
            dbContext.Blogs.Remove(blog);
            await dbContext.SaveChangesAsync();
            return true;
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            return false;
        }
    }

    public async Task<bool> AddCommentAsync(string content, string userId, long blogId)
    {
        try
        {
            var blog = await dbContext.Blogs.FindAsync(blogId);
            if (blog == null) return false;
            
            dbContext.Comments.Add(new BlogCommentEntity
            {
                Content = content,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                CreatedById = userId,
                BlogId = blogId
            });
            await dbContext.SaveChangesAsync();
            return true;
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            return false;
        }
    }

    public async Task<bool> UpdateCommentContentAsync(long commentId, string content, string userId)
    {
        try
        {
            var comment = await dbContext.Comments
                .Include(x => x.CreatedBy)
                .FirstOrDefaultAsync(x => x.Id == commentId);
            if (comment == null) return false;

            var canEdit = CanEditComment(comment, userId);
            if (!canEdit) return false;
            
            comment.Content = content;
            comment.UpdatedAt = DateTime.Now;
            await dbContext.SaveChangesAsync();
            return true;
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            return false;
        }
    }

    public async Task<bool> DeleteCommentAsync(long commentId, string userId, ICollection<UserRole> roles)
    {
        try
        {
            var comment = await dbContext.Comments
                .Include(x => x.Blog)
                .Include(x => x.CreatedBy)
                .FirstOrDefaultAsync(x => x.Id == commentId);
            if (comment == null) return false;
            
            var canDelete = CanDeleteComment(comment.Blog, comment, userId, roles);
            if (!canDelete) return false;
            
            dbContext.Comments.Remove(comment);
            await dbContext.SaveChangesAsync();
            return true;
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            return false;
        }
    }
}