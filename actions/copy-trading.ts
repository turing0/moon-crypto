"use server"

import { unstable_noStore as noStore, revalidatePath } from "next/cache"
import { CreateCopyTradingSchema, UpdateCopyTradingSchema } from "@/lib/validations/exchange";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { redisDelete, redisUpdate } from "./redis-sync";

export async function createCopyTradingAPI(traderId: string, traderName: string, avatarUrl: string, input: CreateCopyTradingSchema) {
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
      avatarUrl: avatarUrl,
    };
    if (input.fixedAmount && input.multiplierAmount) {
      return {
        data: null,
        error: "FixedAmount and MultiplierAmount can not both have values",
      }
    }

    if (input.fixedAmount) {
      // data.fixedAmount = input.fixedAmount;
      data.fixedAmount = parseInt(input.fixedAmount, 10);
    }
    if (input.multiplierAmount) {
      data.multiplierAmount = parseFloat(input.multiplierAmount);
    }
    if (input.takeProfit) {
      data.takeProfit = parseInt(input.takeProfit);
    }
    if (input.stopLoss) {
      data.stopLoss = parseInt(input.stopLoss);
    }

    let copyTradingSettingId;

    // 使用 prisma.$transaction 来确保所有操作都在一个事务中执行
    await prisma.$transaction(async (prisma) => {
      // 创建 CopyTradingSetting
      const copyTradingSetting = await prisma.copyTradingSetting.create({
        data: data,
      });

      copyTradingSettingId = copyTradingSetting.id;

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
    
    revalidatePath("/copy-trading")

    await redisUpdate([copyTradingSettingId], undefined);

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
export async function getCopyTradingSetting(userId: string, status: string = 'active') {
  noStore()
  try {
    const session = await auth()
    
    if (!session?.user || session?.user.id !== userId) {
      throw new Error("Unauthorized");
    }

    // Retrieve  
    const exchangeAPIs = await prisma.copyTradingSetting.findMany({
      where: {
        userId: userId,
        status: status
      },
      select: { // 选择要返回的字段
        id: true, 
        userId: true, 
        traderName: true, 
        traderId: true, 
        avatarUrl: true, 
        fixedAmount: true, 
        multiplierAmount: true, 
        takeProfit: true, 
        stopLoss: true, 
        createdAt: true, 
        endDate: true, 
        status: true, 
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

export async function updateCopyTradingSetting(input: UpdateCopyTradingSchema & { id: string }) {
  // noStore()
  try {
    const updateData: any = {
      fixedAmount: null,
      multiplierAmount: null,
      takeProfit: input.takeProfit ? parseInt(input.takeProfit, 10): null,
      stopLoss: input.stopLoss ? parseInt(input.stopLoss, 10): null,
    };

    if (input.fixedAmount && input.multiplierAmount) {
      return {
        data: null,
        error: "FixedAmount and MultiplierAmount can not both have values",
      }
    }

    if (input.fixedAmount) {
      updateData.fixedAmount = parseInt(input.fixedAmount, 10);
    }
    if (input.multiplierAmount) {
      updateData.multiplierAmount = parseFloat(input.multiplierAmount);
    }
    // if (input.takeProfit) {
    //   updateData.takeProfit = parseInt(input.takeProfit, 10);
    // }
    // if (input.stopLoss) {
    //   updateData.stopLoss = parseInt(input.stopLoss, 10);
    // }
    
    await prisma.copyTradingSetting
    .update({
      where: {
        id: input.id,
      },
      data: updateData,
    })

    revalidatePath("/copy-trading/manage")

    // Call the function to fetch Redis update
    await redisUpdate([input.id], undefined);
    
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

export async function stopCopyTradingSetting(input: { ids: string[] }) {
  try {
    await prisma.copyTradingSetting
    .update({
      where: {
        id: input.ids[0],
      },
      data: {
        endDate: new Date().toISOString(),
        status: "ended"
      },
    })

    revalidatePath("/copy-trading/manage")

    // Call the function to fetch Redis update
    await redisUpdate([input.ids[0]], undefined);
    
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

export async function deleteCopyTradingSetting(input: { ids: string[] }) {
  const session = await auth()
    
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  
  try {
    // Delete  
    const result = await prisma.copyTradingSetting.deleteMany({
      where: {
        id: {
          in: input.ids,
        }
      },
    })
    
    // TODO: 市价全平仓位

    revalidatePath("/copy-trading/manage")

    await redisDelete(input.ids[0]);

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
