using System.Security.Claims;
using hajusrakendused.Models;
using Microsoft.AspNetCore.Mvc;

namespace hajusrakendused;

public static class Extensions
{
    public static string? GetUserId(this ClaimsPrincipal principal)
        => principal.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;
    
    public static UserRole[] GetUserRoles(this ClaimsPrincipal principal)
        => principal.Claims.Where(x => x.Type == ClaimTypes.Role).Select(x => Enum.Parse<UserRole>(x.Value)).ToArray();

    public static ObjectResult GetResult(this ErrorType? errorType)
        => errorType switch
        {
            ErrorType.NotFound => new NotFoundObjectResult(""),
            ErrorType.Unknown => new ObjectResult("") { StatusCode = 500},
            ErrorType.Unauthorized => new UnauthorizedObjectResult(""),
            ErrorType.ServerError => new ObjectResult("") { StatusCode = 500},
            _ => new ObjectResult("") { StatusCode = 500}
        };
}

public class Result<T>
{
    public bool IsSuccess { get; init; }
    public ErrorType? ErrorType { get; init; }
    public T? Data { get; init; }
    
    public static Result<T> Error(ErrorType errorType)
        => new() { IsSuccess = false, ErrorType = errorType };
    
    public static Result<T> Success(T data)
        => new() { IsSuccess = true, Data = data };
}

public enum ErrorType
{
    NotFound,
    Unknown,
    Unauthorized,
    ServerError
}
