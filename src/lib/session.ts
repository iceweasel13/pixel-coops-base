// src/lib/session.ts

import type { IronSessionOptions } from "iron-session";

export const sessionOptions: IronSessionOptions = {
  password:
    process.env.SECRET_COOKIE_PASSWORD ||
    "complex_password_at_least_32_characters_long",
  cookieName: "siwe",
  /* cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  }, */
};
