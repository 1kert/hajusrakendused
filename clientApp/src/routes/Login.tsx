import { FormEvent, useState } from "react"
import Authorization, { user } from "../Authorization"

function Login() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [token, setToken] = useState<string | null>(null)
    const [loginStatus, setLoginStatus] = useState("")

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const user: user = {
            username,
            password
        }
        Authorization.login(user, setToken, setLoginStatus)
    }
    
    function handleUsernameChange(e: React.ChangeEvent<HTMLInputElement>) {
        setUsername(e.target.value)
    }

    function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
        setPassword(e.target.value)
    }

    return (
        <div className="w-full h-full flex justify-center items-center">
            {loginStatus != "" && <p>{loginStatus}</p>}
            <form action="" onSubmit={handleSubmit} className="p-16 rounded-2xl bg-slate-400 flex flex-col gap-2">
                <input type="text" name="username" value={username} onChange={handleUsernameChange} />
                <input type="password" name="password" value={password} onChange={handlePasswordChange} />
                <input type="submit" value="askdjsa"/>
            </form>
        </div>
    )
}

export default Login
