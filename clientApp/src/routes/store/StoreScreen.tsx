import {useNavigate, useSearchParams} from "react-router-dom"
import {Button} from "../../components/ui/button.tsx"
import ic_cart from "../../assets/ic_shopping_cart.svg"
import {useMutation, useQuery} from "@tanstack/react-query";
import axios from "axios";
import Loading from "../../components/Loading.tsx";
import {useContext, useEffect} from "react";
import getAuthHeader from "../../repositories/AxiosHeader.ts";
import {AppContext} from "../../App.tsx";

export interface StoreItem {
    id: number
    image: string
    name: string
    description: string
    price: number
}

export default function StoreScreen() {
    const navigate  = useNavigate();
    const [searchParams] = useSearchParams();
    const context = useContext(AppContext)
    const { storeItemsQuery } = useStoreItemsQueries()
    
    const clearCartMutation = useMutation({
        mutationFn: async () => {
            return (await axios.delete("/api/store/clear-cart", getAuthHeader(context.token))).data
        }
    })

    useEffect(() => {
        const success = searchParams.get("success")
        if (!success) return
        if (success !== "true") return
        
        clearCartMutation.mutate(undefined, {
            onSuccess: () => {
                location.href = "/store";
            }
        })
        
    }, []);
    
    function onStoreItemClick(id: number) {
        navigate(`/store/${id}`)
    }
    
    return (
        <div className="flex flex-col w-[1300px] p-8 mx-auto">
            <Button onClick={() => navigate("/store/cart")} className="w-max ml-auto">
                <img src={ic_cart} alt="cart"/>
            </Button>
            <div className="flex flex-wrap gap-3 w-full mx-auto mt-4">
                {storeItemsQuery.isLoading && <Loading className="mx-auto"/>}
                {storeItemsQuery.isSuccess && storeItemsQuery.data.map(item => (
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

function useStoreItemsQueries() {
    const storeItemsQuery = useQuery<StoreItem[]>({
        queryKey: ["store-items"],
        queryFn: async () => {
            return (await axios.get("/api/store")).data
        }
    })
    
    return { storeItemsQuery }
}
