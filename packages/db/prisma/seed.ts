import { PrismaClient } from '../src/generated'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create demo shop
  const shop = await prisma.shop.upsert({
    where: { kraPin: 'A000000000A' },
    update: {},
    create: {
      name: 'Kilimo Agrovet',
      kraPin: 'A000000000A',
      phoneNumber: '254712345678', // WhatsApp number (no +)
      address: 'Main Street, Nakuru',
    },
  })

  console.log(`✅ Shop: ${shop.name}`)

  // Create owner user
  const hash = await bcrypt.hash('password123', 10)
  const user = await prisma.user.upsert({
    where: { email: 'owner@kilimo.co.ke' },
    update: {},
    create: {
      shopId: shop.id,
      name: 'John Kamau',
      email: 'owner@kilimo.co.ke',
      passwordHash: hash,
      role: 'OWNER',
    },
  })
  console.log(`✅ User: ${user.email} (password: password123)`)

  // Seed products
  const products = [
    {
      name: 'DAP Fertilizer',
      aliases: ['dap', 'dap fertilizer', 'diammonium phosphate'],
      unit: 'bag',
      defaultPrice: 1600,
      stockQty: 20,
    },
    {
      name: 'CAN Fertilizer',
      aliases: ['can', 'can fertilizer', 'calcium ammonium nitrate'],
      unit: 'bag',
      defaultPrice: 1400,
      stockQty: 15,
    },
    {
      name: 'Round-Up Herbicide',
      aliases: ['roundup', 'round-up', 'glyphosate'],
      unit: 'litre',
      defaultPrice: 450,
      stockQty: 30,
    },
    {
      name: 'Fencing Staples',
      aliases: ['staples', 'fencing staples', 'fence staples'],
      unit: 'kg',
      defaultPrice: 120,
      stockQty: 50,
    },
    {
      name: 'Urea Fertilizer',
      aliases: ['urea'],
      unit: 'bag',
      defaultPrice: 1550,
      stockQty: 10,
      lowStockAlert: 5,
    },
  ]

  for (const p of products) {
    const product = await prisma.product.upsert({
      where: { shopId_name: { shopId: shop.id, name: p.name } },
      update: {},
      create: { shopId: shop.id, ...p, defaultPrice: p.defaultPrice },
    })
    console.log(`✅ Product: ${product.name} (stock: ${product.stockQty})`)
  }

  console.log('\n🎉 Seed complete!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
