"use client";

import "./css/signin.css";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function SignIn() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    return (
        <div className="signin-container">
            <div className="cart-signin">
                <div className="cart-text">
                    <h1>ลงทะเบียนเข้าสู่ระบบ</h1>
                </div>

                <div className="input-cart">
                    <label>ชื่อผู้ใช้</label>

                    <input
                        type="text"
                        value={username}
                        onChange={(e) =>
                            setUsername(e.target.value)
                        }
                        placeholder="กรอกชื่อผู้ใช้"
                    />
                </div>

                <div className="input-cart">
                    <label>อีเมล</label>

                    <input
                        type="email"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                        placeholder="example@gmail.com"
                    />
                </div>

                <div className="input-cart">
                    <label>รหัสผ่าน</label>

                    <div className="password-box">
                        <input
                            type={
                                showPassword
                                    ? "text"
                                    : "password"
                            }
                            value={password}
                            onChange={(e) =>
                                setPassword(
                                    e.target.value
                                )
                            }
                            placeholder="กรอกรหัสผ่าน"
                        />

                        <span
                            className="eye-icon"
                            onClick={() =>
                                setShowPassword(
                                    !showPassword
                                )
                            }
                        >
                            {showPassword ? (
                                <FaEyeSlash />
                            ) : (
                                <FaEye />
                            )}
                        </span>
                    </div>
                </div>

                <div className="input-cart">
                    <label>ยืนยันรหัสผ่าน</label>

                    <div className="password-box">
                        <input
                            type={
                                showConfirmPassword
                                    ? "text"
                                    : "password"
                            }
                            value={confirmPassword}
                            onChange={(e) =>
                                setConfirmPassword(
                                    e.target.value
                                )
                            }
                            placeholder="ยืนยันรหัสผ่าน"
                        />

                        <span
                            className="eye-icon"
                            onClick={() =>
                                setShowConfirmPassword(
                                    !showConfirmPassword
                                )
                            }
                        >
                            {showConfirmPassword ? (
                                <FaEyeSlash />
                            ) : (
                                <FaEye />
                            )}
                        </span>
                    </div>
                </div>

                {confirmPassword &&
                    password !== confirmPassword && (
                        <p className="error-text">
                            รหัสผ่านไม่ตรงกัน
                        </p>
                    )}

                {confirmPassword &&
                    password === confirmPassword && (
                        <p className="success-text">
                            รหัสผ่านตรงกัน
                        </p>
                    )}

                <div className="box-button">
                    <button>ลงทะเบียน</button>
                </div>
            </div>
        </div>
    );
}