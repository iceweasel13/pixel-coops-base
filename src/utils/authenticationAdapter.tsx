// src/utils/authenticationAdapter.tsx

import { createAuthenticationAdapter } from "@rainbow-me/rainbowkit";
import { SiweMessage } from "siwe";
import { signIn, signOut } from "next-auth/react";

export const authenticationAdapter = createAuthenticationAdapter({
  getNonce: async () => {
    const response = await fetch("/api/nonce");
    return await response.text();
  },

  createMessage: ({ nonce, address, chainId }) => {
    return new SiweMessage({
      domain: window.location.host,
      address,
      statement: "Sign in with Ethereum to the app.",
      uri: window.location.origin,
      version: "1",
      chainId,
      nonce,
    });
  },

  verify: async ({ message, signature }) => {
    const result = await signIn("credentials", {
      message: JSON.stringify(message),
      redirect: false,
      signature,
    });

    return result?.ok === true;
  },

  signOut: async () => {
    await signOut({ redirect: false });
  },
});