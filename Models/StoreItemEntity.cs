using Microsoft.AspNetCore.Identity;

namespace hajusrakendused.Models;

public class StoreItemEntity
{
    public long Id { get; set; }
    public required string Image { get; set; }
    public required string Name { get; set; }
    public required string Description { get; set; }
    public required decimal Price { get; set; }

    public ICollection<IdentityUser> Users { get; set; } = null!;
}

public class CartEntity
{
    public string UserId { get; set; } = null!;
    public IdentityUser User { get; set; } = null!;
    public long StoreItemId { get; set; }
    public StoreItemEntity StoreItem { get; set; } = null!;
    public required int Quantity { get; set; }
}