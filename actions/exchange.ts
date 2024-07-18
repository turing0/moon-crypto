"use server"

import { unstable_noStore as noStore, revalidatePath } from "next/cache"
import { CreateCopyTradingSchema, CreateExchangeApiSchema, UpdateExchangeApiSchema } from "@/lib/validations/exchange";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { ExchangeApiInfo } from "@/app/(protected)/exchanges/page";

async function exchangeApiVerify(exchangeName: string, apiKey: string, secretKey: string, passphrase?: string) {
  try {
    // 这里我们可以使用具体交易所的API SDK或HTTP请求来验证API密钥
    // 这个示例只是一个简单的模拟，你需要根据实际情况进行实现
    // 比如对于Binance：
    // const client = new BinanceClient(apiKey, secretKey);
    // const accountInfo = await client.getAccountInfo();
    // if (accountInfo) {
    //   return true;
    // }

    // 模拟验证成功
    return true;
  } catch (error) {
    console.error("API verify failed:", error);
    return false;
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
    const isApiValid = await exchangeApiVerify(input.exchange, input.api, input.secret, input.passphrase);
    if (!isApiValid) {
      throw new Error("API invalid");
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
        // description: true, 
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

    const isApiValid = await exchangeApiVerify(exchangeName, input.api, input.secret, input.passphrase);
    if (!isApiValid) {
      throw new Error("API invalid");
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

export async function createCopyTradingAPI(traderId: string, traderName:string, input: CreateCopyTradingSchema) {
  console.log("createCopyTradingAPI traderId", traderId)
  // noStore()
  try {
    const session = await auth()
    
    if (!session?.user) {
      throw new Error("Unauthorized");
    }
    
    const data: any = {
      userId: session?.user.id,
      // userId: "clyd0tn8l00006iyf02pppphd",
      traderName: traderName,
      traderId: traderId,
    };
    if (input.fixedAmount) {
      // data.fixedAmount = input.fixedAmount;
      data.fixedAmount = parseInt(input.fixedAmount, 10);
    }
    if (input.multiplierAmount) {
      data.multiplierAmount = parseFloat(input.multiplierAmount);
    }

    // insert CopyTradingSetting
    // const copyTradingSetting = await prisma.copyTradingSetting.create({
    //   data: data,
    // })
    // const copyTradingAccountCreations = input.apis.map(apiId => {
    //   return prisma.copyTradingAccount.create({
    //     data: {
    //       copyTradingSettingId: copyTradingSetting.id,
    //       exchangeAccountId: apiId
    //     }
    //   });
    // });
    // await Promise.all(copyTradingAccountCreations);

    // 使用 prisma.$transaction 来确保所有操作都在一个事务中执行
    await prisma.$transaction(async (prisma) => {
      // 创建 CopyTradingSetting
      const copyTradingSetting = await prisma.copyTradingSetting.create({
        data: data,
      });
  
      // 为每个 apiId 创建 CopyTradingAccount
      const copyTradingAccountCreations = input.apis.map(apiId => {
        return prisma.copyTradingAccount.create({
          data: {
            copyTradingSettingId: copyTradingSetting.id,
            exchangeAccountId: apiId
          }
        });
      });
  
      // 使用 Promise.all 来同时执行所有创建操作
      await Promise.all(copyTradingAccountCreations);
    });
    
    revalidatePath("/traders")

    return {
      status: "success",
    }
  } catch (err) {
    console.log("createCopyTradingAPI error:", err)
    return {
      data: null,
      error: (err),
    }
  }
}
