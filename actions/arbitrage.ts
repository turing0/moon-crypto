"use server"

import { prisma } from "@/lib/db";
import { auth } from "@/auth";


export async function createArbitrageConfig(symbol, initialFundingRate, input: any) {
  // noStore()
  try {
    const session = await auth()
    
    if (!session?.user) {
      throw new Error("Unauthorized");
    }
    
    const data: any = {
      userId: session?.user.id,
      symbol: symbol,
      initialFundingRate: initialFundingRate,
    };

    input.amount = parseFloat(input.amount);
    input.leverage = parseInt(input.leverage, 10);
    if (input.closeOnRate) {
      input.closeOnRate = parseFloat(input.closeOnRate);
    }
    console.log('input:', input)

    // 创建
    const config = await prisma.arbitrageConfig.create({
      data: { ...data, ...input },
    });

    
    // revalidatePath("/copy-trading")

    // await redisUpdate([copyTradingSettingId], undefined);

    return {
      status: "success",
    }
  } catch (err) {
    console.log("createArbitrageConfig error:", err)
    return {
      data: null,
      error: (err),
    }
  }
}