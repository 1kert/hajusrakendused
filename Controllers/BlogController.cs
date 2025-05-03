using System.Security.Claims;
using hajusrakendused.Models;
using hajusrakendused.Models.http;
using hajusrakendused.Models.Repository;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
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
    
    [HttpGet("/{id:long}")]
    public async Task<IActionResult> GetBlog(long id)
    {
        Console.WriteLine(id); // todo
        return Ok();
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
            Title = request.Title,
            Content = request.Content,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            CreatedBy = userId
        });
        
        return !result ? StatusCode(StatusCodes.Status500InternalServerError) : Ok();
    }
}