import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12);
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@shophub.com' },
    update: {},
    create: {
      email: 'admin@shophub.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
    },
  });

  console.log('👤 Created admin user:', adminUser.email);

  // Create categories
  const categories = [
    {
      name: 'Electronics',
      slug: 'electronics',
      description: 'Latest gadgets and electronic devices',
      sortOrder: 1,
    },
    {
      name: 'Clothing',
      slug: 'clothing',
      description: 'Fashion and apparel for all',
      sortOrder: 2,
    },
    {
      name: 'Home & Garden',
      slug: 'home-garden',
      description: 'Everything for your home and garden',
      sortOrder: 3,
    },
    {
      name: 'Sports',
      slug: 'sports',
      description: 'Sports equipment and accessories',
      sortOrder: 4,
    },
    {
      name: 'Books',
      slug: 'books',
      description: 'Books and educational materials',
      sortOrder: 5,
    },
    {
      name: 'Beauty',
      slug: 'beauty',
      description: 'Beauty and personal care products',
      sortOrder: 6,
    },
  ];

  const createdCategories = [];
  for (const category of categories) {
    const created = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
    createdCategories.push(created);
  }

  console.log('📂 Created categories:', createdCategories.length);

  // Create sample products
  const products = [
    {
      name: 'Wireless Bluetooth Headphones',
      slug: 'wireless-bluetooth-headphones',
      description: 'High-quality wireless headphones with noise cancellation and long battery life.',
      shortDescription: 'Premium wireless headphones with excellent sound quality.',
      price: 99.99,
      comparePrice: 129.99,
      sku: 'WBH-001',
      quantity: 50,
      categoryId: createdCategories.find(c => c.slug === 'electronics')?.id,
      brand: 'AudioTech',
      tags: ['wireless', 'bluetooth', 'headphones', 'audio'],
      isFeatured: true,
      metaTitle: 'Wireless Bluetooth Headphones - Premium Audio',
      metaDescription: 'Experience premium audio with our wireless Bluetooth headphones featuring noise cancellation.',
    },
    {
      name: 'Cotton T-Shirt',
      slug: 'cotton-t-shirt',
      description: 'Comfortable 100% cotton t-shirt available in multiple colors and sizes.',
      shortDescription: 'Soft and comfortable cotton t-shirt.',
      price: 19.99,
      comparePrice: 24.99,
      sku: 'CTS-001',
      quantity: 100,
      categoryId: createdCategories.find(c => c.slug === 'clothing')?.id,
      brand: 'ComfortWear',
      tags: ['cotton', 't-shirt', 'casual', 'comfortable'],
      isFeatured: true,
    },
    {
      name: 'Smart Home Security Camera',
      slug: 'smart-home-security-camera',
      description: 'WiFi-enabled security camera with night vision, motion detection, and mobile app control.',
      shortDescription: 'Smart security camera with advanced features.',
      price: 79.99,
      comparePrice: 99.99,
      sku: 'SHSC-001',
      quantity: 25,
      categoryId: createdCategories.find(c => c.slug === 'electronics')?.id,
      brand: 'SecureHome',
      tags: ['security', 'camera', 'smart home', 'wifi'],
      isFeatured: true,
    },
    {
      name: 'Yoga Mat',
      slug: 'yoga-mat',
      description: 'Non-slip yoga mat made from eco-friendly materials, perfect for all types of yoga practice.',
      shortDescription: 'Eco-friendly non-slip yoga mat.',
      price: 29.99,
      sku: 'YM-001',
      quantity: 75,
      categoryId: createdCategories.find(c => c.slug === 'sports')?.id,
      brand: 'ZenFit',
      tags: ['yoga', 'fitness', 'mat', 'eco-friendly'],
      isFeatured: false,
    },
    {
      name: 'LED Desk Lamp',
      slug: 'led-desk-lamp',
      description: 'Adjustable LED desk lamp with multiple brightness levels and USB charging port.',
      shortDescription: 'Modern LED desk lamp with USB charging.',
      price: 39.99,
      comparePrice: 49.99,
      sku: 'LDL-001',
      quantity: 40,
      categoryId: createdCategories.find(c => c.slug === 'home-garden')?.id,
      brand: 'BrightLight',
      tags: ['led', 'desk lamp', 'adjustable', 'usb'],
      isFeatured: true,
    },
    {
      name: 'Programming Book Set',
      slug: 'programming-book-set',
      description: 'Complete set of programming books covering JavaScript, Python, and React development.',
      shortDescription: 'Essential programming books for developers.',
      price: 89.99,
      comparePrice: 119.99,
      sku: 'PBS-001',
      quantity: 30,
      categoryId: createdCategories.find(c => c.slug === 'books')?.id,
      brand: 'TechBooks',
      tags: ['programming', 'javascript', 'python', 'react', 'books'],
      isFeatured: false,
    },
    {
      name: 'Moisturizing Face Cream',
      slug: 'moisturizing-face-cream',
      description: 'Hydrating face cream with natural ingredients, suitable for all skin types.',
      shortDescription: 'Natural hydrating face cream.',
      price: 24.99,
      sku: 'MFC-001',
      quantity: 60,
      categoryId: createdCategories.find(c => c.slug === 'beauty')?.id,
      brand: 'NaturalGlow',
      tags: ['skincare', 'moisturizer', 'natural', 'face cream'],
      isFeatured: true,
    },
    {
      name: 'Running Shoes',
      slug: 'running-shoes',
      description: 'Lightweight running shoes with advanced cushioning and breathable mesh upper.',
      shortDescription: 'Comfortable lightweight running shoes.',
      price: 79.99,
      comparePrice: 99.99,
      sku: 'RS-001',
      quantity: 45,
      categoryId: createdCategories.find(c => c.slug === 'sports')?.id,
      brand: 'RunFast',
      tags: ['running', 'shoes', 'lightweight', 'cushioning'],
      isFeatured: true,
    },
  ];

  const createdProducts = [];
  for (const product of products) {
    const created = await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    });
    createdProducts.push(created);

    // Add sample images for each product
    await prisma.productImage.create({
      data: {
        productId: created.id,
        url: `https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=400`,
        altText: `${created.name} - Main Image`,
        sortOrder: 0,
        isPrimary: true,
      },
    });
  }

  console.log('🛍️ Created products:', createdProducts.length);

  console.log('✅ Database seed completed successfully!');
  console.log('🔑 Admin credentials:');
  console.log('   Email: admin@shophub.com');
  console.log('   Password: admin123');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });