"use client";


import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import '../css/step.css'

export default function StepCheckout() {
    const pathname = usePathname();

    const router = useRouter();
    const steps = [
        {title: "Addres", path: "/order/checkout/addres", th: "หรอกที่อยู่"},
        {title: "payment", path: "/order/checkout/payment", th: "ชำระเงิน"}

    ]

    const currentIndex  = steps.findIndex(
        step => step.path === pathname
    )
    return (
     <div> 
        <div className="card-button">
             <div className="btn-back">
                <button
                    onClick={() => router.back()}>
                    ← กลับ
                </button>
             </div>
            
            {steps.map((s, index) => index === currentIndex &&(
                <div className="box-th" key={s.path}>
                    <p>{s.th}</p>
                </div>
            ))}
        </div>
           <div className="step-container">
            {steps.map((s, index) => (
                <div className="step-item" key={s.path}>
                    <div className={`step-circle ${
                        index <= Number(currentIndex) ? "active": ""
                    }`}>
                        {index < currentIndex ? "✓": index +1}
                    </div>
                       <span>{s.title}</span>
                        {index !== steps.length - 1 && (
                            <div
                                className={`step-line ${
                                    index < currentIndex ? "active" : ""
                                }`}
                            />
                        )}
                </div>
            ))}
        </div>
     </div>
    )
}