import axios from "axios";

export interface Marker {
    title: string | null,
    description: string | null,
    latitude: number | null,
    longitude: number | null,
    userId: number | null
}

export default class MarkerRepository {
    static async getAllMarkers(): Promise<Marker[]> {
        const response = await axios.get("/api/map/get-markers")
        return response.data;
    }
    
    static async createMarker(
        marker: Marker,
        authToken: string
    ): Promise<boolean> {
        const response = await axios.post("/api/map/create-marker", {
            title: marker.title,
            description: marker.description,
            latitude: marker.latitude,
            longitude: marker.longitude
        }, {
            headers: {
                Authorization: "Bearer " + authToken
            }
        })
        
        // todo: case when request fails
        
        return response.status === 200;
    }
}