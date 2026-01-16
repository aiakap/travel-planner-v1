"use server";

import { auth } from "@/auth";
import { prisma } from "../prisma";
import { redirect } from "next/navigation";
import { generateAndUploadImage } from "@/lib/image-generation";

export async function updateTrip(tripId: string, formData: FormData) {
  const session = await auth();
  if (!session || !session.user?.id) {
    throw new Error("Not authenticated.");
  }

  const title = formData.get("title")?.toString();
  const description = formData.get("description")?.toString();
  const imageUrl = formData.get("imageUrl")?.toString();
  const startDateStr = formData.get("startDate")?.toString();
  const endDateStr = formData.get("endDate")?.toString();

  if (!title || !description || !startDateStr || !endDateStr) {
    throw new Error("All fields are required.");
  }

  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);

  // Fetch existing trip to check for changes
  const existingTrip = await prisma.trip.findUnique({
    where: { id: tripId, userId: session.user.id },
    include: { segments: true },
  });

  if (!existingTrip) {
    throw new Error("Trip not found.");
  }

  // Check if name or description changed
  const nameOrDescChanged =
    title !== existingTrip.title || description !== existingTrip.description;

  // Prepare update data
  const updateData: any = {
    title,
    description,
    startDate,
    endDate,
  };

  // Handle image logic
  if (imageUrl && imageUrl !== existingTrip.imageUrl) {
    // User uploaded a new custom image
    updateData.imageUrl = imageUrl;
    updateData.imageIsCustom = true;
    updateData.imagePromptId = null;
  } else if (nameOrDescChanged && !existingTrip.imageIsCustom) {
    // Regenerate only if it's not a custom image
    try {
      const result = await generateAndUploadImage(
        {
          ...existingTrip,
          title,
          description,
          startDate,
          endDate,
          segments: existingTrip.segments,
        },
        "trip"
      );
      updateData.imageUrl = result.imageUrl;
      updateData.imagePromptId = result.promptId;
      updateData.imageIsCustom = false;
    } catch (error) {
      console.error("Image regeneration failed:", error);
      // Keep existing image
    }
  } else if (!imageUrl && !existingTrip.imageUrl) {
    // No image provided and none exists - could generate here if desired
    updateData.imageUrl = null;
  }

  await prisma.trip.update({
    where: { id: tripId, userId: session.user.id },
    data: updateData,
  });

  redirect(`/trips/${tripId}`);
}


