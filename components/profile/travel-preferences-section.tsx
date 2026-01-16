"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { setTravelPreference, removeTravelPreference } from "@/lib/actions/profile-actions";

interface TravelPreferencesSectionProps {
  initialPreferences: any[];
  preferenceTypes: any[];
}

export function TravelPreferencesSection({
  initialPreferences,
  preferenceTypes,
}: TravelPreferencesSectionProps) {
  const [preferences, setPreferences] = useState(initialPreferences);

  const getSelectedOption = (preferenceTypeId: string) => {
    const pref = preferences.find(p => p.preferenceTypeId === preferenceTypeId);
    return pref?.optionId || "";
  };

  const handlePreferenceChange = async (preferenceTypeId: string, optionId: string) => {
    try {
      await setTravelPreference(preferenceTypeId, optionId);
      setPreferences(preferences.map(p => 
        p.preferenceTypeId === preferenceTypeId
          ? { ...p, optionId }
          : p
      ).concat(preferences.find(p => p.preferenceTypeId === preferenceTypeId) ? [] : [{
        preferenceTypeId,
        optionId,
        preferenceType: preferenceTypes.find(pt => pt.id === preferenceTypeId),
        option: preferenceTypes.find(pt => pt.id === preferenceTypeId)?.options.find((o: any) => o.id === optionId),
      }]));
    } catch (error) {
      console.error("Error updating preference:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Travel Preferences</h2>
        <p className="text-gray-600">Customize your travel style and preferences.</p>
      </div>

      <div className="space-y-6">
        {preferenceTypes.map((prefType) => (
          <div key={prefType.id} className="space-y-2">
            <Label htmlFor={prefType.name}>{prefType.label}</Label>
            {prefType.description && (
              <p className="text-sm text-gray-500">{prefType.description}</p>
            )}
            <Select
              value={getSelectedOption(prefType.id)}
              onValueChange={(value) => handlePreferenceChange(prefType.id, value)}
            >
              <SelectTrigger id={prefType.name}>
                <SelectValue placeholder={`Select ${prefType.label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                {prefType.options.map((option: any) => (
                  <SelectItem key={option.id} value={option.id}>
                    <div>
                      <div className="font-medium">{option.label}</div>
                      {option.description && (
                        <div className="text-xs text-gray-500">{option.description}</div>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>
    </div>
  );
}
