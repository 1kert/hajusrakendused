using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace hajusrakendused.Models;

public class DatabaseContext(DbContextOptions<DatabaseContext> options) : IdentityDbContext(options)
{
    public DbSet<MarkerEntity> Markers { get; set; }
    public DbSet<BlogEntity> Blogs { get; set; }
    public DbSet<BlogCommentEntity> Comments { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        modelBuilder.Entity<BlogEntity>(entity =>
        {
            entity
                .HasOne(x => x.CreatedByUser)
                .WithMany()
                .HasForeignKey(x => x.CreatedBy)
                .IsRequired();

            entity
                .HasMany(x => x.Comments)
                .WithOne(x => x.Blog)
                .HasForeignKey("BlogId")
                .IsRequired();
        });

        modelBuilder.Entity<BlogCommentEntity>(entity =>
        {
            entity
                .HasOne(x => x.CreatedBy)
                .WithMany()
                .HasForeignKey("UserId")
                .IsRequired();
        });
    }
}
