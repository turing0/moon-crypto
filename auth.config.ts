import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs";
import { env } from "@/env.mjs";
import { sendVerificationRequest } from "@/lib/email";
import { getUserByEmail } from "./lib/user";

export default {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        // console.log('credentials', credentials)
        const email = credentials?.email as string;
        const password = credentials?.password as string;

        const existingUser = await getUserByEmail(email);
        // console.log('existingUser', existingUser)
        if (!existingUser || !existingUser.email || !existingUser.password) {
          throw new Error("Invalid email or password")
          // return null
        }

        // Prevent unverified email sign in
        // if (!existingUser?.emailVerified) {
        //   return null;
        // }

        const passwordMatch = await bcrypt.compare(password, existingUser.password);
        
        if (!passwordMatch) {
          throw new Error("Invalid email or password")
          // return null; // 验证失败，返回 null
        }

        return existingUser;
      }
    }),
    Google({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    Resend({
      apiKey: env.RESEND_API_KEY,
      from: env.EMAIL_FROM,
      // sendVerificationRequest,
    }),
  ],
} satisfies NextAuthConfig;
