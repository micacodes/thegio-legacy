// path: apps/api/prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const templates = [
  { 
    name: 'The Classic Memoir', 
    description: 'A timeless design for telling your life story with elegance.', 
    previewImgUrl: 'https://images.unsplash.com/photo-1544716278-e513176f20b5?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600', 
    designHuddleTemplateId: 'classic_memoir_01' 
  },
  { 
    name: 'Modern Moments', 
    description: 'A clean, minimalist layout perfect for showcasing impactful photos.', 
    previewImgUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600', 
    designHuddleTemplateId: 'modern_moments_02' 
  },
  { 
    name: 'Family Heirloom', 
    description: 'A warm, traditional design to capture your family\'s history.', 
    previewImgUrl: 'https://images.unsplash.com/photo-1541882430932-a54b39b8849b?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600', 
    designHuddleTemplateId: 'family_heirloom_03' 
  },
  { 
    name: 'Tribute & Remembrance', 
    description: 'A respectful and beautiful way to honor a loved one\'s memory.', 
    previewImgUrl: 'https://images.unsplash.com/photo-1588970348536-32d7b69a54b4?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600', 
    designHuddleTemplateId: 'tribute_remembrance_04' 
  },
  { 
    name: 'Baby\'s First Year', 
    description: 'A cute and playful design to document your baby\'s milestones.', 
    previewImgUrl: 'https://images.unsplash.com/photo-1566004100631-35d015d6a491?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600', 
    designHuddleTemplateId: 'baby_first_year_05' 
  },
  { 
    name: 'Wedding Album', 
    description: 'A romantic and elegant template for your special day.', 
    previewImgUrl: 'https://images.unsplash.com/photo-1596783104958-7a56976de191?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600', 
    designHuddleTemplateId: 'wedding_album_06' 
  },
  { 
    name: 'Travel Journal', 
    description: 'An adventurous design to showcase your travels and experiences.', 
    previewImgUrl: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600', 
    designHuddleTemplateId: 'travel_journal_07' 
  },
  { 
    name: 'Cookbook & Recipes', 
    description: 'A delicious layout for sharing your favorite family recipes.', 
    previewImgUrl: 'https://images.unsplash.com/photo-1593974495758-78a0827297e6?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600', 
    designHuddleTemplateId: 'cookbook_recipes_08' 
  },
  { 
    name: 'The Professional Portfolio', 
    description: 'A sleek and professional design to showcase your work.', 
    previewImgUrl: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600', 
    designHuddleTemplateId: 'professional_portfolio_09' 
  },
  { 
    name: 'Anniversary Celebration', 
    description: 'Celebrate your love story with this beautiful and romantic design.', 
    previewImgUrl: 'https://images.unsplash.com/photo-1571285061413-a4c3f58a3621?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600', 
    designHuddleTemplateId: 'anniversary_celebration_10' 
  },
  { 
    name: 'Legacy Letters', 
    description: 'A simple, heartfelt design for writing letters to your loved ones.', 
    previewImgUrl: 'https://images.unsplash.com/photo-1483921025534-16a2a3e639a0?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600', 
    designHuddleTemplateId: 'legacy_letters_11' 
  },
  { 
    name: 'Year in Review', 
    description: 'A fun and modern way to capture the highlights of your year.', 
    previewImgUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600', 
    designHuddleTemplateId: 'year_in_review_12' 
  },
];

async function main() {
  console.log('Start seeding...');
  for (const t of templates) {
    const template = await prisma.template.upsert({
      where: { designHuddleTemplateId: t.designHuddleTemplateId },
      update: {
        name: t.name,
        description: t.description,
        previewImgUrl: t.previewImgUrl,
      },
      create: {
        name: t.name,
        description: t.description,
        previewImgUrl: t.previewImgUrl,
        designHuddleTemplateId: t.designHuddleTemplateId,
      },
    });
    console.log(`Created/Updated template: ${template.name} (ID: ${template.id})`);
  }
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });