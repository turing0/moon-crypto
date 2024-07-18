"use server"

import { unstable_noStore as noStore, revalidatePath } from "next/cache"
import { CreateCopyTradingSchema, CreateExchangeApiSchema, UpdateExchangeApiSchema } from "@/lib/validations/exchange";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";


// export async function getCopyTradingSetting(userId: string): Promise<ExchangeApiInfo[]> {
export async function getCopyTradingSetting(userId: string) {
  noStore()
  try {
    // const session = await auth()
    
    // if (!session?.user || session?.user.id !== userId) {
    //   throw new Error("Unauthorized");
    // }

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
