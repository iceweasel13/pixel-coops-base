// src/types/iron-session.d.ts
import "iron-session";

declare module "iron-session" {
  interface IronSessionData {
    nonce?: string;
  }
}