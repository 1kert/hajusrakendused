using System.Security.Claims;
using hajusrakendused.Models.http;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

class MarkerResponse
{
    public string? Title { get; init; }
    public string? Description { get; init; }
    public double? Latitude { get; init; }
    public double? Longitude { get; init; }
    public string? UserId { get; init; }
}

namespace hajusrakendused.controllers
{
    [Route("api/map")]
    [ApiController]
    public class MapController : ControllerBase
    {
        private static readonly List<MarkerResponse> Markers = [];
        
        [HttpGet("get-markers")]
        public IActionResult GetMarkers()
        {
            return Ok(Markers);
        }

        [HttpPost("create-marker")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public IActionResult CreateMarker([FromBody] MarkerRequest marker)
        {
            var userId = User.Claims.FirstOrDefault(x => x.Type.Equals(ClaimTypes.NameIdentifier));
            if (userId == null) return StatusCode(StatusCodes.Status500InternalServerError);
            
            string title = marker.Title?.Trim() ?? "";
            string description = marker.Description?.Trim() ?? "";
            if (marker.Longitude == null || marker.Latitude == null) return BadRequest();
            if (title.Length == 0 || description.Length == 0) return BadRequest();

            Markers.Add(new MarkerResponse
            {
                Title = title,
                Description = description,
                Latitude = marker.Latitude,
                Longitude = marker.Longitude,
                UserId = userId.Value
            });
            return Ok();
        }
    }
}
