import axios from "axios";

export interface Marker {
    id: number
    title: string | null,
    description: string | null,
    latitude: number | null,
    longitude: number | null,
    isOwn: boolean
}

export default class MarkerRepository {
    static async getAllMarkers(token: string | null): Promise<Marker[]> {
        const response = await axios.get("/api/map/get-markers", {
            headers: {
                "Authorization": "Bearer " + token
            }
        })
        console.log(response.data)
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