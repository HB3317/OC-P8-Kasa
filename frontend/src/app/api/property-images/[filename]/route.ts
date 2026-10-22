import { NextRequest, NextResponse } from 'next/server';
import { API_URL } from '@/config/api';
export async function GET(_request: NextRequest,{params}:{params:Promise<{filename:string}>}) {
  const {filename}=await params;
  if(!/^[0-9]{13}-[0-9a-f]{8}\.(jpg|png|webp)$/i.test(filename)) return new NextResponse(null,{status:404});
  try {
    const response=await fetch(`${API_URL}/uploads/${filename}`,{cache:'no-store'});
    if(!response.ok) return new NextResponse(null,{status:404});
    return new NextResponse(response.body,{headers:{'Content-Type':response.headers.get('content-type')||'application/octet-stream','Cache-Control':'public, max-age=3600'}});
  } catch {return new NextResponse(null,{status:502});}
}
