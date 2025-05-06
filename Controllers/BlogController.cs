using System.Security.Claims;
using hajusrakendused.Models;
using hajusrakendused.Models.Http;
using hajusrakendused.Models.Repository;
using Microsoft.AspNetCore.Authentication;
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
        return Ok(await blogRepository.GetAllBlogsResponseAsync());
    }
    
    [HttpGet("{id:long}")]
    public async Task<IActionResult> GetById(long id)
    {
        var user = (await HttpContext.AuthenticateAsync(JwtBearerDefaults.AuthenticationScheme)).Principal;
        var userId = user?.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;
        var userRoles = user?.Claims.Where(x => x.Type == ClaimTypes.Role).Select(x => Enum.Parse<UserRole>(x.Value));
        
        return Ok(await blogRepository.GetBlogResponseAsync(id, userId ?? "", userRoles?.ToList() ?? []));
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
    
    [HttpPost("create")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public async Task<IActionResult> CreateComment([FromBody] BlogCommentUpdateRequest request)
    {
        if (request.Content == null || request.BlogId == null) return BadRequest();
        
        var userId = User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;
        if (userId == null) return StatusCode(StatusCodes.Status500InternalServerError);

        if (!await blogRepository.AddCommentAsync(request.Content, userId, request.BlogId.Value)) return StatusCode(StatusCodes.Status500InternalServerError);
        
        return Ok();
    }

    [HttpPut("edit")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public async Task<IActionResult> EditComment([FromBody] BlogCommentUpdateRequest request)
    {
        if (request.Content == null || request.Id == null || request.BlogId == null) return BadRequest();
        
        var userId = User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;
        if (userId == null) return StatusCode(StatusCodes.Status500InternalServerError);
        
        if (!await blogRepository.UpdateCommentContentAsync(request.Id.Value, request.Content, userId)) return StatusCode(StatusCodes.Status500InternalServerError);
        return Ok();
    }

    [HttpDelete("delete/{id:long}")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public async Task<IActionResult> DeleteComment(long id)
    {
        var userId = User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;
        if (userId == null) return StatusCode(StatusCodes.Status500InternalServerError);
        
        var userRoles = User.Claims.Where(x => x.Type == ClaimTypes.Role).Select(x => Enum.Parse<UserRole>(x.Value));
        if (!await blogRepository.DeleteCommentAsync(id, userId, userRoles.ToList())) return StatusCode(StatusCodes.Status500InternalServerError);
        return Ok();
    }
}