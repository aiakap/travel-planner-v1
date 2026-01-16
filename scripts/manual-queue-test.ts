import { PrismaClient } from '../app/generated/prisma/index.js';
import { queueImageGeneration } from '../lib/image-queue.js';

const prisma = new PrismaClient();

async function main() {
  console.log('Manually testing queue generation...\n');

  // Get the most recent trip
  const trip = await prisma.trip.findFirst({
    where: {
      imageUrl: null,
      imageIsCustom: false
    },
    orderBy: { createdAt: 'desc' },
    include: { segments: true }
  });

  if (!trip) {
    console.log('No trips without images found');
    return;
  }

  console.log(`Testing with trip: ${trip.title} (ID: ${trip.id})`);

  try {
    // Get a prompt
    const prompt = await prisma.imagePrompt.findFirst({
      where: { category: 'trip' }
    });

    if (!prompt) {
      console.log('❌ No trip prompts found!');
      return;
    }

    console.log(`Using prompt: ${prompt.name}`);

    // Try to queue
    const testPrompt = "Test prompt for image generation";
    console.log('\nAttempting to queue image generation...');
    
    const result = await queueImageGeneration('trip', trip.id, testPrompt, prompt.id);
    
    console.log('✓ Successfully queued!');
    console.log(`Queue ID: ${result.id}`);
    console.log(`Status: ${result.status}`);

  } catch (error: any) {
    console.error('❌ Failed to queue:', error.message);
    console.error('Stack:', error.stack);
  }

  await prisma.$disconnect();
}

main();
