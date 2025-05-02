using hajusrakendused.Models.http;
using Microsoft.EntityFrameworkCore;

namespace hajusrakendused.Models.Repository;

public class MarkerRepository(DatabaseContext dbContext)
{
    public async Task<MarkerEntity[]> GetAllMarkersAsync() => await dbContext.Markers.ToArrayAsync();

    public async Task CreateMarkerAsync(MarkerEntity marker)
    {
        dbContext.Markers.Add(marker);
        await dbContext.SaveChangesAsync();
    }
}