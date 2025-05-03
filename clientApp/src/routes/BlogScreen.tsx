import {Button} from "../components/ui/button.tsx";
import {Link} from "react-router-dom";

export default function BlogScreen() {
    return (
        <div className="w-full h-full p-8">
            <div className="flex items-center gap-4">
                <h1 className="text-5xl">Blogs</h1>
                <Link to="/blogs/create">
                    <Button>Create Blog</Button>
                </Link>
            </div>
        </div>
    )
}