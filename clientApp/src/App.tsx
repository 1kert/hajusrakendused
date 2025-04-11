import { BrowserRouter, Route, Routes } from "react-router-dom"
import MapScreen from "./routes/MapScreen.tsx"
import Main from "./routes/Main"
import MainLayout from "./routes/MainLayout"
import { createContext } from "react"
import LoginScreen from "./routes/LoginScreen.tsx"
import {ErrorBoundary} from "react-error-boundary";

export interface appContext {
  token: string | null,
  username: string
}

const initialContext: appContext = {
  token: null,
  username: ""
}

export const AppContext = createContext<appContext>(initialContext)

function handleError(err: Error) {
  console.log(`error: ${err}`)
}

function App() {
  return (
    <AppContext.Provider value={initialContext}>
      <ErrorBoundary fallback={<p>error</p>} onError={handleError} >
        <BrowserRouter>
          <Routes>
            <Route path="/" Component={MainLayout}>
              <Route index Component={Main} />
              <Route path="/map" Component={MapScreen} />
              <Route path="/login" Component={LoginScreen} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ErrorBoundary>
    </AppContext.Provider>
  )
}

export default App
