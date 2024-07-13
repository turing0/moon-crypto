"use server"

import { unstable_noStore as noStore, revalidatePath } from "next/cache"
import { CreateCopyTradingSchema, CreateExchangeApiSchema, UpdateExchangeApiSchema } from "@/lib/validations/exchange";
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
        accountName: input.accountName,
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
    // TODO 需删除注释
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
      accountName: input.accountName,
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


export async function createCopyTradingAPI(traderId: string, input: CreateCopyTradingSchema) {
  console.log("createCopyTradingAPI traderId", traderId)
  // noStore()
  try {
    const session = await auth()
    
    if (!session?.user || session?.user.id !== traderId) {
      throw new Error("Unauthorized");
    }
    
    const data: any = {
      userId: session?.user.id,
      // userId: "clyd0tn8l00006iyf02pppphd",
      traderId: traderId,
    };
    if (input.fixedAmount) {
      // data.fixedAmount = input.fixedAmount;
      data.fixedAmount = parseInt(input.fixedAmount, 10);
    }
    if (input.multiplierAmount) {
      // data.multiplierAmount = input.multiplierAmount;
      data.multiplierAmount = parseFloat(input.multiplierAmount);
    }

    // insert CopyTradingSetting
    await prisma.copyTradingSetting.create({
      data: data,
    })


    revalidatePath("/traders")

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
