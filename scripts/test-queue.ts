import { PrismaClient } from '../app/generated/prisma/index.js';

const prisma = new PrismaClient();

async function main() {
  console.log('Testing image queue functionality...\n');

  // Find the most recent trip
  const trip = await prisma.trip.findFirst({
    orderBy: { createdAt: 'desc' },
    include: { segments: true }
  });

  if (!trip) {
    console.log('No trips found in database');
    return;
  }

  console.log(`Found trip: ${trip.title} (ID: ${trip.id})`);
  console.log(`  - imageUrl: ${trip.imageUrl}`);
  console.log(`  - imageIsCustom: ${trip.imageIsCustom}`);
  console.log(`  - segments: ${trip.segments.length}`);

  // Check if there are any queue entries for this trip
  const queueEntries = await prisma.imageQueue.findMany({
    where: {
      OR: [
        { entityType: 'trip', entityId: trip.id },
        { entityType: 'segment', entityId: { in: trip.segments.map(s => s.id) } }
      ]
    },
    orderBy: { createdAt: 'desc' }
  });

  console.log(`\nQueue entries for this trip: ${queueEntries.length}`);
  queueEntries.forEach(entry => {
    console.log(`  - [${entry.entityType}] ${entry.entityId}: ${entry.status}`);
  });

  // Check segments
  if (trip.segments.length > 0) {
    console.log('\nSegments:');
    for (const segment of trip.segments) {
      console.log(`  - ${segment.name} (ID: ${segment.id})`);
      console.log(`    imageUrl: ${segment.imageUrl}`);
      console.log(`    imageIsCustom: ${segment.imageIsCustom}`);

      // Get reservations for this segment
      const reservations = await prisma.reservation.findMany({
        where: { segmentId: segment.id }
      });

      console.log(`    reservations: ${reservations.length}`);
      
      for (const reservation of reservations) {
        console.log(`      - ${reservation.name} (ID: ${reservation.id})`);
        console.log(`        imageUrl: ${reservation.imageUrl}`);
        console.log(`        imageIsCustom: ${reservation.imageIsCustom}`);
      }
    }
  }

  // Check total queue entries
  const totalQueue = await prisma.imageQueue.count();
  console.log(`\nTotal queue entries in database: ${totalQueue}`);

  // Check available prompts
  const prompts = await prisma.imagePrompt.findMany({
    where: {
      style: { not: null }
    }
  });
  console.log(`\nAvailable high-quality prompts: ${prompts.length}`);
  prompts.forEach(p => {
    console.log(`  - [${p.category}] ${p.name} (style: ${p.style})`);
  });

  await prisma.$disconnect();
}

main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
