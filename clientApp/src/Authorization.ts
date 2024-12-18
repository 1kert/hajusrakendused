export interface user {
    username: string,
    password: string
}

export default class Authorization {
    public static async login(
        user: user,
        setToken: (str: string) => void,
        setLoginStatus: (str: string) => void
    ) {
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
            setLoginStatus(":(")
        }
        const json = await response.json()
        const token = json.token
        setToken(token)
        localStorage.setItem("token", token)
        setLoginStatus("logged in")
    }
    
    public static async register(
        user: user,

    ) {
        const response = await fetch("/user/register", {
            method: "POST",
            headers: new Headers({
                "Content-Type": "Application/json"
            }),
            body: JSON.stringify({
                username: user.username,
                password: user.password
            })
        })
    }
}
