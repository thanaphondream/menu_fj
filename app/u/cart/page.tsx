"use client";

import { useState, useEffect } from "react";
import { useCart, CartModel } from "@/app/context/CartContext";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";

import '../css/cart.css'

export default function Carts() {
    const {user, loading} = useAuth()
    const router = useRouter();
    const {cart, loadings, UpdateQuantity} = useCart()
    const [quantitys, setQuantity] = useState<number>()

    const [cartloading, setCartLoading] = useState<boolean>(false)
    const [cartItems, setCartItems] = useState<CartModel["cart"]["items"]>([])
    useEffect(() => {
        if (!loading && !user) {
            router.replace("/login")
        }
    }, [loading, user, router])

    useEffect(() => {
        if (cart?.cart.items) {
            setCartItems(cart.cart.items)
        }
    }, [cart])
    
    const updataeQuantity = async (
        quantity: number,
        id: number,
        increase: boolean
    ) => {
        let newQuantity = quantity;

        if (increase) {

            if (quantity >= 10) {
                alert("เพิ่มสินค้าได้สูงสุด 10 ชิ้น");
                return;
            }

            newQuantity++;

        } else {

            if (quantity <= 1) {

                const confirmDelete = window.confirm(
                    "คุณต้องการลบสินค้านี้ออกจากตะกร้าหรือไม่?"
                );

                if (!confirmDelete) return;

                newQuantity = 0;

            } else {

                newQuantity--;

            }
        }

        setCartItems(prev =>
            prev.map(item =>
                item.id === id
                    ? { ...item, quantity: newQuantity }
                    : item
            )
        );

        try {

            await UpdateQuantity(newQuantity, id);

        } catch (err) {

            console.error(err);

        }
    }


    if (loading) {
        return <span className="loading loading-spinner loading-xl"></span>
    }

    if (!user) {
        return (
            <div className="empty-cart">
                <h2>กรุณาเข้าสู่ระบบ</h2>
                <p>คุณต้องเข้าสู่ระบบก่อนใช้งานตะกร้าสินค้า</p>

                <button
                    onClick={() => router.push("/login")}
                    className="bt-total"
                >
                    ไปหน้าเข้าสู่ระบบ
                </button>
            </div>
        );
    }
    
    const isEmpty =
        !cart ||
        !cart.cart ||
        cart.cart.items.length === 0;

    if (isEmpty) {
    return (
        <div className="empty-cart">
            <h2>🛒 ตะกร้าของคุณว่าง</h2>

            <p>ยังไม่มีสินค้าในตะกร้า</p>

            <button
                className="bt-total"
                onClick={() => router.push("/u/menu")}
            >
                เลือกซื้อสินค้า
            </button>
        </div>
    );
}

    return (
        <div>
            <div className="catd-cartItem">
                <div className="box-text">
                    <h1>ชามของคุณ</h1>
                    <p>ตรวจสอบสินค้าที่คุณเลือกสรรมาอย่างพิถีพิถัน</p>
                </div>
                <br />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px'}}>
                    {cartItems?.map((m) => (
                        <div className="box-cartItem" key={m.id}>
                            <div className="box-img">
                                <img src={m.menuItem.image} alt={m.menuItem.name} />
                            </div>
                            <div className="box-text01" key={m.id}>
                                <div>
                                    <p>{m.menuItem.name}</p>
                                </div>
                                <div>
                                    {/* <p>{m.menuItem.description}</p> */}
                                    <span className="box-price">฿{m.menuItem.price}</span>
                                </div>
                            </div>
                            
                            <div className="box-quantity">
                                <button
                                    onClick={() =>
                                        updataeQuantity(Number(m.quantity), Number(m.id), false)
                                    }
                                >
                                    -
                                </button>

                                <input
                                    type="number"
                                    value={ m.quantity}
                                    readOnly
                                />

                                <button
                                    onClick={() =>
                                        updataeQuantity(Number(m.quantity), Number(m.id), true)
                                    }
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <div>
                </div>
                <br />
                <br />
                <hr />
                <div className="card-total02">
                   <div className="box-total">
                        <div className="total01">
                            <p>ราคารวม:</p>
                        </div>
                        <hr />
                        <div  className="total02">
                            {cart?.total}
                        </div>
                   </div>
                    <div className="box-total">
                        <div className="total01">
                            <p>Delivery Fee:</p>
                        </div>
                        <hr />
                        <div  className="total02">
                            Free
                        </div>
                   </div>
                    <div className="box-total">
                        <div className="total01">
                            <p>Service Fee:</p>
                        </div>
                        <hr />
                        <div  className="total02">
                            Free
                        </div>
                   </div>
                    <div className="box-total">
                        <div className="total01">
                            <p>Total:</p>
                        </div>
                        <hr />
                        <div  className="total02">
                            {cart?.total}
                        </div>
                   </div>
                   <br />
                   <button className="bt-total" onClick={() => {
                    router.push("/order/checkout/addres")
                   }}>ชำระเงิน </button>
                </div>
            </div>
        </div>
    )
}