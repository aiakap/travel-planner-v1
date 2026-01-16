"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { PersonalInfoSection } from "@/components/profile/personal-info-section";
import { ContactsSection } from "@/components/profile/contacts-section";
import { HobbiesSection } from "@/components/profile/hobbies-section";
import { TravelPreferencesSection } from "@/components/profile/travel-preferences-section";
import { RelationshipsSection } from "@/components/profile/relationships-section";

interface ProfileClientProps {
  userId: string;
  userName: string;
  userEmail: string;
  userImage: string;
  initialProfile: any;
  initialContacts: any[];
  initialHobbies: any[];
  initialTravelPreferences: any[];
  initialRelationships: any[];
  contactTypes: any[];
  hobbies: any[];
  travelPreferenceTypes: any[];
}

export function ProfileClient({
  userId,
  userName,
  userEmail,
  userImage,
  initialProfile,
  initialContacts,
  initialHobbies,
  initialTravelPreferences,
  initialRelationships,
  contactTypes,
  hobbies,
  travelPreferenceTypes,
}: ProfileClientProps) {
  return (
    <Tabs defaultValue="personal" className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="personal">Personal Info</TabsTrigger>
        <TabsTrigger value="contacts">Contacts</TabsTrigger>
        <TabsTrigger value="hobbies">Hobbies</TabsTrigger>
        <TabsTrigger value="preferences">Travel Preferences</TabsTrigger>
        <TabsTrigger value="relationships">Relationships</TabsTrigger>
      </TabsList>

      <TabsContent value="personal">
        <Card className="p-6">
          <PersonalInfoSection
            userName={userName}
            userEmail={userEmail}
            userImage={userImage}
            initialProfile={initialProfile}
          />
        </Card>
      </TabsContent>

      <TabsContent value="contacts">
        <Card className="p-6">
          <ContactsSection
            initialContacts={initialContacts}
            contactTypes={contactTypes}
          />
        </Card>
      </TabsContent>

      <TabsContent value="hobbies">
        <Card className="p-6">
          <HobbiesSection
            initialHobbies={initialHobbies}
            availableHobbies={hobbies}
          />
        </Card>
      </TabsContent>

      <TabsContent value="preferences">
        <Card className="p-6">
          <TravelPreferencesSection
            initialPreferences={initialTravelPreferences}
            preferenceTypes={travelPreferenceTypes}
          />
        </Card>
      </TabsContent>

      <TabsContent value="relationships">
        <Card className="p-6">
          <RelationshipsSection
            initialRelationships={initialRelationships}
          />
        </Card>
      </TabsContent>
    </Tabs>
  );
}
