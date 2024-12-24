using Microsoft.EntityFrameworkCore;

namespace hajusrakendused.Models;

public class DatabaseContext: DbContext
{
    public DatabaseContext(DbContextOptions<DatabaseContext> options): base(options)
    {
        
    }

    public DbSet<User> users { get; set; }
}

public class User
{
    public int Id { get; set; }
    public string Username { get; set; }
    public string Password { get; set; }
}
