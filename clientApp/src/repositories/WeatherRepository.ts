import axios from "axios";

export interface WeatherData {
    weather: {
        main: string
        description: string
        icon: string
    }
    temperature: string
    name: string
}

export default class WeatherRepository {
    static async getWeatherData(): Promise<WeatherData> {
        const response = (await axios.get("/api/weather")).data
        // todo: error handling
        return {
            temperature: response.main.temp,
            name: response.name,
            weather: {
                main: response.weather[0].main,
                description: response.weather[0].description,
                icon: response.weather[0].icon,
            }
        };
    }
}