import { NextRequest, NextResponse } from 'next/server';

// Cette API utilise les headers de géolocalisation de Vercel
// pour détecter automatiquement le pays de l'utilisateur
export async function GET(request: NextRequest) {
  // Vercel ajoute automatiquement ces headers
  const country = request.headers.get('x-vercel-ip-country') ||
                  request.geo?.country ||
                  '';

  const city = request.headers.get('x-vercel-ip-city') ||
               request.geo?.city ||
               '';

  const region = request.headers.get('x-vercel-ip-country-region') ||
                 request.geo?.region ||
                 '';

  return NextResponse.json({
    country,
    city,
    region,
  });
}
