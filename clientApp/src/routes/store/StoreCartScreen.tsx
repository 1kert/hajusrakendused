import {useContext, useEffect, useRef, useState} from "react";
import StoreRepository, {CartItem} from "../../repositories/StoreRepository.ts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table.tsx";
import {AppContext} from "../../App.tsx";
import { Button } from "../../components/ui/button.tsx";
import { Input } from "../../components/ui/input.tsx";

export default function StoreCartScreen() {
    const context = useContext(AppContext)
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const quantityTimeouts = useRef<Record<number, NodeJS.Timeout>>({})
    
    useEffect(() => {
        (async () => {
            await refreshCart()
        })()
    }, [])
    
    useEffect(() => {
        console.log(cartItems)
    }, [cartItems])
    
    async function refreshCart() {
        const items = await StoreRepository.getCart(context.token)
        setCartItems(items)
    }
    
    async function onRemoveItem(id: number) {
        const result = await StoreRepository.removeFromCart(id, context.token)
        if (!result) return
        await refreshCart()
    }
    
    function onQuantityChange(
        item: CartItem,
        quantity: string
    ) {
        const num = Number(quantity)
        if(Number.isNaN(num)) return
        
        item.quantity = num
        setCartItems([...cartItems])
        
        if (quantityTimeouts.current[item.id]) {
            clearTimeout(quantityTimeouts.current[item.id])
        }
        
        quantityTimeouts.current[item.id] = setTimeout(async () => {
            await StoreRepository.updateCartItemQuantity(item.id, num, context.token)
        }, 500)
    }
    
    return (
        <div className="w-[1000px] flex flex-col mx-auto py-8">
            {cartItems.length == 0 && (
                <p className="text-4xl mx-auto text-gray-400">Cart is empty</p>
            )}
            
            {cartItems.length > 0 && (
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
                            {cartItems.map((item) => (
                                <TableRow>
                                    <TableCell className="font-medium"><img className="w-20 h-14" src={item.image} alt=""/></TableCell>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell className="flex flex-col">
                                        <p className="text-md font-bold">${item.price * item.quantity}</p>
                                        <p className="text-gray-600">${item.price} each</p>
                                    </TableCell>
                                    <TableCell>
                                        <Input className="w-16 text-center ml-auto" value={item.quantity} onChange={e => onQuantityChange(item, e.target.value)} />
                                    </TableCell>
                                    <TableCell className="text-right"><p onClick={() => onRemoveItem(item.id)} className="text-red-700 w-max ml-10 font-bold select-none mb-1 text-2xl hover:cursor-pointer">x</p></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <Button className="w-52 ml-auto mt-8">Continue</Button>
                </>
            )}
        </div>
    )
}