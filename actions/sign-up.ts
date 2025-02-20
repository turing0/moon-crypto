"use server";

import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { getUserByEmail } from "@/lib/user";
import { generateUserId } from "@/lib/utils";
import * as z from "zod";

export const signUp = async (values) => {
  console.log('values',values)
  const { email, name, password } = values;
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: "Email already in use!" };
  }

  await prisma.user.create({
    data: {
      id: generateUserId(email, 10, true),
      name,
      email,
      password: hashedPassword,
    },
  });

  // const verificationToken = await generateVerificationToken(email);
  // await sendVerificationEmail(verificationToken.email, verificationToken.token);

  // return { success: "Confirmation email sent!" };
  return { success: "Sign up successful." };
};