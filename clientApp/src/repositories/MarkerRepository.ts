import axios from "axios";

export interface Marker {
    title: string | null,
    description: string | null,
    latitude: number | null,
    longitude: number | null
}

export default class MarkerRepository {
    static async getAllMarkers(): Promise<Marker[]> {
        const response = await axios.get("/api/map/get-markers")
        console.log(response.data.markers)
        return response.data.markers;
    }
}