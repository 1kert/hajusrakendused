import { BrowserRouter, Route, Routes } from "react-router-dom"
import Map from "./routes/Map"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/map" Component={Map}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
