import { prisma } from '@/lib/db'
import type { NextApiRequest, NextApiResponse } from 'next'
import { NextRequest, NextResponse } from 'next/server'
 
type ResponseData = {
  message: string
}
 
export async function GET(){
  const data = {
    name: 'Bishal Shrestha',
    age: '27'
  }

  return NextResponse.json({data})
}

export async function POST(req: NextRequest, res: NextResponse){
  // const data = await req.json()
  // console.log(data)
  // return NextResponse.json(data)
  
  try {
    const body = await req.json(); // 假设请求的 body 包含 userId
    const userId = body.userId; // 从请求体中获取 userId
    if (!userId) {
      return NextResponse.json([])
    }
    // 使用 Prisma 从数据库获取特定用户的数据
    const userApiData = await prisma.exchangeAccount.findMany({
      where: {
        userId: userId,
      },
      select: { // 选择要返回的字段
        accountName: true, 
        exchangeName: true, 
      },
    });
    if (userApiData) {
      return NextResponse.json(userApiData)
      // res.status(200).json(userApiData);
    } else {
      return NextResponse.json({ message: 'UserId not found' })
      // res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Failed to fetch user data:', error);
    return NextResponse.json({ message: 'Failed to fetch user data' })
    // res.status(500).json({ message: 'Failed to fetch user data' });
  }
}
