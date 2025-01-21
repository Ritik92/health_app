import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth.config'

// Best practice: Create a single PrismaClient instance and reuse it
const prisma = new PrismaClient();
export async function GET() {
    const session:any = await getServerSession(authOptions);
    // Get user session
    
    console.log("this is session",session)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
  try{
    const res=await prisma.order.findMany({
        where: {
            userId: session.user.id
          },
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
    return NextResponse.json({ res }, { status: 201 });
  }
  catch(error){
    console.log(error)
  }
}
export async function POST(req) {
  try {
    // Check authentication
    const session:any = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const body = await req.json();
    const { medicineId, quantity } = body;

    // Validate input
    if (!medicineId || !quantity || quantity < 1) {
      return NextResponse.json({ 
        error: 'Invalid input: medicineId and quantity > 0 are required' 
      }, { status: 400 });
    }

    // Verify medicine exists
    const medicine = await prisma.medicine.findUnique({
      where: { id: medicineId }
    });

    if (!medicine) {
      return NextResponse.json({ 
        error: 'Medicine not found' 
      }, { status: 404 });
    }

    // Create order
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        medicineId,
        quantity,
        status: 'PENDING' // Match the schema default "Pending"
      },
      include: {
        medicine: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json({ order }, { status: 201 });

  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ 
      error: 'Failed to create order',
      details: error.message 
    }, { status: 500 });
  } finally {
    // Clean up Prisma connection
    await prisma.$disconnect();
  }
}