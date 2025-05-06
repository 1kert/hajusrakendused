import {Button} from "../components/ui/button.tsx";
import {Link, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import BlogRepository, {Blog} from "../repositories/BlogRepository.tsx";

export default function BlogScreen() {
    const [blogs, setBlogs] = useState<Blog[]>([])
    const navigate = useNavigate()
    
    useEffect(() => {
        (async () => {
            const blogs = await BlogRepository.getAllBlogs();
            setBlogs(blogs)
        })()
    }, [])
    
    function onBlogClick(id: number) {
        navigate(`/blog/${id}`)
    }
    
    // todo: sorting
    // todo: pagination
    // todo: searching
    
    return (
        <div className="w-full h-full flex flex-col p-8">
            <div className="flex items-center gap-4 w-[800px] mx-auto justify-between">
                <h1 className="text-5xl">Blogs</h1>
                <Link to="/blog/create">
                    <Button>Create Blog</Button>
                </Link>
            </div>
            
            <div className="mt-8 flex flex-col gap-2 w-[800px] mx-auto">
                {blogs.map((blog: Blog) => 
                    <div onClick={() => onBlogClick(blog.id)} className="flex flex-col rounded-md py-1 px-3 bg-gray-300 h-[8em] hover:cursor-pointer hover:bg-gray-400">
                        <h1 className="text-2xl">{blog.title}</h1>
                        <p>Created by <span className="font-bold">{blog.author}</span> at {new Date(blog.updatedAt).getUTCHours()}</p>
                        <p className="mt-[1em] h-full w-full line-clamp-2">{blog.content}</p>
                    </div>
                )}
            </div>
        </div>
    )
}