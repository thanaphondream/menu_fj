"use client";


import { useEffect, useState } from "react";
import { menuItem } from "../../page";
import '../../css/product.css'
import { useRouter } from "next/navigation";
import { PiShoppingCartThin } from "react-icons/pi";
import { useCart, Cart} from "@/app/context/CartContext";

interface Props {
  params: Promise<{
    id: string;
  }>;
}


export default function Product({params}:Props) {
    const {CartSave} = useCart()
    const [menu, setMenu] = useState<menuItem>()
    const [cartn, setCartn] = useState<number>(1)
    const [selectedImage, setSelectedImage] = useState("");

    const token = localStorage.getItem('token')
    const router = useRouter();

    useEffect(() => {
        const menuRestapi = async () => {
            try{
                const { id } = await params;
                const menu = await fetch("https://menu-back-hemk.onrender.com/menuitem/menuItem/"+id)
                const menu_json= await menu.json()
                setMenu(menu_json.menuItem)
                setSelectedImage(menu_json.menuItem.image);
            }catch(err){
                console.error(err)
            }
        }
        menuRestapi()
    }, [])

    const CartNumber = (increase: boolean) => {
        if (increase) {
            setCartn((prev) => (prev < 10 ? prev + 1 : 10));
        } else {
            setCartn((prev) => (prev > 1 ? prev - 1 : 1));
        }
    };

    async function CheckUser(token: string) {
        try {
            const rs = await fetch("https://menu-back-hemk.onrender.com/api/me", {
                credentials: "include"
            })

            if (!rs.ok) return false

            const data = await rs.json()
            return !!data.user

        } catch (err) {
            console.error(err)
            return false
        }
    }

    const PostApiCart = async () => {
        try {
            // const token = localStorage.getItem('token')
            // if (!token) {
            //     alert("No token")
            //     return
            // }

            const users = await CheckUser("ffdd")

            if (!users) {
                alert("Login not found")
                return

            }
            const carts: Cart = {
                menuItemId: Number(menu?.id),
                quantity: Number(cartn)
            }

            CartSave(carts)
        } catch (err) {
            console.error(err)
        }
    }
    return(
        <div>
             <button
                onClick={() => router.back()}
                className="btn-back"
            >
                ← กลับ
            </button>
           <div className="card-menu">
                <div className="box-img">
                   <img
                        src={selectedImage || menu?.image}
                        alt=""
                        className="main-image"
                    />
                   <div className="thumbnail-container">
                        <img src="https://i.pinimg.com/1200x/fe/12/a3/fe12a36a4f8dd44542b357204a7f2a10.jpg" alt="" onClick={() => setSelectedImage("https://i.pinimg.com/1200x/fe/12/a3/fe12a36a4f8dd44542b357204a7f2a10.jpg")}/>
                        <img src="https://i.pinimg.com/736x/4f/a4/71/4fa47125bb7310cd4f6e69c5b309f1ba.jpg" alt="" onClick={() => setSelectedImage("https://i.pinimg.com/736x/4f/a4/71/4fa47125bb7310cd4f6e69c5b309f1ba.jpg")}/>
                        <img src={menu?.image} alt="" onClick={() => setSelectedImage(String(menu?.image))}/>
                        <img src={menu?.image} alt="" onClick={() => setSelectedImage(String(menu?.image))}/>
                        <img src={menu?.image} alt="" onClick={() => setSelectedImage(String(menu?.image))}/>
                        <img src="https://i.pinimg.com/736x/23/48/42/234842d2343509b24b334350f99ac3f5.jpg" alt="" onClick={() => setSelectedImage("https://i.pinimg.com/736x/23/48/42/234842d2343509b24b334350f99ac3f5.jpg")}/>
                        <img src={menu?.image} alt="" onClick={() => setSelectedImage(String(menu?.image))}/>
                        <img src={menu?.image} alt="" onClick={() => setSelectedImage(String(menu?.image))}/>
                        <img src="https://i.pinimg.com/736x/f8/e1/65/f8e165424415a8cde098aae9a1f3a85b.jpg" alt="" onClick={() => setSelectedImage("https://i.pinimg.com/736x/f8/e1/65/f8e165424415a8cde098aae9a1f3a85b.jpg")}/>
                        <img src={menu?.image} alt="" />
                        <img src={menu?.image} alt="" />
                    </div>
                </div>
                <div className="box-text">
                    <p>ร้านอาหารยายต๋อยย</p>
                    <h1>{menu?.name}</h1>
                    <div className="box-price">
                        <h2>{menu?.price}</h2>
                        <p>บาท</p>
                    </div>
                    <br />
                   <div className="box-address">
                        <h2>ตำแหน่งที่ร้านอาหาร:</h2>
                        <p>56/3 บ้านนาขมิ้น ตำบลนาขมิ้น อำเภอโพนสวรรค์ จังหวัดนครพนม </p>
                        <p>48190</p>
                   </div>
                   <div className="quantity-box">
                        <button onClick={() => CartNumber(false)}>-</button>

                        <input
                            type="number"
                            value={cartn}
                            readOnly
                        />
                        <button onClick={() => CartNumber(true)}>+</button>
                    </div>

                    <button className="btn-order" onClick={() => PostApiCart()}>
                     <PiShoppingCartThin  size={24} /> เพิ่มลงตะกร้า
                </button>
                </div>
           </div>
        </div>
    )
}