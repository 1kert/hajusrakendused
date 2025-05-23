using System.Security.Claims;
using hajusrakendused.Models.Http;
using hajusrakendused.Models.Repository;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace hajusrakendused.Controllers;

[ApiController]
[Route("/api/store")]
public class StoreController(StoreRepository storeRepository) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetStoreItems()
    {
        var items = await storeRepository.GetAllItemsResponseAsync();
        if (items == null) return StatusCode(500);
        return Ok(items);
    }
    
    [HttpGet("{id:long}")]
    public async Task<IActionResult> GetStoreItem(long id)
    {
        var item = await storeRepository.GetItemByIdResponseAsync(id);
        if (item == null) return NotFound();
        return Ok(item);
    }

    [HttpPost]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public async Task<IActionResult> AddToCart([FromBody] CartRequest request)
    {
        var userId = User.GetUserId();
        if (userId == null) return Unauthorized();
        
        if (request.Id == null || request.Quantity == null) return BadRequest();
        var result = await storeRepository.CreateCartItemAsync(userId, request.Id.Value, request.Quantity.Value);
        return result ? Created() : NotFound();
    }
    
    [HttpDelete("{id:long}")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public async Task<IActionResult> RemoveFromCart(long id)
    {
        var userId = User.GetUserId();
        if (userId == null) return Unauthorized();

        var result = await storeRepository.DeleteCartItemAsync(userId, id);
        return result ? Ok() : StatusCode(500);
    }
    
    [HttpPut]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public async Task<IActionResult> UpdateCartItem([FromBody] CartRequest request)
    {
        if (request.Id == null || request.Quantity == null) return BadRequest();
        var userId = User.GetUserId();
        if (userId == null) return Unauthorized();
        
        var result = await storeRepository.UpdateCartItemQuantityAsync(userId, request.Id.Value, request.Quantity.Value);
        return result ? Ok() : StatusCode(500);
    }
    
    [HttpGet("cart")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public async Task<IActionResult> GetCart()
    {
        var userId = User.GetUserId();
        if (userId == null) return Unauthorized();
        
        var result = await storeRepository.GetCartItemsResponseAsync(userId);
        return result == null ? NotFound() : Ok(result);
    }
}