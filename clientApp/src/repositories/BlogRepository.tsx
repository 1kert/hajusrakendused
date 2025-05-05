import axios from "axios";

export interface Blog {
    id: number
    title: string
    content: string
    author: string
    updatedAt: string
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

    static blog: Blog = {
        id: 3,
        title: "The Art of Staying Productive in a Distracted World",
        content: "Staying focused in today’s fast-paced digital environment is more challenging than ever. With constant notifications and endless scrolling, our attention spans are shrinking. Many people struggle to find a balance between staying connected and being productive. One effective strategy is time-blocking your schedule to prioritize deep work. It’s also important to set boundaries around technology use, especially during work hours. Creating a distraction-free workspace can dramatically improve concentration. Regular breaks, even just five minutes, help reset the brain and reduce mental fatigue. Tracking your progress each day can build momentum and keep you motivated. Ultimately, productivity is less about doing more and more about doing what truly matters. With a few intentional habits, anyone can reclaim control of their focus.",
        author: "no idea",
        updatedAt: "10 years ago",
        comments: [
            {
                id: 0,
                author: "some one",
                content: "this is ass",
                updatedAt: "9 years ago",
                canEdit: true,
                canDelete: true
            },
            {
                id: 1,
                author: "some guy",
                content: "2025 anyone?",
                updatedAt: "few minutes ago",
                canEdit: false,
                canDelete: true
            }
        ]
    }
    
    static async get(id: number): Promise<Blog | null> {
        return {...this.blog}
    }
    
    static async createComment(content: string): Promise<void> {
        let largestId = 0
        for (const comment of this.blog.comments!) if(largestId < comment.id) largestId = comment.id;
        
        this.blog.comments = [
            ...this.blog.comments!, {
                id: largestId + 1,
                author: "me",
                content: content,
                canEdit: true,
                canDelete: true,
                updatedAt: "now"
            }
        ]
    }
    
    static async deleteComment(id: number): Promise<void> {
        const index = this.blog.comments!.findIndex(comment => comment.id === id)
        if (index == -1) return
        this.blog.comments = this.blog.comments!.filter(comment => comment.id !== id)
    }
    
    static async editComment(
        id: number,
        content: string
    ) {
        const comment = this.blog.comments!.find(comment => comment.id === id)
        if (!comment) return
        comment.content = content
        comment.updatedAt = "updated!!"
    }
}