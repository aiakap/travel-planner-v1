import { PrismaClient } from '../app/generated/prisma/index.js';

const prisma = new PrismaClient();

async function main() {
  const queue = await prisma.imageQueue.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10
  });
  
  console.log(`Total queue entries: ${queue.length}\n`);
  
  if (queue.length === 0) {
    console.log('No queue entries found!');
  } else {
    console.log('Recent queue entries:');
    queue.forEach(q => {
      console.log(`\n- [${q.entityType}] ${q.entityId}`);
      console.log(`  Status: ${q.status}`);
      console.log(`  Created: ${q.createdAt}`);
      console.log(`  Attempts: ${q.attempts}`);
      if (q.notes) {
        console.log(`  Notes: ${q.notes.substring(0, 200)}`);
      }
      if (q.imageUrl) {
        console.log(`  Image: ${q.imageUrl.substring(0, 50)}...`);
      }
    });
  }
  
  await prisma.$disconnect();
}

main();
