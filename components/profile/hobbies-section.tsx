"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { addHobby, removeHobby, updateHobbyLevel } from "@/lib/actions/profile-actions";
import { Plus, X } from "lucide-react";

interface HobbiesSectionProps {
  initialHobbies: any[];
  availableHobbies: any[];
}

export function HobbiesSection({ initialHobbies, availableHobbies }: HobbiesSectionProps) {
  const [userHobbies, setUserHobbies] = useState(initialHobbies);
  const [isAdding, setIsAdding] = useState(false);

  const selectedHobbyIds = new Set(userHobbies.map(uh => uh.hobbyId));
  const availableToAdd = availableHobbies.filter(h => !selectedHobbyIds.has(h.id));

  // Group by category
  const groupedAvailable = availableToAdd.reduce((acc, hobby) => {
    const category = hobby.category || "other";
    if (!acc[category]) acc[category] = [];
    acc[category].push(hobby);
    return acc;
  }, {} as Record<string, any[]>);

  const groupedUserHobbies = userHobbies.reduce((acc, uh) => {
    const category = uh.hobby.category || "other";
    if (!acc[category]) acc[category] = [];
    acc[category].push(uh);
    return acc;
  }, {} as Record<string, any[]>);

  const handleAddHobby = async (hobbyId: string) => {
    try {
      const added = await addHobby(hobbyId);
      const hobby = availableHobbies.find(h => h.id === hobbyId);
      setUserHobbies([...userHobbies, { ...added, hobby }]);
      setIsAdding(false);
    } catch (error) {
      console.error("Error adding hobby:", error);
    }
  };

  const handleRemoveHobby = async (userHobbyId: string) => {
    try {
      await removeHobby(userHobbyId);
      setUserHobbies(userHobbies.filter(uh => uh.id !== userHobbyId));
    } catch (error) {
      console.error("Error removing hobby:", error);
    }
  };

  const categoryLabels: Record<string, string> = {
    outdoor: "Outdoor & Adventure",
    culinary: "Culinary",
    arts: "Arts & Culture",
    relaxation: "Relaxation",
    sports: "Sports",
    urban: "Urban & Shopping",
    other: "Other",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Hobbies & Interests</h2>
        <Button onClick={() => setIsAdding(!isAdding)} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Hobby
        </Button>
      </div>

      {isAdding && (
        <div className="p-4 border rounded-lg space-y-4 bg-gray-50">
          <h3 className="font-semibold">Select Hobbies to Add</h3>
          {Object.entries(groupedAvailable).map(([category, hobbies]) => (
            <div key={category} className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">{categoryLabels[category] || category}</h4>
              <div className="flex flex-wrap gap-2">
                {hobbies.map((hobby: any) => (
                  <Badge
                    key={hobby.id}
                    variant="outline"
                    className="cursor-pointer hover:bg-blue-100"
                    onClick={() => handleAddHobby(hobby.id)}
                  >
                    {hobby.name} <Plus className="w-3 h-3 ml-1" />
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-4">
        {Object.keys(groupedUserHobbies).length === 0 ? (
          <p className="text-gray-500 text-center py-8">No hobbies selected yet.</p>
        ) : (
          Object.entries(groupedUserHobbies).map(([category, hobbies]) => (
            <div key={category} className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-700">{categoryLabels[category] || category}</h3>
              <div className="flex flex-wrap gap-2">
                {hobbies.map((userHobby: any) => (
                  <Badge
                    key={userHobby.id}
                    variant="default"
                    className="cursor-pointer hover:bg-red-100 hover:text-red-700"
                    onClick={() => handleRemoveHobby(userHobby.id)}
                  >
                    {userHobby.hobby.name} <X className="w-3 h-3 ml-1" />
                  </Badge>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
