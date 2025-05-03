namespace hajusrakendused.Models.Repository;

public class WeatherData
{
    public string DataJson { get; set; } = "";
    public DateTime ExpiresAt { get; set; } = DateTime.MinValue;
}

public class WeatherRepository(IConfiguration configuration)
{
    private const string City = "Kuressaare";
    private readonly string _url = $"https://api.openweathermap.org/data/2.5/weather?q={City}&units=metric&appid={configuration["OpenWeatherApiKey"]}";
    private static readonly WeatherData WeatherCache = new();

    public async Task<WeatherData?> GetWeatherDataAsync()
    {
        if (DateTime.UtcNow < WeatherCache.ExpiresAt) return WeatherCache;
        
        HttpClient client = new();
        var result = await client.GetAsync(_url);
        if (!result.IsSuccessStatusCode) return null;
        var jsonString = await result.Content.ReadAsStringAsync();
        WeatherCache.ExpiresAt = DateTime.UtcNow.AddMinutes(30);
        WeatherCache.DataJson = jsonString;

        return WeatherCache;
    }
    // $response = Http::get('https://api.openweathermap.org/data/2.5/weather', [
    // 'q' => $city,
    // 'units' => 'metric',
    // 'appid' => config('services.open_weather_map.key'),
    //     ]);
    
    
}