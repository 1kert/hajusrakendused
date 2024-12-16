import { useEffect } from "react"
import Radar from "radar-sdk-js"
import 'radar-sdk-js/dist/radar.css';

function Map() {
    useEffect(() => {
        Radar.initialize("prj_live_pk_7a98b00dfd090c2938b71f3908bac856ec6393be")

        const map = Radar.ui.map({
            container: "map",
            style: "radar-default-v1",
            center: [-73.991, 40.7342465],
            zoom: 14
        })

        Radar.ui.marker({ text: 'Radar HQ' }).setLngLat([-73.9910078, 40.7342465]).addTo(map);

        return () => {
            map.remove()
        }
    }, [])

    return (
        <div id="map" style={{width: "100%", height: "400px"}} />
    )
}

export default Map
