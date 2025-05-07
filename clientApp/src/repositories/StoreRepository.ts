import axios from "axios";
import getAuthHeader from "./AxiosHeader.ts";

export interface StoreItem {
    id: number
    image: string
    name: string
    description: string
    price: number
}

export interface CartItem {
    id: number
    image: string
    name: string
    price: number
    quantity: number
}

export default class StoreRepository {
    static async getStoreItems(): Promise<StoreItem[]> {
        const response = await axios.get("/api/store")
        // todo: error
        return response.data
    }
    
    static async getStoreItemById(id: number): Promise<StoreItem | undefined> {
        const response = await axios.get(`/api/store/${id}`)
        // todo: error
        return response.data
    }

    static async getCart(
        token: string
    ): Promise<CartItem[]> {
        const response = await axios.get("/api/store/cart", getAuthHeader(token))
        // todo: error
        return response.data
    }
    
    static async addToCart(
        item: StoreItem,
        quantity: number,
        token: string
    ): Promise<boolean> {
        const response = await axios.post(`/api/store`, {
            id: item.id,
            quantity: quantity
        }, getAuthHeader(token))
        // todo: error
        return response.status === 201
    }
    
    static async removeFromCart(
        itemId: number,
        token: string
    ): Promise<boolean> {
        const response = await axios.delete(`/api/store/${itemId}`, getAuthHeader(token))
        // todo: error
        return response.status === 200
    }
    
    static async updateCartItemQuantity(
        itemId: number,
        quantity: number,
        token: string
    ): Promise<boolean> {
        const response = await axios.put("/api/store", {
            id: itemId,
            quantity: quantity,
        }, getAuthHeader(token))
        // todo: error
        return response.data
    }
}