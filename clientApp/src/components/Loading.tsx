import { LoaderCircle } from "lucide-react";
import {twMerge} from "tailwind-merge";

export default function Loading({className}: {className?: string}) {
    return <LoaderCircle className={twMerge("animate-spin size-10", className)}/>

}