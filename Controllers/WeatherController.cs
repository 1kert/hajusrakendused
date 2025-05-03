using hajusrakendused.Models.Repository;
using Microsoft.AspNetCore.Mvc;

namespace hajusrakendused.Controllers;

[Route("api/weather")]
[ApiController]
public class WeatherController(WeatherRepository weatherRepository) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Index()
    {
        var weatherData = await weatherRepository.GetWeatherDataAsync();
        if (weatherData == null) return StatusCode(StatusCodes.Status500InternalServerError);
        return Ok(weatherData.DataJson);
    }
}