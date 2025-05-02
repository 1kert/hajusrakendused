import {Dialog, DialogContent, DialogHeader} from "./ui/dialog.tsx";
import ic_edit from "../assets/ic_edit.svg"

export default function MarkerDialog(
    props: {
        isVisible: boolean
        title: string
        description: string
        author: string
        updateDate: string
        canEdit: boolean
        onClose: () => void
    }
) {
    return (
        <Dialog open={props.isVisible} onOpenChange={open => { if(!open) props.onClose() }}>
            <DialogContent>
                <DialogHeader>
                    <div className="flex gap-2 pr-4">
                        <h1 className="text-xl">{props.title}</h1>
                        { props.canEdit && <img src={ic_edit} alt="edit" className="size-6 relative top-0.5 hover:cursor-pointer" /> }
                    </div>
                    <p className="text-xs text-gray-700">Created by {props.author}</p>
                    <p className="text-xs text-gray-500">{props.updateDate}</p>
                </DialogHeader>
                <p>{props.description}</p>
            </DialogContent>
        </Dialog>
    )
}