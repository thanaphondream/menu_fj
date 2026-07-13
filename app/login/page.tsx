"use client";

import { useEffect, useState } from "react";
import './css/login.css'
import Link from "next/link";
import { CiLogin } from "react-icons/ci";
import { useAuth} from "../context/AuthContext";
import { useRouter } from "next/navigation";


interface Logins {
    email: string;
    password: string;
}

export default function Login() {
    const [users, setUsers] = useState<Logins>({
        email: "",
        password: ""
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { login } = useAuth()
    const router = useRouter();

    const usersPost = async () => {
    try {
        const rs = await fetch("https://menu-back-hemk.onrender.com/api/login", {
        method: "POST",
         headers: {
                    "Content-Type": "application/json",
                    },
        body: JSON.stringify(users),
        });

        const data = await rs.json();

        if (!rs.ok) {
        setError(data.message || "เกิดข้อผิดพลาด");
        return;
        }


    login(data.user, data.token)

    alert("Login สำเร็จ");

    router.push('/u')
    } catch (err) {
        setError("Server ไม่ตอบสนอง");
    } finally {
        setLoading(false);
    }
    }
    return(
        <div>
            <div className="cart-login">
                <div className="cart-text">
                    <div className="text-01">
                        <CiLogin size={50} className="login-icon" />
                        <h1>ล็อกอิน</h1>
                    </div>
                    <h4>เข้าสู่เว็บไซต์ร้านก๋วยเตี๋ยวเลย</h4>
                </div>
                <div className="input-group">
                    <label htmlFor="">อีเมล</label>
                   <input
                        type="email"
                        value={users?.email}
                        onChange={(e) =>
                            setUsers({ ...users, email: e.target.value })
                        }
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="">รหัสผ่าน</label>
                    <input
                        type="password"
                        value={users.password}
                        onChange={(e) =>
                            setUsers({ ...users, password: e.target.value })
                        }
                    />
                </div>
                <div className="box-bu">
                    <button onClick={() => usersPost()} disabled={loading}>  {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}</button>
                </div>

                {error && (
                    <p style={{ color: "red", textAlign: "center" }}>
                        {error}
                    </p>
                )}

                <div className="sign-up">
                    <p>Don't have an account?</p>
                    <Link href={'/signin'} className="box-link">Sign up</Link>
                </div>
            </div>
        </div>
    )
}