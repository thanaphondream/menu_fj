"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useAuth } from "./AuthContext"

export interface Cart {
    menuItemId: number
    quantity: number
}

export interface CartModel{
    count: number;
    total: number;
    cart: CartsItmeModel
}

interface CartsItmeModel {
    id: number;
    items: Items[]
}

interface Items{
    id: number;
    quantity: number;
    menuItem: menuItem
}

export interface menuItem{
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
}

type CartContextType = {
    count: number
    CartSave: (carts: Cart) => Promise<void>
    refreshCart: () => Promise<void>
    cart: CartModel | null
    loadings: boolean
    UpdateQuantity: (quantity: number, id: number) => Promise<void>
    CartsAPI: () => Promise<void>
}

const AuthContextCart = createContext<CartContextType | null>(null)

export const AuthPCart = ({ children }: { children: React.ReactNode }) => {
    const [count, setCount] = useState<number>(0)
    const [cart, setCart] = useState<CartModel | null>(null)
    const [loadings, setLoading] = useState(true)

    const {user} = useAuth()

    const getToken = () => {
        if (typeof window === "undefined") return null
        return localStorage.getItem("token")
    }

    useEffect(() => {
       if(user){
         refreshCart();
       }
    }, [user])

        const refreshCart = async () => {
            try {
                if (!user) {
                    setCount(0);
                    return;
                }

                const rs = await fetch(
                    "https://menu-back-hemk.onrender.com/cartitme/count",
                    {
                        credentials: "include",
                    }
                );

                if (rs.status === 401) {
                    setCount(0);
                    return;
                }

                if (!rs.ok) {
                    throw new Error("โหลดตะกร้าไม่สำเร็จ");
                }

                const data = await rs.json();

                if (!data) {
                    setCount(0);
                    return;
                }

                setCount(data);
            } catch (err) {
                console.error(err);
                setCount(0);
            }
        };

    useEffect(() => {
        if(user){
            CartsAPI();
        }
    }, [user]);

    const CartSave = async (carts: Cart) => {
        try {
            const token = getToken()
            if (!token) return
            //  if(!user){
            //     return
            // }
            const res = await fetch("https://menu-back-hemk.onrender.com/cartitme/carts", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(carts)
            })
             const data = await res.json()

            if (!res.ok) {
                alert(String(data.message))
                throw new Error(data.message || "เกิดข้อผิดพลาด")
            }

            alert("เพิ่มลงตะกร้าสำเร็จ")
            await refreshCart()

            await CartsAPI()

        } catch (err) {
            console.error(err)
        }
    }

    const CartsAPI = async () => {
        try{
            // const token = getToken()
            // if (!token) return
             if(!user){
                throw new Error("เกิดข้อผิดพลาด")
            }
            const rs = await fetch("https://menu-back-hemk.onrender.com/cartitme/cart", {
               credentials: "include"
            })
            const data = await rs.json()
            if (!rs.ok) {
                throw new Error(data.message || "เกิดข้อผิดพลาด")
            }

            setCart(data)
        }catch(err){
            console.error(err)
        }finally{
            setLoading(false)
        }
    }

    const UpdateQuantity = async (quantity: number, id: number) => {
        try{
            const res = await fetch ('https://menu-back-hemk.onrender.com/cartitme/count' + '/' + id, {
                method: "PUT",
                credentials: "include",
                  headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({quantity})
            })

            const rs_json = await res.json()
            if(!res.ok){
                throw Error("Error :", rs_json.message || "เกิดข้อผิดพลาด")
            }
            await CartsAPI()
        }
        catch(err){
            console.error(err)
        }
    }

    return (
        <AuthContextCart.Provider value={{ count, CartSave, refreshCart, cart, loadings, UpdateQuantity, CartsAPI }}>
            {children}
        </AuthContextCart.Provider>
    )
}

export const useCart = () => {
    const ctx = useContext(AuthContextCart)
    if (!ctx) throw new Error("useCart must be used inside AuthPCart")
    return ctx
}