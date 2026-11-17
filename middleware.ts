import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname === '/_next/image') {
    const imageUrl = req.nextUrl.searchParams.get('url');
    // eslint-disable-next-line no-console
    console.log({ message: `Image requested: ${imageUrl}`, req });
  }
  return NextResponse.next();
}

export const config = {
  matcher: '/_next/image'
};
