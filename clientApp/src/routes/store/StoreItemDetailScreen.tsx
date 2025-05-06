import {useNavigate, useParams} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import StoreRepository, {StoreItem} from "../../repositories/StoreRepository.ts";
import {Button} from "../../components/ui/button.tsx";
import {Input} from "../../components/ui/input.tsx";
import ic_cart from "../../assets/ic_shopping_cart.svg"
import {AppContext} from "../../App.tsx";

export default function StoreItemDetailScreen() {
    const params = useParams()
    const context = useContext(AppContext)
    const navigate = useNavigate()
    const [storeItem, setStoreItem] = useState<StoreItem>();
    const [quantity, setQuantity] = useState("1");
    
    useEffect(() => {
        (async () => {
            const id = Number(params.id)
            if(Number.isNaN(id)) navigate("/store")

            const storeItem = await StoreRepository.getStoreItemById(id)
            if (!storeItem) navigate("/store")
            setStoreItem(storeItem)
        })()
    })
    
    async function onAddToCartClick() {
        if (!storeItem) throw Error("store item not found")
        const quantityNumber = Number(quantity)
        if (Number.isNaN(quantityNumber)) return // todo: error
        
        const result = await StoreRepository.addToCart(
            storeItem,
            quantityNumber,
            context.token
        )

        console.log(result)
        if (result) navigate("/store")
    }
    
    return (
        <div className="flex flex-col w-full p-8">
            {storeItem && (
                <div className="mx-auto flex gap-10">
                    <div className="w-[500px] h-[400px] shadow-md rounded-lg overflow-hidden">
                        <img src={storeItem.image} alt="" className="size-full"/>
                    </div>
                    <div className="flex flex-col w-[700px] mt-4">
                        <p className="text-xl">{storeItem.name}</p>
                        <p className="text-2xl font-bold mt-2">${storeItem.price}</p>
                        <p className="text-lg mt-5">{storeItem.description}</p>
                        <div className="flex gap-2 mt-4">
                            <Input className="w-16 text-center" value={quantity} onChange={e => setQuantity(e.target.value)}/>
                            <Button onClick={onAddToCartClick}>
                                <img className="size-full" src={ic_cart} alt="cart"/>
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}