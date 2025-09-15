// src/pages/api/nonce.ts

import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import { generateNonce } from "siwe";
import { sessionOptions } from "@/lib/session"; // Make sure you have this file from the previous step

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  if (method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${method} Not Allowed`);
  }

  try {
    const nonce = generateNonce();
    req.session.nonce = nonce;
    await req.session.save();
    res.setHeader("Content-Type", "text/plain");
    res.send(req.session.nonce);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export default withIronSessionApiRoute(handler, sessionOptions);