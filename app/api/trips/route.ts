import { auth } from "@/auth";
import { getCountryFromCoordinates } from "@/lib/actions/geocode";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { calculateTotalDistance, stringToColor } from "@/lib/utils";
import type { GlobeTripData } from "@/lib/globe-types";

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return new NextResponse("Not authenticated", { status: 401 });
    }

    // Fetch all trips with segments and reservations
    const trips = await prisma.trip.findMany({
      where: {
        userId: session.user?.id,
      },
      include: {
        segments: {
          orderBy: { order: "asc" },
          include: {
            segmentType: true,
            reservations: {
              include: {
                reservationType: {
                  include: {
                    category: true,
                  },
                },
              },
              orderBy: { startTime: "asc" },
            },
          },
        },
      },
      orderBy: { startDate: "desc" },
    });

    // Transform trips into GlobeTripData format
    const globeTrips: GlobeTripData[] = await Promise.all(
      trips.map(async (trip) => {
        // Calculate total distance for this trip
        const totalDistance = calculateTotalDistance(trip.segments);

        // Get unique countries from all segment start and end points
        const countrySet = new Set<string>();
        
        // Use try-catch for each geocoding call to prevent one failure from breaking everything
        for (const seg of trip.segments) {
          try {
            const startResult = await getCountryFromCoordinates(seg.startLat, seg.startLng);
            countrySet.add(startResult.country);
          } catch (error) {
            console.error(`Error geocoding start location for segment ${seg.id}:`, error);
            countrySet.add("Unknown");
          }
          
          try {
            const endResult = await getCountryFromCoordinates(seg.endLat, seg.endLng);
            countrySet.add(endResult.country);
          } catch (error) {
            console.error(`Error geocoding end location for segment ${seg.id}:`, error);
            countrySet.add("Unknown");
          }
        }

        return {
          id: trip.id,
          title: trip.title,
          description: trip.description,
          imageUrl: trip.imageUrl,
          startDate: trip.startDate.toISOString(),
          endDate: trip.endDate.toISOString(),
          segments: trip.segments.map((seg) => ({
            id: seg.id,
            name: seg.name,
            startTitle: seg.startTitle,
            startLat: seg.startLat,
            startLng: seg.startLng,
            endTitle: seg.endTitle,
            endLat: seg.endLat,
            endLng: seg.endLng,
            startTime: seg.startTime?.toISOString() || null,
            endTime: seg.endTime?.toISOString() || null,
            notes: seg.notes,
            imageUrl: seg.imageUrl,
            segmentType: {
              name: seg.segmentType.name,
            },
            reservations: seg.reservations.map((res) => ({
              id: res.id,
              name: res.name,
              location: res.location,
              departureLocation: res.departureLocation,
              arrivalLocation: res.arrivalLocation,
              startTime: res.startTime?.toISOString() || null,
              endTime: res.endTime?.toISOString() || null,
              confirmationNumber: res.confirmationNumber,
              notes: res.notes,
              cost: res.cost,
              currency: res.currency,
              imageUrl: res.imageUrl,
              reservationType: {
                name: res.reservationType.name,
                category: {
                  name: res.reservationType.category.name,
                },
              },
            })),
          })),
          totalDistance,
          countries: Array.from(countrySet).filter(c => c !== "Unknown"),
          color: stringToColor(trip.id),
        };
      })
    );

    return NextResponse.json(globeTrips);
  } catch (err) {
    console.error("Error in /api/trips:", err);
    return NextResponse.json(
      { error: "Internal Server Error", details: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
