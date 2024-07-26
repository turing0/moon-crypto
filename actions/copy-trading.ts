"use server"

import { unstable_noStore as noStore, revalidatePath } from "next/cache"
import { CreateCopyTradingSchema, UpdateCopyTradingSchema } from "@/lib/validations/exchange";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

async function redisUpdate(settingIds) {
  const response = await fetch(`https://tdb.mooncryp.to/api/redis/update`, { 
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ settingIds: settingIds }),
   });
  if (!response.ok) {
    throw new Error(`Redis update, failed to fetch data: ${response.statusText}`);
  }
  const responseData = await response.json(); // Assuming response is JSON
  console.log('Redis update, response:', responseData); // Print response data
  return responseData;
}
async function redisDelete(settingId) {
  console.log('delete:', settingId)
  const apiUrl = `https://tdb.mooncryp.to/api/redis/delete?settingId=${settingId}`;
  const response = await fetch(apiUrl, { method: 'GET' });
  if (!response.ok) {
    throw new Error(`Redis delete, failed to fetch data: ${response.statusText}`);
  }
  const responseData = await response.json(); // Assuming response is JSON
  console.log('Redis delete, response:', responseData); // Print response data
  return responseData;
}

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
    
    revalidatePath("/traders")

    await redisUpdate([copyTradingSettingId]);

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

export async function updateCopyTradingSetting(input: UpdateCopyTradingSchema & { id: string }) {
  // noStore()
  try {
    const updateData: any = {
      fixedAmount: null,
      multiplierAmount: null,
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
    
    await prisma.copyTradingSetting
    .update({
      where: {
        id: input.id,
      },
      data: updateData,
    })

    revalidatePath("/copy-trading/manage")

    // Call the function to fetch Redis update
    await redisUpdate([input.id]);
    
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
