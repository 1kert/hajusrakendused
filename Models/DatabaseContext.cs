using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace hajusrakendused.Models;

public class DatabaseContext(DbContextOptions<DatabaseContext> options) : IdentityDbContext(options)
{
    public DbSet<MarkerEntity> Markers { get; set; }
    public DbSet<BlogEntity> Blogs { get; set; }
    public DbSet<BlogCommentEntity> Comments { get; set; }
    public DbSet<StoreItemEntity> StoreItems { get; set; }
    public DbSet<CartEntity> Carts { get; set; }

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
                .HasForeignKey(x => x.BlogId)
                .IsRequired();
        });

        modelBuilder.Entity<BlogCommentEntity>(entity =>
        {
            entity
                .HasOne(x => x.CreatedBy)
                .WithMany()
                .HasForeignKey(x => x.CreatedById)
                .IsRequired();
        });

        modelBuilder.Entity<StoreItemEntity>(entity =>
        {
            entity
                .HasMany(x => x.Users)
                .WithMany()
                .UsingEntity<CartEntity>();
        });
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = new CancellationToken())
    {
        ChangeTracker.DetectChanges();

        foreach (var entry in ChangeTracker.Entries())
        {
            if (entry.State is EntityState.Added or EntityState.Modified)
            {
                
            }
        }
        
        return base.SaveChangesAsync(cancellationToken);
    }
}
