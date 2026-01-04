import authConfig from "@/auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { type DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import Resend from "next-auth/providers/resend";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { env } from "@/env.mjs";
import { createUserWithCustomId, getUserById, getUserByEmail } from "@/lib/user";
import { UserRole } from "./prisma/generated/prisma/enums";

// More info: https://authjs.dev/getting-started/typescript#module-augmentation
declare module "next-auth" {
  interface Session {
    user: {
      role: UserRole;
    } & DefaultSession["user"];
  }
}

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  adapter: {
    ...PrismaAdapter(prisma as any),
    createUser: async (data) => {
      const user = await createUserWithCustomId(data);
      return user as any;
    },
  },
  ...authConfig,
  providers: [
    ...authConfig.providers,
    Resend({
      apiKey: env.RESEND_API_KEY,
      from: env.EMAIL_FROM,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const email = credentials?.email as string;
        const password = credentials?.password as string;

        const existingUser = await getUserByEmail(email);
        if (!existingUser || !existingUser.email || !existingUser.password) {
          throw new Error("Invalid email or password")
        }

        const passwordMatch = await bcrypt.compare(password, existingUser.password);

        if (!passwordMatch) {
          throw new Error("Invalid email or password")
        }

        return existingUser;
      }
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      if (session.user) {
        if (token.sub) {
          session.user.id = token.sub;
        }

        if (token.email) {
          session.user.email = token.email;
        }

        if (token.role) {
          session.user.role = token.role;
        }

        session.user.name = token.name;
        session.user.image = token.picture;
      }

      return session;
    },

    async jwt({ token }) {
      if (!token.sub) return token;

      const dbUser = await getUserById(token.sub);

      if (!dbUser) return token;

      token.name = dbUser.name;
      token.email = dbUser.email;
      token.picture = dbUser.image;
      token.role = dbUser.role;

      return token;
    },

    // async signIn({ user, account, profile, email, credentials }) {
    //   // if (user && account && profile) {
    //   //   const ip = await captureIp(req); // Capture IP address

    //   //   // Create a new login log record
    //   //   await prisma.loginLog.create({
    //   //     data: {
    //   //       userId: user.id,
    //   //       ipAddress: ip,
    //   //     },
    //   //   });
    //   // }
    //   if (user && account && profile) {
    //     const ip = (headers().get('x-forwarded-for') || '').split(',')[0] || 'Unknown';
    //     const userAgent = headers().get('user-agent') || 'Unknown';

    //     await prisma.loginLog.create({
    //       data: {
    //         userId: user.id!,
    //         ip: ip,
    //         userAgent: userAgent,
    //       },
    //     });
    //   }

    //   return true;
    // },
  },
});
