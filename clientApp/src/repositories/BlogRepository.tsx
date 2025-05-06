import axios from "axios";

export interface Blog {
    id: number
    title: string
    content: string
    author: string
    updatedAt: string
    canEdit: boolean
    canDelete: boolean
    comments: BlogComment[] | null
}

export interface BlogComment {
    id: number
    author: string
    content: string
    canEdit: boolean
    canDelete: boolean
    updatedAt: string
}

export interface BlogRequest {
    title: string
    content: string
}

export default class BlogRepository {
    static async getAllBlogs(): Promise<Blog[]> {
        const response = await axios.get("/api/blog");
        // todo: error handling
        return response.data
    }
    
    static async createBlog(
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
    
    static async getBlogById(id: number, token: string): Promise<Blog> {
        const response = await axios.get(`/api/blog/${id}`, {
            headers: {
                Authorization: "Bearer " + token
            }
        });
        // todo: error
        return response.data;
    }
    
    static async updateBlog(
        id: number,
        title: string,
        content: string,
        token: string
    ) {
        const response = await axios.put(`/api/blog/${id}`, {
            title,
            content
        }, {
            headers: {
                Authorization: "Bearer " + token
            }
        })
        // todo: error
        return response.data
    }
    
    static async deleteBlog(id: number, token: string) {
        const response = await axios.delete(`/api/blog/${id}`, {
            headers: {
                Authorization: "Bearer " + token
            }
        })
        // todo: error
        return response.data
    }
    
    static async createComment(
        blogId: number,
        content: string,
        token: string
    ): Promise<void> {
        const response = await axios.post("/api/blog/create", {
            blogId: blogId,
            content: content
        }, {
            headers: {
                Authorization: "Bearer " + token
            }
        })
        // todo: error
        return response.data;
    }
    
    static async deleteComment(id: number, token: string): Promise<void> {
        const response =  await axios.delete(`/api/blog/delete/${id}`, {
            headers: {
                Authorization: "Bearer " + token
            }
        })
        // todo: error
        return response.data;
    }
    
    static async updateComment(
        id: number,
        content: string,
        token: string
    ) {
        const response = await axios.put(`/api/blog/edit`, {
            id: id,
            content: content
        }, {
            headers: {
                Authorization: "Bearer " + token
            }
        })
        // todo: error
        return response.data;
    }
}