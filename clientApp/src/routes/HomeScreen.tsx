import rat from "../assets/rat.gif"
import {useEffect, useState} from "react";
import WeatherRepository, { WeatherData } from "../repositories/WeatherRepository.ts";
import {useNavigate} from "react-router-dom";

export default function HomeScreen() {
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
    const navigate = useNavigate()
    
    useEffect(() => {
        (async () => {
            const weatherData = await WeatherRepository.getWeatherData()
            setWeatherData(weatherData)
        })()
    }, [])
    
    return (
        <div className="h-full w-full p-8 flex">
            <div className="flex flex-col gap-4">
                <div className="flex gap-2">
                    <h1 className="text-5xl font-bold tracking-wide">Distributed apps</h1>
                    <img src={rat} alt="" className="size-20 relative bottom-6"/>
                </div>
                <div className="flex gap-8">
                    <NavigationCard title="Map"
                                    description="Adding markers on a map n' such. For when you want to feel like you're doing something productive."
                                    onClick={() => navigate("/map")}/>
                    <NavigationCard title="Blogs"
                                    description="Long-form opinions disguised as insight. Perfect for pretending you're learning something."
                                    onClick={() => navigate("/blogs")}/>
                    <NavigationCard title="Store"
                                    description="Give us your money in exchange for things you probably don’t need. Minimal guilt, maximum cart size."
                                    onClick={() => navigate("/store")}/>
                    <NavigationCard title="Favourite game API"
                                    description=""
                                    onClick={() => navigate("/favourite-game")}/>
                </div>
            </div>
            {/*todo: loading*/}
            <div className="flex justify-end w-full">
                {weatherData && (
                    <WeatherInfoCard weatherTitle={weatherData.weather.main}
                                     weatherDescription={weatherData.weather.description}
                                     weatherIcon={weatherData.weather.icon}
                                     cityName={weatherData.name}
                                     temperature={weatherData.temperature}/>
                )}
            </div>
        </div>
    )
}

function NavigationCard(
    props: {
        title: string
        description: string
        onClick: () => void
    }
) {
    return (
        <div onClick={props.onClick} className="bg-gray-300 w-[300px] p-4 rounded-md shadow-md hover:cursor-pointer hover:bg-gray-400">
            <p className="text-3xl mb-2 font-medium">{props.title}</p>
            <p className="text-lg">{props.description}</p>
        </div>
    )
}

function WeatherInfoCard(
    props: {
        weatherTitle: string
        weatherDescription: string
        weatherIcon: string
        cityName: string
        temperature: string
    }
) {
    return (
        <div className="flex w-[400px] bg-gray-300 h-max px-4 py-2 justify-between items-end rounded-md shadow-md">
            <div className="flex flex-col gap-2">
                <div className="flex w-full justify-between items-center gap-2">
                    <img className="size-12" src={`https://openweathermap.org/img/wn/${props.weatherIcon}.png`} alt=""/>
                    <p className="text-sm text-gray-600">{props.cityName}</p>
                </div>
                <p className="text-lg">{props.weatherTitle}</p>
                <p className="-mt-2 text-md">{props.weatherDescription}</p>
            </div>
            <p className="text-2xl font-bold">{props.temperature}&#176;C</p>
        </div>
    )
}
