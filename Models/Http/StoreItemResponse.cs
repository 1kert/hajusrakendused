namespace hajusrakendused.Models.Http;

public class StoreItemResponse
{
    public required long Id { get; set; }
    public required string Image { get; set; }
    public required string Name { get; set; }
    public string? Description { get; set; }
    public required decimal Price { get; set; }
}

public class CartItemResponse
{
    public required long Id { get; set; }
    public required string Image { get; set; }
    public required string Name { get; set; }
    public required decimal Price { get; set; }
    public required int Quantity { get; set; }
}