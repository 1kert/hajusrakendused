import { BrowserRouter, Route, Routes } from "react-router-dom"
import Map from "./routes/Map"
import Main from "./routes/Main"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" Component={}>
          <Route index Component={Main} />
          <Route path="/map" Component={Map} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
