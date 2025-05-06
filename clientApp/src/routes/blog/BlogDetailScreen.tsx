import {useNavigate, useParams} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import BlogRepository, {Blog} from "../repositories/BlogRepository.tsx";
import vertical_menu from "../assets/ic_vertical_menu.svg"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "../components/ui/dropdown-menu.tsx";
import {Textarea} from "../components/ui/textarea.tsx";
import {Button} from "../components/ui/button.tsx";
import {AppContext, appContext} from "../App.tsx";
import {Input} from "../components/ui/input.tsx";

export default function BlogDetailScreen() {
    const context = useContext<appContext>(AppContext);
    const params = useParams()
    const navigate = useNavigate()
    const [blog, setBlog] = useState<Blog | null>(null)
    const [commentAreaText, setCommentAreaText] = useState("")
    
    const [isEditing, setIsEditing] = useState(false)
    const [titleText, setTitleText] = useState("")
    const [contentText, setContentText] = useState("")
    
    useEffect(() => {
        (async () => {
            const id = Number(params.id)
            if (!Number.isInteger(id)) navigate("/blogs")
            await getBlog(id)
        })()
    }, [])
    
    async function getBlog(id: number | undefined = blog?.id) {
        if (!id) throw Error("Blog not found")
        setBlog(await BlogRepository.getBlogById(id, context.token))
    }
    
    async function onCommentEdit(id: number, content: string) {
        await BlogRepository.updateComment(id, content, context.token)
        await getBlog()
    }
    
    async function onCommentDelete(id: number) {
        await BlogRepository.deleteComment(id, context.token)
        await getBlog()
    }
    
    async function onCommentCreate() {
        if (!blog) throw Error("Blog not found")
        
        await BlogRepository.createComment(
            blog.id,
            commentAreaText,
            context.token
        )
        await getBlog()
        setCommentAreaText("")
    }
    
    async function onEditConfirm() {
        if (!blog) throw Error("Blog not found")
        await BlogRepository.updateBlog(
            blog.id,
            titleText,
            contentText,
            context.token
        )
        const blogData = await BlogRepository.getBlogById(blog.id, context.token)
        setBlog(blogData)
        setIsEditing(false) // todo: loading
    }
    
    async function onBlogDeleteClick() {
        if(!blog) throw Error("Blog not found")
        await BlogRepository.deleteBlog(blog.id, context.token)
        navigate(`/blogs`)
    }
    
    function onBlogEditClick() {
        setTitleText(blog?.title ?? "")
        setContentText(blog?.content ?? "")
        setIsEditing(true)
    }
    
    // todo: loading
    // todo: error
    
    return (
        <div className="flex flex-col items-center w-full py-10">
            {blog &&
                <div className="flex flex-col gap-2 w-[700px]">
                    {!isEditing && (
                        <>
                            <div className="flex justify-between gap-2">
                                <h1 className="text-3xl">{blog.title}</h1>
                                {(blog.canDelete || blog.canEdit) && (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <img className="size-7 mt-1 hover:cursor-pointer" src={vertical_menu} alt="more"/>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            {blog.canEdit && <DropdownMenuItem onClick={onBlogEditClick}>Edit</DropdownMenuItem>}
                                            {blog.canDelete && <DropdownMenuItem onClick={onBlogDeleteClick} className="text-red-600">Delete</DropdownMenuItem>}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                )}
                            </div>
                            <p>Created by <span className="font-bold">{blog.author}</span>, last updated {blog.updatedAt}</p>
                            <p className="mt-4">{blog.content}</p>
                            <p className="text-xl mt-10">Comments</p>
                            <Textarea rows={4} spellCheck={false} className="resize-none border-gray-600 text-lg md:text-md" value={commentAreaText} onChange={e => setCommentAreaText(e.target.value)} />
                            <Button onClick={onCommentCreate} className="w-max ml-auto">Comment</Button>
                            <div className="mt-5 gap flex flex-col gap-4">
                                {blog.comments?.map(comment =>
                                    <CommentCard
                                        key={comment.id}
                                        content={comment.content}
                                        author={comment.author}
                                        updatedAt={comment.updatedAt}
                                        onEdit={comment.canEdit ? (content: string) => onCommentEdit(comment.id, content) : undefined }
                                        onDelete={comment.canDelete ? () => onCommentDelete(comment.id) : undefined }
                                    />
                                )}
                            </div>
                        </>
                    )}

                    {isEditing && (
                        <>
                            <div className="flex flex-col gap-2">
                                <p className="text-lg font-medium">Title</p>
                                <Input className="mb-6 border-gray-600" type="text" value={titleText} onChange={(e) => setTitleText(e.target.value)} />
                            </div>
                            <div className="flex flex-col gap-2">
                                <p className="text-lg font-medium">Content</p>
                                <textarea spellCheck="false" rows={9} className="mb-6 px-3 py-1 shadow-sm resize-none bg-transparent border-gray-600 border rounded-md focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none" value={contentText} onChange={e => setContentText(e.target.value)}></textarea>
                            </div>
                            <div className="flex gap-2 -mt-4 ml-auto">
                                <Button onClick={() => setIsEditing(false)} variant="outline">Cancel</Button>
                                <Button onClick={onEditConfirm}>Confirm</Button>
                            </div>
                        </>
                    )}
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
        onEdit?: (content: string) => void
        onDelete?: () => void
    }
) {
    const [isEditing, setIsEditing] = useState(false)
    const [text, setText] = useState("")
    
    function onEditClick() {
        setText(props.content)
        setIsEditing(true)
    }
    
    function onConfirmClick() {
        if (!props.onEdit) throw Error("Can't edit comment")
        props.onEdit(text)
        setIsEditing(false)
    }
    
    return (
        <div className="flex flex-col gap-1 bg-gray-300 px-3 py-2 rounded-md shadow-md">
            <div className="flex justify-between">
                <div className="flex flex-col gap-1">
                    <p className="font-bold">{props.author}</p>
                    <p className="text-sm text-gray-600">{props.updatedAt}</p>
                </div>
                {(props.onEdit || props.onDelete) && !isEditing &&
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <img className="size-7 mt-1 hover:cursor-pointer" src={vertical_menu} alt="more"/>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            {props.onEdit && <DropdownMenuItem onClick={onEditClick}>Edit</DropdownMenuItem>}
                            {props.onDelete && <DropdownMenuItem onClick={props.onDelete} className="text-red-600">Delete</DropdownMenuItem>}
                        </DropdownMenuContent>
                    </DropdownMenu>
                }
            </div>
            {!isEditing && <p className="mt-2">{props.content}</p>}
            {isEditing && (
                <div className="flex flex-col">
                    <Textarea rows={4} spellCheck={false} className="resize-none border-gray-600 md:text-md mt-2" value={text} onChange={e => setText(e.target.value)} />
                    <div className="flex gap-2 mt-2 ml-auto">
                        <Button onClick={() => setIsEditing(false)} variant="outline">Cancel</Button>
                        <Button onClick={onConfirmClick}>Confirm</Button>
                    </div>
                </div>
            )}
        </div>
    )
}