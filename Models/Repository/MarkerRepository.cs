using hajusrakendused.Models.http;
using Microsoft.EntityFrameworkCore;

namespace hajusrakendused.Models.Repository;

public class MarkerRepository(DatabaseContext dbContext)
{
    public async Task<MarkerEntity[]> GetAllAsync() => await dbContext.Markers.ToArrayAsync();

    public async Task CreateAsync(MarkerEntity marker)
    {
        dbContext.Markers.Add(marker);
        await dbContext.SaveChangesAsync();
    }
    
    public async Task<MarkerEntity?> GetByIdAsync(int id) => await dbContext.Markers.FindAsync(id);

    public async Task<MarkerEntity?> UpdateTitleAndDescription(int id, string title, string description)
    {
        var marker = await dbContext.Markers.FindAsync(id);
        if (marker == null) return null;
        marker.Title = title;
        marker.Description = description;
        marker.UpdatedAt = DateTime.UtcNow;
        await dbContext.SaveChangesAsync();
        return marker;
    }
}