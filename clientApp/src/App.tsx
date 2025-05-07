import { BrowserRouter, Route, Routes } from "react-router-dom"
import MapScreen from "./routes/MapScreen.tsx"
import HomeScreen from "./routes/HomeScreen.tsx"
import MainLayout from "./routes/MainLayout"
import {createContext, useState} from "react"
import {ErrorBoundary} from "react-error-boundary";
import BlogScreen from "./routes/blog/BlogScreen.tsx"
import BlogCreateScreen from "./routes/blog/BlogCreateScreen.tsx";
import BlogDetailScreen from "./routes/blog/BlogDetailScreen.tsx";
import StoreScreen from "./routes/store/StoreScreen.tsx"
import StoreItemDetailScreen from "./routes/store/StoreItemDetailScreen.tsx";
import StoreCartScreen from "./routes/store/StoreCartScreen.tsx";
import StoreContinueForm from "./routes/store/StoreContinueForm.tsx";

export interface appContext {
  token: string,
  setToken: (token: string) => void,
}

const initialContext: appContext = {
  token: "",
  setToken: () => {},
}

export const AppContext = createContext<appContext>(initialContext)

function App() {
  const [token, setToken] = useState<string>(localStorage.getItem("token") ?? "")
  
  return ( // todo: when 401 unauthorized, re prompt login
    <AppContext.Provider value={{token, setToken}}>
      <ErrorBoundary fallback={<p>error</p>} onError={(e) => console.error(e)} >
        <BrowserRouter>
          <Routes>
            <Route path="/" Component={MainLayout}>
              <Route index Component={HomeScreen} />
              <Route path="/map" Component={MapScreen} />
              <Route path="/blogs" Component={BlogScreen} />
              <Route path="/blog/create" Component={BlogCreateScreen} />
              <Route path="/blog/:id" Component={BlogDetailScreen} />
              <Route path="/store" Component={StoreScreen} />
              <Route path="/store/:id" Component={StoreItemDetailScreen} />
              <Route path="/store/cart" Component={StoreCartScreen} />
              <Route path="/store/continue" Component={StoreContinueForm} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ErrorBoundary>
    </AppContext.Provider>
  )
}

export default App
