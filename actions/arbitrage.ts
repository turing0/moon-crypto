"use server"

import { prisma } from "@/lib/db";
import { auth } from "@/auth";

const apiAuthorization = process.env.API_Authorization;

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

    // 校验
    const response = await fetch("https://api.mooncryp.to/arbitrage/validate", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Authorization': apiAuthorization!,
      },
      body: JSON.stringify({ ...data, ...input, symbol: symbol+'USDT' }),
    });
    // console.log('validate data:', { ...data, ...input, symbol: symbol+'USDT' })
    if (!response.ok) {
      const errorMessage = await response.text();
      console.error(`Failed to validate ArbitrageConfig: ${errorMessage}`);
      return {
        error: errorMessage
      }
    }
    const validatedData = await response.json();
    // console.log('validate result:', validatedData)
    if (validatedData?.validated) {
      // 创建
      const config = await prisma.arbitrageConfig.create({
        data: { ...data, ...input },
      });
      // revalidatePath("/arbitrage/manage")
      // await redisUpdate([copyTradingSettingId], undefined);
      return {
        status: "success",
        data: config
      }
    }

    return {
      // status: "success",
      error: validatedData?.error
    }
  } catch (err) {
    console.log("createArbitrageConfig error:", err)
    return {
      data: null,
      error: (err),
    }
  }
}

export async function getArbitrageConfig(userId: string) {
  // noStore()
  try {
    const session = await auth()
    if (!session?.user || session?.user.id !== userId) {
      throw new Error("Unauthorized");
    }

    const configs = await prisma.arbitrageConfig.findMany({
      where: {
        userId: userId
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return configs
  } catch (err) {
    console.log("getArbitrageConfig error:", err)
    return []
  }
}

export async function getFundingRate(symbol) {
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
        'Authorization': apiAuthorization!,
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

// TODO:
export async function marketClose(id: string) {
  // noStore()
  try {
    const session = await auth()
    
    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    // Send the POST request
    const response = await fetch(`https://api.mooncryp.to/arbitrage/${id}/market-close`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Authorization': apiAuthorization!,
      },
      body: JSON.stringify({
        uid: session?.user.id,
      }),
    });
    if (!response.ok) {
      const errorMessage = await response.text();
      console.error(`Failed to marketClose: ${errorMessage}`);
      return {
        data: null,
        error: errorMessage
      }
    }
    const responseData = await response.json();

    return responseData
  } catch (err) {
    console.log("marketClose error:", err)
    return {
      data: null,
      error: (err),
    }
  }
}

export async function limitClose(id: string) {
  // noStore()
  try {
    const session = await auth()
    
    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    // Send the POST request
    const response = await fetch(`https://api.mooncryp.to/arbitrage/${id}/limit-close`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Authorization': apiAuthorization!,
      },
      body: JSON.stringify({
        uid: session?.user.id,
      }),
    });
    if (!response.ok) {
      const errorMessage = await response.text();
      console.error(`Failed to limitClose: ${errorMessage}`);
      return {
        data: null,
        error: errorMessage
      }
    }
    const responseData = await response.json();

    return responseData
  } catch (err) {
    console.log("limitClose error:", err)
    return {
      data: null,
      error: (err),
    }
  }
}

export async function cancelArbitrage(id: string) {
  // noStore()
  try {
    const session = await auth()
    
    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    // Send the POST request
    // const response = await fetch(`https://api.mooncryp.to/arbitrage/${id}/cancel`, {
    const response = await fetch(`https://api.mooncryp.to/arbitrage/${id}/limit-close`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Authorization': apiAuthorization!,
      },
      body: JSON.stringify({
        uid: session?.user.id,
      }),
    });
    if (!response.ok) {
      const errorMessage = await response.text();
      console.error(`Failed to cancelArbitrage: ${errorMessage}`);
      return {
        error: errorMessage
      }
    }
    const responseData = await response.json();
    // console.log(responseData)
    if (responseData?.error) {
      return responseData
    }

    // await prisma.arbitrageConfig.update({
    //   where: {
    //     id: id,
    //   },
    //   data: {
    //     status: 'ended',
    //   },
    // });
    // revalidatePath('/arbitrage/manage');
    return responseData
  } catch (err) {
    console.log("cancelArbitrage error:", err)
    return {
      data: null,
      error: (err),
    }
  }
}

