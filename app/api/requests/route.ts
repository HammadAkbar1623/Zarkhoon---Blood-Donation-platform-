import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { calculateDistance, isCompatibleBloodGroup } from "@/lib/geo";

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      patientName,
      bloodGroup,
      unitsNeeded,
      hospitalName,
      address,
      latitude,
      longitude,
      contactNumber,
      urgency,
    } = body;

    if (!patientName || !bloodGroup || !hospitalName || !contactNumber || !latitude || !longitude) {
      return NextResponse.json(
        { error: "Patient name, blood group, hospital name, contact number, and location coordinates are required" },
        { status: 400 }
      );
    }

    const reqLat = parseFloat(latitude);
    const reqLng = parseFloat(longitude);

    // 1. Create the blood request
    const bloodRequest = await db.bloodRequest.create({
      data: {
        requesterId: user.id,
        patientName,
        bloodGroup,
        unitsNeeded: unitsNeeded ? parseInt(unitsNeeded) : 1,
        hospitalName,
        address: address || hospitalName,
        latitude: reqLat,
        longitude: reqLng,
        contactNumber,
        urgency: urgency === "NORMAL" ? "NORMAL" : "EMERGENCY",
        status: "PENDING",
      },
    });

    // 2. Find matching available donors
    const allUsers = await db.user.findMany({
      where: {
        id: { not: user.id }, // Don't notify requester
        isAvailable: true,
        latitude: { not: null },
        longitude: { not: null },
      },
    });

    const notificationsToCreate: {
      userId: string;
      requestId: string;
      title: string;
      message: string;
    }[] = [];

    for (const donor of allUsers) {
      if (donor.latitude !== null && donor.longitude !== null) {
        // Check blood compatibility
        if (isCompatibleBloodGroup(donor.bloodGroup, bloodGroup)) {
          // Check distance radius <= 50 km
          const dist = calculateDistance(reqLat, reqLng, donor.latitude, donor.longitude);
          if (dist <= 50) {
            notificationsToCreate.push({
              userId: donor.id,
              requestId: bloodRequest.id,
              title: `🚨 Urgent ${bloodGroup} Blood Needed (${dist.toFixed(1)} km away)`,
              message: `Emergency request for ${patientName} at ${hospitalName}. Contact: ${contactNumber}`,
            });
          }
        }
      }
    }

    // 3. Batch create notifications
    if (notificationsToCreate.length > 0) {
      await db.notification.createMany({
        data: notificationsToCreate,
      });
    }

    return NextResponse.json({
      success: true,
      request: bloodRequest,
      notifiedDonorsCount: notificationsToCreate.length,
    });
  } catch (error: any) {
    console.error("Create blood request error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const lat = searchParams.get("lat") ? parseFloat(searchParams.get("lat")!) : null;
    const lng = searchParams.get("lng") ? parseFloat(searchParams.get("lng")!) : null;
    const radius = searchParams.get("radius") ? parseFloat(searchParams.get("radius")!) : 50;

    const requests = await db.bloodRequest.findMany({
      where: {
        status: { in: ["PENDING", "ARRANGED"] },
      },
      include: {
        requester: {
          select: { name: true, phone: true, email: true },
        },
        acceptances: {
          include: {
            donor: {
              select: { name: true, phone: true, bloodGroup: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // If coordinates provided, annotate distance & filter by radius
    if (lat !== null && lng !== null) {
      const filtered = requests
        .map((r:any) => {
          const dist = calculateDistance(lat, lng, r.latitude, r.longitude);
          return { ...r, distanceKm: Math.round(dist * 10) / 10 };
        })
        .filter((r:any) => r.distanceKm <= radius);

      return NextResponse.json({ success: true, requests: filtered });
    }

    return NextResponse.json({ success: true, requests });
  } catch (error: any) {
    console.error("Fetch requests error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
