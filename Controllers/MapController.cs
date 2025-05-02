using System.Net;
using System.Security.Claims;
using hajusrakendused.Models;
using hajusrakendused.Models.http;
using hajusrakendused.Models.Repository;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace hajusrakendused.controllers
{
    [Route("api/map")]
    [ApiController]
    public class MapController(MarkerRepository markerRepository) : ControllerBase
    {
        [HttpGet("get-markers")]
        public async Task<IActionResult> GetMarkers()
        {
            var authResult = await HttpContext.AuthenticateAsync(JwtBearerDefaults.AuthenticationScheme);
            var userId = authResult.Principal?.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;
            
            var allMarkers = await markerRepository.GetAllMarkersAsync();
            var response = allMarkers.Select(marker => new MarkerResponse
            {
                Id = marker.Id,
                Title = marker.Title,
                Description = marker.Description,
                Latitude = marker.Latitude,
                Longitude = marker.Longitude,
                IsOwn = userId != null && marker.UserId.Equals(Guid.Parse(userId))
            });
            
            return Ok(response);
        }

        [HttpPost("create-marker")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> CreateMarker([FromBody] MarkerRequest marker)
        {
            var userId = User.Claims.FirstOrDefault(x => x.Type.Equals(ClaimTypes.NameIdentifier));
            if (userId == null) return StatusCode(StatusCodes.Status500InternalServerError);
            
            string title = marker.Title?.Trim() ?? ""; // todo: max size
            string description = marker.Description?.Trim() ?? "";
            if (title.Length == 0 || description.Length == 0) return BadRequest();
            if (marker.Longitude == null || marker.Latitude == null) return BadRequest();

            await markerRepository.CreateMarkerAsync(new MarkerEntity
            {
                Title = title,
                Description = description,
                Latitude = marker.Latitude.Value,
                Longitude = marker.Longitude.Value,
                UserId = Guid.Parse(userId.Value),
                UpdatedAt = DateTime.UtcNow,
                CreatedAt = DateTime.UtcNow
            });
            
            return Ok();
        }
    }
}
