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
        onClose: () => void
    }
) {
    const [isEditing, setIsEditing] = useState(false)
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    
    useEffect(() => { // todo: remove when finished
        handleOnEditClick()
    }, [])
    
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
    
    return (
        <Dialog open={props.isVisible} onOpenChange={open => { if(!open) props.onClose() }}>
            <DialogContent>
                <DialogHeader>
                    <div className="flex gap-2 pr-4">
                        {/*<h1 className="text-xl">{props.title}</h1>*/}
                        <Input type="text" onChange={e => setTitle(e.target.value)} value={title}/>
                        { props.canEdit && <img src={ic_edit} alt="edit" onClick={handleOnEditClick} className="size-6 relative top-0.5 hover:cursor-pointer" /> }
                    </div>
                    <p className="text-xs text-gray-700">Created by {props.author}</p>
                    <p className="text-xs text-gray-500">{props.updateDate}</p>
                </DialogHeader>
                <p>{props.description}</p>
                { isEditing && (
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                        <Button onClick={handleOnConfirmClick}>Confirm</Button>
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    )
}