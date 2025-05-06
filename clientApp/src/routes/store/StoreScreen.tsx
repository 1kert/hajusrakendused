import {useEffect, useState} from "react"
import StoreRepository, {StoreItem} from "../../repositories/StoreRepository.ts"
import {useNavigate} from "react-router-dom"
import {Button} from "../../components/ui/button.tsx"
import ic_cart from "../../assets/ic_shopping_cart.svg"

export default function StoreScreen() {
    const navigate  = useNavigate();
    const [storeItems, setStoreItems] = useState<StoreItem[]>([])
    
    useEffect(() => {
        (async () => {
            const items = await StoreRepository.getStoreItems()
            setStoreItems(items)
        })()
    }, [])
    
    function onStoreItemClick(id: number) {
        navigate(`/store/${id}`)
    }
    
    return (
        <div className="flex flex-col w-[1300px] p-8 mx-auto">
            <Button onClick={() => navigate("/store/cart")} className="w-max ml-auto">
                <img src={ic_cart} alt="cart"/>
            </Button>
            <div className="flex flex-wrap gap-3 w-full mx-auto mt-4">
                {storeItems.map(item => (
                    <StoreItemCard 
                        name={item.name}
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
        </div>
    )
}