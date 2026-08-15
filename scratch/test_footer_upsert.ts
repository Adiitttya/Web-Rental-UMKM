import { prisma } from '../src/lib/prisma';

async function main() {
  console.log('Testing Footer DB Upsert...');
  
  const textRes = await prisma.systemSetting.upsert({
    where: { key: 'footer_text' },
    update: { value: '© 2026 DsterGame Studio. All Rights Reserved.' },
    create: {
      key: 'footer_text',
      value: '© 2026 DsterGame Studio. All Rights Reserved.',
      group: 'footer',
      description: 'Teks Hak Cipta (Copyright Notice) pada Footer Website',
      isPublic: true,
    },
  });

  const socialLinks = [
    { id: 'instagram', platform: 'Instagram', url: 'https://instagram.com/dster.game', icon: 'instagram' },
    { id: 'tiktok', platform: 'TikTok', url: 'https://tiktok.com/@dster.game', icon: 'tiktok' },
    { id: 'whatsapp', platform: 'WhatsApp', url: 'https://wa.me/6285172412206', icon: 'whatsapp' },
    { id: 'email', platform: 'Email', url: 'mailto:admin@dstergame.com', icon: 'email' },
  ];

  const socialRes = await prisma.systemSetting.upsert({
    where: { key: 'footer_social_links' },
    update: { value: JSON.stringify(socialLinks) },
    create: {
      key: 'footer_social_links',
      value: JSON.stringify(socialLinks),
      group: 'footer',
      description: 'Daftar Media Sosial dan Tautan Resmi pada Footer Website',
      isPublic: true,
    },
  });

  console.log('Upsert Success!');
  console.log('footer_text record:', textRes);
  console.log('footer_social_links record:', socialRes);
}

main()
  .catch((e) => {
    console.error('Error during upsert:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
