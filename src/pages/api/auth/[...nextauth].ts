// src/pages/api/auth/[...nextauth].ts
import NextAuth from "next-auth";
import { authConfig } from "../../../auth"; // auth.ts dosyanızın yolunu doğru belirttiğinizden emin olun

export default NextAuth(authConfig);