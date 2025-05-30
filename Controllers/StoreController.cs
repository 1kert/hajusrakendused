using hajusrakendused.Models;
using hajusrakendused.Models.Http;
using hajusrakendused.Models.Repository;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Stripe.Checkout;

namespace hajusrakendused.Controllers;

[ApiController]
[Route("/api/store")]
public class StoreController(
    StoreRepository storeRepository,
    StoreContinueRequestValidator continueRequestValidator,
    CartRequestValidator cartRequestValidator) : ControllerBase
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
        var validationResult = await cartRequestValidator.ValidateAsync(request);
        if (!validationResult.IsValid) return validationResult.GetResult();
        
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
    
    [HttpDelete("clear-cart")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public async Task<IActionResult> ClearCart()
    {
        var userId = User.GetUserId();
        if (userId == null) return Unauthorized();

        var result = await storeRepository.ClearCartAsync(userId);
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

    [HttpPost("payment-session")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public async Task<IActionResult> GetPaymentIntent([FromBody] StoreContinueRequest request)
    {
        var validateResult = await continueRequestValidator.ValidateAsync(request);
        if (!validateResult.IsValid) return validateResult.GetResult();
        
        var userId = User.GetUserId();
        if (userId == null) return Unauthorized();
        
        var cart = await storeRepository.GetCartItemsResponseAsync(userId);
        if (cart == null) return StatusCode(StatusCodes.Status500InternalServerError);
        
        string domain = $"{Config.Domain}/store";
        var options = new SessionCreateOptions
        {
            LineItems = cart.Select(cartItem => new SessionLineItemOptions
            {
                PriceData = new SessionLineItemPriceDataOptions
                {
                    Currency = "usd",
                    ProductData = new SessionLineItemPriceDataProductDataOptions
                    {
                        Name = cartItem.Name
                    },
                    UnitAmountDecimal = cartItem.Price * 100
                },
                Quantity = cartItem.Quantity
            }).ToList(),
            Mode = "payment",
            SuccessUrl = domain + "?success=true",
            CancelUrl = domain
        };
        var service = new SessionService();
        Session session = await service.CreateAsync(options);

        return Ok(session.Url);
    }
}