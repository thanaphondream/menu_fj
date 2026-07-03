'use client'

import { createContext, useContext, useEffect, useState } from "react"
import { useAuth, User } from "./AuthContext"
import { useCart, menuItem } from "./CartContext";
import { useRouter } from "next/navigation";

type StatusOrder = "รอดำเนินการ" | "ตอบรับแล้ว" | "กำลังปรุงอาหาร" | "กำลังจัดส่ง" | "เสร็จสิ้น"

export interface Address {
    id?: number;
    address: string;
    username: string;
    phone: string;
    lat: string;
    lng: string;
    description: string,
    home: string,
    distance: string
}

export interface OrderAll{
    id?: number;
    total_price: number;
    delivery_fee: number;
    status: StatusOrder;
    reference: string;
    items: OrderItems[];
}

export interface Order{
    id?: number;
    total_price: number;
    delivery_fee: number;
    status: StatusOrder;
    items: OrderItems[];
    payment: Payments;
    address: Address;
    reference: string;
    user: User;
    driver: Drivers;
}

interface OrderItems{
    id?:number;
    quantity: number;
    price: number;
    menuItem: menuItem
}

interface Payments{
    id?: number;
    method: string;
    amount: number;
    status: string;
}

interface Drivers{
    id?: number;
    name: string;
    phone: string;
    vehicle: string;
}

type AuthAddRess = {
    AddressPosts: ((address: Address) => Promise<void>)
    OrderPost: ((addressId: number) => Promise<void>)
    addresss: Address | null
    setOrderId: ((orderId: number) => void)
    order: Order | null
    orderFin: OrderAll[] | null
}


const  AuthOderAll = createContext<AuthAddRess | null>(null)

export const AuthOrderAll = ({ children }: { children: React.ReactNode }) => {
    const [addresss, setAddresss] = useState<Address | null>(null)
    const [order, setOrder] = useState<Order | null>(null)
    const [orderId, setOrderId] = useState<number | null>(null)
    const [orderFin , setOrderFin] = useState<OrderAll[] | null>(null)
    const [loadings, setLoadings] = useState(false);
    
    const {user, loading} = useAuth()
    const {CartsAPI} = useCart()
    
    const router = useRouter();

    const AddressPosts = async(address: Address) => {
        try{
            const re = await fetch("https://menu-back-hemk.onrender.com/address/address",
                {
                    method: "POST",
                    credentials: "include",
                     headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(address),
                }
            )
            const re_json = await re.json()
            if(!re.ok){
                return;
            }
            await AddressGet()
            alert("Save All This OK")
        }catch(err){
            console.error(err)
        }
    }
    useEffect(() => {
        AddressGet()
        orderGetAll();
    }, [user])

    const AddressGet = async () =>{
        try{
            if (!user) return
            const rs = await fetch("https://menu-back-hemk.onrender.com/address/address", {
                credentials: "include"
            })

            const data = await rs.json()
            if(!rs.ok) return;

            setAddresss(data.message)

        }catch(err){
            console.error(err)
        }
    }

    const OrderPost = async (addressId: number) => {
        try{
            const rs = await fetch("https://menu-back-hemk.onrender.com/order/orders", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({addressId})
            })

            const data = await rs.json()

            if(!rs.ok){
               return;
            }

            router.replace(`/order/tracking/${data.orderId}`);
            // await CartsAPI()
            // router.replace('/u/cart')

        }catch(err){
            console.error(err)
        }
    }

    useEffect(() => {
        if (!orderId) return;

        OrderGet();
    }, [orderId]);

    const OrderGet = async () => {
        try{
            const rs = await fetch("https://menu-back-hemk.onrender.com/order/tracking/"+ orderId, {
                credentials: "include",
            })

            const data = await rs.json()

            if(!rs.ok){
                router.push('/login')
               return
            }

            setOrder(data)

        }catch(err){
            console.error(err)
        }finally {
            setLoadings(false);
        }
    }

    const orderGetAll = async () => {
        try{
            const rs = await fetch("https://menu-back-hemk.onrender.com/order/tracking", {
                credentials: "include",
            })
            const data = await rs.json()

            if(!rs.ok){
                router.push('/login')
                return;
            }
            console.log("ddfffs", data)
            setOrderFin(data)
        }catch(err){
            console.error(err)
        }
    }

    return (
        <AuthOderAll.Provider value={{AddressPosts, OrderPost, addresss, setOrderId, order, orderFin}}>
            {children}
        </AuthOderAll.Provider>
    )
}
export const useOrderAll = () => {
    const ctx = useContext(AuthOderAll)
    if (!ctx) throw new Error("useCart must be used inside AuthPCart")
    return ctx
}