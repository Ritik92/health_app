import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const body = await req.json();
    const { doctorId, date, userId, type } = body;
    
    // Input validation
    if (!doctorId || !date || !userId || !type) {
      return NextResponse.json(
        { 
          error: "Missing required fields",
          details: "Doctor ID, user ID, date, and appointment type are required." 
        },
        { status: 400 }
      );
    }

    // Validate appointment type
    const validTypes = ["Video Call", "Chat", "In-Person"];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { 
          error: "Invalid appointment type",
          details: "Type must be one of: Video Call, Chat, In-Person"
        },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Check if doctor exists
    const doctor = await prisma.doctor.findUnique({
      where: { id: doctorId }
    });

    if (!doctor) {
      return NextResponse.json(
        { error: "Doctor not found" },
        { status: 404 }
      );
    }

    // Create the appointment
    const appointment = await prisma.appointment.create({
      data: {
        userId,
        doctorId,
        date: new Date(date),
        type,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true
          }
        },
        doctor: {
          select: {
            name: true,
            specialty: true,
            email: true,
            phone: true
          }
        }
      }
    });

    return NextResponse.json(
      {
        message: "Appointment booked successfully.",
        appointment
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error creating appointment:', error);
    
    // Handle specific Prisma errors
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: "A scheduling conflict exists for this time slot." },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to create appointment." },
      { status: 500 }
    );
  }
}