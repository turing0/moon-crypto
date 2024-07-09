"use server"

import { unstable_noStore as noStore, revalidatePath } from "next/cache"
import { CreateExchangeApiSchema, UpdateExchangeApiSchema } from "@/lib/validations/exchange";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { ExchangeApiInfo } from "@/app/(protected)/exchanges/page";

export async function createExchangeAPI(userId: string, input: CreateExchangeApiSchema) {
  // noStore()
  try {
    const session = await auth()
    
    if (!session?.user || session?.user.id !== userId) {
      throw new Error("Unauthorized");
    }

    // creat 
    await prisma.exchangeAccount.create({
      data: {
        userId: userId,
        exchangeName: input.exchange,
        apiKey: input.api,
        secretKey: input.secret,
        passphrase: input.passphrase,
        description: input.description,
      },
    })

    revalidatePath("/exchanges")

    return {
      status: "success",
    }
  } catch (err) {
    console.log(err)
    return {
      data: null,
      error: (err),
    }
  }
}

export async function getExchangeAPI(userId: string): Promise<ExchangeApiInfo[]> {
  // noStore()
  try {
    const session = await auth()
    
    if (!session?.user || session?.user.id !== userId) {
      throw new Error("Unauthorized");
    }

    // Retrieve  
    const exchangeAPIs = await prisma.exchangeAccount.findMany({
      where: {
        userId: userId
      },
    })

    return exchangeAPIs
  } catch (err) {
    console.log(err)
    return []
  }
}

export async function updateExchangeAPI(input: UpdateExchangeApiSchema & { id: string }) {
  // noStore()
  try {
    const updateData: any = {
      apiKey: input.api,
      description: input.description,
    };

    if (input.secret) {
      updateData.secretKey = input.secret;
    }
    if (input.passphrase) {
      updateData.passphrase = input.passphrase;
    }

    await prisma.exchangeAccount
      .update({
        where: {
          id: input.id,
        },
        data: updateData,
      })

    revalidatePath("/exchanges")

    return {
      data: null,
      error: null,
    }
  } catch (err) {
    return {
      data: null,
      error: (err),
    }
  }
}

export async function deleteExchangeAPI(input: { ids: string[] }) {
  try {

    // Delete  
    const result = await prisma.exchangeAccount.deleteMany({
      where: {
        id: {
          in: input.ids,
        }
      },
    })
    
    revalidatePath("/exchanges")

    return {
      data: null,
      error: null,
    }
  } catch (err) {
    console.log(err)
    return {
      data: null,
      error: (err),
    }
  }
}
