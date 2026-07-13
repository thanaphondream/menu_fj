"use client";

import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMapEvents,
    Tooltip 
} from "react-leaflet";
import { useState,useEffect } from "react";
import L from "leaflet";
import 'leaflet/dist/leaflet.css';

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export interface Location{
    village?: string;
    municipality?: string;
    county?: string;
    province?: string;
    distance: number;
}

type LeafletMapProps = {
    onSelect: (
        position: [number, number] | null,
        address: Location,
        addresss: string,
    ) => void;
};

const shopPosition: [number, number] = [
    17.5243397,
    104.4896309,
];

function LocationMarkers({
    onSelect,
}: LeafletMapProps) {
    const [position, setPosition] = useState<[number, number] | null>(null);

    const [address, setAddress] =useState<Location>();

    type Postitions = (pos: [number, number]) => number;

    useMapEvents({
        async click(e) {
            const lat = e.latlng.lat;
            const lng = e.latlng.lng;

            const pos: [number, number] = [lat, lng];

            setPosition(pos);

            try {
                const res = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
                );

                const data = await res.json();

                const addr: Location = data.address || {};

                const distance = DistanceFn(pos);

                addr.distance = distance;

                console.log("location: ", addr)

                setAddress(addr);

                onSelect(pos, addr, String(data.address));

            } catch (err) {
                console.error(err);
            }
        },
    });

    const DistanceFn: Postitions = (pos) => {
        const distance = L.latLng(pos)
            .distanceTo(L.latLng(shopPosition));
        const result = distance.toFixed(3);
        return Number(result)
    }

    return position ? (
        <Marker position={position}>
           <Popup>
                <div>
                    <strong>ที่อยู่</strong>
                    <br />
                    {address ? (
                        <>
                            {address.village},
                            {address.municipality},
                            {address.province}
                        </>
                    ) : (
                        "กำลังค้นหา..."
                    )}
                    <br />
                    <img
                        src="https://i.pinimg.com/736x/3a/73/b1/3a73b121715d1cddf2ea5d31ae30443c.jpg"
                        alt="ร้านค้า"
                        width={50}
                        height={50}
                    />
                </div>
            </Popup>
        </Marker>
    ) : null;
}

function LocationshopPosition(){
    return (
        <Marker position={shopPosition}>
           <Tooltip permanent direction="left">
            🍜 ร้านอาหาร
            </Tooltip>
            <Popup>
                🍜 ร้านอาหาร
            </Popup>
        </Marker>
    )
}

export default function LeafletMap({
        onSelect,
    }: LeafletMapProps) {
    return (
        <div>
            <MapContainer
                center={[17.525845236703216, 104.48962569236755]}
                zoom={17}
                 style={{
                    height: "350px",
                    width: "100%",
                    borderRadius: "15px",
                }}
                className="map"
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="© OpenStreetMap contributors"
                />
                <LocationshopPosition/>
                <LocationMarkers onSelect={onSelect} />
            </MapContainer>

            <p style={{ marginTop: "10px" }}>
                คลิกบนแผนที่เพื่อเลือกตำแหน่งจัดส่ง
            </p>
        </div>
    );
}