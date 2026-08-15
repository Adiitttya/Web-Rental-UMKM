import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedFaqs() {
  console.log('🔄 Updating FAQ database items...');

  const generalFaq = await prisma.faqCategory.upsert({
    where: { id: 'faq-general' },
    update: {},
    create: { id: 'faq-general', name: 'Umum', displayOrder: 1 },
  });

  await prisma.faqItem.deleteMany({ where: {} });

  const faqs = [
    { question: 'Bagaimana alur pesan & cara mulai bermain jika baru pertama kali datang?', answer: 'Sangat mudah & santai! Cukup datang ke kasir/admin, pilih konsol yang ingin Anda mainkan (PS3, PS4, PS5, Switch, atau Simulator Balap), dan staff kami siap menyiapkan TV, memilihkan game, hingga mengajari cara memegang stik controller sampai Anda nyaman bermain.', categoryId: generalFaq.id, displayOrder: 1 },
    { question: 'Apakah bisa booking / reservasi slot tempat atau konsol lebih dulu sebelum datang?', answer: 'Bisa banget! Agar tidak kehabisan tempat saat jam ramai, Anda dapat langsung reservasi via WhatsApp Admin sebelum berangkat. Cukup infokan estimasi jam kedatangan, durasi main, dan jenis konsol pilihan Anda.', categoryId: generalFaq.id, displayOrder: 2 },
    { question: 'Syarat dan prosedur apa saja yang dibutuhkan untuk Sewa Bawa Pulang (Home Rental)?', answer: 'Persyaratannya sangat simpel! Cukup jaminkan 2 Identitas Resmi yang masih berlaku (seperti KTP / SIM / STNK / Kartu Pelajar) dan kirimkan titik lokasi rumah via WhatsApp Admin. Kami juga menyediakan layanan antar-jemput unit konsol langsung ke lokasi Anda.', categoryId: generalFaq.id, displayOrder: 3 },
    { question: 'Apakah boleh membawa makanan & minuman sendiri saat bermain di tempat?', answer: 'Boleh banget! Anda bebas membawa makanan & minuman dari luar. Selain itu, studio kami juga berada di lokasi yang sama dengan Warmindo & Snack Corner sehingga Anda bisa memesan makan dan minum favorit sambil santai bermain.', categoryId: generalFaq.id, displayOrder: 4 },
    { question: 'Bagaimana jika stik/controller mengalami kendala saat sedang asyik bermain?', answer: 'Jangan khawatir! Seluruh stik controller dirawat dan dicek secara berkala. Jika baterai habis atau ada kendala pada tombol saat bermain, staff kami akan langsung menggantinya dengan stik cadangan tanpa biaya tambahan.', categoryId: generalFaq.id, displayOrder: 5 },
  ];

  for (const faq of faqs) {
    await prisma.faqItem.create({ data: faq });
  }

  console.log('✅ FAQ items successfully updated in database!');
}

seedFaqs()
  .catch((e) => {
    console.error('❌ Error updating FAQs:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
