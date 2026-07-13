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

    const [cartloading, setCartLoading] = useState<boolean>(false)

    const router = useRouter();

    const [token, setToken] = useState("");

    useEffect(() => {
        setToken(localStorage.getItem("token") || "");
    }, []);

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
                 headers: {
                        "Authorization": `Bearer ${token}`
                    },
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

            setCartLoading(true)
            
            if (!token) {
                alert("No token")
                return
            }

            const users = await CheckUser(token)

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
        }finally {
            setCartLoading(false)
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
                        <img src={menu?.image} alt="" onClick={() => setSelectedImage(String(menu?.image))}/>
                        {menu?.images?.map((img, index) => (
                            <div key={index + 1}>
                                <img src={img} alt="" onClick={() => setSelectedImage(String(img))}/>
                            </div>
                        ))}

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
            {cartloading && (
                <div className="loading">
                    <div className="loading-box">
                        <div className="spinner"></div>
                        <p>กำลังเพิ่มสินค้าลงตะกร้า...</p>
                    </div>
                </div>
            )}   
        </div>
    )
}