import { FormEvent, useContext, useState } from "react"
import Authorization, { user } from "../Authorization"
import { AppContext } from "../App"
import { useNavigate } from "react-router-dom"

function Login() {
    const appContext = useContext(AppContext)
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [loginStatus, setLoginStatus] = useState("")
    const navigate = useNavigate()

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()

        const user: user = {
            username,
            password
        }

        Authorization.login(
            user,
            (str: string) => {appContext.token = str},
            setLoginStatus,
            () => navigate("/")
        )
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
