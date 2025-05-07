using hajusrakendused.Models.Http;
using Microsoft.EntityFrameworkCore;

namespace hajusrakendused.Models.Repository;

public class StoreRepository(DatabaseContext dbContext)
{
    public async Task<StoreItemResponse[]?> GetAllItemsResponseAsync()
    {
        try
        {
            var storeItems = await dbContext.StoreItems.ToArrayAsync();
            return storeItems.Select(x => new StoreItemResponse
            {
                Id = x.Id,
                Image = x.Image,
                Name = x.Name,
                Price = x.Price
            }).ToArray();
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            return null;
        }
    }
    
    public async Task<StoreItemResponse?> GetItemByIdResponseAsync(long id)
    {
        try
        {
            var storeItem = await dbContext.StoreItems.FirstOrDefaultAsync(x => x.Id == id);
            if (storeItem == null) return null;

            return new StoreItemResponse
            {
                Id = storeItem.Id,
                Image = storeItem.Image,
                Name = storeItem.Name,
                Description = storeItem.Description,
                Price = storeItem.Price
            };
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            return null;
        }
    }

    public async Task<bool> CreateCartItemAsync(string userId, long storeItemId, int quantity)
    {
        try
        {
            var storeItem = await dbContext.Carts
                .Where(x => x.UserId == userId && x.StoreItemId == storeItemId)
                .FirstOrDefaultAsync();

            if (storeItem == null)
            {
                await dbContext.Carts.AddAsync(new CartEntity
                {
                    UserId = userId,
                    StoreItemId = storeItemId,
                    Quantity = quantity
                });
                
                await dbContext.SaveChangesAsync();
                return true;
            }
            
            storeItem.Quantity += quantity;
            await dbContext.SaveChangesAsync();
            
            return true;
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            return false;
        }
    }
    
    public async Task<CartItemResponse[]?> GetCartItemsResponseAsync(string userId)
    {
        try
        {
            var items = await dbContext.Carts
                .Include(x => x.StoreItem)
                .Where(x => x.UserId == userId)
                .Select(x => new CartItemResponse
                {
                    Id = x.StoreItemId,
                    Image = x.StoreItem.Image,
                    Name = x.StoreItem.Name,
                    Price = x.StoreItem.Price,
                    Quantity = x.Quantity
                })
                .ToArrayAsync();

            return items;
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            return null;
        }
    }
    
    public async Task<bool> UpdateCartItemQuantityAsync(string userId, long storeItemId, int quantity)
    {
        try
        {
            var item = await dbContext.Carts
                .Where(x => x.UserId == userId && x.StoreItemId == storeItemId)
                .FirstOrDefaultAsync();
            
            if (item == null) return false;
            item.Quantity = quantity;
            await dbContext.SaveChangesAsync();
            return true;
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            return false;
        }
    }
    
    public async Task<bool> DeleteCartItemAsync(string userId, long storeItemId)
    {
        try
        {
            var item = await dbContext.Carts
                .Where(x => x.StoreItemId == storeItemId && x.UserId == userId)
                .FirstOrDefaultAsync();
            
            if (item == null) return false;
            dbContext.Carts.Remove(item);
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