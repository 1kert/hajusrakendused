import {FormEvent, useState} from "react";

export default function MarkerAddPopup(
    props: {
        onClose: () => void,
        onSubmit: (title: string, desc: string) => void,
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
        <div className="absolute left-0 top-0 z-50 w-full h-screen bg-[#00000090] flex items-center justify-center">
            <form className="bg-white p-6 flex flex-col gap-2" onSubmit={handleSubmit}>
                <input className="border-2 border-solid border-black" type="text" onChange={(e) => setTitle(e.target.value)} value={title} />
                <input className="border-2 border-solid border-black" type="text" onChange={(e) => setDescription(e.target.value)} value={description} />
                <input type="submit" value="Submit" />
            </form>
        </div>
    )
}
