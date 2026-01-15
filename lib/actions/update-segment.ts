"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

async function geocodeAddress(address: string) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY!;
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${apiKey}`
  );

  if (!response.ok) {
    throw new Error(`Geocoding failed with status ${response.status}`);
  }

  const data = await response.json();
  const firstResult = data.results?.[0];
  if (!firstResult?.geometry?.location) {
    throw new Error("No results found for that address");
  }

  const { lat, lng } = firstResult.geometry.location;
  return { lat, lng, formatted: firstResult.formatted_address ?? address };
}

export async function updateSegment(segmentId: string, formData: FormData) {
  const session = await auth();
  if (!session) {
    throw new Error("Not authenticated");
  }

  const name = formData.get("name")?.toString();
  const startAddress = formData.get("startAddress")?.toString();
  const endAddress = formData.get("endAddress")?.toString();
  const notes = formData.get("notes")?.toString();
  const startTimeStr = formData.get("startTime")?.toString();
  const endTimeStr = formData.get("endTime")?.toString();
  const imageUrl = formData.get("imageUrl")?.toString();

  if (!name || !startAddress || !endAddress) {
    throw new Error("Name, start address, and end address are required");
  }

  const segment = await prisma.segment.findFirst({
    where: { id: segmentId, trip: { userId: session.user?.id } },
    select: { id: true, tripId: true },
  });

  if (!segment) {
    throw new Error("Segment not found");
  }

  const [startGeo, endGeo] = await Promise.all([
    geocodeAddress(startAddress),
    geocodeAddress(endAddress),
  ]);

  await prisma.segment.update({
    where: { id: segment.id },
    data: {
      name,
      startTitle: startGeo.formatted,
      startLat: startGeo.lat,
      startLng: startGeo.lng,
      endTitle: endGeo.formatted,
      endLat: endGeo.lat,
      endLng: endGeo.lng,
      notes: notes || null,
      startTime: startTimeStr ? new Date(startTimeStr) : null,
      endTime: endTimeStr ? new Date(endTimeStr) : null,
      imageUrl: imageUrl || null,
    },
  });

  redirect(`/trips/${segment.tripId}`);
}
