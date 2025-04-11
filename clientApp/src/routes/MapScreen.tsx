import {useContext, useEffect, useState} from "react"
import Radar from "radar-sdk-js"
import 'radar-sdk-js/dist/radar.css';
import MarkerAddPopup from "../components/MarkerAddPopup.tsx";
import MarkerRepository, {Marker} from "../repositories/MarkerRepository.ts";
import RadarMap from "radar-sdk-js/dist/ui/RadarMap";
import {renderToString} from "react-dom/server";
import {AppContext} from "../App.tsx";
import LoginScreen from "./LoginScreen.tsx";

export default function MapScreen() {
    const appContext = useContext(AppContext)
    if (appContext.token == null) return <LoginScreen />
    
    const [radarMap, setRadarMap] = useState<RadarMap | null>(null)
    const [isPopupVisible, setIsPopupVisible] = useState<boolean>(false)
    const [allMarkers, setAllMarkers] = useState<Marker[]>([])
    const [latitude, setLatitude] = useState<number>(0)
    const [longitude, setLongitude] = useState<number>(0)
    
    async function getAllMarkers() {
        // todo: update every 5 sec or websocket?
        const markers = await MarkerRepository.getAllMarkers()
        setAllMarkers(markers)
    }
    
    useEffect(() => {
        if (radarMap == null) return;
        
        allMarkers?.forEach((element: Marker) => {
            if (element.longitude == null || element.latitude == null) return
            // todo: different marker colors for self and others
            Radar.ui.marker({ 
                popup: {
                    html: renderToString(
                        <CustomPopup text={element.title} description={element.description}/>
                    )
                }
            })
                .setLngLat([element.longitude, element.latitude])
                .addTo(radarMap)
        }) 
        
        return () => {
            radarMap.clearMarkers()
        }
    }, [allMarkers])
    
    useEffect(() => {
        Radar.initialize("prj_live_pk_7a98b00dfd090c2938b71f3908bac856ec6393be");
        getAllMarkers().catch(console.error);
        const map = Radar.ui.map({
            container: "map",
            style: "radar-default-v1",
            center: [25.33176823888624, 58.761168617909306],
            zoom: 6
        })

        map.on("click", (e) => {
            setLatitude(e.lngLat.lat)
            setLongitude(e.lngLat.lng)
            setIsPopupVisible(true)
        })

        setRadarMap(map)
        
        return () => {
            map.remove()
        }
    }, [])
    
    async function onMarkerSubmit(
        title: string,
        desc: string
    ) {
        const marker: Marker = {
            title: title,
            description: desc,
            latitude: latitude,
            longitude: longitude,
            userId: null
        }
        
        await MarkerRepository.createMarker(
            marker,
            appContext.token!
        )
        
        setAllMarkers(await MarkerRepository.getAllMarkers())
    }
    
    // todo: display desc for markers
    
    return (
        <div className="w-full h-full">
            {isPopupVisible && <MarkerAddPopup 
                onClose={() => setIsPopupVisible(false)} 
                onSubmit={onMarkerSubmit}
            />}
            <div id="map" className="w-full h-full" />
        </div>
    )
}

function CustomPopup(
    props: {
        text: string | null,
        description: string | null
    }
) {
    return ( // todo: should look less trash
        <div className="flex flex-col gap-2">
            <h1 className="text-xl font-bold">{props.text}</h1>
            <p className="text-lg">{props.description}</p>
        </div>
    )
}
