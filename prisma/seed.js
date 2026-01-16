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

  // Seed Image Prompts
  const imagePrompts = [
    // Trip-level prompts
    {
      name: "Tropical Paradise",
      category: "trip",
      prompt: "A stunning aerial view of a tropical paradise with crystal clear turquoise waters, pristine white sand beaches, palm trees swaying in the breeze, and a vibrant sunset painting the sky in shades of orange and pink. Professional travel photography, 4K quality, warm lighting."
    },
    {
      name: "European Cityscape",
      category: "trip",
      prompt: "A breathtaking panoramic view of a historic European city at golden hour, featuring iconic architecture, cobblestone streets, charming cafes with outdoor seating, and a dramatic sky. Shot from an elevated viewpoint, professional travel photography with rich colors and sharp details."
    },
    {
      name: "Mountain Adventure",
      category: "trip",
      prompt: "A majestic mountain landscape with snow-capped peaks, lush green valleys, a winding hiking trail, and dramatic clouds. The scene captures the spirit of adventure with warm morning light. Ultra-high resolution, professional outdoor photography."
    },
    {
      name: "Asian Metropolis",
      category: "trip",
      prompt: "A vibrant Asian city skyline at twilight with modern skyscrapers illuminated by neon lights, traditional temples in the foreground, busy streets below, and a gradient sky transitioning from day to night. Cinematic travel photography, rich saturated colors."
    },
    {
      name: "Desert Expedition",
      category: "trip",
      prompt: "A dramatic desert landscape with rolling sand dunes in warm golden tones, a caravan of camels silhouetted against a spectacular sunset, clear starry sky beginning to emerge. Professional travel photography with emphasis on texture and atmosphere."
    },
    {
      name: "Coastal Getaway",
      category: "trip",
      prompt: "A picturesque coastal town with colorful houses cascading down a hillside to a sparkling blue harbor, fishing boats, and rugged cliffs. Mediterranean or Amalfi Coast style, bright sunny day with puffy white clouds. Vibrant travel photography."
    },

    // Segment-level prompts
    {
      name: "Flight Journey",
      category: "segment",
      prompt: "View from an airplane window at cruising altitude, showing fluffy white clouds below, a stunning sunset or sunrise on the horizon, with the wing visible. Peaceful and serene atmosphere, high-quality aviation photography with dreamy lighting."
    },
    {
      name: "Train Adventure",
      category: "segment",
      prompt: "A scenic train journey through beautiful countryside, captured from inside the train looking out the window at passing landscapes - mountains, valleys, or coastline. Warm natural lighting, nostalgic travel photography feel."
    },
    {
      name: "Road Trip",
      category: "segment",
      prompt: "An open road stretching toward the horizon through stunning natural scenery - desert, mountains, or coastal highway. Shot from the driver's perspective with a clear blue sky, evoking freedom and adventure. Professional landscape photography."
    },
    {
      name: "City Transfer",
      category: "segment",
      prompt: "A modern city street scene showing urban transit - perhaps a sleek metro station, a busy intersection with taxis, or a scenic bridge crossing. Dynamic urban photography with interesting lighting and architectural elements."
    },
    {
      name: "Ferry Crossing",
      category: "segment",
      prompt: "A ferry boat crossing calm blue waters with scenic coastline or islands visible in the background. Golden hour lighting, seagulls in flight, the wake of the boat creating patterns in the water. Maritime travel photography."
    },

    // Reservation-level prompts
    {
      name: "Luxury Hotel Room",
      category: "reservation",
      prompt: "An elegant luxury hotel room with a perfectly made king bed, floor-to-ceiling windows revealing a stunning city or ocean view, modern decor, soft ambient lighting, and premium amenities. Professional interior photography, warm and inviting."
    },
    {
      name: "Fine Dining Experience",
      category: "reservation",
      prompt: "An exquisite fine dining table setting with artfully plated gourmet food, crystal glasses, elegant cutlery, soft candlelight, and a sophisticated restaurant ambiance. Professional food photography with shallow depth of field."
    },
    {
      name: "Adventure Activity",
      category: "reservation",
      prompt: "An exciting outdoor adventure activity in progress - kayaking, zip-lining, snorkeling, or hiking - set against a stunning natural backdrop. Action photography capturing the thrill and beauty of the experience, bright dynamic lighting."
    },
    {
      name: "Cultural Attraction",
      category: "reservation",
      prompt: "A stunning cultural landmark or museum interior with impressive architecture, interesting exhibits or artwork, and atmospheric lighting. The image conveys history, culture, and discovery. Professional architectural photography."
    },
    {
      name: "Beachside Resort",
      category: "reservation",
      prompt: "A luxury beachside resort scene with comfortable loungers, swaying palm trees, an infinity pool overlooking the ocean, and attentive service. Tropical paradise atmosphere with bright sunny weather. Resort photography, relaxation vibes."
    },
    {
      name: "Local Market Tour",
      category: "reservation",
      prompt: "A vibrant local market scene bursting with colorful fresh produce, exotic spices, handmade crafts, and friendly vendors. Authentic cultural experience with interesting textures and colors. Documentary-style travel photography."
    },
    {
      name: "Spa & Wellness",
      category: "reservation",
      prompt: "A serene spa and wellness setting with natural elements - bamboo, stones, flowing water, candles, and fresh flowers. Zen atmosphere with soft diffused lighting, conveying relaxation and rejuvenation. Professional wellness photography."
    },
    {
      name: "Nightlife Scene",
      category: "reservation",
      prompt: "An exciting nightlife scene at a rooftop bar or upscale lounge with city lights twinkling in the background, stylish cocktails, elegant decor, and vibrant atmosphere. Moody evening photography with neon accents and bokeh lights."
    },
    {
      name: "Historic Monument",
      category: "reservation",
      prompt: "An iconic historic monument or ancient ruins captured at golden hour, with dramatic lighting emphasizing the architectural details and historical significance. Few tourists, emphasizing the grandeur. Professional travel photography."
    },
  ];

  for (const prompt of imagePrompts) {
    await prisma.imagePrompt.upsert({
      where: { name: prompt.name },
      update: { prompt: prompt.prompt, category: prompt.category },
      create: prompt,
    });
  }
  console.log("✓ Image prompts seeded");

  // Seed Contact Types
  const contactTypes = [
    { name: "phone", label: "Phone", icon: "phone", sortOrder: 1 },
    { name: "email", label: "Email", icon: "mail", sortOrder: 2 },
    { name: "whatsapp", label: "WhatsApp", icon: "message-circle", sortOrder: 3 },
    { name: "website", label: "Website", icon: "globe", sortOrder: 4 },
    { name: "instagram", label: "Instagram", icon: "instagram", sortOrder: 5 },
    { name: "linkedin", label: "LinkedIn", icon: "linkedin", sortOrder: 6 },
    { name: "twitter", label: "Twitter/X", icon: "twitter", sortOrder: 7 },
    { name: "facebook", label: "Facebook", icon: "facebook", sortOrder: 8 },
  ];

  for (const ct of contactTypes) {
    await prisma.contactType.upsert({
      where: { name: ct.name },
      update: ct,
      create: ct,
    });
  }
  console.log("✓ Contact types seeded");

  // Seed Hobbies
  const hobbies = [
    // Outdoor & Adventure
    { name: "Hiking", category: "outdoor", sortOrder: 1 },
    { name: "Camping", category: "outdoor", sortOrder: 2 },
    { name: "Skiing", category: "outdoor", sortOrder: 3 },
    { name: "Scuba Diving", category: "outdoor", sortOrder: 4 },
    { name: "Surfing", category: "outdoor", sortOrder: 5 },
    { name: "Rock Climbing", category: "outdoor", sortOrder: 6 },
    { name: "Cycling", category: "outdoor", sortOrder: 7 },
    { name: "Kayaking", category: "outdoor", sortOrder: 8 },
    { name: "Fishing", category: "outdoor", sortOrder: 9 },
    
    // Culinary
    { name: "Wine Tasting", category: "culinary", sortOrder: 10 },
    { name: "Cooking Classes", category: "culinary", sortOrder: 11 },
    { name: "Food Tours", category: "culinary", sortOrder: 12 },
    { name: "Craft Beer", category: "culinary", sortOrder: 13 },
    { name: "Street Food", category: "culinary", sortOrder: 14 },
    
    // Arts & Culture
    { name: "Photography", category: "arts", sortOrder: 15 },
    { name: "Museums", category: "arts", sortOrder: 16 },
    { name: "Architecture", category: "arts", sortOrder: 17 },
    { name: "Live Music", category: "arts", sortOrder: 18 },
    { name: "Theater", category: "arts", sortOrder: 19 },
    { name: "History", category: "arts", sortOrder: 20 },
    { name: "Art Galleries", category: "arts", sortOrder: 21 },
    
    // Relaxation
    { name: "Beach", category: "relaxation", sortOrder: 22 },
    { name: "Spa & Wellness", category: "relaxation", sortOrder: 23 },
    { name: "Golf", category: "relaxation", sortOrder: 24 },
    { name: "Yoga", category: "relaxation", sortOrder: 25 },
    { name: "Meditation", category: "relaxation", sortOrder: 26 },
    
    // Sports
    { name: "Running", category: "sports", sortOrder: 27 },
    { name: "Tennis", category: "sports", sortOrder: 28 },
    { name: "Water Sports", category: "sports", sortOrder: 29 },
    { name: "Swimming", category: "sports", sortOrder: 30 },
    
    // Urban & Shopping
    { name: "Shopping", category: "urban", sortOrder: 31 },
    { name: "Nightlife", category: "urban", sortOrder: 32 },
    { name: "Cafes & Coffee", category: "urban", sortOrder: 33 },
  ];

  for (const hobby of hobbies) {
    await prisma.hobby.upsert({
      where: { name: hobby.name },
      update: hobby,
      create: hobby,
    });
  }
  console.log("✓ Hobbies seeded");

  // Seed Travel Preference Types and Options
  const travelPreferences = [
    {
      type: {
        name: "budget_level",
        label: "Budget Level",
        description: "What's your typical travel budget preference?",
        icon: "dollar-sign",
        sortOrder: 1,
        isRequired: false,
      },
      options: [
        { value: "budget", label: "Budget", description: "Cost-conscious travel", sortOrder: 1 },
        { value: "moderate", label: "Moderate", description: "Comfortable without splurging", sortOrder: 2 },
        { value: "upscale", label: "Upscale", description: "Premium experiences", sortOrder: 3 },
        { value: "luxury", label: "Luxury", description: "Top-tier experiences", sortOrder: 4 },
      ],
    },
    {
      type: {
        name: "activity_level",
        label: "Activity Level",
        description: "How active do you like to be when traveling?",
        icon: "activity",
        sortOrder: 2,
        isRequired: false,
      },
      options: [
        { value: "relaxed", label: "Relaxed", description: "Leisure and downtime", sortOrder: 1 },
        { value: "moderate", label: "Moderate", description: "Mix of activities and rest", sortOrder: 2 },
        { value: "active", label: "Active", description: "Busy schedule with activities", sortOrder: 3 },
        { value: "adventurous", label: "Adventurous", description: "High-energy adventures", sortOrder: 4 },
      ],
    },
    {
      type: {
        name: "accommodation_preference",
        label: "Accommodation Preference",
        description: "What type of accommodation do you prefer?",
        icon: "home",
        sortOrder: 3,
        isRequired: false,
      },
      options: [
        { value: "hostel", label: "Hostel", description: "Social and budget-friendly", sortOrder: 1 },
        { value: "hotel", label: "Hotel", description: "Traditional hotels", sortOrder: 2 },
        { value: "vacation_rental", label: "Vacation Rental", description: "Airbnb, VRBO, etc.", sortOrder: 3 },
        { value: "boutique", label: "Boutique", description: "Unique boutique hotels", sortOrder: 4 },
        { value: "resort", label: "Resort", description: "All-inclusive resorts", sortOrder: 5 },
      ],
    },
    {
      type: {
        name: "pace_preference",
        label: "Travel Pace",
        description: "How do you like to pace your trips?",
        icon: "clock",
        sortOrder: 4,
        isRequired: false,
      },
      options: [
        { value: "slow", label: "Slow Travel", description: "Deep dive in fewer places", sortOrder: 1 },
        { value: "balanced", label: "Balanced", description: "Mix of exploration and rest", sortOrder: 2 },
        { value: "fast", label: "Fast-Paced", description: "See as much as possible", sortOrder: 3 },
      ],
    },
  ];

  for (const pref of travelPreferences) {
    const prefType = await prisma.travelPreferenceType.upsert({
      where: { name: pref.type.name },
      update: pref.type,
      create: pref.type,
    });

    for (const option of pref.options) {
      await prisma.travelPreferenceOption.upsert({
        where: {
          preferenceTypeId_value: {
            preferenceTypeId: prefType.id,
            value: option.value,
          },
        },
        update: option,
        create: {
          ...option,
          preferenceTypeId: prefType.id,
        },
      });
    }
  }
  console.log("✓ Travel preferences seeded");

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
