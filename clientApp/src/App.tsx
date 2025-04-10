import { BrowserRouter, Route, Routes } from "react-router-dom"
import MapScreen from "./routes/MapScreen.tsx"
import Main from "./routes/Main"
import MainLayout from "./routes/MainLayout"
import { createContext } from "react"
import LoginScreen from "./routes/LoginScreen.tsx"

export interface appContext {
  token: string | null,
  username: string
}

const initialContext: appContext = {
  token: null,
  username: ""
}

export const AppContext = createContext<appContext>(initialContext)

function App() {
  return (
    <AppContext.Provider value={initialContext}>
      <BrowserRouter>
        <Routes>
          <Route path="/" Component={MainLayout}>
            <Route index Component={Main} />
            <Route path="/map" Component={MapScreen} />
            <Route path="/login" Component={LoginScreen} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppContext.Provider>
  )
}

export default App
