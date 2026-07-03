'use client'

import dynamic from "next/dynamic";
import { useState, useEffect } from "react"
import { Location } from "../../../components/LeafletMap";
import { useOrderAll, Order } from "@/app/context/Address-Order-PeymentContext";
import '../../css/Orders.css'
import { PiMapPin } from "react-icons/pi";
import { GiRecycle } from "react-icons/gi";
import { useRouter } from "next/navigation";
import { FaPhoneAlt } from "react-icons/fa";
import { JSX } from "react/jsx-runtime";
import { ImSpoonKnife } from "react-icons/im";
import { useRef } from "react";

const MapOrder = dynamic(
    () => import("../../../components/maporder"),
    {
        ssr: false,
    }
);

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default function Tracking({params}:Props){

    const [position, setPosition] = useState<[number, number] | null>(null);
    const [location, setLocation] = useState<Location>();
    const [orderStatus, setOrderStatus] = useState<number>()
    const [styorder, setStyOrder] = useState<number>()
    const [buttonStatus, setButtonStatus] = useState<[string, JSX.Element]>()
    const {setOrderId, order} = useOrderAll()

    const router = useRouter();
    const dialogRef = useRef<HTMLDialogElement>(null);

    const statusorder = [
        {numbers: 1, status: "รอดำเนินการ", icon: "1",  text: "เรายืนยันคำสั่งซื้อของคุณและส่งไปยังห้องครัวเรียบร้อยแล้ว"}, 
        {numbers: 2, status: "ตอบรับแล้ว", icon: "2", text: "เชฟได้เริ่มเตรียมเส้นบะหมี่ที่ทำด้วยมือของคุณแล้ว"}, 
        {numbers: 3, status: "กำลังปรุงอาหาร", icon: "3", text: "น้ำซุปของคุณกำลังเคี่ยวอยู่ และกำลังมีการเติมเครื่องเคียงลงไป"}, 
        {numbers: 4, status: "กำลังจัดส่ง", icon: "4", text: "พนักงานจัดส่งของคุณจะมารับสินค้าในอีกสักครู่"},
        {numbers: 5, status: "เสร็จสิ้น", icon: "5", text: "อิ่มอร่อยกับอาหารอุ่นๆ จากยายต้อยนะคะ!"}
    ]

    useEffect(() => {
        const OrderIds = async () => {
            const { id } = await params;
            setOrderId(Number(id));
        };

        OrderIds();
    }, [params, setOrderId]);

    useEffect(() => {
        // setOrderStatus(order?.status)
        // const currentStep = statusorder.findIndex(
        //     step => step.status === order?.status
        // )
        let l = 0
        for (let s of statusorder){
            if(s.status === order?.status){
                l = s.numbers
            }
        }
        setOrderStatus(Number(l))
    }, [order])


    const checkOrderStatus = (number: number, orderS: number, icon: string, s: string) => {
        if(number === orderS){
           if(number === 5 && order?.status === s){
                return (<div className="">55</div>)
           }
           
            return (
                <div className="icon-anima">
                     <GiRecycle />
                </div>
            )
        } else if (number <= orderS){
            return ("✓")
        }else{
            return(icon)
        }
    }

    const buttonsStatus = ():  JSX.Element => {
        const status = statusorder.find(s => s.status === order?.status);

        if (!status) {
            return (
                <p className="flex items-center">"ติดต่อร้านอาหาร" <FaPhoneAlt />;</p>
            )
        }

        if (status.numbers <= 3) {
            return (
                <p className="flex items-center gap-[8px]" > <FaPhoneAlt /> ติดต่อร้านอาหาร</p>
            )
        }

        if (status.numbers === 4) {
            return (
                <p className="flex items-center gap-[8px]"> <FaPhoneAlt /> ติดต่อพนักงานส่งอาหาร</p>
            )
        }

        return (
            <p className="flex items-center gap-[8px]"> ✓ ติดต่อร้านอาหาร</p>
        )
    };
    useEffect(() => {
        const status = statusorder.find(
            s => s.status === order?.status
        );

        if (!status) {
            setStyOrder(1);
        } else if (status.numbers <= 3) {
            setStyOrder(1);
        } else if (status.numbers === 4) {
            setStyOrder(4);
        } else {
            setStyOrder(5);
        }

    }, [order]);
    return (
        <div className="order-context">
            <div className="btn-backs">
                <button
                    onClick={() => router.back()}>
                    ← กลับ
                </button>
                <div className="order-contexts">
                    <h1>หน้ารายกายที่สั้งซื้อ</h1>
                </div>
            </div>
            <div className="card-reference">
                <div className="box-reference">
                    <p>หมายเลขอ้างอิงคำสั่งซื้อ</p>
                    <h1>{order?.reference}</h1>
                </div>

                <div className="button-statuss">
                    <ImSpoonKnife />
                    <button >{order?.status}</button>
                </div>
            </div>
        <br />
            {order && (
                <div className="order-box">
                    <div className="box-orderss">
                        <div>
                            <div className="box-map">
                                <MapOrder  
                                    onorders={order}
                                    statusNubmer={Number(orderStatus)}
                                />
                            </div>
                        </div>

                        <div>
                            <div className="tracking-container">
                            <h2>Tracking Details</h2>
                            
                            <ul className="timeline">
                                {statusorder.map((s) => (
                                    <li className="status" key={s.numbers}>
                                        <div className={`icon ${s.numbers === Number(orderStatus) ? "active" : s.numbers <= Number(orderStatus)? 'done': 'pending'}`} >
                                            {checkOrderStatus(s.numbers, Number(orderStatus), String(s.icon), s.status)}
                                        </div>
                                        <div className="content">
                                            <h3>{s.status}</h3>
                                            <p>{s.text}</p>
                                            <span className="time">{s.numbers <= Number(orderStatus)? "12:45 PM": ""}</span>
                                        </div>
                                </li>
                                ))}
                            </ul>
                            </div>
                        </div>
                    </div>
                    <div className="card-ordermenu">
                        <div className="card-menuss">
                            <h1 className="text-[22px] font-bold">Order Summary</h1>
                            <br />
                            <div className="box-munes">
                               {order.items.map((m) => (
                                <div key={m.id} className="box-menu0">
                                    <div className="box-menu01">
                                    <div className="box-imgs">
                                        <img src={m.menuItem.image} alt="" width={82} height={94}/>
                                   </div>
                                    <div>
                                        <h1>{m.menuItem.name}</h1>
                                        <p>{m.menuItem.description}</p>
                                        <p>{m.quantity} รายการ</p>
                                    </div>
                                    </div>
                                    <div className="box-prices">
                                        <h1>฿{m.price * m.quantity}</h1>
                                    </div>
                                </div>
                               ))}
                            </div>
                        </div>
                        <br /><br />
                            <div className="count">
                                <div className="box-addresss">
                                    <div className="icon-box">
                                        <PiMapPin size={22} className="mt-1"/>
                                    </div>
                                    <div>
                                        <h1>ที่อยู่ของผู้รับอาหาร</h1>
                                        <p>{order.address.home}, {order.address.address}</p>
                                    </div>
                                </div>
                                <br />
                            <div className="box-total">
                                <div>
                                    <p>ราคารวม:</p>
                                </div>
                                <div className="mr-[20px]">
                                    <p>฿{order.total_price}</p>
                                </div>
                            </div>
                            <div className="box-total">
                                <div>
                                    <p>ค่าจัดส่ง:</p>
                                </div>
                                <div className="mr-[20px]">
                                    <p>฿0</p>
                                </div>
                            </div>
                            <div className="box-total">
                                <div>
                                    <h1>ราคารวม:</h1>
                                </div>
                                <div className="text-orange-600 text-2xl mr-[20px]">
                                    <p>฿{order.total_price}</p>
                                </div>
                            </div>
                                    <br />
                            {styorder === 5? (
                                <div className="buts">
                                    <button >{buttonsStatus()} </button>
                                    {/* <SlArrowRight /> */}
                                </div>
                                ): (
                                    <div className="buts" onClick={() => dialogRef.current?.showModal()}>
                                        <button >{buttonsStatus()} </button>
                                    </div>
                                )}
                            <div className="box-dialogRefs">
                                 <dialog ref={dialogRef} className="dialog">

                               {styorder === 1 ? (
                                                                <div className="box-cosphon">
                                     <h2>ติดต่อทางร้าน</h2>
                                        <div className="flex gap-[5px]">
                                            <p className="font-bold">ชื่อ: </p>
                                            <p>ยายต๋อยย</p>
                                        </div>
                                        <div className="flex gap-[5px]">
                                                <FaPhoneAlt />
                                                <p>:  06823xxx</p>
                                        </div>
                                        <br />
                                        <div className="locatinss">
                                                <PiMapPin size={22}/>
                                                <p>:  ร้านยายต้อย 56/3 บ้านขมิ้น ตำบลบ้านขมิ้น อำโพนสวรรค์ จังหวัดนครพนม</p>
                                        </div>
                                    </div>
                               ):(
                                    <div className="box-cosphon">
                                     <h2>ติดต่อพนักงานส่งอาหาร</h2>
                                    <div className="flex gap-[5px]">
                                         <p className="font-bold">ชื่อ: </p>
                                        <p>{order.driver.name}</p>
                                    </div>
                                    <div className="flex gap-[5px]">
                                        <FaPhoneAlt />
                                        <p>: {order.driver.phone}</p>
                                    </div>
                                    <br />
                                    <div className="locatinss">
                                            <PiMapPin size={22}/>
                                            <p>:  ร้านยายต้อย 56/3 บ้านขมิ้น ตำบลบ้านขมิ้น อำโพนสวรรค์ จังหวัดนครพนม</p>
                                    </div>
                                </div>
                               )}
                                <br />
                                <div className="dialog-footer">

                                    <button
                                        className="cancel-btn"
                                        onClick={() => dialogRef.current?.close()}
                                    >
                                       ออก
                                    </button>

                                    {/* <button
                                        className="confirm-btn"
                                        onClick={() => {
                                            console.log("สั่งซื้อสำเร็จ");
                                            dialogRef.current?.close();
                                        }}
                                    >
                                        ตกลง
                                    </button> */}

                                </div>

                            </dialog>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}