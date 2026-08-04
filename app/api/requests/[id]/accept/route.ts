import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: requestId } = await params;

    const bloodRequest = await db.bloodRequest.findUnique({
      where: { id: requestId },
      include: { requester: true },
    });

    if (!bloodRequest) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    if (bloodRequest.requesterId === user.id) {
      return NextResponse.json(
        { error: "You cannot accept your own blood request" },
        { status: 400 }
      );
    }

    // Upsert acceptance
    const acceptance = await db.requestAcceptance.upsert({
      where: {
        requestId_donorId: {
          requestId,
          donorId: user.id,
        },
      },
      update: { status: "ACCEPTED" },
      create: {
        requestId,
        donorId: user.id,
        status: "ACCEPTED",
      },
    });

    // Update blood request status to ARRANGED
    const updatedRequest = await db.bloodRequest.update({
      where: { id: requestId },
      data: { status: "ARRANGED" },
    });

    // Send notification to the requester
    await db.notification.create({
      data: {
        userId: bloodRequest.requesterId,
        requestId: bloodRequest.id,
        title: `🩸 Donor Found! Request Arranged`,
        message: `${user.name} (${user.bloodGroup}) has accepted your request for ${bloodRequest.patientName}. Contact donor at: ${user.phone || "Email: " + user.email}`,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Request marked as Arranged! Thank you for donating.",
      request: updatedRequest,
      acceptance,
    });
  } catch (error: any) {
    console.error("Accept request error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
