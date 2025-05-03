import rat from "../assets/rat.gif"

export default function HomeScreen() {
    // todo: rat
    
    return (
        <div className="h-full w-full p-8 flex">
            <div className="flex flex-col gap-4">
                <div className="flex gap-2">
                    <h1 className="text-5xl font-bold tracking-wide">Distributed apps</h1>
                    <img src={rat} alt="" className="size-20 relative bottom-6"/>
                </div>
                <div className="flex gap-8">
                    <NavigationCard title="Map"
                                    description="Adding markers on a map n' such. For when you want to feel like you're doing something productive."
                                    onClick={() => {}}/>
                    <NavigationCard title="Blogs"
                                    description="Long-form opinions disguised as insight. Perfect for pretending you're learning something."
                                    onClick={() => {}}/>
                    <NavigationCard title="Store"
                                    description="Give us your money in exchange for things you probably don’t need. Minimal guilt, maximum cart size."
                                    onClick={() => {}}/>
                </div>
            </div>
            <div className="flex justify-end w-full">
                
            </div>
        </div>
    )
}

function NavigationCard(
    props: {
        title: string
        description: string
        onClick: () => void
    }
) {
    return (
        <div className="bg-gray-300 w-[300px] p-4 rounded-md shadow-md hover:cursor-pointer hover:bg-gray-400">
            <p className="text-3xl mb-2 font-medium">{props.title}</p>
            <p className="text-lg">{props.description}</p>
        </div>
    )
}
