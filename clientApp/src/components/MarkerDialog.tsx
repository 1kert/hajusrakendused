import {Dialog, DialogContent, DialogFooter, DialogHeader} from "./ui/dialog.tsx";
import ic_edit from "../assets/ic_edit.svg"
import {useEffect, useState} from "react";
import {Input} from "./ui/input.tsx";
import { Button } from "./ui/button.tsx";

export default function MarkerDialog(
    props: {
        isVisible: boolean
        title: string
        description: string
        author: string
        updateDate: string
        canEdit: boolean
        onEdit: (title: string, description: string) => void
        onRemove: () => void
        onClose: () => void
    }
) {
    const [isEditing, setIsEditing] = useState(false)
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    
    useEffect(() => {
        if (props.isVisible) setIsEditing(false)
    }, [props.isVisible])
    
    function handleOnEditClick() {
        setTitle(props.title)
        setDescription(props.description)
        setIsEditing(true)
    }
    
    function handleOnConfirmClick() {
        setIsEditing(false)
        props.onEdit(title, description)
        // todo: handle loading
    }
    
    function handleOnRemoveClick() {
        props.onClose()
        props.onRemove()
    }
    
    return (
        <Dialog open={props.isVisible} onOpenChange={open => { if(!open) props.onClose() }}>
            <DialogContent>
                <DialogHeader>
                    <div className="flex gap-2 pr-4">
                        { !isEditing && <h1 className="text-xl">{props.title}</h1> }
                        { isEditing && <Input type="text" className="md:text-xl mr-24" onChange={e => setTitle(e.target.value)} value={title}/> }
                        { (props.canEdit && !isEditing) && <img src={ic_edit} alt="edit" onClick={handleOnEditClick} className="size-6 relative top-0.5 hover:cursor-pointer" /> }
                    </div>
                    <p className="text-xs text-gray-700">Created by {props.author}</p>
                    <p className="text-xs text-gray-500">{props.updateDate}</p>
                </DialogHeader>
                { !isEditing && <p>{props.description}</p> }
                { isEditing &&<textarea onChange={e => setDescription(e.target.value)} value={description} spellCheck="false" rows={3} className="resize-none w-full rounded-md border border-input px-3 py-2 shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:text-md"/> }
                { isEditing && (
                    <DialogFooter>
                        <Button variant="link" onClick={handleOnRemoveClick} className="mr-auto text-red-600">Remove</Button>
                        <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                        <Button onClick={handleOnConfirmClick}>Confirm</Button>
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    )
}