using hajusrakendused.Models.Http;
using hajusrakendused.Models.Repository;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace hajusrakendused.Controllers;

[ApiController]
[Route("/api/favourite")]
public class FavoriteGameController(FavoriteGameRepository favoriteGameRepository): ControllerBase
{
    [HttpGet("{userId}")]
    public async Task<IActionResult> GetAllFavouriteGames(string userId)
    {
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
    
    [HttpPut("{id:long}")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public async Task<IActionResult> UpdateFavouriteGame([FromBody] FavoriteGameRequest request, long id)
    {
        var userId = User.GetUserId();
        if (userId == null) return Unauthorized();

        var result = await favoriteGameRepository.UpdateGameAsync(
            userId,
            id,
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
    public async Task<IActionResult> CreateFavouriteGame([FromBody] FavoriteGameRequest request)
    {
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