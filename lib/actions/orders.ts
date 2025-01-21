// app/actions/orders.ts
'use server'

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

export type OrderWithDetails = {
  id: string
  quantity: number
  status: string
  createdAt: Date
  user: {
    id: string
    name: string | null
    email: string
    phone: string | null
  }
  medicine: {
    id: string
    name: string
    price: number
  }
}

export async function getOrders(): Promise<OrderWithDetails[]> {
  return prisma.order.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
      medicine: {
        select: {
          id: true,
          name: true,
          price: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
}

export async function updateStatus(orderId: string, status: string) {
  return prisma.order.update({
    where: { id: orderId },
    data: { status },
  })
}