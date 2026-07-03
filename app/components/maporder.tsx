"use client";

import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
} from "react-leaflet";
import L, { divIcon } from "leaflet";
import "leaflet/dist/leaflet.css";
import './css/mapOrder.css'
import { useOrderAll, Order} from "../context/Address-Order-PeymentContext";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import img from "../context/img/Untitled.png"
import { IoIosBicycle } from "react-icons/io";
import { MdOutlinePhone } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { PiMapPin } from "react-icons/pi";

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});


const shopIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/3514/3514491.png", // public/shop.png
    iconSize: [20, 20],
    iconAnchor: [20, 40],
    popupAnchor: [0, -35],
});


const customerIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149071.png", // public/customer.png
    iconSize: [20, 20],
    iconAnchor: [20, 40],
    popupAnchor: [0, -35],
});

interface MapOrderProps {
    onorders: Order;
    statusNubmer: number;
}

function ShopMarker() {
    const shop: [number, number] = [ 17.524046,104.489580,];

    return (
        <Marker position={shop} icon={shopIcon}>
            <Popup>
                <b>🏪 ร้านยายต้อย</b>
            </Popup>
        </Marker>
    );
}

function CustomerMarker() {
    const { addresss } = useOrderAll();

    const [customers, setCustomer] = useState<[number, number] | null>(null);

    useEffect(() => {
        if (!addresss) return;

        setCustomer([
            Number(addresss.lat),
            Number(addresss.lng),
        ]);
    }, [addresss]);

    if (!customers) return null;

    return (
        <Marker position={customers} icon={customerIcon}>
            <Popup>
                <b>🏠 บ้านลูกค้า</b>
            </Popup>
        </Marker>
    );
}

export default function MapOrder({ onorders, statusNubmer }: MapOrderProps) {
    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {

        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    return (
        <div className="map-wrapper">
            <MapContainer
            center={[17.526266, 104.489041]}
            zoom={16}
            minZoom={11}
            maxZoom={19}
            style={{
                height: "350px",
                width: "100%",
            }}
        >
            <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <ShopMarker />
            <CustomerMarker />
        </MapContainer>
       <div
            ref={menuRef}
            className="box-card-diver"
        >

            {statusNubmer <= 3 ? (
                <div>
                     <div onClick={() => setOpen((prev) => !prev)} className="driver-card" >
                        <Image
                            src={img}
                            alt="driver"
                            width={60}
                            height={60}
                        />

                        <div className="driver-info">
                            <p>ผู้ทำอาหารอาหาร</p>
                            <h3>ร้านยายต๋อยยย</h3>
                        </div>
                    </div>
                        <div>
                        {open && (
                            <div className="box-dpdow">
                                <div className="dp-img">
                                    <Image
                                        src={img}
                                        alt="driver"
                                        width={90}
                                        height={90}
                                    />
                                </div>
                                <div className="dp-driver">
                                        <div className="flex gap-[18px]">
                                            <CgProfile size={20}/>
                                            <h1> ยายต๋อยยย</h1>
                                        </div>
                                        <div className="flex gap-[18px]">
                                            <MdOutlinePhone size={20}/>
                                            <h1>06478xxxx</h1>
                                        </div>
                                        <div className="flex gap-[18px]">
                                            <PiMapPin size={50} />
                                            <h1>ร้านยายต้อย 56/3 บ้านขมิ้น ตำบลบ้านขมิ้น อำโพนสวรรค์ จังหวัดนครพนม</h1>
                                        </div>
                                    </div>
                                </div>
                        )}
                    </div>
                </div>
            ): (statusNubmer >= 5? (
                <div>
                     <div>
                     <div onClick={() => setOpen((prev) => !prev)} className="driver-card" >
                        <Image
                            src={img}
                            alt="driver"
                            width={60}
                            height={60}
                        />

                        <div className="driver-info">
                            <p>สถานนะ</p>
                            <h3>ส่งสินค้าสำเร็จแล้ว</h3>
                        </div>
                    </div>
                        <div>
                        {open && (
                            <div className="box-dpdow">
                                <div className="dp-img">
                                    <Image
                                        src={img}
                                        alt="driver"
                                        width={90}
                                        height={90}
                                    />
                                </div>
                                <div className="dp-driver">
                                        <div className="flex gap-[18px]">
                                            <CgProfile size={20}/>
                                            <h1> ชื่อผู้รับ: xxxx</h1>
                                        </div>
                                        <div className="flex gap-[18px]">
                                            เวลาที่จัดส่งสำเร็จ 12.xxx
                                        </div>
                                        <div className="flex gap-[18px]">
                                             <PiMapPin size={50} />
                                             <h1>{onorders.address.username}</h1>
                                             <h1>{onorders.address.home}, {onorders.address.address}</h1>
                                        </div>
                                    </div>
                                </div>
                        )}
                    </div>
                </div>
                </div>
            ): (
            <div>
                 <div>
                     <div onClick={() => setOpen((prev) => !prev)} className="driver-card" >
                        <Image
                            src={img}
                            alt="driver"
                            width={60}
                            height={60}
                        />

                        <div className="driver-info">
                            <p>ผู้ส่งอาหาร</p>
                            <h3>{onorders.driver.name}</h3>
                        </div>
                    </div>
                        <div>
                        {open && (
                            <div className="box-dpdow">
                                <div className="dp-img">
                                    <Image
                                        src={img}
                                        alt="driver"
                                        width={90}
                                        height={90}
                                    />
                                </div>
                                <div className="dp-driver">
                                        <div className="flex gap-[18px]">
                                            <CgProfile size={20}/>
                                            <h1> {onorders.driver.name}</h1>
                                        </div>
                                        <div className="flex gap-[18px]">
                                            <MdOutlinePhone size={20}/>
                                            <h1>{onorders.driver.phone}</h1>
                                        </div>
                                        <div className="flex gap-[18px]">
                                            <IoIosBicycle size={20} />
                                            <h1> ยานพาหนะ: {onorders.driver.vehicle}</h1>
                                        </div>
                                    </div>
                                </div>
                        )}
                    </div>
                </div>
            </div>
        ))}
        </div>
        </div>
    );
}