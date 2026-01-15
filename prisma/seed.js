const { PrismaClient } = require("../app/generated/prisma");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Seed SegmentTypes
  const segmentTypes = [
    "Flight",
    "Drive",
    "Train",
    "Ferry",
    "Walk",
    "Other",
  ];

  for (const name of segmentTypes) {
    await prisma.segmentType.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  console.log("✓ Segment types seeded");

  // Seed Reservation Categories and Types
  const reservationData = [
    {
      category: "Travel",
      types: ["Flight", "Train", "Car Rental", "Bus", "Ferry"],
    },
    {
      category: "Stay",
      types: ["Hotel", "Airbnb", "Hostel", "Resort", "Vacation Rental"],
    },
    {
      category: "Activity",
      types: ["Tour", "Event Tickets", "Museum", "Hike", "Excursion", "Adventure"],
    },
    {
      category: "Dining",
      types: ["Restaurant", "Cafe", "Bar", "Food Tour"],
    },
  ];

  for (const { category, types } of reservationData) {
    const cat = await prisma.reservationCategory.upsert({
      where: { name: category },
      update: {},
      create: { name: category },
    });

    for (const typeName of types) {
      await prisma.reservationType.upsert({
        where: { 
          categoryId_name: {
            categoryId: cat.id,
            name: typeName
          }
        },
        update: {},
        create: {
          name: typeName,
          categoryId: cat.id,
        },
      });
    }
  }
  console.log("✓ Reservation categories and types seeded");

  // Seed Reservation Statuses
  const statuses = ["Pending", "Confirmed", "Cancelled", "Completed", "Waitlisted"];

  for (const name of statuses) {
    await prisma.reservationStatus.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  console.log("✓ Reservation statuses seeded");

  console.log("Database seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
