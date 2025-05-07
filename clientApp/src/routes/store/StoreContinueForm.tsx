import {Input} from "../../components/ui/input";
import {ChangeEvent, FormEvent, useState} from "react";
import {Button} from "../../components/ui/button.tsx";

export default function StoreContinueForm() {
    const [inputs, setInputs] = useState<Record<string, string>>({})
    
    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
    }
    
    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        const {name, value} = e.target
        setInputs({...inputs, [name]: value})
    }
    
    return (
        <div className="w-[500px] flex flex-col mx-auto py-8">
            <form className="flex flex-col" onSubmit={handleSubmit}>
                <label htmlFor="firstname">First name</label>
                <Input name="firstname" onChange={handleChange} value={inputs.firstname}/>
                
                <label className="mt-4" htmlFor="lastname">Last name</label>
                <Input name="lastname" onChange={handleChange} value={inputs.lastname}/>
                
                <label className="mt-4" htmlFor="email">Email address</label>
                <Input name="email" type="email" onChange={handleChange} value={inputs.email}/>
                
                <label className="mt-4" htmlFor="phone">Phone number</label>
                <Input name="phone" type="tel" onChange={handleChange} value={inputs.phone} pattern="\d{3}-\d{2}-\d{3}"/>
                
                <Button className="mt-4 ml-auto">Continue</Button>
            </form>
        </div>
    )
}