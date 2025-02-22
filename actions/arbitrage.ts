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
    // console.log('input:', input)

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


export async function getBinanceRate(symbol) {
  // noStore()
  try {
    const session = await auth()
    
    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    // Send the POST request
    const response = await fetch("https://api.mooncryp.to/funding-rate", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Authorization': 'Hv0bcc6HZCR0wEm7Hj+mik6JJTfhqNJrugjIQx9jcsdVxkvRZvigrft4Xfs',
      },
      body: JSON.stringify({
        uid: session?.user.id,
        symbol: symbol+'USDT'
      }),
    });
    if (!response.ok) {
      const errorMessage = await response.text();
      console.error(`Failed to getBinanceRate: ${errorMessage}`);
      return {
        fundingRate: null,
        error: errorMessage
      }
    }
    const responseData = await response.json();

    return {
      fundingRate: responseData,
      status: "success",
    }
  } catch (err) {
    console.log("getBinanceRate error:", err)
    return {
      fundingRate: null,
      error: (err),
    }
  }
}

