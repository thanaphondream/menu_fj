"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useOrderAll, MenuTop } from "../context/Address-Order-PeymentContext";
import '././css/home.css'
import { FiShoppingCart } from "react-icons/fi";
import { PiMapPin } from "react-icons/pi";
import { IoTimeSharp } from "react-icons/io5";
import { MdOutlinePhoneInTalk } from "react-icons/md";
import { SlArrowRight } from "react-icons/sl";


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
    images?: string[];
}

export default function HomePage() {
    const [menu, setMenu] = useState<menuAdncategory>()
    const {ordertop, setLimit} = useOrderAll()

    const [ordermenu, setOrderMenu] = useState<MenuTop[] | null>()

    const router = useRouter();

    useEffect(() => {
        setLimit(5)
    }, [])

    useEffect(() => {
        setOrderMenu(ordertop)
    }, [ordertop])

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
        {/* <div className="cart-menus">
            {menu?.menus.map((m) => (
                <div className="box-menus" key={m.id}>
                 <Link href={`/u/product/${m.id}`}>
                    <img src={m.image} alt="" />
                    <h1>{m.name}</h1>
                    <p>ราคา{m.price}฿</p>
                 </Link>
                </div>
            ))}
        </div> */}

        <div>
            <div className="box-hom-menu">
                <div className="box-text-menu">
                    <div className="box-menu-texttop">
                        <h1>อาหารมาใหม่</h1>
                        <p>เป็นที่ชื่นชอบที่สุดในชุมชนของเรา</p>
                    </div>
                    <div className="menu-textall" onClick={() => router.push("/u/menu")}>
                        <p>{">>"} เมนูทั้งหมด</p>
                      
                    </div>
                </div>
                <br />
           <div className="menu-box">
                {ordermenu?.map((m) => (
                    <div className="menus-top" key={m.id}>
                        <div className="img-menu">
                            <img src={m.image} alt="" />
                        </div>
                        <div>
                            <br />
                            <div className="box-menu-itme">
                                <p>{m.name}</p>
                                <p>ราคา {m.price} บาท</p>
                            </div>
                            <br />
                            <div className="text-des">
                                <p>{m.description}</p>
                            </div>
                        </div>
                        <br />
                        <div  className="box-menu-appcart" onClick={() => router.push(`/u/product/${m.id}`)}>
                              <FiShoppingCart size={21} />
                            <button>เพิ่มเมนูลงตะกร้า</button>
                        </div>
                    </div>
                ))}
                <div className="box-icons-Line">
                    <div className="icon-Linemenu" onClick={() => router.push("/u/menu")}>
                        <SlArrowRight />
                        <SlArrowRight />
                    </div>
                    <div>
                        ดูเมนูทั้งหมด
                    </div>
                </div>
            </div>
            </div>
            <br /><br />
            <div className="card-restaurant">
                <div className="box-time-onoff">
                   <div>
                        <h3>เวลา เปิด/ปิด</h3>
                        <p>8.30 AM - 17.00 AM</p>
                        <p>วันหยุดเฉพาะวันเสาร์</p>
                   </div>
                   <div>
                    <IoTimeSharp size={30} color="#e84e40"/>
                   </div>
                </div>
                <div className="box-restaurant">
                    <div className="box-text-address">
                         <PiMapPin size={22} color="#5f1f04"/>
                        <p>ตำแหน่งของร้านอาหาร</p>
                        <p>ร้านยายต้อย 56/3 บ้านขมิ้น ตำบลบ้านขมิ้น อำโพนสวรรค์ จังหวัดนครพนม</p>
                    </div>
                    <div className="box-text-phons">
                        <MdOutlinePhoneInTalk size={22}/>
                        <p>เบอร์โทร</p>
                        <h3>+664-78x-xxxx</h3>
                    </div>
                </div>
            </div>
            <br /><br />
        </div>
    </div>
  )
}