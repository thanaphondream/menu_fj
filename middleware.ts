import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"

const secret = new TextEncoder().encode("DreamMenu001")

export async function middleware(request: NextRequest) {
    const token = request.cookies.get("token")?.value
    const { pathname } = request.nextUrl

    const protectedRoutes = ["/u/cart", "/order/checkout/addres", "/order"]

    const isProtected = protectedRoutes.some((route) =>
        pathname.startsWith(route)
    )
    if (isProtected && !token) {
        console.log("token0: ", token)
        return NextResponse.redirect(new URL("/login", request.url))
    }

    console.log("token: ", token)
    if (token) {
        try {
            await jwtVerify(token, secret)
        } catch (err) {
            console.log("token1: ", token)
            return NextResponse.redirect(new URL("/login", request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
  matcher: [
    "/u/cart", 
    "/u/cart/:path*", 
    "/u/payment", 
    "/u/payment/:path*", 
    "/order/checkout/addres/", 
    "/order/checkout/addres/:path*", 
    "/order/checkout/payment", 
    "/order/checkout/payment/:path*"
    ]
}