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
    
    return (
        <div className="flex flex-col w-full">
            <div className="flex flex-col gap-2">
                {storeItems.map(item => (
                    <StoreItemCard name={item.name} description={item.description} image={item.image} />
                ))}
            </div>
        </div>
    )
}

function StoreItemCard(
    props: {
        name: string
        description: string
        image: string
    }
) {
    return (
        <img src={props.image} alt="" className="size-52"/>
    )
}