using hajusrakendused.Models;
using Microsoft.AspNetCore.Mvc;

namespace hajusrakendused.controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MapController : ControllerBase
    {
        [HttpGet("get-markers")]
        public IActionResult GetMarkers()
        {
            Marker[] markers =
            [
                new() { Id = 1, UpdatedAt = DateTime.UtcNow, Title = "marker 1", Description = "some description", Latitude = 0, Longitude = 0 },
                new() { Id = 2, UpdatedAt = DateTime.UtcNow, Title = "marker 2", Description = "some other description", Latitude = 0, Longitude = 0 }
            ];

            return Ok(new { Markers = markers });
        }
    }
}
