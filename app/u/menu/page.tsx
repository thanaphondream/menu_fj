'use client'

import { useEffect, useState, useRef  } from "react"
import Link from "next/link"
import { useOrderAll, MenuTop } from "@/app/context/Address-Order-PeymentContext"
import '../css/menu.css'

export interface MenuItem {
  id: number
  name: string
  description: string
  price: number
  image: string
}

interface ApiResponse {
  data: MenuItem[]
  total: number
  page: number
  hasMore: boolean
}

export default function MenuPage() {

  const loadingRef = useRef(false)

  const [menu, setMenu] = useState<MenuItem[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)

  const {ordertop, setLimit} = useOrderAll()
  const [ordermenu, setOrderMenu] = useState<MenuTop[] | null>()
  
  const [tab, setTab] = useState<"all" | "new" | "top">("all")

  const [newMenu, setNewMenu] = useState<MenuItem[]>([])

  const loadNewMenu = async () => {

      try {

          const res = await fetch(
              `https://menu-back-hemk.onrender.com/menuitem/menu?page=1&limit=6`
          )

          const data: ApiResponse = await res.json()

          setNewMenu(data.data)

      } catch (err) {
          console.log(err)
      }

  }

  useEffect(() => {
      loadNewMenu()
  }, [])
  
  useEffect(() => {
    setLimit(6)
  }, [])
  
  useEffect(() => {
    setOrderMenu(ordertop)
  }, [ordertop])

 const loadMenu = async () => {

    if (loadingRef.current || !hasMore) return

    loadingRef.current = true
    setLoading(true)

    try {

        const res = await fetch(
            `https://menu-back-hemk.onrender.com/menuitem/menu?page=${page}&limit=5`
        )

        const data: ApiResponse = await res.json()

        setMenu(prev => {
            const newItems = data.data.filter(
                item => !prev.some(old => old.id === item.id)
            )

            return [...prev, ...newItems]
        })

        setHasMore(data.hasMore)

    } finally {
        loadingRef.current = false
        setLoading(false)
    }
}

  useEffect(() => {
    loadMenu()
  }, [page])

  useEffect(() => {

    const handleScroll = () => {

      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 300
      ) {

        if (hasMore && !loading) {
          setPage(prev => prev + 1)
        }

      }

    }

    window.addEventListener("scroll", handleScroll)

    return () => window.removeEventListener("scroll", handleScroll)

  }, [hasMore, loading])

  return (
    <div className="menu-container">

      <div className="menu-tab">
        <button
          className={tab === "all" ? "active" : ""}
          onClick={() => setTab("all")}
        >
          อาหารทั้งหมด
        </button>

        <button
          className={tab === "new" ? "active" : ""}
          onClick={() => setTab("new")}
        >
          อาหารมาใหม่
        </button>

        <button
          className={tab === "top" ? "active" : ""}
          onClick={() => setTab("top")}
        >
          อาหารขายดี
        </button>
      </div>

      <div className="menu-grid">

        {tab === "all" &&
          menu.map(item => (
            <Link href={`/u/product/${item.id}`} key={item.id}>
              <div className="menu-card">
                <img src={item.image} alt={item.name} />

                <div className="menu-info">
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                  <strong>{item.price} บาท</strong>
                </div>
              </div>
            </Link>
          ))}

        {tab === "new" &&
          newMenu.map(item => (
            <Link href={`/u/product/${item.id}`} key={item.id}>
              <div className="menu-card">
                <img src={item.image} alt={item.name} />

                <div className="menu-info">
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                  <strong>{item.price} บาท</strong>
                </div>
              </div>
            </Link>
          ))}

        {tab === "top" &&
          ordermenu?.map(item => (
            <Link href={`/u/product/${item.id}`} key={item.id}>
              <div className="menu-card">
                <img src={item.image} alt={item.name} />

                <div className="menu-info">
                  <h3>{item.name}</h3>
                  <p>ขาย {item.totalSold} จาน</p>
                  <strong>{item.price} บาท</strong>
                </div>
              </div>
            </Link>
          ))}

      </div>

      {loading && <p className="loading">กำลังโหลด...</p>}

      {/* {!hasMore && <p className="loading">ไม่มีข้อมูลแล้ว</p>} */}

    </div>
  )
}