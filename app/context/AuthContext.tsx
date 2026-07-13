"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation";

const AuthContext = createContext<any>(null)

export interface User {
  id: number;
  username: string;
  password: string;
  email: string;
  status: string;
}

interface menuAdncategory{
    category: category[]
    menus: menuItem[]
}

export interface category{
    id: number;
    name: number;
}

export interface menuItem{
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
}

export const AuthProvider = ({ children }: any) => {
    const [user, setUser] = useState<User| null>(null)
    const [loading, setLoading] = useState(true)
    const [menu, setMenu] = useState<menuAdncategory>()

    const token = localStorage.getItem("token") 

    const router = useRouter();

    // useEffect(() => {
    //     if(!token) {
    //         return router.prefetch("/login")
    //     }
    // }, [!token])

    // useEffect(() => {
    //     if(!token) {
    //         return router.prefetch("/login")
    //     }
    // }, [!token])

    useEffect(() => {

        const fetchUser = async () => {
            if (!token) {
                setLoading(false)
                return
            }

            try {
                const res = await fetch("http://localhost:8001/api/me", {
                     headers: {
                        "Authorization": `Bearer ${token}`
                    },
                })

                const data = await res.json()

                if (data.user) {
                    setUser(data.user)
                } else {
                    setUser(null)
                }

            } catch (err) {
                setUser(null)
            } finally {
                setLoading(false)
            }
        }

        fetchUser()
    }, [])

    const login = (userData: User, token: string) => {
        setUser(userData)
        localStorage.setItem('token', token)
    }

    const logout = async() => {
        try {
            // const rs = await fetch("http://localhost:8001/api/logout", {
            //     method: "POST",
            //     headers: {
            //         "Authorization": `Bearer ${token}`
            //     }
            // });
            // if (rs.ok){
            //     const data = await rs.json()
            //     console.log("rs", data.message)
            // }
            localStorage.removeItem("token"); 
            setUser(null);
            window.location.reload();
    } catch (err) {
        console.error(err);
    }
    }


     useEffect(() => {
        const MenuRestapi = async () => {
            try{
                const re = await fetch ("http://localhost:8001/category/category")
                const r_json: menuAdncategory = await re.json()
                setMenu(r_json)
            }catch(err){
                console.error("Erorr :", err)
            }
        }

        MenuRestapi()
    }, [])

    return (
        <AuthContext.Provider value={{ user, setUser, login, logout, loading, menu }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)