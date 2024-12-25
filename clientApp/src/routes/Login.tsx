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
            <form action="" onSubmit={handleSubmit} className="p-10 rounded-2xl bg-slate-400 flex flex-col gap-4 min-w-[400px]">
                {/* {loginStatus != "" && <p>{loginStatus}</p>} */}
                <h1 className="text-2xl mb-4 font-bold">Login</h1>
                <input type="text" name="username" value={username} placeholder="username" className="p-2 rounded-md" onChange={handleUsernameChange} />
                <input type="password" name="password" value={password} placeholder="password" className="p-2 rounded-md" onChange={handlePasswordChange} />
                <input type="submit" className="bg-gray-800 text-white rounded-md p-2 cursor-pointer" value="Login"/>
            </form>
        </div>
    )
}

export default Login
