import type { NextApiRequest, NextApiResponse } from "next";
import { generateNonce } from "siwe";
import { serialize } from 'cookie'; // Cookie oluşturmak için yardımcı

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Bu endpoint'in sadece POST isteklerini kabul ettiğinden emin olalım
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const nonce = generateNonce();

    // Cookie'yi bir string olarak serialize ediyoruz
    const cookie = serialize('siwe-nonce', nonce, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 5, // 5 dakika
      sameSite: 'lax',
      path: '/',
    });

    // Cookie'yi response header'ına ekliyoruz
    res.setHeader('Set-Cookie', cookie);
    
    // Nonce'ı JSON olarak client'a gönderiyoruz
    res.status(200).json({ nonce });

  } catch (error) {
    console.error("Nonce generation failed:", error);
    res.status(500).json({ message: "Failed to generate nonce." });
  }
}