import {useEffect, useState} from "react";
import StoreRepository, {StoreItem} from "../../repositories/StoreRepository.ts";

export default function StoreScreen() {
    const [storeItems, setStoreItems] = useState<StoreItem[]>([])
    
    useEffect(() => {
        (async () => {
            const items = await StoreRepository.getStoreItems()
            setStoreItems(items)
        })()
    }, [])
    
    function onStoreItemClick(id: number) {
        
    }
    
    return (
        <div className="flex flex-col w-full p-8">
            <div className="grid grid-cols-4 gap-3 w-max mx-auto">
                {storeItems.map(item => (
                    <StoreItemCard 
                        name={item.name}
                        description={item.description}
                        image={item.image}
                        price={item.price}
                        onClick={() => onStoreItemClick(item.id)}
                    />
                ))}
            </div>
        </div>
    )
}

function StoreItemCard(
    props: {
        name: string
        description: string
        price: number
        image: string,
        onClick: () => void
    }
) {
    return (
        <div onClick={props.onClick} className="flex flex-col gap-2 p-3 bg-gray-300 w-[300px] rounded-md shadow-md hover:cursor-pointer hover:bg-gray-400">
            <img src={props.image} alt="" className="size-52 w-full rounded-md" />
            <p className="text-md">{props.name}</p>
            <p className="text-lg font-bold">${props.price}</p>
            {/*<p className="line-clamp-0">{props.description}</p>*/}
        </div>
    )
}