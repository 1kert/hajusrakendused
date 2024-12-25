import { useState } from "react"

interface textFieldProps {
    name: string,
    id: string,
    className: string,
    placeholder: string,
    backgroundColor: string,
    value: string,
    setValue: (str: string) => void
}

function TextField(props: textFieldProps) {
    const [isSelected, setSelected] = useState(false)

    function handleOnBlur() {
        if (props.value != "") return
        
        setSelected(false)
    }

    return (
        <div className={`${props.className} relative`}>
            <label
                htmlFor={props.id}
                className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all ${isSelected ? `left-2 top-0 -translate-y-[60%] px-1 text-sm ${props.backgroundColor}` : ""}`}
            >{props.placeholder}</label>
            <input
                type="text"
                onFocus={() => setSelected(true)}
                onBlur={handleOnBlur}
                name={props.name}
                id={props.id}
                className={`p-2 rounded-md w-full border-2 border-solid border-gray-800 ${props.backgroundColor}`}
                value={props.value}
                onChange={(e) => props.setValue(e.target.value)}
            />
        </div>
    )
}

export default TextField
