export interface user {
    username: string,
    password: string
}

export default class Authorization {
    static async sendCreds(
        user: user,
        endpoint: string
    ): Promise<Response> {
        return await fetch(endpoint, {
            method: "POST",
            body: JSON.stringify({
                username: user.username,
                password: user.password
            }),
            headers: new Headers({
                "Content-Type": "Application/json"
            })
        })
    }

    public static async login(
        user: user,
        setToken: (str: string) => void,
        setLoginStatus: (str: string) => void
    ) {
        const response = await this.sendCreds(user, "/user/login")
        if (response.status == 401) {
            setLoginStatus("credentials invalid")
            return
        } else if(response.status != 200) {
            setLoginStatus(":(")
            return
        }
        const json = await response.json()
        const token = json.token
        setToken(token)
        localStorage.setItem("token", token)
        setLoginStatus("logged in")
    }
    
    public static async register(
        user: user,
        redirectToLogin: () => void,
        setStatusText: (str: string) => void
    ) {
        const response = await this.sendCreds(user, "/user/register")
        if(response.status == 409) {
            // name taken
            setStatusText("username is already taken")
            return
        } else if (response.status != 200) {
            // unforseen
            return
        }
        redirectToLogin()
    }
}
