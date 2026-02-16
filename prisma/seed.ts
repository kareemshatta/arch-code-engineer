import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Placeholder images using Unsplash
const placeholders = {
  hero: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1920&q=80',
  intro: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
  philosophy: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
  team: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80',
  projects: [
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80',
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&q=80',
    'https://images.unsplash.com/photo-1600573472591-ee6c563aaec7?w=1200&q=80',
  ],
  services: [
    'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80',
    'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80',
    'https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?w=800&q=80',
    'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80',
    'https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=800&q=80',
    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80',
  ],
};

async function main() {
  console.log('🌱 Seeding database...');

  // Clean up existing data
  await prisma.projectImage.deleteMany();
  await prisma.project.deleteMany();
  await prisma.service.deleteMany();
  await prisma.socialLink.deleteMany();
  await prisma.contactSubmission.deleteMany();
  await prisma.contactInfo.deleteMany();
  await prisma.aboutContent.deleteMany();
  await prisma.homeContent.deleteMany();
  await prisma.siteSettings.deleteMany();

  // Create admin user
  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin@123456', 12);
  
  await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL || 'admin@archcodeengineer.com' },
    update: { password: hashedPassword },
    create: {
      email: process.env.ADMIN_EMAIL || 'admin@archcodeengineer.com',
      password: hashedPassword,
      name: 'Admin',
      role: 'admin',
      isActive: true,
    },
  });
  console.log('✅ Admin user created');

  // Create site settings
  await prisma.siteSettings.create({
    data: {
      id: 'default-settings',
      siteName: 'Arch Code Engineer',
      siteNameAr: 'آرك كود إنجينير',
      slogan: 'Where Architecture Meets Innovation',
      sloganAr: 'حيث تلتقي العمارة بالابتكار',
      seoTitle: 'Arch Code Engineer | Premium Architectural Design Studio',
      seoTitleAr: 'آرك كود إنجينير | استوديو تصميم معماري متميز',
      seoDescription: 'Award-winning architectural design studio specializing in innovative residential, commercial, and urban planning solutions.',
      seoDescriptionAr: 'استوديو تصميم معماري حائز على جوائز متخصص في الحلول السكنية والتجارية والتخطيط العمراني المبتكرة.',
      seoKeywords: 'architecture, design, engineering, urban planning, sustainable design',
      seoKeywordsAr: 'هندسة معمارية، تصميم، هندسة، تخطيط عمراني، تصميم مستدام',
    },
  });
  console.log('✅ Site settings created');

  // Create home content
  await prisma.homeContent.create({
    data: {
      id: 'default-home',
      heroTitle: 'Arch Code Engineer',
      heroTitleAr: 'آرك كود إنجينير',
      heroSubtitle: 'Where Architecture Meets Innovation',
      heroSubtitleAr: 'حيث تلتقي العمارة بالابتكار',
      heroImage: placeholders.hero,
      introTitle: 'Crafting Exceptional Spaces',
      introTitleAr: 'صياغة مساحات استثنائية',
      introText: 'We are a forward-thinking architectural studio dedicated to creating spaces that inspire, function beautifully, and stand the test of time. Our approach combines innovative design with engineering precision to deliver projects that exceed expectations.',
      introTextAr: 'نحن استوديو معماري يتطلع إلى المستقبل ومكرس لإنشاء مساحات تلهم وتعمل بشكل جميل وتصمد أمام اختبار الزمن. يجمع نهجنا بين التصميم المبتكر والدقة الهندسية لتقديم مشاريع تتجاوز التوقعات.',
      introImage: placeholders.intro,
      seoTitle: 'Home | Arch Code Engineer',
      seoTitleAr: 'الرئيسية | آرك كود إنجينير',
      seoDescription: 'Discover Arch Code Engineer - a premium architectural design studio creating innovative spaces that inspire and endure.',
      seoDescriptionAr: 'اكتشف آرك كود إنجينير - استوديو تصميم معماري متميز يصنع مساحات مبتكرة تلهم وتدوم.',
    },
  });
  console.log('✅ Home content created');

  // Create about content
  await prisma.aboutContent.create({
    data: {
      id: 'default-about',
      philosophyTitle: 'Our Philosophy',
      philosophyTitleAr: 'فلسفتنا',
      philosophyText: "Architecture is more than constructing buildings—it's about crafting experiences that resonate with human emotion and enhance daily life. We believe in the power of thoughtful design to transform communities, inspire innovation, and create lasting legacies.",
      philosophyTextAr: 'العمارة أكثر من مجرد بناء المباني - إنها تتعلق بصياغة تجارب تتردد صداها مع المشاعر الإنسانية وتعزز الحياة اليومية. نؤمن بقوة التصميم المدروس لتحويل المجتمعات وإلهام الابتكار وخلق إرث دائم.',
      philosophyImage: placeholders.philosophy,
      visionTitle: 'Our Vision',
      visionTitleAr: 'رؤيتنا',
      visionText: 'To be the leading force in architectural innovation, setting new standards for design excellence while creating sustainable spaces that harmonize with their environment.',
      visionTextAr: 'أن نكون القوة الرائدة في الابتكار المعماري، ووضع معايير جديدة للتميز في التصميم مع إنشاء مساحات مستدامة تتناغم مع بيئتها.',
      missionTitle: 'Our Mission',
      missionTitleAr: 'مهمتنا',
      missionText: "We deliver exceptional architectural solutions by combining cutting-edge technology with timeless design principles. Our collaborative approach ensures every project reflects our clients' aspirations.",
      missionTextAr: 'نقدم حلولاً معمارية استثنائية من خلال الجمع بين التكنولوجيا المتطورة ومبادئ التصميم الخالدة. يضمن نهجنا التعاوني أن يعكس كل مشروع تطلعات عملائنا.',
      teamImage: placeholders.team,
      seoTitle: 'About Us | Arch Code Engineer',
      seoTitleAr: 'من نحن | آرك كود إنجينير',
      seoDescription: "Learn about Arch Code Engineer's philosophy, vision, and mission in creating exceptional architectural designs.",
      seoDescriptionAr: 'تعرف على فلسفة آرك كود إنجينير ورؤيتها ومهمتها في إنشاء تصاميم معمارية استثنائية.',
    },
  });
  console.log('✅ About content created');

  // Create services
  const services = [
    {
      title: 'Architectural Design',
      titleAr: 'التصميم المعماري',
      description: 'From concept to completion, we create distinctive architectural designs that balance aesthetics, functionality, and sustainability.',
      descriptionAr: 'من المفهوم إلى الإنجاز، نصنع تصاميم معمارية مميزة توازن بين الجماليات والوظائف والاستدامة.',
      icon: 'Building2',
      image: placeholders.services[0],
      slug: 'architectural-design',
      order: 1,
    },
    {
      title: 'Engineering Solutions',
      titleAr: 'الحلول الهندسية',
      description: 'Our engineering team provides structural, mechanical, and electrical solutions that ensure your project is built to last.',
      descriptionAr: 'يقدم فريقنا الهندسي حلولاً إنشائية وميكانيكية وكهربائية تضمن بناء مشروعك ليدوم.',
      icon: 'Settings',
      image: placeholders.services[1],
      slug: 'engineering-solutions',
      order: 2,
    },
    {
      title: 'Urban Planning',
      titleAr: 'التخطيط العمراني',
      description: 'We shape communities through thoughtful urban planning that considers environmental impact, social dynamics, and future growth.',
      descriptionAr: 'نشكل المجتمعات من خلال التخطيط العمراني المدروس الذي يراعي التأثير البيئي والديناميكيات الاجتماعية والنمو المستقبلي.',
      icon: 'Map',
      image: placeholders.services[2],
      slug: 'urban-planning',
      order: 3,
    },
    {
      title: 'Interior Design',
      titleAr: 'التصميم الداخلي',
      description: 'Our interior design services transform spaces into extraordinary experiences through careful curation of materials, lighting, and furnishings.',
      descriptionAr: 'تحول خدمات التصميم الداخلي لدينا المساحات إلى تجارب استثنائية من خلال الاختيار الدقيق للمواد والإضاءة والمفروشات.',
      icon: 'Palette',
      image: placeholders.services[3],
      slug: 'interior-design',
      order: 4,
    },
    {
      title: 'Sustainable Design',
      titleAr: 'التصميم المستدام',
      description: 'We integrate green building strategies, renewable materials, and energy-efficient systems to minimize environmental impact.',
      descriptionAr: 'ندمج استراتيجيات البناء الأخضر والمواد المتجددة وأنظمة كفاءة الطاقة لتقليل التأثير البيئي.',
      icon: 'Leaf',
      image: placeholders.services[4],
      slug: 'sustainable-design',
      order: 5,
    },
    {
      title: 'Project Management',
      titleAr: 'إدارة المشاريع',
      description: 'From permits to punch lists, our project management team ensures your project stays on schedule and within budget.',
      descriptionAr: 'من التصاريح إلى قوائم المراجعة النهائية، يضمن فريق إدارة المشاريع لدينا بقاء مشروعك في الموعد المحدد وضمن الميزانية.',
      icon: 'ClipboardList',
      image: placeholders.services[5],
      slug: 'project-management',
      order: 6,
    },
  ];

  for (const service of services) {
    await prisma.service.create({ data: service });
  }
  console.log('✅ Services created');

  // Create projects
  const projects = [
    {
      title: 'Horizon Tower',
      titleAr: 'برج هورايزن',
      slug: 'horizon-tower',
      description: 'A 45-story mixed-use skyscraper redefining urban living with sustainable design.',
      descriptionAr: 'ناطحة سحاب متعددة الاستخدامات من 45 طابقاً تعيد تعريف الحياة الحضرية بتصميم مستدام.',
      fullDescription: 'Horizon Tower represents the pinnacle of modern urban architecture. This 45-story mixed-use development combines luxury residential units, premium office spaces, and ground-floor retail in a stunning glass and steel structure.',
      fullDescriptionAr: 'يمثل برج هورايزن قمة العمارة الحضرية الحديثة. يجمع هذا المشروع متعدد الاستخدامات المكون من 45 طابقاً بين الوحدات السكنية الفاخرة والمساحات المكتبية المتميزة ومحلات التجزئة في الطابق الأرضي.',
      thumbnail: placeholders.projects[0],
      location: 'Dubai, UAE',
      locationAr: 'دبي، الإمارات',
      year: '2024',
      client: 'Horizon Development Group',
      clientAr: 'مجموعة هورايزن للتطوير',
      area: '125,000 sqm',
      category: 'Commercial',
      categoryAr: 'تجاري',
      isFeatured: true,
      order: 1,
    },
    {
      title: 'Serenity Villa',
      titleAr: 'فيلا سيرينيتي',
      slug: 'serenity-villa',
      description: 'A minimalist luxury residence that harmonizes with its coastal landscape.',
      descriptionAr: 'مسكن فاخر بسيط يتناغم مع المناظر الطبيعية الساحلية.',
      fullDescription: 'Serenity Villa is a testament to the beauty of restraint. This 800 sqm private residence on the Mediterranean coast embraces minimalist principles while providing ultimate luxury.',
      fullDescriptionAr: 'فيلا سيرينيتي هي شهادة على جمال ضبط النفس. يحتضن هذا المسكن الخاص الذي تبلغ مساحته 800 متر مربع على ساحل البحر المتوسط مبادئ البساطة مع توفير الفخامة القصوى.',
      thumbnail: placeholders.projects[1],
      location: 'Santorini, Greece',
      locationAr: 'سانتوريني، اليونان',
      year: '2023',
      client: 'Private Client',
      clientAr: 'عميل خاص',
      area: '800 sqm',
      category: 'Residential',
      categoryAr: 'سكني',
      isFeatured: true,
      order: 2,
    },
    {
      title: 'Innovation Hub',
      titleAr: 'مركز الابتكار',
      slug: 'innovation-hub',
      description: 'A collaborative workspace designed to foster creativity and innovation.',
      descriptionAr: 'مساحة عمل تعاونية مصممة لتعزيز الإبداع والابتكار.',
      fullDescription: 'The Innovation Hub is a 15,000 sqm technology campus designed to facilitate collaboration and inspire breakthrough thinking.',
      fullDescriptionAr: 'مركز الابتكار هو حرم تقني تبلغ مساحته 15,000 متر مربع مصمم لتسهيل التعاون وإلهام التفكير الإبداعي.',
      thumbnail: placeholders.projects[2],
      location: 'Singapore',
      locationAr: 'سنغافورة',
      year: '2024',
      client: 'TechVentures Inc.',
      clientAr: 'تك فينتشرز',
      area: '15,000 sqm',
      category: 'Commercial',
      categoryAr: 'تجاري',
      isFeatured: true,
      order: 3,
    },
    {
      title: 'Cultural Center',
      titleAr: 'المركز الثقافي',
      slug: 'cultural-center',
      description: 'A landmark cultural institution celebrating art and community.',
      descriptionAr: 'مؤسسة ثقافية بارزة تحتفي بالفن والمجتمع.',
      fullDescription: "This cultural center serves as a beacon for arts and community engagement. The building's organic form houses galleries, performance spaces, and educational facilities.",
      fullDescriptionAr: 'يعمل هذا المركز الثقافي كمنارة للفنون والمشاركة المجتمعية. يضم الشكل العضوي للمبنى صالات عرض ومساحات للعروض ومرافق تعليمية.',
      thumbnail: placeholders.projects[3],
      location: 'Oslo, Norway',
      locationAr: 'أوسلو، النرويج',
      year: '2023',
      client: 'City of Oslo',
      clientAr: 'مدينة أوسلو',
      area: '22,000 sqm',
      category: 'Cultural',
      categoryAr: 'ثقافي',
      isFeatured: false,
      order: 4,
    },
    {
      title: 'Green Heights',
      titleAr: 'جرين هايتس',
      slug: 'green-heights',
      description: 'Sustainable residential complex with integrated vertical gardens.',
      descriptionAr: 'مجمع سكني مستدام مع حدائق عمودية متكاملة.',
      fullDescription: 'Green Heights reimagines urban living through biophilic design. This residential complex features 200 apartments with private balcony gardens.',
      fullDescriptionAr: 'يعيد جرين هايتس تصور الحياة الحضرية من خلال التصميم البيوفيلي. يضم هذا المجمع السكني 200 شقة مع حدائق شرفة خاصة.',
      thumbnail: placeholders.projects[4],
      location: 'Milan, Italy',
      locationAr: 'ميلانو، إيطاليا',
      year: '2024',
      client: 'EcoLiving Developments',
      clientAr: 'إيكو ليفينج للتطوير',
      area: '45,000 sqm',
      category: 'Residential',
      categoryAr: 'سكني',
      isFeatured: false,
      order: 5,
    },
    {
      title: 'Waterfront Pavilion',
      titleAr: 'جناح الواجهة البحرية',
      slug: 'waterfront-pavilion',
      description: 'An elegant events venue on the edge of the harbor.',
      descriptionAr: 'مكان أنيق للفعاليات على حافة الميناء.',
      fullDescription: "The Waterfront Pavilion is a stunning events venue that appears to float on the harbor. The structure's cantilevered roof extends over an outdoor terrace.",
      fullDescriptionAr: 'جناح الواجهة البحرية هو مكان مذهل للفعاليات يبدو وكأنه يطفو على الميناء. يمتد سقف الهيكل المعلق فوق شرفة خارجية.',
      thumbnail: placeholders.projects[5],
      location: 'Sydney, Australia',
      locationAr: 'سيدني، أستراليا',
      year: '2023',
      client: 'Harbor Events Co.',
      clientAr: 'شركة هاربور للفعاليات',
      area: '3,500 sqm',
      category: 'Hospitality',
      categoryAr: 'ضيافة',
      isFeatured: false,
      order: 6,
    },
  ];

  for (const project of projects) {
    await prisma.project.create({ data: project });
  }
  console.log('✅ Projects created');

  // Create contact info
  await prisma.contactInfo.create({
    data: {
      id: 'default-contact',
      address: '123 Architecture Avenue',
      addressAr: '123 شارع العمارة',
      city: 'New York',
      cityAr: 'نيويورك',
      country: 'United States',
      countryAr: 'الولايات المتحدة',
      postalCode: 'NY 10001',
      phone: '+1 (555) 123-4567',
      email: 'hello@archcodeengineer.com',
      officeHours: 'Monday - Friday: 9:00 AM - 6:00 PM',
      officeHoursAr: 'الإثنين - الجمعة: 9:00 صباحاً - 6:00 مساءً',
      mapLink: 'https://maps.google.com/?q=Empire+State+Building,+New+York,+NY',
    },
  });
  console.log('✅ Contact info created');

  // Create social links
  const socialLinks = [
    { platform: 'Instagram', url: 'https://instagram.com/archcodeengineer', icon: 'Instagram', order: 1 },
    { platform: 'LinkedIn', url: 'https://linkedin.com/company/archcodeengineer', icon: 'Linkedin', order: 2 },
    { platform: 'Twitter', url: 'https://twitter.com/archcodeeng', icon: 'Twitter', order: 3 },
    { platform: 'Facebook', url: 'https://facebook.com/archcodeengineer', icon: 'Facebook', order: 4 },
  ];

  for (const link of socialLinks) {
    await prisma.socialLink.create({ data: link });
  }
  console.log('✅ Social links created');

  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
