import { BrowserRouter, Route, Routes } from "react-router-dom"
import Map from "./routes/Map"
import Main from "./routes/Main"
import MainLayout from "./routes/MainLayout"
import { createContext, useContext, useEffect, useState } from "react"
import Login from "./routes/Login"

export interface appContext {
  token: string | null
}

export const AppContext = createContext<appContext>({
  token: null
})

function App() {
  return (
    <AppContext.Provider value={{token: null}}>
      <BrowserRouter>
        <Routes>
          <Route path="/" Component={MainLayout}>
            <Route index Component={Main} />
            <Route path="/map" Component={Map} />
            <Route path="/login" Component={Login} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppContext.Provider>
  )
}

export default App
