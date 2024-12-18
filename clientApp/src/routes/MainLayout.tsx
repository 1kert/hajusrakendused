import { Link, Outlet } from "react-router-dom"

function MainLayout() {
    return (
        <div className="bg-gray-200 w-full h-screen">
            <nav className="flex w-full justify-end bg-gray-400 text-white text-xl py-4 px-8">
                <Link className="mr-4" to="/login">Login</Link>
                <Link to="/register">Register</Link>
            </nav>
            <Outlet/>
        </div>
    )
}

export default MainLayout
