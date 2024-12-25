import { FormEvent, useContext, useState } from "react"
import Authorization, { user } from "../Authorization"
import { AppContext } from "../App"
import { useNavigate } from "react-router-dom"
import TextField from "../components/TextField"

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

    return (
        <div className="w-full h-full flex justify-center items-center">
            <form action="" onSubmit={handleSubmit} className="p-10 rounded-2xl bg-slate-400 flex flex-col gap-5 min-w-[400px]">
                {loginStatus != "" && <p>{loginStatus}</p>}
                <h1 className="text-2xl mb-4 font-bold">Login</h1>
                
                <TextField name="username" id="username" className="" placeholder="username" backgroundColor="bg-slate-400" value={username} setValue={x => setUsername(x)}/>
                <TextField name="password" id="password" className="" placeholder="password" backgroundColor="bg-slate-400" value={password} setValue={x => setPassword(x)}/>

                <input type="submit" className="bg-gray-800 text-white rounded-md p-2 cursor-pointer" value="Login"/>
            </form>
        </div>
    )
}

export default Login
