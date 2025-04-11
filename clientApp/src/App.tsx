import { BrowserRouter, Route, Routes } from "react-router-dom"
import MapScreen from "./routes/MapScreen.tsx"
import Main from "./routes/Main"
import MainLayout from "./routes/MainLayout"
import {createContext, useState} from "react"
import {ErrorBoundary} from "react-error-boundary";

export interface appContext {
  token: string | null,
  setToken: (token: string) => void,
}

const initialContext: appContext = {
  token: null,
  setToken: () => {},
}

export const AppContext = createContext<appContext>(initialContext)

function handleError(err: Error) {
  console.log(`error: ${err}`)
}

function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"))
  
  return (
    <AppContext.Provider value={{token, setToken}}>
      <ErrorBoundary fallback={<p>error</p>} onError={handleError} >
        <BrowserRouter>
          <Routes>
            <Route path="/" Component={MainLayout}>
              <Route index Component={Main} />
              <Route path="/map" Component={MapScreen} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ErrorBoundary>
    </AppContext.Provider>
  )
}

export default App
