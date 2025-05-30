import {useNavigate, useParams} from "react-router-dom";
import {useState} from "react";
import {Button} from "../../components/ui/button.tsx";
import {Input} from "../../components/ui/input.tsx";
import ic_cart from "../../assets/ic_shopping_cart.svg"
import {useQuery} from "@tanstack/react-query";
import axios from "axios";
import Loading from "../../components/Loading.tsx";
import {StoreItem} from "./StoreScreen.tsx";
import {useCartQueries} from "./StoreCartScreen.tsx";

export default function StoreItemDetailScreen() {
    const params = useParams()
    const navigate = useNavigate()
    const [quantity, setQuantity] = useState("1");
    const storeItemQuery = useQuery<StoreItem>({
        queryKey: ["store-item", params.id],
        queryFn: async () => {
            return (await axios.get(`/api/store/${params.id}`)).data
        }
    })
    const { cartItemCreateMutation } = useCartQueries()
    
    async function onAddToCartClick() {
        const storeItem = storeItemQuery.data
        if (!storeItem) throw Error("store item not found")
        const quantityNumber = Number(quantity)
        if (Number.isNaN(quantityNumber)) return // todo: error

        cartItemCreateMutation.mutate({
                id: storeItem.id,
                quantity: quantityNumber,
            }, {
                onSuccess: () =>  navigate("/store")
            }
        )
    }
    
    return (
        <div className="flex flex-col w-full p-8">
            {storeItemQuery.isLoading && <Loading className="mx-auto" />}
            {storeItemQuery.isSuccess && (
                <div className="mx-auto flex gap-10">
                    <div className="w-[500px] h-[400px] shadow-md rounded-lg overflow-hidden">
                        <img src={storeItemQuery.data.image} alt="" className="size-full"/>
                    </div>
                    <div className="flex flex-col w-[700px] mt-4">
                        <p className="text-xl">{storeItemQuery.data.name}</p>
                        <p className="text-2xl font-bold mt-2">${storeItemQuery.data.price}</p>
                        <p className="text-lg mt-5">{storeItemQuery.data.description}</p>
                        <div className="flex gap-2 mt-4">
                            <Input type="number" className="w-16 text-center" value={quantity} onChange={e => setQuantity(e.target.value)}/>
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