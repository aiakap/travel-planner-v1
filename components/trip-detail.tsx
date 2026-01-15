"use client";

import { Segment, Trip } from "@/app/generated/prisma";
import Image from "next/image";
import { Calendar, MapPin, Plus, Pencil } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useState } from "react";
import Map from "@/components/map";
import SortableItinerary from "./sortable-itinerary";
import { formatDateTimeInTimeZone } from "@/lib/utils";

export type TripWithSegments = Trip & {
  segments: Segment[];
};

interface TripDetailClientProps {
  trip: TripWithSegments;
  segmentTimeZones: Record<
    string,
    {
      startTimeZoneId?: string;
      startTimeZoneName?: string;
      endTimeZoneId?: string;
      endTimeZoneName?: string;
    }
  >;
}

export default function TripDetailClient({
  trip,
  segmentTimeZones,
}: TripDetailClientProps) {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {trip.imageUrl && (
        <div className="w-full h-72 md:h-96 overflow-hidden rounded-xl shadow-lg relative">
          <Image
            src={trip.imageUrl}
            alt={trip.title}
            className="object-cover"
            fill
            priority
          />
        </div>
      )}
      <div className="bg-white p-6 shadow rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900">{trip.title}</h1>

          <div className="flex items-center text-gray-500 mt-2">
            <Calendar className="h-5 w-5 mr-2" />
            <span className="text-lg">
              {trip.startDate.toLocaleDateString()} -{" "}
              {trip.endDate.toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="mt-4 md:mt-0 flex gap-3">
          <Link href={`/trips/${trip.id}/edit`}>
            <Button variant="outline">
              <Pencil className="mr-2 h-5 w-5" /> Edit Trip
            </Button>
          </Link>
          <Link href={`/trips/${trip.id}/itinerary/new`}>
            <Button>
              <Plus className="mr-2 h-5 w-5" /> Add Segment
            </Button>
          </Link>
        </div>
      </div>
      <div className="bg-white p-6 shadow rounded-lg">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview" className="text-lg">
              Overview
            </TabsTrigger>
            <TabsTrigger value="itinerary" className="text-lg">
              Segments
            </TabsTrigger>
            <TabsTrigger value="map" className="text-lg">
              Map
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-2xl font-semibold mb-4">Trip Summary</h2>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Calendar className="h-6 w-6 mr-3 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-700">Dates</p>
                      <p className="text-sm text-gray-500">
                        {trip.startDate.toLocaleDateString()} -{" "}
                        {trip.endDate.toLocaleDateString()}
                        <br />
                        {`${Math.round(
                          (trip.endDate.getTime() - trip.startDate.getTime()) /
                            (1000 * 60 * 60 * 24)
                        )} days(s)`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="h-6 w-6 mr-3 text-gray-500" />
                    <div>
                      <p>Segments</p>
                      <p>
                        {trip.segments.length}{" "}
                        {trip.segments.length === 1 ? "segment" : "segments"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-72 rounded-lg overflow-hidden shadow">
                <Map segments={trip.segments} segmentTimeZones={segmentTimeZones} />
              </div>
              {trip.segments.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Segments</h3>
                  <div className="space-y-3">
                    {trip.segments.map((segment) => (
                      <div
                        key={segment.id}
                        className="p-4 border rounded-md bg-white"
                      >
                        {(() => {
                          const tz = segmentTimeZones[segment.id];
                          return (
                            <>
                              <div className="font-medium text-gray-800">
                                {segment.name ||
                                  `${segment.startTitle} → ${segment.endTitle}`}
                              </div>
                              <p className="text-sm text-gray-500">
                                Start: {segment.startTitle}
                                {segment.startTime
                                  ? ` • ${formatDateTimeInTimeZone(
                                      new Date(segment.startTime),
                                      tz?.startTimeZoneId
                                    )}`
                                  : " • No start time"}
                                {tz?.startTimeZoneName
                                  ? ` • ${tz.startTimeZoneName}`
                                  : ""}
                              </p>
                              <p className="text-sm text-gray-500">
                                End: {segment.endTitle}
                                {segment.endTime
                                  ? ` • ${formatDateTimeInTimeZone(
                                      new Date(segment.endTime),
                                      tz?.endTimeZoneId
                                    )}`
                                  : " • No end time"}
                                {tz?.endTimeZoneName
                                  ? ` • ${tz.endTimeZoneName}`
                                  : ""}
                              </p>
                              {segment.notes && (
                                <p className="text-sm text-gray-500 mt-2">
                                  {segment.notes}
                                </p>
                              )}
                              <div className="mt-3">
                                <Link
                                  href={`/trips/${trip.id}/segments/${segment.id}/edit`}
                                >
                                  <Button variant="outline">Edit Segment</Button>
                                </Link>
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {trip.segments.length === 0 && (
                <div className="text-center p-4">
                  <p>Add segments to see them on the map.</p>
                  <Link href={`/trips/${trip.id}/itinerary/new`}>
                    <Button>
                      <Plus className="mr-2 h-5 w-5" /> Add Segment
                    </Button>
                  </Link>
                </div>
              )}

              <div>
                <p className="text-gray-600 leading-relaxed">
                  {trip.description}
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="itinerary" className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Segments</h2>
            </div>

            {trip.segments.length === 0 ? (
              <div className="text-center p-4">
                <p>Add segments to see them on the itinerary.</p>
                <Link href={`/trips/${trip.id}/itinerary/new`}>
                  <Button>
                    <Plus className="mr-2 h-5 w-5" /> Add Segment
                  </Button>
                </Link>
              </div>
            ) : (
              <SortableItinerary
                segments={trip.segments}
                tripId={trip.id}
                segmentTimeZones={segmentTimeZones}
              />
            )}
          </TabsContent>

          <TabsContent value="map" className="space-y-6">
            <div className="h-72 rounded-lg overflow-hidden shadow">
              <Map segments={trip.segments} segmentTimeZones={segmentTimeZones} />
            </div>
            {trip.segments.length === 0 && (
              <div className="text-center p-4">
                <p>Add segments to see them on the map.</p>
                <Link href={`/trips/${trip.id}/itinerary/new`}>
                  <Button>
                    <Plus className="mr-2 h-5 w-5" /> Add Segment
                  </Button>
                </Link>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      <div className="text-center">
        <Link href={`/trips`}>
          <Button> Back to Trips</Button>
        </Link>
      </div>
    </div>
  );
}
