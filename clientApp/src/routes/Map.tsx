import { useEffect } from "react"
import Radar from "radar-sdk-js"
import 'radar-sdk-js/dist/radar.css';
import { LngLat } from "maplibre-gl";

const mapBounds = {
    min: new LngLat(21.604570781444522, 57.46168384337247),
    max: new LngLat(28.18021304156798, 59.66718179585894)
}

function isLngLatWithinBounds(position: LngLat): boolean {
    return position.lng > mapBounds.min.lng && position.lng < mapBounds.max.lng
        && position.lat > mapBounds.min.lat && position.lat < mapBounds.max.lat
}

function Map() {
    useEffect(() => {
        Radar.initialize("prj_live_pk_7a98b00dfd090c2938b71f3908bac856ec6393be")

        const map = Radar.ui.map({
            container: "map",
            style: "radar-default-v1",
            center: [25.33176823888624, 58.761168617909306],
            zoom: 6
        })

        Radar.ui.marker({ text: 'Radar HQ' }).setLngLat([-73.9910078, 40.7342465]).addTo(map);
        
        map.on("click", (e) => {
            const pos = e.lngLat
            const isWithinBounds = isLngLatWithinBounds(pos)
            if(isWithinBounds) {
                console.log(pos);
            } else {
                console.log("not within bounds");
            }
        })

        return () => {
            map.remove()
        }
    }, [])

    return (
        <div id="map" className="w-full h-[400px]" />
    )
}

export default Map
