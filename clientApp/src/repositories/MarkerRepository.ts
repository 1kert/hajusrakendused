import axios from "axios";

export interface Marker {
    id: number
    title: string,
    description: string,
    latitude: number,
    longitude: number,
    isOwn: boolean
}

export interface MarkerUpdateRequest {
    id: number
    title: string
    description: string
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
        
        // todo: error handling
        
        return response.status === 200;
    }
    
    static async updateMarker(
        marker: MarkerUpdateRequest,
        authToken: string
    ): Promise<Marker> {
        const response = await axios.put("/api/map/update-marker", {
            id: marker.id,
            title: marker.title,
            description: marker.description,
        }, {
            headers: {
                Authorization: "Bearer " + authToken
            }
        })
        
        // todo: error handling
        
        return response.data
    }
    
    static async deleteMarker(id: number, authToken: string): Promise<boolean> {
        const response = await axios.delete(`/api/map/delete-marker/${id}`, {
            headers: {
                Authorization: "Bearer " + authToken
            }
        })
        
        return response.status === 200;
    }
}