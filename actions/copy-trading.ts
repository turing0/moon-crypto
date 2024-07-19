"use server"

import { unstable_noStore as noStore, revalidatePath } from "next/cache"
import { CreateCopyTradingSchema, CreateExchangeApiSchema, UpdateExchangeApiSchema } from "@/lib/validations/exchange";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

export async function createCopyTradingAPI(traderId: string, traderName:string, input: CreateCopyTradingSchema) {
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

// export async function getCopyTradingSetting(userId: string): Promise<ExchangeApiInfo[]> {
export async function getCopyTradingSetting(userId: string) {
  noStore()
  try {
    const session = await auth()
    
    if (!session?.user || session?.user.id !== userId) {
      throw new Error("Unauthorized");
    }

    // Retrieve  
    const exchangeAPIs = await prisma.copyTradingSetting.findMany({
      where: {
        userId: userId
      },
      select: { // 选择要返回的字段
        id: true, 
        userId: true, 
        traderName: true, 
        traderId: true, 
        fixedAmount: true, 
        multiplierAmount: true, 
        followedApis: {select: {
          copyTradingSettingId: true,   // Replace with the actual field names you need
          exchangeAccountId: true,
          copyTradingSetting: true,
          exchangeAccount: true,
        }, }
      },
    })

    return exchangeAPIs
  } catch (err) {
    console.log(err)
    return []
  }
}
