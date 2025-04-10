using System.Security.Claims;
using hajusrakendused.Models;
using hajusrakendused.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace hajusrakendused.controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController(
        IConfiguration configuration,
        UserManager<IdentityUser> userManager
    ) : ControllerBase
    {
        private const string UnauthorizedMessage = "Invalid username or password.";
        private const string BadRequestMessage = "Malformed request.";
        
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            if (model.Username == null || model.Password == null) return BadRequest(new
            {
                Content = BadRequestMessage
            });
            
            var user = await userManager.FindByNameAsync(model.Username);
            if (user != null && await userManager.CheckPasswordAsync(user, model.Password))
            {
                return Ok(new
                {
                    token = Authorization.GenerateJwtToken(model.Username, configuration["JwtKey"]!)
                });
            }
            return Unauthorized(new
            {
                Content = UnauthorizedMessage
            });
        }
        
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] LoginModel model)
        {
            if (model.Username == null || model.Password == null) return BadRequest(new
            {
                Content = BadRequestMessage
            });
            
            IdentityUser user = new() { UserName = model.Username };
            IdentityResult result = await userManager.CreateAsync(user, model.Password);
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
