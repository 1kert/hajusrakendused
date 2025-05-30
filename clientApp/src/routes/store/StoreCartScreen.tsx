import {useContext, useEffect, useState} from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table.tsx";
import {AppContext} from "../../App.tsx";
import { Button } from "../../components/ui/button.tsx";
import { Input } from "../../components/ui/input.tsx";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import axios from "axios";
import getAuthHeader from "../../repositories/AxiosHeader.ts";
import Loading from "../../components/Loading.tsx";
import { useNavigate } from "react-router-dom";

export const cartItemsKey = ["cartItems"]

interface CartItem {
    id: number
    image: string
    name: string
    price: number
    quantity: number
}

export interface CartItemUpdate {
    id: number
    quantity: number
}

export default function StoreCartScreen() {
    const { cartItemUpdateMutation, cartItemRemoveMutation, cartItemsQuery } = useCartQueries()
    const navigate = useNavigate()
    const [totalPrice, setTotalPrice] = useState(0)
    
    async function onRemoveItem(id: number) {
        cartItemRemoveMutation.mutate(id)
    }
    
    function onQuantityChange(
        item: CartItem,
        quantity: string
    ) {
        const num = Number(quantity)
        if(Number.isNaN(num)) return

        cartItemUpdateMutation.mutate({
            id: item.id,
            quantity: num
        })
    }
    
    function onContinueClick() {
        navigate("/store/continue")
    }
    
    function round(num: number) {
        return Math.round(num * 100) / 100
    }

    useEffect(() => {
        const items = cartItemsQuery.data
        if (!items) return

        setTotalPrice(round(items.reduce((acc, item) => acc + item.quantity * item.price, 0)))
    }, [cartItemsQuery.data]);
    
    return (
        <div className="w-[1000px] flex flex-col mx-auto py-8">
            {cartItemsQuery.isLoading && <Loading className="mx-auto"/>}
            
            {cartItemsQuery.isSuccess && cartItemsQuery.data.length == 0 && (
                <p className="text-4xl mx-auto text-gray-400">Cart is empty</p>
            )}
            
            {cartItemsQuery.isSuccess && cartItemsQuery.data.length > 0 && (
                <>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]"></TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead className="w-[50px]">Quantity</TableHead>
                                <TableHead className="w-[100px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {cartItemsQuery.data.map(item => (
                                <TableRow>
                                    <TableCell className="font-medium"><img className="w-20 h-14" src={item.image} alt=""/></TableCell>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell className="flex flex-col">
                                        <p className="text-md font-bold">${round(item.price * item.quantity)}</p>
                                        <p className="text-gray-600">${round(item.price)} each</p>
                                    </TableCell>
                                    <TableCell>
                                        <Input className="w-16 text-center ml-auto" value={item.quantity} onChange={e => onQuantityChange(item, e.target.value)} />
                                    </TableCell>
                                    <TableCell className="text-right"><p onClick={() => onRemoveItem(item.id)} className="text-red-700 w-max ml-10 font-bold select-none mb-1 text-2xl hover:cursor-pointer">x</p></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <p className="text-2xl mt-2">Total: <span className="font-bold">${totalPrice}</span></p>
                    <Button className="w-52 ml-auto mt-8" onClick={onContinueClick}>Continue</Button>
                </>
            )}
        </div>
    )
}

export function useCartQueries() {
    const context = useContext(AppContext)
    const client = useQueryClient()
    
    const cartItemsQuery = useQuery<CartItem[]>({
        queryKey: cartItemsKey,
        queryFn: async () => {
            return (await axios.get("/api/store/cart", getAuthHeader(context.token))).data
        }
    })
    
    const cartItemUpdateMutation = useMutation({
        mutationFn: async (update: CartItemUpdate) => {
            return (await axios.put("/api/store", update, getAuthHeader(context.token))).data
        },
        onMutate: async (update: CartItemUpdate) => {
            await client.cancelQueries({ queryKey: cartItemsKey })
            const currentItems: CartItem[] | undefined = client.getQueryData(cartItemsKey)
            client.setQueryData(cartItemsKey, currentItems?.map(item => {
                if (item.id !== update.id) return item
                return { ...item, ...update }
            }))

            return currentItems
        },
        onError: async (_, __, context) => {
            client.setQueryData(cartItemsKey, context)
        },
        onSettled: () => client.invalidateQueries({ queryKey: cartItemsKey }),
    })

    const cartItemRemoveMutation = useMutation({
        mutationFn: async (id: number) => {
            return (await axios.delete(`/api/store/${id}`, getAuthHeader(context.token))).data
        },
        onMutate: async (id: number) => {
            await client.cancelQueries({ queryKey: cartItemsKey })
            const currentItems: CartItem[] | undefined = client.getQueryData(cartItemsKey)
            client.setQueryData(cartItemsKey, currentItems?.filter(item => item.id !== id))
            return currentItems
        },
        onError: async (_, __, context) => {
            client.setQueryData(cartItemsKey, context)
        },
        onSettled: async () => {
            await client.cancelQueries({queryKey: cartItemsKey})
        }
    })

    const cartItemCreateMutation = useMutation({
        mutationFn: async (item: CartItemUpdate) => {
            return (await axios.post("/api/store", item, getAuthHeader(context.token))).data
        },
        onMutate: async () => await client.cancelQueries({ queryKey: cartItemsKey }),
        onSuccess: async () => client.invalidateQueries({ queryKey: cartItemsKey })
    })

    return { cartItemsQuery, cartItemUpdateMutation, cartItemRemoveMutation, cartItemCreateMutation }
}