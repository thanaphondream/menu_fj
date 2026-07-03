"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import './css/layout.css'
import { useAuth} from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useRouter } from "next/navigation";
import { FaRegUser } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import { PiBowlFoodDuotone } from "react-icons/pi";
import { CiUser, CiMenuBurger } from "react-icons/ci";
import { MdOutlineMenuBook, MdOutlineRestaurantMenu } from "react-icons/md";
import { TbLogout2 } from "react-icons/tb";


export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const {count, refreshCart} = useCart()
  const { user, logout, loading } = useAuth()
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const [opens, setOpens] = useState(false);

  const router = useRouter();

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

  useEffect(() => {
    if (opens) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [opens]);

  const tabs = [
    {
      name: "เมนู",
      href: "/u/menu",
      icon: <MdOutlineRestaurantMenu />,
    },
    {
      name: "หมวดหมู่",
      href: "/u/category",
      icon: <MdOutlineMenuBook />,
    },
  ];

  // const LogOut = () => {
  //   localStorage.removeItem("token");
  //   window.location.reload();

  //   router.push('/login')
  // }

  useEffect(() => {
    const Count = async () => {
      await refreshCart()
    }
    Count()
  })

  return (
    <div>
      <nav className="layout">

    <div className="cart-tt">
       <button
            onClick={() => setOpens(!opens)}
            className="menub"
        >
            ☰
        </button>
      <div>
        <PiBowlFoodDuotone size={22}/>
       <Link href={'/u'}>
          <p>ก๋วยเตี๋ยวยายต๋วยย</p>
      </Link>
    </div>
    <br />
    <div className="desktop-menu">
        {tabs.map((tab) => (
            <Link
                key={tab.href}
                href={tab.href}
                className={pathname === tab.href ? "border-b-2 border-blue-500 font-bold " : ""}
            >
               <div className="flex items-center gap-[5px]">
                  {tab.icon}
                  <p>{tab.name}</p>
               </div>
            </Link>
        ))}
    </div>
    </div>

    <div className="box-user">

     <Link href={'/u/cart'}>
         <div className="cart-icon">
            <FiShoppingCart size={21} />

            {count > 0 && (
                <div className="badge">
                    <p>{count}</p>
                </div>
            )}
        </div>
     </Link>

        <div className="nav-right">
            {loading ? null : user ?  (
                <div className="profile-box" ref={menuRef}>
                    <img
                        src="https://i.pinimg.com/736x/e1/a2/dc/e1a2dc0ecec77eb0907f31f87698f74b.jpg"
                        className="avatar"
                        onClick={() => setOpen(!open)}
                    />

                    {open && (
                        <div className="dropdown">
                            <div className="profile-dropdown">
                              <img src="https://i.pinimg.com/736x/e1/a2/dc/e1a2dc0ecec77eb0907f31f87698f74b.jpg" alt="" />
                              <div>
                                <p>{user.username}</p>
                                <p>{user.email}</p>
                              </div>
                            </div>
                            <hr />
                            <div className="dropdown-s01">
                              <div className="box-me">
                                <CiUser size={30} />
                                <p>บัญชีของฉัน</p>
                              </div>
                              <div className="box-me" onClick={() => router.push("/u/orders")}>
                                <MdOutlineMenuBook  size={30} />
                                <p>คำสั่งซื้อ</p>
                              </div>
                              <div className="box-logout">
                                  <TbLogout2 size={30}/>
                                  <p onClick={() => logout()} className="box-lout">
                                    ออกจากระบบ
                                </p>
                              </div>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <Link href="/login">
                    <button className="login-button">
                        <FaRegUser />
                         <span>เข้าสู่ระบบ</span>
                    </button>
                </Link>
            )}
        </div>

    </div>
</nav>

{opens && (
    <div className="mobile-menu">
       <div className="m-logo">
          <div className="m-button">
            <button
              onClick={() => setOpens(!opens)}
            >
                <CiMenuBurger size={20}/>
            </button>
            </div>
          <div className="m-text">
              <PiBowlFoodDuotone />
            <Link href={'/u'} onClick={() => setOpens(false)}>
                ก๋วยเตี๋ยวยายต๋วยย
            </Link>
        </div>
      </div>
        <hr />
        {tabs.map((tab) => (
            <Link
                key={tab.href}
                href={tab.href}
                className="nav-link"
                onClick={() => setOpens(false)}
            >
                <div className="flex items-center gap-[5px]">
                  {tab.icon}
                  <p>{tab.name}</p>
               </div>
            </Link>
        ))}
    </div>
)}
    {opens && (
      <div className="menu-overlay" onClick={() => setOpens(false)} />
    )}
      <main className="p-4">{children}</main>
    </div>
  );
}