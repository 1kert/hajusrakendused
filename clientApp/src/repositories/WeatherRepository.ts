import axios from "axios";

export interface WeatherData {
    weather: {
        main: string
        description: string
        icon: string
    }[]
    main: {
        temp: string
    }
    name: string
}

export default class WeatherRepository {
    static async getWeatherData(): Promise<WeatherData> {
        const response = (await axios.get("/api/weather")).data
        // todo: error handling
        return {
            main: {
                temp: response.main.temp
            },
            name: response.name,
            weather: response.weather.map((w: any) => ({
                main: w.main,
                description: w.description,
                icon: w.icon
            }))
        };
    }
}