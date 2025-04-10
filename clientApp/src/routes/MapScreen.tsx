import {useEffect, useState} from "react"
import Radar from "radar-sdk-js"
import 'radar-sdk-js/dist/radar.css';
import MarkerAddPopup from "../components/MarkerAddPopup.tsx";

function MapScreen() {
    const [isMapVisible, setIsMapVisible] = useState<boolean>(false)
    
    useEffect(() => {
        Radar.initialize("prj_live_pk_7a98b00dfd090c2938b71f3908bac856ec6393be")

        const map = Radar.ui.map({
            container: "map",
            style: "radar-default-v1",
            center: [25.33176823888624, 58.761168617909306],
            zoom: 6
        })

        Radar.ui.marker({ text: 'Radar HQ' }).setLngLat([-73.9910078, 40.7342465]).addTo(map);
        
        map.on("click", () => {
            setIsMapVisible(true)
        })

        return () => {
            map.remove()
        }
    }, [])

    return (
        // todo: add popup when clicked that asks for title and desc
        <div>
            {isMapVisible && <MarkerAddPopup onClose={() => setIsMapVisible(false)} />}
            <div id="map" className="w-full h-[400px]" />
        </div>
    )
}

export default MapScreen
