using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using hajusrakendused.Models;
using hajusrakendused.Models.http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace hajusrakendused.controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController(
        IConfiguration configuration,
        UserManager<IdentityUser> userManager
    ) : ControllerBase
    {
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            if (request.Username == null || request.Password == null) return BadRequest();
            
            var user = await userManager.FindByNameAsync(request.Username);
            if (user == null || !await userManager.CheckPasswordAsync(user, request.Password)) return Unauthorized();
            
            var roles = await userManager.GetRolesAsync(user);
            var claims = new ClaimsIdentity();
            claims.AddClaim(new Claim(ClaimTypes.Name, request.Username));
            claims.AddClaim(new Claim(ClaimTypes.NameIdentifier, user.Id));
            foreach(var role in roles) claims.AddClaim(new Claim(ClaimTypes.Role, role));
                    
            var handler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(configuration["JwtKey"]!);
            var credentials = new SigningCredentials(
                new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha256
            );
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                SigningCredentials = credentials,
                Subject = claims,
                Expires = DateTime.UtcNow.AddDays(7), // todo: change time back
                Issuer = "dunno",
                Audience = "dunno"
            };
            var token = handler.WriteToken(handler.CreateToken(tokenDescriptor));
            return Ok(new { token });
        }
        
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] LoginRequest request)
        {
            if (request.Username == null || request.Password == null) return BadRequest();
            
            IdentityUser user = new() { UserName = request.Username };
            IdentityResult result = await userManager.CreateAsync(user, request.Password);
            if (!result.Succeeded) return BadRequest(result.Errors);
            
            await userManager.AddToRoleAsync(user, UserRole.User.ToString());
            return Ok(new { Message = "User created successfully" });

        }
    }
}
