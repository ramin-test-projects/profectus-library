import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  const pathName = request.nextUrl.pathname;

  const isApiCall = /^\/api\//gi.test(pathName);
  const proxyDomain = process.env.NEXTJS_PUBLIC_PROXY_DOMAIN;

  if (isApiCall && !!proxyDomain) {
    const hostname = proxyDomain || request.nextUrl.hostname;

    requestHeaders.set("host", process.env.NEXTJS_PUBLIC_PROXY_AS_DOMAIN || hostname);

    const url = request.nextUrl.clone();

    url.protocol = process.env.NEXTJS_PUBLIC_PROXY_PROTOCOL || "https";
    url.hostname = hostname;
    url.port = process.env.NEXTJS_PUBLIC_PROXY_PORT || "443";
    url.pathname = url.pathname;

    return NextResponse.rewrite(url, {
      headers: requestHeaders,
    });
  } else {
    requestHeaders.set("x-current-path", pathName);
    return NextResponse.next({ headers: requestHeaders });
  }
}

export const config = {
  matcher: ["/:path*"],
};
