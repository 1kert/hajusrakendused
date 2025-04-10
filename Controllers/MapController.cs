using System.Text.Json;
using hajusrakendused.Models;
using Microsoft.AspNetCore.Mvc;

namespace hajusrakendused.controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MapController : ControllerBase
    {
        private static readonly List<MarkerResponse> Markers = [];
        
        [HttpGet("get-markers")]
        public IActionResult GetMarkers()
        {
            return Ok(new { Markers = Markers });
        }

        [HttpPost("create-marker")]
        public IActionResult CreateMarker([FromBody] MarkerResponse marker)
        {
            string title = marker.Title?.Trim() ?? "";
            string description = marker.Description?.Trim() ?? "";
            if (marker.Longitude == null || marker.Latitude == null) return BadRequest();
            if (title.Length == 0 || description.Length == 0) return BadRequest();

            Markers.Add(new MarkerResponse
            {
                Title = title,
                Description = description,
                Latitude = marker.Latitude,
                Longitude = marker.Longitude
            });
            return Ok();
        }
    }
}
