import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import BlogRepository, {Blog} from "../repositories/BlogRepository.tsx";

export default function BlogDetailScreen() {
    const params = useParams()
    const navigate = useNavigate()
    const [blog, setBlog] = useState<Blog | null>(null)
    
    useEffect(() => {
        (async () => {
            const id = Number(params.id)
            if (!Number.isInteger(id)) navigate("/blogs")
            const blog = await BlogRepository.get(id)
            setBlog(blog)
        })()
    })
    
    // todo: loading
    // todo: error
    
    return (
        <div className="flex flex-col items-center w-full py-10">
            {blog &&
                <div className="flex flex-col gap-2 w-[700px]">
                    <h1 className="text-3xl">{blog.title}</h1>
                    <p>Created by <span className="font-bold">{blog.author}</span>, last updated {blog.updatedAt}</p>
                    <p className="mt-4">{blog.content}</p>
                    <p className="text-xl mt-10">Comments</p>
                    <div className="mt-5 gap flex flex-col gap-4">
                        {blog.comments?.map(comment => 
                            <CommentCard content={comment.content} author={comment.author} updatedAt={comment.updatedAt} />
                        )}
                    </div>
                </div>
            }
        </div>
    )
}

function CommentCard(
    props: {
        content: string
        author: string
        updatedAt: string
    }
) {
    return (
        <div className="flex flex-col gap-1 bg-gray-300 px-3 py-2 rounded-md shadow-md">
            <p className="font-bold">{props.author}</p>
            <p className="text-sm text-gray-600">{props.updatedAt}</p>
            <p className="mt-2">{props.content}</p>
        </div>
    )
}