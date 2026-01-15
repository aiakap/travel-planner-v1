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

interface SortableItineraryProps {
  segments: Segment[];
  tripId: string;
}

function SortableItem({ item }: { item: Segment }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className="p-4 border rounded-md flex justify-between items-center hover:shadow transition-shadow"
    >
      <div>
        <h4 className="font-medium text-gray-800">
          {item.startTitle} → {item.endTitle}
        </h4>
        <p className="text-sm text-gray-500 truncate max-w-xs">
          {item.startTime
            ? `${new Date(item.startTime).toLocaleString()}`
            : "No start time"}{" "}
          {item.endTime ? ` → ${new Date(item.endTime).toLocaleString()}` : ""}
        </p>
        {item.notes && (
          <p className="text-sm text-gray-500 truncate max-w-xs">{item.notes}</p>
        )}
      </div>
      <div className="text-sm text-gray-600"> Day {item.order}</div>
    </div>
  );
}

export default function SortableItinerary({
  segments,
  tripId,
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
            <SortableItem key={key} item={item} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
