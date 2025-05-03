import axios from "axios";

export interface Blog {
    title: string
    content: string
    author: string
    updatedAt: string
}

export interface BlogRequest {
    title: string
    content: string
}

export default class BlogRepository {
    static async getAll(): Promise<Blog[]> {
        const response = await axios.get("/api/blog");
        // todo: error handling
        return response.data
    }
    
    static async create(
        data: BlogRequest,
        token: string
    ): Promise<void> {
        const response = await axios.post("/api/blog", {
            title: data.title,
            content: data.content
        }, {
            headers: {
                Authorization: "Bearer " + token
            }
        });
        console.log(response.data);
        // todo: error handling
    }
}