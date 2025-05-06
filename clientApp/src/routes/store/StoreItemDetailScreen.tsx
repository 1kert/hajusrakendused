import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import StoreRepository, {StoreItem} from "../../repositories/StoreRepository.ts";
import {Button} from "../../components/ui/button.tsx";

export default function StoreItemDetailScreen() {
    const params = useParams()
    const navigate = useNavigate()
    const [storeItem, setStoreItem] = useState<StoreItem>();
    
    useEffect(() => {
        (async () => {
            const id = Number(params.id)
            if(Number.isNaN(id)) navigate("/store")

            const storeItem = await StoreRepository.getStoreItemById(id)
            if (!storeItem) navigate("/store")
            setStoreItem(storeItem)
        })()
    })
    
    return (
        <div className="flex flex-col w-full p-8">
            {storeItem && (
                <div className="mx-auto flex gap-10">
                    <div className="w-[500px] h-[450px] shadow-md rounded-lg overflow-hidden">
                        <img src={storeItem.image} alt="" className="w-full"/>
                    </div>
                    <div className="flex flex-col w-[700px] mt-4">
                        <p className="text-xl">{storeItem.name}</p>
                        <p className="text-2xl font-bold mt-2">${storeItem.price}</p>
                        <p className="text-lg mt-5">{storeItem.description}</p>
                        <Button className="w-max mt-4">Add to cart</Button>
                    </div>
                </div>
            )}
        </div>
    )
}