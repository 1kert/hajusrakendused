using hajusrakendused.Models.Http;
using hajusrakendused.Models.Repository;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace hajusrakendused.Controllers;

[ApiController]
[Route("/api/favourite")]
public class FavoriteGameController(
    FavoriteGameRepository favoriteGameRepository,
    FavouriteGameCreateValidator createValidator,
    FavouriteGameUpdateValidator updateValidator): ControllerBase
{
    [HttpGet("{userId}")]
    public async Task<IActionResult> GetAllFavouriteGames(string userId)
    {
        var result = await favoriteGameRepository.GetAllGamesResponseAsync(userId);
        return result.IsSuccess ? Ok(result.Data) : result.ErrorType.GetResult();
    }
    
    [HttpGet]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public async Task<IActionResult> GetAllFavouriteGamesForCurrent()
    {
        var userId = User.GetUserId();
        if (userId == null) return Unauthorized();
        
        var result = await favoriteGameRepository.GetAllGamesResponseAsync(userId);
        return result.IsSuccess ? Ok(result.Data) : result.ErrorType.GetResult();
    }
    
    [HttpDelete("{id:long}")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public async Task<IActionResult> DeleteFavouriteGame(long id)
    {
        var userId = User.GetUserId();
        if (userId == null) return Unauthorized();

        var result = await favoriteGameRepository.DeleteGameAsync(userId, id);
        return result == null ? Ok() : result.GetResult();
    }
    
    [HttpPut]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public async Task<IActionResult> UpdateFavouriteGame([FromBody] FavouriteGameUpdateRequest request)
    {
        var validateResult = await updateValidator.ValidateAsync(request);
        if (!validateResult.IsValid) return validateResult.GetResult();
        
        var userId = User.GetUserId();
        if (userId == null) return Unauthorized();

        var result = await favoriteGameRepository.UpdateGameAsync(
            userId,
            request.Id!.Value,
            request.Title,
            request.Description,
            request.Image,
            request.Genres,
            request.Developer
        );
        
        return result == null ? Ok() : result.GetResult();
    }
    
    [HttpPost]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public async Task<IActionResult> CreateFavouriteGame([FromBody] FavouriteGameRequest request)
    {
        var validateResult = await createValidator.ValidateAsync(request);
        if (!validateResult.IsValid) validateResult.GetResult();
        
        var userId = User.GetUserId();
        if (userId == null) return Unauthorized();

        var result = await favoriteGameRepository.CreateGameAsync(
            userId,
            request.Title!,
            request.Description!,
            request.Image!,
            request.Genres!,
            request.Developer!
        );
        
        return result == null ? Ok() : result.GetResult();
    }
}