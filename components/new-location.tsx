"use client";

import { useTransition } from "react";
import { Button } from "./ui/button";
import { addSegment } from "@/lib/actions/add-location";

export default function NewLocationClient({ tripId }: { tripId: string }) {
  const [isPending, startTransation] = useTransition();

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white p-8 shadow-lg rounded-lg">
          <h1 className="text-3xl font-bold text-center mb-6">
            Add New Segment
          </h1>

          <form
            className="space-y-6"
            action={(formData: FormData) => {
              startTransation(() => {
                addSegment(formData, tripId);
              });
            }}
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Address
              </label>
              <input
                name="startAddress"
                type="text"
                required
                className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Address
              </label>
              <input
                name="endAddress"
                type="text"
                required
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
                  className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (optional)
              </label>
              <textarea
                name="notes"
                rows={3}
                className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Button type="submit" className="w-full">
              {isPending ? "Adding..." : "Add Segment"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
