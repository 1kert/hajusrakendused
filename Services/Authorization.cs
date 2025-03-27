using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace hajusrakendused.Services;

public class Authorization
{
    public static string GenerateJwtToken(string username, string keyStr)
    {
        var claims = new ClaimsIdentity();
        claims.AddClaim(new(ClaimTypes.Name, username));
        var handler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(keyStr);
        var creds = new SigningCredentials(
            new SymmetricSecurityKey(key),
            SecurityAlgorithms.HmacSha256
        );
        var tokenDescriptor = new SecurityTokenDescriptor()
        {
            SigningCredentials = creds,
            Subject = claims,
            Expires = DateTime.UtcNow.AddHours(1),
            Issuer = "dunno",
            Audience = "dunno"
        };
        var token = handler.CreateToken(tokenDescriptor);
        return handler.WriteToken(token);
    }
}
