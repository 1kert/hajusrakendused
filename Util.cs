using System.Security.Claims;
using hajusrakendused.Models;

namespace hajusrakendused;

public static class Extensions
{
    public static string? GetUserId(this ClaimsPrincipal principal)
        => principal.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;
    
    public static UserRole[] GetUserRoles(this ClaimsPrincipal principal)
        => principal.Claims.Where(x => x.Type == ClaimTypes.Role).Select(x => Enum.Parse<UserRole>(x.Value)).ToArray();
}
