import { auth } from "@/auth";
import { getCountryFromCoordinates } from "@/lib/actions/geocode";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return new NextResponse("Not authenticated", { status: 401 });
    }

    const segments = await prisma.segment.findMany({
      where: {
        trip: {
          userId: session.user?.id,
        },
      },
      select: {
        startTitle: true,
        startLat: true,
        startLng: true,
        trip: {
          select: {
            title: true,
          },
        },
      },
    });

    const transformedLocations = await Promise.all(
      segments.map(async (seg) => {
        const geocodeResult = await getCountryFromCoordinates(
          seg.startLat,
          seg.startLng
        );

        return {
          name: `${seg.trip.title} - ${seg.startTitle}`,
          lat: seg.startLat,
          lng: seg.startLng,
          country: geocodeResult.country,
        };
      })
    );

    return NextResponse.json(transformedLocations);
  } catch (err) {
    console.log(err);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
