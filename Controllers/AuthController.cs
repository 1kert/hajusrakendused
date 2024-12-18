using System.Security.Claims;
using hajusrakendused.Models;
using hajusrakendused.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace hajusrakendused.controllers
{
    [Route("user")]
    [ApiController]
    public class AuthController(IConfiguration configuration) : ControllerBase
    {
        private readonly string _jwtKey = configuration["JwtKey"]!;

        [HttpPost("login")]
        public IActionResult Login([FromBody] Credentials user)
        {
            if(!user.Username.Equals("test") || !user.Password.Equals("123")) return Unauthorized();
            return Ok(new
            {
                Token = JwtToken.GenerateJwtToken(user.Username, _jwtKey)
            });
        }
        
        [HttpPost("register")]
        public IActionResult Register([FromBody] Credentials user)
        {
            return Ok(user);
        }
        
        [HttpPost("test")]
        [Authorize]
        public IActionResult Test()
        {
            Claim? name = User.Claims.FirstOrDefault(x => x.Type.Equals(ClaimTypes.Name));
            if(name == null) return Unauthorized();
            var nameStr = name.Value;
            return Ok(new
            {
                Content = $"authorized, {nameStr}"
            });
        }
    }
}
