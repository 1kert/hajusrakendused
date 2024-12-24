using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace hajusrakendused.Models;

public class DatabaseContext: IdentityDbContext
{
    public DatabaseContext(DbContextOptions<DatabaseContext> options): base(options)
    {
        
    }
}
