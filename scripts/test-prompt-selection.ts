import { PrismaClient } from '../app/generated/prisma/index.js';

const prisma = new PrismaClient();

async function main() {
  console.log('Testing prompt selection...\n');

  // Get the most recent trip
  const trip = await prisma.trip.findFirst({
    orderBy: { createdAt: 'desc' },
    include: { segments: true }
  });

  if (!trip) {
    console.log('No trips found');
    return;
  }

  console.log(`Trip: ${trip.title}`);
  console.log(`Description: ${trip.description}\n`);

  // Check available prompts for trip category
  const tripPrompts = await prisma.imagePrompt.findMany({
    where: { category: 'trip' }
  });

  console.log(`Available trip prompts: ${tripPrompts.length}`);
  tripPrompts.forEach(p => {
    console.log(`  - ${p.name} (style: ${p.style}, lightness: ${p.lightness})`);
  });

  if (tripPrompts.length === 0) {
    console.log('\n❌ ERROR: No trip prompts found!');
    console.log('This is why queueing is failing - there are no prompts to select from.');
    return;
  }

  // Try to manually call the selection logic
  const content = `Title: ${trip.title}\nDescription: ${trip.description || ""}`;
  console.log(`\nContent to analyze: ${content}`);

  // Check if OpenAI API key is set
  if (!process.env.OPENAI_API_KEY) {
    console.log('\n❌ ERROR: OPENAI_API_KEY is not set in environment!');
    return;
  }

  console.log('\n✓ OPENAI_API_KEY is set');
  console.log(`✓ ${tripPrompts.length} trip prompts available`);

  await prisma.$disconnect();
}

main();
