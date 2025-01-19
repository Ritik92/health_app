import { NextResponse } from "next/server";
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Fetch all doctors (already provided)
export async function GET() {
  const doctors = await prisma.doctor.findMany({});
  console.log(doctors);
  return NextResponse.json(doctors);
}

// Fetch all appointments for a specific doctor
export async function POST(req) {
  try {
    const body = await req.json(); // Parse the JSON body
    const { doctorId } = body; // Extract doctorId from the request body

    // Validate input
    if (!doctorId) {
      return NextResponse.json(
        { error: "Doctor ID is required" },
        { status: 400 }
      );
    }

    // Fetch appointments for the specified doctor
    const appointments = await prisma.appointment.findMany({
      where: { doctorId },
      include: {
        user: {
          select: { name: true, email: true }, // Include user details if needed
        },
      },
    });

    return NextResponse.json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return NextResponse.json(
      { error: "Something went wrong while fetching appointments" },
      { status: 500 }
    );
  }
}
