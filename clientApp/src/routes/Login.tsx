import { FormEvent, useState } from "react"

interface user {
    username: string,
    password: string
}

async function login(
    user: user,
    setToken: (str: string) => void,
    setLoginStatus: (str: string) => void
) {
    console.log('run login');
    const response = await fetch("/user/login", {
        method: "POST",
        body: JSON.stringify({
            username: user.username,
            password: user.password
        }),
        headers: new Headers({
            "Content-Type": "Application/json"
        })
    })
    if (response.status == 401) {
        setLoginStatus("credentials invalid")
    } else {
        console.log(response);
    }
    const json = await response.json()
    setToken(json.token)
    setLoginStatus("logged in")
}

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
        login(user, setToken, setLoginStatus)
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
