using hajusrakendused.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace hajusrakendused.controllers
{
    [Route("api")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        [HttpPost("login")]
        public IActionResult Login([FromBody] Credentials user)
        {
            return Ok(user);
        }
        
        [HttpPost("register")]
        public IActionResult Register([FromBody] Credentials user)
        {
            return Ok(user);
        }
    }
}
