"use server"

import { unstable_noStore as noStore, revalidatePath } from "next/cache"
import { CreateExchangeApiSchema, UpdateExchangeApiSchema } from "@/lib/validations/exchange";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { ExchangeApiInfo } from "@/app/(protected)/exchanges/page";
import { error } from "console";

async function exchangeApiVerify(exchangeName: string, apiKey: string, secretKey: string, passphrase?: string) {
  try {
    const response = await fetch(`https://tdb.mooncryp.to/api/exchange/verify?exchange=${exchangeName}&key=${apiKey}&secret=${secretKey}&passphrase=${passphrase}`, {
      // body: JSON.stringify({ data })
    })
    if (!response.ok) {
      throw new Error("OKX verrify fetch failed")
    }
    const data = await response.json()
    console.log("response data:", data)
    if (data['code']==="0") {
      return {
        "verified": true, 
        "data": data, 
        "balance": data['balance'], 
        "msg": "success"}
    } 

    return {"verified": false, "msg": data["msg"]}
  } catch (error) {
    console.error("API verify failed:", error);
    return {"verified": false, "msg": error};
  }
}

export async function createExchangeAPI(userId: string, input: CreateExchangeApiSchema) {
  // noStore()
  try {
    const session = await auth()
    
    if (!session?.user || session?.user.id !== userId) {
      throw new Error("Unauthorized");
    }

    // api verify
    const {verified, balance, msg} = await exchangeApiVerify(input.exchange, input.api, input.secret, input.passphrase);
    if (!verified) {
      // throw new Error("API invalid:");
      return {
        error: msg
      }
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
        balance: balance,
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
  noStore()
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
      select: { // 选择要返回的字段
        id: true, 
        userId: true, 
        accountName: true, 
        exchangeName: true, 
        apiKey: true, 
        enabled: true, 
        balance: true, 
      },
    })

    return exchangeAPIs
  } catch (err) {
    console.log(err)
    return []
  }
}

export async function updateExchangeAPI(input: UpdateExchangeApiSchema & { id: string }, exchangeName: string) {
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

    const oringinApi = await prisma.exchangeAccount.findUnique({
      where: {
        id: input.id
      },
      select: { // 选择要返回的字段
        apiKey: true, 
        secretKey: true, 
        passphrase: true, 
      },
    })
    // console.log("oringinApi:", oringinApi)
    // need verify api
    if ((input.api !== oringinApi?.apiKey) || (input.secret) || (input.passphrase)) {
      // console.log("new api data:", input.api, 
        // input.secret? input.secret:oringinApi?.secretKey!, input.passphrase? input.passphrase:oringinApi?.passphrase!)
      const {verified, msg} = await exchangeApiVerify(exchangeName, input.api, 
        input.secret? input.secret:oringinApi?.secretKey!, input.passphrase? input.passphrase:oringinApi?.passphrase!);
      if (!verified) {
        // throw new Error("API invalid:");
        return {
          error: msg
        }
      }
      await prisma.exchangeAccount
      .update({
        where: {
          id: input.id,
        },
        data: updateData,
      })
    } else {
      await prisma.exchangeAccount
      .update({
        where: {
          id: input.id,
        },
        data: updateData,
      })
    }

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
  const session = await auth()
    
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  
  try {
    // Delete  
    const result = await prisma.exchangeAccount.deleteMany({
      where: {
        id: {
          in: input.ids,
        }
      },
    })

    // TODO: 市价全平仓位
    
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

export async function toggleEnabledExchangeAPI(input: { ids: string[] }, status: boolean) {
  try {
    // disable  
    const result = await prisma.exchangeAccount.updateMany({
      where: {
        id: {
          in: input.ids,
        }
      },
      data: {
        enabled: !status
      },
    })
    
    if (status) {
      // TODO: 市价全平仓位
      
      // Delete  
      const deleteResult = await prisma.copyTradingAccount.deleteMany({
        where: {
          exchangeAccountId: {
            in: input.ids,
          }
        },
      })
    }

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
