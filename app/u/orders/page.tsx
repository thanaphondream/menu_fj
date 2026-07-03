'use client'

import { useOrderAll } from "@/app/context/Address-Order-PeymentContext";
import "../css/Orderss.css";
import { useRouter } from "next/navigation";

export default function Orders() {
    const { orderFin } = useOrderAll();
    const rounter = useRouter()

    if (!orderFin || orderFin.length === 0) {
        return (
            <div className="order-empty">
                ยังไม่มีรายการคำสั่งซื้อของคุณในขณะนี้
            </div>
        );
    }

    return (
        <div className="orders-container">

            <h1 className="orders-title">
                รายการคำสั่งซื้อของคุณ
            </h1>

            {orderFin.map((order) => (
                <div key={order.id} className="order-card">

                    {/* Header */}
                    <div className="order-header">

                        <div>
                            <p className="order-reference">
                                หมายเลขอ้างอิง :
                                <span>{order.reference}</span>
                            </p>

                            <p className="order-date">
                                วันที่สั่ง :
                                {/* {new Date(order.created_at).toLocaleString("th-TH")} */}
                            </p>
                        </div>

                        <div className="order-status">
                            <span>สถานะ :</span>

                            <div className="status-badge">
                                {order.status}
                            </div>
                        </div>

                    </div>

                    {/* Items */}

                    <div className="order-items">

                        {order.items.map((item) => (

                            <div
                                key={item.id}
                                className="order-item"
                            >

                                <div className="item-left">

                                    <img
                                        src={item.menuItem.image}
                                        alt={item.menuItem.name}
                                    />

                                    <div>

                                        <h3>{item.menuItem.name}</h3>

                                        <p>
                                            {item.price} บาท × {item.quantity}
                                        </p>

                                    </div>

                                </div>

                                <div className="item-price">
                                    {(item.price * item.quantity).toLocaleString()} บาท
                                </div>

                            </div>

                        ))}

                    </div>

                    {/* Footer */}

                    <div className="order-footer">

                        <div className="price-row">
                            <span>ค่าจัดส่ง</span>

                            <span>
                                {order.delivery_fee === 0
                                    ? "ฟรี"
                                    : `${order.delivery_fee} บาท`}
                            </span>
                        </div>

                        <div className="price-total">

                            <span>ราคารวมทั้งสิ้น</span>

                            <span>
                                {order.total_price.toLocaleString()} บาท
                            </span>

                        </div>
                        <div onClick={() => {rounter.push("/order/tracking/"+ order.id)}}>
                            <h1 className="text-[#03a9f4]">ดูรายละเอียดเพิ่มเติม</h1>
                        </div>
                    </div>

                </div>
            ))}

        </div>
    );
}