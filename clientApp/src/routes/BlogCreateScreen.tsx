import {Input} from "../components/ui/input.tsx";
import {useContext, useState} from "react";
import {Button} from "../components/ui/button.tsx";
import BlogRepository from "../repositories/BlogRepository.tsx";
import {AppContext} from "../App.tsx";
import {useNavigate} from "react-router-dom";

export default function BlogCreateScreen() {
    const appContext = useContext(AppContext);
    const navigate = useNavigate()
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    
    // todo: title and description validation
    // todo: user styling for content?
    
    async function onCreateClick() {
        await BlogRepository.createBlog({
            content: content,
            title: title
        }, appContext.token)
        console.log("done")
        navigate("/blogs")
    }
    
    return (
        <div className="h-full w-full p-8 flex flex-col">
            <h1 className="text-5xl">Blog create screen</h1>
            <div className="w-[600px] mx-auto mt-8 flex flex-col">
                <div className="flex flex-col gap-2">
                    <p className="text-lg font-medium">Add title</p>
                    <Input className="mb-6 border-gray-600" type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div className="flex flex-col gap-2">
                    <p className="text-lg font-medium">Add content</p>
                    <textarea spellCheck="false" rows={9} className="mb-6 px-3 py-1 shadow-sm resize-none bg-transparent border-gray-600 border rounded-md focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none" value={content} onChange={e => setContent(e.target.value)}></textarea>
                </div>
                <Button className="ml-auto" onClick={onCreateClick}>Create</Button>
            </div>
        </div>
    )
}