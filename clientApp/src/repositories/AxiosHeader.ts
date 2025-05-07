import {AxiosRequestConfig} from "axios";

export default function getAuthHeader(token: string): AxiosRequestConfig {
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
}