using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace hajusrakendused.Services;

public class Authorization
{
    public static string GenerateJwtToken(string username, string userId, string keyStr)
    {
        var claims = new ClaimsIdentity();
        claims.AddClaim(new Claim(ClaimTypes.Name, username));
        claims.AddClaim(new Claim(ClaimTypes.NameIdentifier, userId));
        
        var handler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(keyStr);
        var credentials = new SigningCredentials(
            new SymmetricSecurityKey(key),
            SecurityAlgorithms.HmacSha256
        );
        var tokenDescriptor = new SecurityTokenDescriptor()
        {
            SigningCredentials = credentials,
            Subject = claims,
            Expires = DateTime.UtcNow.AddHours(1),
            Issuer = "dunno",
            Audience = "dunno"
        };
        var token = handler.CreateToken(tokenDescriptor);
        return handler.WriteToken(token);
    }
}
