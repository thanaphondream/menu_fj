"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import StepCheckout from "../page";
import "../../css/addres.css"
import { Location } from "../../../components/LeafletMap";
import { useAuth } from "@/app/context/AuthContext";
import { useCart } from "@/app/context/CartContext";
import { useRouter } from "next/navigation";
import { useOrderAll, Address } from "@/app/context/Address-Order-PeymentContext";

const LeafletMap = dynamic(
    () => import("../../../components/LeafletMap"),
    {
        ssr: false,
    }
);

export default function Addred() {
    const [position, setPosition] = useState<[number, number] | null>(null);
    const [address, setAddress] = useState<Location>();
    const [customerName, setCustomerName] = useState<string>("");
    const [addresApi, setAddressApi] = useState<string>("")
    const [homenumber, setHomeNember] = useState<string>("")
    const [phon, setPhon] = useState<string>("")

    const [isfase, setIsfase] = useState<boolean>(true)
    const [notDefount, setnotDefount] = useState<string>()
    
    const router = useRouter();

    const { user } = useAuth()
    const { cart } = useCart()

    const {AddressPosts, addresss} = useOrderAll()

    const distance: string = String(addresss?.address)
    useEffect(() => {
        if (user?.username) {
            setCustomerName(user.username);
        }
    }, [user]);

    const CheckDataAddress = (): boolean => {
        if (phon.trim() === "") {
            setIsfase(false);
            setnotDefount("ไม่มีเบอร์โทรศัพท์");
            return false;
        }

        if (phon.length !== 10) {
            setIsfase(false);
            setnotDefount("กรุณากรอกเบอร์โทร 10 หลัก");
            return false;
        }

        if (homenumber.trim() === "") {
            setIsfase(false);
            setnotDefount("ไม่มีข้อมูลสถานที่จัดส่ง");
            return false;
        }

        if (addresApi.trim() === "") {
            setIsfase(false);
            setnotDefount("เลือกข้อมูลปักมุดในแผนที่");
            return false;
        }

        if (!position) {
            setIsfase(false);
            setnotDefount("กรุณาเลือกตำแหน่งบนแผนที่");
            return false;
        }

        setIsfase(true);
        setnotDefount("");

        return true;
    };

    const PostAddres = async () => {
        const isValid = CheckDataAddress();

        if (!isValid) {
            return;
        }

        const data: Address = {
            address: addresApi,
            home: homenumber,
            username: customerName,
            distance: String(address?.distance),
            phone: phon,
            lat: String(position?.[0] ?? ""),
            lng: String(position?.[1] ?? ""),
            description: "-",
        };

        try {
            await AddressPosts(data);


        } catch (err) {
            console.error(err);
        }
    };
    return (
        <>
            <StepCheckout />

             <br /><br />
            <div className="address">
               <div className="card-address">
                 <div className="box-up">
                    <div className="box-text">
                        <h1>Customer Info</h1>
                    </div>
                    <div className="box-info">
                        <div className="box-ipu01">
                            <label htmlFor="">ชื่อผู้สั่ง</label>
                            <input
                                type="text"
                                value={customerName}
                            />
                        </div>
                        <div className="box-ipu01">
                            <label htmlFor="">เบอร์มือถือ</label>
                            <input 
                            type="text" 
                            value={phon} 
                            maxLength={10}
                        />
                        {notDefount === "ไม่มีเบอร์โทรศัพท์" && (
                            <div>
                                <p className="text-red-600">{notDefount}</p>
                            </div>
                        )}
                         {notDefount === "กรุณากรอกเบอร์โทร 10 หลัก" && (
                            <div>
                                <p className="text-red-600">{notDefount}</p>
                            </div>
                        )}
                        </div>
                    </div>
                </div>

                <br /><br />

                <div className="card-map">
                    <div className="box-text02">
                        <h1>Delivery Address</h1>
                    </div>
                    <div>
                        <div className="box-map">
                              <LeafletMap
                                onSelect={(position, address) => {
                                    setPosition(position);
                                    setAddress(address);
                                }}
                            />
                        </div>
                    </div>

                    <div className="box-address">
                        <div>
                            <label htmlFor="">ที่อยู่(114/3 ....)</label>
                            <input 
                                type="text" 
                                value={homenumber}
                                className={`phon ${
                                    !isfase && notDefount === "ไม่มีข้อมูลสถานที่จัดสัง"? "iso": ""
                                }`} 
                            />
                            {notDefount === "ไม่มีข้อมูลสถานที่จัดสัง" && (
                                <div>
                                    <p className="text-red-600">{notDefount}</p>
                                </div>
                            )}
                        </div>
                        <br />
                        <div>
                            <label htmlFor="">เขต</label>
                            <input 
                            type="text" 
                            value={addresApi || "เลือกที่อยู่ในแผ่นที่"}
                            />

                            {notDefount === "เลือกข้อมูลปักมุดในแผนที่" ? (
                                <div>
                                    <p className="text-red-600">{notDefount}</p>
                                </div>
                            ):(
                                <div>
                                    <p className="text-lime-600">กรุณาปักมุดในพื้นที่เลย</p>
                                </div>
                            )}
                        </div>
                        <br />
                        <div>
                            <label htmlFor="">รายละเอียดในการส่ง</label>
                            <input type="text" />
                        </div>
                        <br />
                        <div>
                            <p>ระยะทาง {address?.distance || 0 } เมตร</p>
                        </div>
                        <div>
                            <button 
                           
                            >บันทึก</button>
                        </div>
                    </div>
                </div>
               </div>

               <div className="card-cart1">
                    <h1>สรุปการสั่งซื้อ</h1>
                    <br />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px'}}>
                        {cart?.cart.items.map((m) => (
                            <div className="box-cartItem1" key={m.id}>
                                <div className="box-img1">
                                    <img src={m.menuItem.image} alt="" />
                                </div>
                                <div className="box-text031">
                                    <p>{m.menuItem.name}</p>
                                    <p>{m.quantity} รายการ</p>
                                </div>
                                <div className="box-price">
                                    <span>฿{m.menuItem.price * m.quantity}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <br /><br />
                    <div className="card-total1">
                    <div className="box-total1">
                            <div className="total01">
                                <p>ราคารวม:</p>
                            </div>
                            <hr />
                            <div  className="total02">
                                {cart?.total}
                            </div>
                    </div>
                        <div className="box-total1">
                            <div className="total01">
                                <p>Delivery Fee:</p>
                            </div>
                            <hr />
                            <div  className="total02">
                                Free
                            </div>
                    </div>
                        <div className="box-total1">
                            <div className="total01">
                                <p>Service Fee:</p>
                            </div>
                            <hr />
                            <div  className="total02">
                                Free
                            </div>
                    </div>
                        <div className="box-total1">
                            <div className="total01">
                                <p>Total:</p>
                            </div>
                            <hr />
                            <div  className="total02">
                                {cart?.total}
                            </div>
                    </div>
                    <br />
                    <button className="bt-total1" onClick={() => {
                             const isValid = CheckDataAddress();
                            if (!isValid) {
                                return;
                            }
                            router.push("/order/checkout/payment")
                            }}>
                            ชำระเงิน 
                        </button>
                    </div>
               </div>
            </div>
        </>
    );
}