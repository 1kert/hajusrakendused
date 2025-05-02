import {Dialog, DialogContent, DialogHeader, DialogTitle} from "./ui/dialog.tsx";

export default function MarkerDialog(
    props: {
        isVisible: boolean
        title: string
        description: string
        author: string
        updateDate: string
        onClose: () => void
    }
) {
    return (
        <Dialog open={props.isVisible} onOpenChange={open => { if(!open) props.onClose() }}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="pr-4 text-xl">{props.title}</DialogTitle>
                    <p className="text-xs text-gray-700">Created by {props.author}</p>
                    <p className="text-xs text-gray-500">{props.updateDate}</p>
                </DialogHeader>
                <p>{props.description}</p>
            </DialogContent>
        </Dialog>
    )
}