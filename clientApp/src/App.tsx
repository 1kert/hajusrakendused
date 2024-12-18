import { BrowserRouter, Route, Routes } from "react-router-dom"
import Map from "./routes/Map"
import Main from "./routes/Main"
import MainLayout from "./routes/MainLayout"
import { useEffect, useState } from "react"
import Login from "./routes/Login"

function App() {
  const [token, setToken] = useState<string | null>(null)

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" Component={MainLayout}>
          <Route index Component={Main} />
          <Route path="/map" Component={Map} />
          <Route path="/login" Component={Login} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
