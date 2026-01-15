import { Segment } from "@/app/generated/prisma";
import { reorderItinerary } from "@/lib/actions/reorder-itineraty";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useId, useState } from "react";
import { formatDateTimeInTimeZone } from "@/lib/utils";
import Link from "next/link";
import { Button } from "./ui/button";

interface SortableItineraryProps {
  segments: Segment[];
  tripId: string;
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

function SortableItem({
  item,
  timeZoneInfo,
  tripId,
}: {
  item: Segment;
  timeZoneInfo?: {
    startTimeZoneId?: string;
    startTimeZoneName?: string;
    endTimeZoneId?: string;
    endTimeZoneName?: string;
  };
  tripId: string;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className="p-4 border rounded-md flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:shadow transition-shadow"
    >
      <div className="flex-1">
        <h4 className="font-medium text-gray-800">
          {item.name || `${item.startTitle} → ${item.endTitle}`}
        </h4>
        <p className="text-sm text-gray-500">
          Start: {item.startTitle}
          {item.startTime
            ? ` • ${formatDateTimeInTimeZone(
                new Date(item.startTime),
                timeZoneInfo?.startTimeZoneId
              )}`
            : " • No start time"}
          {timeZoneInfo?.startTimeZoneName
            ? ` • ${timeZoneInfo.startTimeZoneName}`
            : ""}
        </p>
        <p className="text-sm text-gray-500">
          End: {item.endTitle}
          {item.endTime
            ? ` • ${formatDateTimeInTimeZone(
                new Date(item.endTime),
                timeZoneInfo?.endTimeZoneId
              )}`
            : " • No end time"}
          {timeZoneInfo?.endTimeZoneName
            ? ` • ${timeZoneInfo.endTimeZoneName}`
            : ""}
        </p>
        {item.notes && (
          <p className="text-sm text-gray-500 truncate max-w-xs">{item.notes}</p>
        )}
      </div>
      <div className="flex items-center gap-3">
        <div className="text-sm text-gray-600"> Day {item.order}</div>
        <Link href={`/trips/${tripId}/segments/${item.id}/edit`}>
          <Button variant="outline" size="sm">
            Edit
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function SortableItinerary({
  segments,
  tripId,
  segmentTimeZones,
}: SortableItineraryProps) {
  const id = useId();
  const [localSegments, setLocalSegments] = useState(segments);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = localSegments.findIndex((item) => item.id === active.id);
      const newIndex = localSegments.findIndex((item) => item.id === over!.id);

      const newSegmentsOrder = arrayMove(
        localSegments,
        oldIndex,
        newIndex
      ).map((item, index) => ({ ...item, order: index }));

      setLocalSegments(newSegmentsOrder);

      await reorderItinerary(
        tripId,
        newSegmentsOrder.map((item) => item.id)
      );
    }
  };

  return (
    <DndContext
      id={id}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={localSegments.map((seg) => seg.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-4">
          {localSegments.map((item, key) => (
            <SortableItem
              key={key}
              item={item}
              timeZoneInfo={segmentTimeZones[item.id]}
              tripId={tripId}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
