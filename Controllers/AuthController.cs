using System.Security.Claims;
using hajusrakendused.Models;
using hajusrakendused.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace hajusrakendused.controllers
{
    [Route("user")]
    [ApiController]
    public class AuthController(
        IConfiguration configuration,
        UserManager<IdentityUser> userManager
    ) : ControllerBase
    {
        private readonly IConfiguration _configuration = configuration;
        private readonly UserManager<IdentityUser> _userManager = userManager;

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            var user = await _userManager.FindByNameAsync(model.Username);
            if (user != null && await _userManager.CheckPasswordAsync(user, model.Password))
            {
                return Ok(new
                {
                    token = AuthService.GenerateJwtToken(model.Username, _configuration["JwtKey"]!)
                });
            }
            return Unauthorized();
        }
        
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] LoginModel model)
        {
            IdentityUser user = new() { UserName = model.Username };
            IdentityResult result = await _userManager.CreateAsync(user, model.Password);
            if (result.Succeeded)
            {
                return Ok(new
                {
                    Message = "user created successfully"
                });
            }
            
            return BadRequest(result.Errors);
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
