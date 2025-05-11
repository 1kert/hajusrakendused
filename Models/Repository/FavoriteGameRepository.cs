using System.Text.Json;
using hajusrakendused.Models.Http;
using Microsoft.EntityFrameworkCore;

namespace hajusrakendused.Models.Repository;

public class FavoriteGameRepository(DatabaseContext databaseContext)
{
    public async Task<Result<FavoriteGameResponse[]>> GetAllGamesResponseAsync(string userId)
    {
        try
        {
            var games = await databaseContext.FavoriteGames
                .Where(x => EF.Property<string>(x, "UserId") == userId)
                .Select(x => new FavoriteGameResponse
                {
                    Id = x.Id,
                    Title = x.Title,
                    Description = x.Description,
                    Image = x.Image,
                    Genres = JsonSerializer.Deserialize<string[]>(x.GenreJson, JsonSerializerOptions.Web),
                    Developer = x.Developer
                })
                .ToArrayAsync();

            return Result<FavoriteGameResponse[]>.Success(games);
        }
        catch (Exception e)
        {
            // todo: db errors
            return Result<FavoriteGameResponse[]>.Error(ErrorType.Unknown);
        }
    }

    public async Task<ErrorType?> CreateGameAsync(
        string userId,
        string title,
        string description,
        string image,
        string[] genres,
        string developer)
    {
        try
        {
            var game = new FavoriteGameEntity
            {
                Title = title,
                Description = description,
                Image = image,
                GenreJson = JsonSerializer.Serialize(genres),
                Developer = developer
            };
            databaseContext.FavoriteGames.Add(game);
            databaseContext.Entry(game).Property("UserId").CurrentValue = userId;
            await databaseContext.SaveChangesAsync();
            
            return null;
        }
        catch (Exception e)
        {
            return ErrorType.Unknown;
        }
    }

    public async Task<ErrorType?> UpdateGameAsync(
        string userId,
        long gameId,
        string? title,
        string? description,
        string? image,
        string[]? genres,
        string? developer)
    {
        try
        {
            var game = await databaseContext.FavoriteGames
                .Where(x => EF.Property<string>(x, "UserId") == userId && x.Id == gameId)
                .FirstOrDefaultAsync();
            if (game == null) return ErrorType.NotFound;
            
            if (title != null) game.Title = title;
            if (description != null) game.Description = description;
            if (image != null) game.Image = image;
            if (genres != null) game.GenreJson = JsonSerializer.Serialize(genres);
            if (developer != null) game.Developer = developer;
            
            await databaseContext.SaveChangesAsync();
            return null;
        }
        catch (Exception e)
        {
            return ErrorType.Unknown;
        }
    }

    public async Task<ErrorType?> DeleteGameAsync(string userId, long gameId)
    {
        try
        {
            var game = await databaseContext.FavoriteGames
                .Where(x => EF.Property<string>(x, "UserId") == userId && x.Id == gameId)
                .FirstOrDefaultAsync();
            if (game == null) return ErrorType.NotFound;
            databaseContext.FavoriteGames.Remove(game);
            await databaseContext.SaveChangesAsync();
            return null;
        }
        catch (Exception e)
        {
            return ErrorType.Unknown;
        }
    }
}