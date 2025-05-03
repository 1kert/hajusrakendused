using System.Security.Claims;
using hajusrakendused.Models;
using hajusrakendused.Models.http;
using hajusrakendused.Models.Repository;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace hajusrakendused.Controllers;

[ApiController]
[Route("/api/blog")]
public class BlogController(BlogRepository blogRepository): ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Index()
    {
        return Ok(await blogRepository.GetAllBlogsResponsesAsync());
    }

    [HttpPost]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public async Task<IActionResult> Create([FromBody] BlogCreateRequest request)
    {
        if (request.Title == null || request.Content == null) return BadRequest();
        var userId = User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;
        if (userId == null) return StatusCode(StatusCodes.Status500InternalServerError);

        var result = await blogRepository.AddBlogAsync(new BlogEntity
        {
            Id = 0,
            Title = request.Title,
            Content = request.Content,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            CreatedBy = Guid.Parse(userId)
        });
        
        return !result ? StatusCode(StatusCodes.Status500InternalServerError) : Ok();
    }
}