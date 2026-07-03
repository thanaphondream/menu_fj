'use client'

import StepCheckout from "../page";
import { useEffect, useState } from "react";
import { useOrderAll } from "@/app/context/Address-Order-PeymentContext";
import { useCart } from "@/app/context/CartContext";
import Link from "next/link";
import { IoIosBicycle } from "react-icons/io";
import { PiMapPin } from "react-icons/pi";
import { IoQrCodeOutline } from "react-icons/io5";
import { MdAttachMoney } from "react-icons/md";
import { CiMoneyBill } from "react-icons/ci";
import { SlArrowRight } from "react-icons/sl";
import { MdQrCode } from "react-icons/md";
import { useRouter } from "next/navigation";

import '../../css/payment.css'

export default function Pyment() {
    const [payment, setPayment] = useState("")

    const { addresss, OrderPost } = useOrderAll()
    const { cart } = useCart()

    const router = useRouter();

    useEffect(() => {
        if(!addresss){
            router.push("/order/checkout/addres")
        }
    }, [addresss])

    const OrderSave = () => {
        const confirmPost = window.confirm(
            "คุณต้องการชำระสินค้านี้หรือไม่?"
        );

        if (!confirmPost) return;

        // console.log(addresss?.id)
        OrderPost(Number(addresss?.id))
        
    }

    return (
        <>
            <StepCheckout />

            <br /><br />
            <div className="card-payment">
                <div className="box-peyment">
                    <div className="box-location">
                       <div className="box-addresss">
                            <div className="box-address01">
                                <h1>Deliverry Address</h1>
                            </div>
                            <div className="box-address02">
                                <p>เลือกที่อยู่ใหม่</p>
                            </div>
                       </div>
                        <div className="box-address03">
                            <div>
                                <PiMapPin size={22}/>
                            </div>
                            <div>
                                <h1>{addresss?.home}</h1>
                                {/* <p>{addresss?.address.split(",").slice(-3)}</p> */}
                                <p>{addresss?.address}</p>
                                <div className="box-distance">
                                    <IoIosBicycle />
                                    <p>ระยะทาง {addresss?.distance} ก.ม (15-20 นาที)</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="box-money">
                       <div className="box-text">
                            <h1>Peyment Method</h1>
                       </div>

                        <label
                            className="box-money02"
                            onClick={() => setPayment("้เก็บเงินปลายทาง")}
                        >
                            <div>
                                <MdAttachMoney size={22}/>
                            </div>

                            <div>
                                <h1>เก็บเงินปลายทาง</h1>
                                {/* <p>{payment}</p> */}
                                <p>จ่ายเงินผ่านพนักงานส่งได้เลย</p>
                            </div>

                            <div className="box-input">
                                <input
                                type="radio"
                                name="payment"
                                checked={payment === "้เก็บเงินปลายทาง"}
                                onChange={() => setPayment("้เก็บเงินปลายทาง")}
                            />
                            </div>
                        </label>

                        {/* <label
                            className="box-money02"
                            onClick={() => setPayment("promptpay")}
                        >
                            <div>
                                <MdQrCode size={22}/>
                            </div>

                            <div>
                                <h1>PromptPay QR</h1>
                                <p>{payment}</p>
                                <p>สแกนจ่ายผ่าน Mobile Banking</p>
                            </div>

                            <input
                                type="radio"
                                name="payment"
                                checked={payment === "promptpay"}
                                onChange={() => setPayment("promptpay")}
                            />
                        </label> */}

                        {/* <div>
                            <div>
                                <CiMoneyBill />
                            </div>
                            <div>
                                <h1>แสกนจ่าย</h1>
                            </div>
                        </div> */}
                    </div>
                </div>
                    <div className="cart">
                        <br />
                       <div className="menuitme">
                         <h1 className="hh1">จำนวนอาอารที่จะสั่ง</h1>
                            <br />
                            {cart?.cart.items.map((m) => (
                                <div key={m.menuItem.id} className="menu">
                                    <div className="menuitme-img">
                                        <img src={m.menuItem.image} alt=""/>
                                    </div>
                                    <div className="menuitme-text">
                                        <h1 className="font-sans">{m.menuItem.name}</h1>
                                        <p>{m.menuItem.description}</p>
                                        <p>{m.quantity}  รายการ</p>              
                                    </div>
                                    <div className="menuitme-price">
                                       <p> ฿{m.menuItem.price * m.quantity}</p>
                                    </div>
                                </div>
                            ))}
                       </div>
                            <br /><br />
                         <div className="count">
                        <div className="box-total">
                            <div>
                                <p>ราคารวม:</p>
                            </div>
                            <div>
                                <p>฿{cart?.total}</p>
                            </div>
                        </div>
                        <div className="box-total">
                            <div>
                                <p>ค่าจัดส่ง:</p>
                            </div>
                            <div>
                                <p>฿0</p>
                            </div>
                        </div>
                        <div className="box-total">
                            <div>
                                <h1>ราคารวม:</h1>
                            </div>
                            <div className="text-orange-600 text-2xl">
                                <p>฿{cart?.total}</p>
                            </div>
                        </div>
                        <br />
                        <div className="but" onClick={() => OrderSave()}>
                            <button>ยืนยันการชำระ </button>
                            <SlArrowRight />
                        </div>
                    </div>
                    </div>
            </div>
        </>
    );
}