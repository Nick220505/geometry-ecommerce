import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@example.com",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  // Create regular user
  const userPassword = await hash("user123", 12);
  const user = await prisma.user.upsert({
    where: { email: "user@example.com" },
    update: {},
    create: {
      name: "Test User",
      email: "user@example.com",
      password: userPassword,
      role: "USER",
    },
  });

  // Create initial products
  const products = await Promise.all([
    prisma.product.upsert({
      where: { id: "platonic-solids-set" },
      update: {},
      create: {
        id: "platonic-solids-set",
        name: "Platonic Solids Set",
        description:
          "Complete set of all five Platonic solids, perfect for sacred geometry study and meditation.",
        price: 29.99,
        type: "3D Geometry",
        stock: 50,
        imageUrl: "/products/platonic-solids.jpg",
      },
    }),
    prisma.product.upsert({
      where: { id: "rose-essence" },
      update: {},
      create: {
        id: "rose-essence",
        name: "Rose Essence",
        description:
          "Pure rose flower essence for emotional healing and heart chakra balancing.",
        price: 19.99,
        type: "Flower Essence",
        stock: 100,
        imageUrl: "/products/rose-essence.jpg",
      },
    }),
  ]);

  console.log({ admin, user, products });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
