"use client";

import {
  Reservation,
  ReservationCategory,
  ReservationType,
  ReservationStatus,
} from "@/app/generated/prisma";
import { createReservation } from "@/lib/actions/create-reservation";
import { updateReservation } from "@/lib/actions/update-reservation";
import { UploadButton } from "@/lib/upload-thing";
import { formatForDateTimeLocal } from "@/lib/utils";
import Image from "next/image";
import { useState, useTransition, useEffect } from "react";
import { Button } from "./ui/button";

type ReservationWithRelations = Reservation & {
  reservationType: ReservationType & { category: ReservationCategory };
  reservationStatus: ReservationStatus;
};

interface ReservationFormProps {
  segmentId: string;
  reservation?: ReservationWithRelations;
  categories: (ReservationCategory & { types: ReservationType[] })[];
  statuses: ReservationStatus[];
}

export default function ReservationForm({
  segmentId,
  reservation,
  categories,
  statuses,
}: ReservationFormProps) {
  const [isPending, startTransition] = useTransition();
  const [imageUrl, setImageUrl] = useState<string | null>(
    reservation?.imageUrl ?? null
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(
    reservation?.reservationType.categoryId ?? categories[0]?.id ?? ""
  );
  const [selectedTypeId, setSelectedTypeId] = useState<string>(
    reservation?.reservationTypeId ?? ""
  );
  const [selectedStatusId, setSelectedStatusId] = useState<string>(
    reservation?.reservationStatusId ?? statuses[0]?.id ?? ""
  );

  // Filter types based on selected category
  const availableTypes =
    categories.find((cat) => cat.id === selectedCategoryId)?.types ?? [];

  // Auto-select first type when category changes
  useEffect(() => {
    if (availableTypes.length > 0 && !reservation) {
      setSelectedTypeId(availableTypes[0].id);
    }
  }, [selectedCategoryId, availableTypes, reservation]);

  const startTimeValue = reservation?.startTime
    ? formatForDateTimeLocal(new Date(reservation.startTime))
    : "";
  const endTimeValue = reservation?.endTime
    ? formatForDateTimeLocal(new Date(reservation.endTime))
    : "";

  const isEditMode = !!reservation;

  return (
    <form
      className="space-y-6"
      action={(formData: FormData) => {
        startTransition(() => {
          if (imageUrl) {
            formData.set("imageUrl", imageUrl);
          }
          if (isEditMode) {
            formData.set("reservationId", reservation.id);
            updateReservation(formData);
          } else {
            formData.set("segmentId", segmentId);
            createReservation(formData);
          }
        });
      }}
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Reservation Name
        </label>
        <input
          name="name"
          type="text"
          required
          defaultValue={reservation?.name}
          placeholder="e.g., United Airlines Flight, Marriott Hotel"
          className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(e.target.value)}
            className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type
          </label>
          <select
            name="reservationTypeId"
            required
            value={selectedTypeId}
            onChange={(e) => setSelectedTypeId(e.target.value)}
            className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {availableTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Status
        </label>
        <select
          name="reservationStatusId"
          required
          value={selectedStatusId}
          onChange={(e) => setSelectedStatusId(e.target.value)}
          className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {statuses.map((status) => (
            <option key={status.id} value={status.id}>
              {status.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Confirmation Number (optional)
        </label>
        <input
          name="confirmationNumber"
          type="text"
          defaultValue={reservation?.confirmationNumber ?? ""}
          placeholder="e.g., ABC123XYZ"
          className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Start Time (optional)
          </label>
          <input
            name="startTime"
            type="datetime-local"
            defaultValue={startTimeValue}
            className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            End Time (optional)
          </label>
          <input
            name="endTime"
            type="datetime-local"
            defaultValue={endTimeValue}
            className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cost (optional)
          </label>
          <input
            name="cost"
            type="number"
            step="0.01"
            defaultValue={reservation?.cost ?? ""}
            placeholder="0.00"
            className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Currency (optional)
          </label>
          <input
            name="currency"
            type="text"
            defaultValue={reservation?.currency ?? "USD"}
            placeholder="USD"
            maxLength={3}
            className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Location (optional)
        </label>
        <input
          name="location"
          type="text"
          defaultValue={reservation?.location ?? ""}
          placeholder="e.g., 123 Main St, City, Country"
          className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Booking URL (optional)
        </label>
        <input
          name="url"
          type="url"
          defaultValue={reservation?.url ?? ""}
          placeholder="https://..."
          className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Notes (optional)
        </label>
        <textarea
          name="notes"
          rows={3}
          defaultValue={reservation?.notes ?? ""}
          className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Image (optional)
        </label>
        {imageUrl && (
          <div className="mb-3">
            <Image
              src={imageUrl}
              alt="Reservation"
              className="w-full rounded-md max-h-48 object-cover"
              width={400}
              height={200}
            />
          </div>
        )}
        <UploadButton
          endpoint="imageUploader"
          onClientUploadComplete={(res) => {
            if (res && res[0].ufsUrl) {
              setImageUrl(res[0].ufsUrl);
            }
          }}
          onUploadError={(error: Error) => {
            console.error("Upload error: ", error);
          }}
        />
        <input type="hidden" name="imageUrl" value={imageUrl || ""} />
      </div>

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending
          ? "Saving..."
          : isEditMode
          ? "Save Changes"
          : "Create Reservation"}
      </Button>
    </form>
  );
}

