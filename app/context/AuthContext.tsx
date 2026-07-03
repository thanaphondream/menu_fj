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

export const AuthProvider = ({ children }: any) => {
    const [user, setUser] = useState<User| null>(null)
    const [loading, setLoading] = useState(true)


    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token")

        const fetchUser = async () => {
            if (!token) {
                setLoading(false)
                return
            }

            try {
                const res = await fetch("https://menu-back-hemk.onrender.com/api/me", {
                    credentials: "include"
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
    }

    const logout = async() => {
        try {
            const rs = await fetch("https://menu-back-hemk.onrender.com/api/logout", {
                method: "POST",
                credentials: "include",
            });
            if (rs.ok){
                const data = await rs.json()
                console.log("rs", data.message)
            }
            localStorage.removeItem("token"); 
            setUser(null);
            //  router.refresh(); 
            window.location.reload();
        // router.push("/login");
    } catch (err) {
        console.error(err);
    }
    }

    return (
        <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)