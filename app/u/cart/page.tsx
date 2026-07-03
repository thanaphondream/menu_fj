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
    // useEffect(() => {
    // if (!loading && !user) {
    //     router.push("/login")
    // }
    // }, [loading, user])
    const updataeQuantity = (
        quantity: number,
        id: number,
        increase: boolean
    ) => {
        try {
            let newQuantity = quantity;

            if (increase) {
                if (quantity >= 10) {
                    alert("เพิ่มสินค้าได้สูงสุด 10 ชิ้น");
                    return;
                }

                newQuantity = quantity + 1;
            } else {
                if (quantity <= 1) {
                    const confirmDelete = window.confirm(
                        "คุณต้องการลบสินค้านี้ออกจากตะกร้าหรือไม่?"
                    );

                    if (!confirmDelete) return;

                    UpdateQuantity(0, id);
                    return;
                }

                newQuantity = quantity - 1;
            }

            UpdateQuantity(newQuantity, id);

        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <div className="catd-cartItem">
                <div className="box-text">
                    <h1>ชามของคุณ</h1>
                    <p>ตรวจสอบสินค้าที่คุณเลือกสรรมาอย่างพิถีพิถัน</p>
                </div>
                <br />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px'}}>
                    {cart?.cart.items.map((m) => (
                        <div className="box-cartItem" key={m.id}>
                            <div className="box-img">
                                <img src={m.menuItem.image} alt={m.menuItem.name} />
                            </div>
                            <div className="box-text01" key={m.id}>
                                <p>{m.menuItem.name}</p>
                                <p>{m.menuItem.description}</p>
                                <span className="box-price">฿{m.menuItem.price}</span>
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