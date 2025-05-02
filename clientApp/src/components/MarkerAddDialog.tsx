import {FormEvent, useState} from "react";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "./ui/dialog.tsx";
import {Button} from "./ui/button.tsx";

export default function MarkerAddDialog(
    props: {
        isPopupVisible: boolean,
        onClose: () => void,
        onSubmit: (title: string, desc: string) => void
    }
) {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    
    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        props.onSubmit(title, description)
        props.onClose()
        
        e.preventDefault()
    }
    
    // todo: field validation
    
    return (
        <Dialog open={props.isPopupVisible} onOpenChange={open => { if(!open) props.onClose() }}>
            <DialogContent>
                <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Add marker</DialogTitle>
                    </DialogHeader>
                    <input className="border-2 border-solid border-black" type="text" onChange={(e) => setTitle(e.target.value)} value={title} />
                    <input className="border-2 border-solid border-black" type="text" onChange={(e) => setDescription(e.target.value)} value={description} />
                    <DialogFooter>
                        <Button type="submit">Confirm</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
