"use server";

import { prisma } from "@/lib/prisma";
import { queueImageGeneration } from "@/lib/image-queue";

/**
 * Helper to build and queue image generation for a trip
 * Note: Should only be called from authenticated server actions
 */
export async function queueTripImageGeneration(tripId: string, specificPromptId?: string) {
  // Get trip data (no auth check needed - called from authenticated actions)
  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    include: { segments: true },
  });

  if (!trip) {
    throw new Error("Trip not found");
  }

  // Select prompt
  const { buildContextualPrompt, selectBestPromptForTrip } = await import("@/lib/image-generation");
  const prompt = await selectBestPromptForTrip(trip, specificPromptId);
  const fullPrompt = buildContextualPrompt(prompt, trip, "trip");

  // Queue the generation
  return await queueImageGeneration("trip", tripId, fullPrompt, prompt.id);
}

/**
 * Helper to build and queue image generation for a segment
 * Note: Should only be called from authenticated server actions
 */
export async function queueSegmentImageGeneration(segmentId: string) {
  // Get segment data (no auth check needed - called from authenticated actions)
  const segment = await prisma.segment.findFirst({
    where: {
      id: segmentId,
    },
    include: {
      trip: true,
      segmentType: true,
    },
  });

  if (!segment) {
    throw new Error("Segment not found");
  }

  // Select prompt and build full prompt
  const { buildContextualPrompt, selectBestPromptForSegment } = await import("@/lib/image-generation");
  const prompt = await selectBestPromptForSegment(segment);
  const fullPrompt = buildContextualPrompt(prompt, segment, "segment");

  // Queue the generation
  return await queueImageGeneration("segment", segmentId, fullPrompt, prompt.id);
}

/**
 * Helper to build and queue image generation for a reservation
 * Note: Should only be called from authenticated server actions
 */
export async function queueReservationImageGeneration(reservationId: string) {
  // Get reservation data (no auth check needed - called from authenticated actions)
  const reservation = await prisma.reservation.findFirst({
    where: {
      id: reservationId,
    },
    include: {
      segment: { include: { trip: true } },
      reservationType: true,
    },
  });

  if (!reservation) {
    throw new Error("Reservation not found");
  }

  // Select prompt and build full prompt
  const { buildContextualPrompt, selectBestPromptForReservation } = await import("@/lib/image-generation");
  const prompt = await selectBestPromptForReservation(reservation);
  const fullPrompt = buildContextualPrompt(prompt, reservation, "reservation");

  // Queue the generation
  return await queueImageGeneration("reservation", reservationId, fullPrompt, prompt.id);
}
