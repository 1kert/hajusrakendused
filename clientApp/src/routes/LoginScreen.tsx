import { FormEvent, useContext, useState } from "react"
import AuthRepository, { user } from "../repositories/AuthRepository.ts"
import { AppContext } from "../App"
import { useNavigate } from "react-router-dom"

function LoginScreen() {
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

        AuthRepository.login(
            user,
            (str: string) => {appContext.token = str},
            setLoginStatus,
            () => navigate("/")
        )
    }

    return (
        <div className="w-full h-full flex justify-center items-center">
            <form action="" onSubmit={handleSubmit} className="p-10 rounded-2xl bg-slate-400 flex flex-col gap-5 min-w-[400px]">
                <h1 className="text-2xl mb-4 font-bold">Login</h1>
                {loginStatus != "" && <p className="text-red-800">* {loginStatus}</p>}
                
                <div className="flex flex-col gap-2">
                    <label htmlFor="username">username</label>
                    <input type="text" name="username" value={username} onChange={e => setUsername(e.target.value)}/>
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="password">password</label>
                    <input type="password" name="password" value={password} onChange={e => setPassword(e.target.value)} />
                </div>
                
                <input type="submit" className="bg-gray-800 text-white rounded-md p-2 cursor-pointer mt-4" value="Login"/>
            </form>
        </div>
    )
}

export default LoginScreen
