using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace hajusrakendused.Models;

public class DatabaseContext: IdentityDbContext
{
    public DbSet<MarkerEntity> Markers { get; set; }
    
    public DatabaseContext(DbContextOptions<DatabaseContext> options): base(options) { }
}
