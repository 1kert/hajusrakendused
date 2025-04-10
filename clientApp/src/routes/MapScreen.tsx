import {useEffect, useState} from "react"
import Radar from "radar-sdk-js"
import 'radar-sdk-js/dist/radar.css';
import MarkerAddPopup from "../components/MarkerAddPopup.tsx";
import MarkerRepository, {Marker} from "../repositories/MarkerRepository.ts";
import RadarMap from "radar-sdk-js/dist/ui/RadarMap";

function MapScreen() {
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
        
        allMarkers.forEach((element: Marker) => {
            if (element.longitude == null || element.latitude == null) return
            Radar.ui.marker({ text: element.title ?? "null" }).setLngLat([element.longitude, element.latitude]).addTo(radarMap)
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
            longitude: longitude
        }
        
        await MarkerRepository.createMarker(
            marker,
            "test"
        )
        
        setAllMarkers(await MarkerRepository.getAllMarkers())
    }
    
    // todo: display desc for markers
    // todo: custom popup for markers

    return (
        <div>
            {isPopupVisible && <MarkerAddPopup 
                onClose={() => setIsPopupVisible(false)} 
                onSubmit={onMarkerSubmit}
            />}
            <div id="map" className="w-full h-[400px]" />
        </div>
    )
}

export default MapScreen
