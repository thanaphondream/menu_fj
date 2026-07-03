"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import '././css/home.css'

interface menuAdncategory{
    category: category[]
    menus: menuItem[]
}

interface category{
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

export default function HomePage() {
    const [menu, setMenu] = useState<menuAdncategory>()

    useEffect(() => {
        const MenuRestapi = async () => {
            try{
                const re = await fetch ("https://menu-back-hemk.onrender.com/category/category")
                const r_json: menuAdncategory = await re.json()
                console.log(r_json)
                setMenu(r_json)
            }catch(err){
                console.error("Erorr :", err)
            }
        }

        MenuRestapi()
    }, [])
  return (
    <div>
        <div className="cart-ti">
            <div className="cart-text">
                <h1>ยินดีต้อนรับสู้ร้านก๋วยเตี๋ยวยายต๋อย</h1>
                <h1>🍜</h1>
                <div>
                    <button className="bt1">ดูรายการอาาหาร</button>
                </div>
            </div>
            <br />
            <div className="cart-img">
                <div>
                    <img src="https://res.cloudinary.com/daw1e3jbg/image/upload/v1726439701/zahx5hn8l9yudcfgofzx.jpg" alt="" />
                </div>
            </div>
        </div>
            <br /><br /><br /><br /><hr className="bg-black" /><br />
        <div>{menu?.category.map((c) => (
            <div key={c.id} className="cart-category">
                <button>{c.name}</button>
            </div>
        ))}</div>
        <br />
        <div className="cart-menus">
            {menu?.menus.map((m) => (
                <div className="box-menus" key={m.id}>
                 <Link href={`/u/product/${m.id}`}>
                    <img src={m.image} alt="" />
                    <h1>{m.name}</h1>
                    <p>ราคา{m.price}฿</p>
                 </Link>
                </div>
            ))}
        </div>
    </div>
  )
}