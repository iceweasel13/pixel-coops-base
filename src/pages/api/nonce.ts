import type { NextApiRequest, NextApiResponse } from "next";
import { generateNonce } from "siwe";
import { serialize } from 'cookie'; // Helper to create cookies

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Ensure this endpoint accepts only POST requests
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

    // Add the cookie to the response header
    res.setHeader('Set-Cookie', cookie);
    
    // Send the nonce to the client as JSON
    res.status(200).json({ nonce });

  } catch (error) {
    console.error("Nonce generation failed:", error);
    res.status(500).json({ message: "Failed to generate nonce." });
  }
}
