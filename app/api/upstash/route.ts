import { getRedisArray } from '@/actions/redisKey'
import type { NextApiRequest, NextApiResponse } from 'next'
import { NextRequest, NextResponse } from 'next/server'
 
type ResponseData = {
  message: string
}
 
export async function GET(){
  const whitelistIPs = await getRedisArray(`exchange_whitelistIPs`)

  const data = {
    code: '0',
    data: whitelistIPs,
  }

  return NextResponse.json({data})
}
