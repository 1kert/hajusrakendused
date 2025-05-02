import {useContext, useEffect, useState} from "react"
import Radar from "radar-sdk-js"
import 'radar-sdk-js/dist/radar.css';
import MarkerAddDialog from "../components/MarkerAddDialog.tsx";
import MarkerRepository, {Marker} from "../repositories/MarkerRepository.ts";
import RadarMap from "radar-sdk-js/dist/ui/RadarMap";
import {AppContext} from "../App.tsx";
import LoginScreen from "./LoginScreen.tsx";
import MarkerDialog from "../components/MarkerDialog.tsx";

interface AddDialogData {
    latitude: number
    longitude: number
}

interface MarkerDialogData {
    id: number
    title: string
    description: string
    canEdit: boolean
}

export default function MapScreen() {
    const appContext = useContext(AppContext)
    if (appContext.token == null) return <LoginScreen />
    
    const [radarMap, setRadarMap] = useState<RadarMap | null>(null)
    const [addDialogData, setAddDialogData] = useState<AddDialogData | null>(null)
    const [markerDialogData, setMarkerDialogData] = useState<MarkerDialogData | null>(null)
    const [allMarkers, setAllMarkers] = useState<Marker[]>([])
    
    async function getAllMarkers() {
        // todo: update every 5 sec or websocket?
        const markers = await MarkerRepository.getAllMarkers(appContext.token);
        setAllMarkers(markers)
    }
    
    useEffect(() => {
        if (radarMap == null) return;
        
        allMarkers?.forEach((marker: Marker) => {
            if (marker.longitude == null || marker.latitude == null) return
            // todo: different marker colors for self and others
            Radar.ui.marker()
                .setLngLat([marker.longitude, marker.latitude])
                .on("click", () => { setMarkerDialogData({
                    id: marker.id,
                    title: marker.title,
                    description: marker.description,
                    canEdit: marker.isOwn
                }) })
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
            setAddDialogData({
                latitude: e.lngLat.lat, 
                longitude: e.lngLat.lng,
            })
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
        const latitude = addDialogData?.latitude
        const longitude = addDialogData?.longitude
        if (latitude === undefined || longitude === undefined) throw new Error("submitted lngLat is required")
        
        const marker: Marker = {
            title: title,
            description: desc,
            latitude: latitude,
            longitude: longitude,
            id: 0,
            isOwn: false,
        }
        
        await MarkerRepository.createMarker(
            marker,
            appContext.token!
        )
        
        setAllMarkers(await MarkerRepository.getAllMarkers(appContext.token));
    }
    
    // todo: display desc for markers
    // todo: loading after adding marker
    
    return (
        <div className="w-full h-full">
            <MarkerAddDialog isVisible={addDialogData !== null}
                             onClose={() => setAddDialogData(null)}
                             onSubmit={onMarkerSubmit}/>
            <MarkerDialog isVisible={markerDialogData !== null}
                          title={markerDialogData?.title ?? ""}
                          description={markerDialogData?.description ?? ""}
                          author={"some guy"} // todo: show author
                          updateDate={"10 years ago"} // todo: show update date
                          canEdit={markerDialogData?.canEdit ?? false}
                          onClose={() => setMarkerDialogData(null)}/>
            <div id="map" className="w-full h-full" />
        </div>
    )
}