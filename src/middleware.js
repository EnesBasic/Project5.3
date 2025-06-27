import { NextResponse } from "next/server";

export const config = {
  matcher: "/integrations/:path*",
};

export function middleware(request) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-createxyz-project-id", "d73ef97f-13a2-47d4-9592-4b9fb20fc12b");
  requestHeaders.set("x-createxyz-project-group-id", "9dc2142a-e4f4-49f0-8374-450caa4fee08");


  request.nextUrl.href = `https://www.create.xyz/${request.nextUrl.pathname}`;

  return NextResponse.rewrite(request.nextUrl, {
    request: {
      headers: requestHeaders,
    },
  });
}