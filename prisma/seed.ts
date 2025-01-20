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
  }); // Create initial products - Platonic Solids

  const platonicSolids = await Promise.all([
    prisma.product.upsert({
      where: { id: "tetrahedron" },
      update: {},
      create: {
        id: "tetrahedron",
        name: "Tetrahedron (Fire Element)",
        description:
          "Represents transformation, spiritual growth, and personal power. The tetrahedron is associated with the element of Fire.",
        price: 29.99,
        type: "Sacred Geometry",
        stock: 50,
      },
    }),
    prisma.product.upsert({
      where: { id: "cube" },
      update: {},
      create: {
        id: "cube",
        name: "Cube (Earth Element)",
        description:
          "Symbolizes stability, grounding, and physical well-being. The cube is associated with the element of Earth.",
        price: 29.99,
        type: "Sacred Geometry",
        stock: 50,
      },
    }),
    prisma.product.upsert({
      where: { id: "octahedron" },
      update: {},
      create: {
        id: "octahedron",
        name: "Octahedron (Air Element)",
        description:
          "Associated with love, forgiveness, and compassion. The octahedron is linked to the element of Air.",
        price: 29.99,
        type: "Sacred Geometry",
        stock: 50,
      },
    }),
    prisma.product.upsert({
      where: { id: "icosahedron" },
      update: {},
      create: {
        id: "icosahedron",
        name: "Icosahedron (Water Element)",
        description:
          "Linked to joy, emotional flow, and fluidity. The icosahedron is connected to the element of Water.",
        price: 29.99,
        type: "Sacred Geometry",
        stock: 50,
      },
    }),
    prisma.product.upsert({
      where: { id: "dodecahedron" },
      update: {},
      create: {
        id: "dodecahedron",
        name: "Dodecahedron (Aether Element)",
        description:
          "Represents the universe, wisdom, and spiritual connection. The dodecahedron is associated with the element of Aether/Cosmos.",
        price: 29.99,
        type: "Sacred Geometry",
        stock: 50,
      },
    }),
  ]);

  // Create initial products - Bach Flower Remedies
  const bachFlowers = await Promise.all([
    prisma.product.upsert({
      where: { id: "agrimony" },
      update: {},
      create: {
        id: "agrimony",
        name: "Agrimony Essence",
        description:
          "For those who hide their worries behind a cheerful facade.",
        price: 19.99,
        type: "Flower Essence",
        stock: 100,
      },
    }),
    prisma.product.upsert({
      where: { id: "aspen" },
      update: {},
      create: {
        id: "aspen",
        name: "Aspen Essence",
        description: "For vague, unexplained fears.",
        price: 19.99,
        type: "Flower Essence",
        stock: 100,
      },
    }),
    prisma.product.upsert({
      where: { id: "beech" },
      update: {},
      create: {
        id: "beech",
        name: "Beech Essence",
        description: "For those who need to see more beauty in the world.",
        price: 19.99,
        type: "Flower Essence",
        stock: 100,
      },
    }),
    prisma.product.upsert({
      where: { id: "centaury" },
      update: {},
      create: {
        id: "centaury",
        name: "Centaury Essence",
        description: "For people who find it hard to say 'no' to others.",
        price: 19.99,
        type: "Flower Essence",
        stock: 100,
      },
    }),
    prisma.product.upsert({
      where: { id: "cerato" },
      update: {},
      create: {
        id: "cerato",
        name: "Cerato Essence",
        description: "For those lacking confidence in their own judgment.",
        price: 19.99,
        type: "Flower Essence",
        stock: 100,
      },
    }),
    // Adding remaining Original Bach Flower Remedies
    prisma.product.upsert({
      where: { id: "cherry-plum" },
      update: {},
      create: {
        id: "cherry-plum",
        name: "Cherry Plum Essence",
        description: "For fear of losing control.",
        price: 19.99,
        type: "Flower Essence",
        stock: 100,
      },
    }),
    prisma.product.upsert({
      where: { id: "chestnut-bud" },
      update: {},
      create: {
        id: "chestnut-bud",
        name: "Chestnut Bud Essence",
        description: "For those who fail to learn from life's lessons.",
        price: 19.99,
        type: "Flower Essence",
        stock: 100,
      },
    }),
    prisma.product.upsert({
      where: { id: "chicory" },
      update: {},
      create: {
        id: "chicory",
        name: "Chicory Essence",
        description: "For possessive love and the need for attention.",
        price: 19.99,
        type: "Flower Essence",
        stock: 100,
      },
    }),
    prisma.product.upsert({
      where: { id: "clematis" },
      update: {},
      create: {
        id: "clematis",
        name: "Clematis Essence",
        description: "For those whose minds drift into fantasies.",
        price: 19.99,
        type: "Flower Essence",
        stock: 100,
      },
    }),
    prisma.product.upsert({
      where: { id: "crab-apple" },
      update: {},
      create: {
        id: "crab-apple",
        name: "Crab Apple Essence",
        description: "For self-dislike and the need for cleansing.",
        price: 19.99,
        type: "Flower Essence",
        stock: 100,
      },
    }),
    prisma.product.upsert({
      where: { id: "elm" },
      update: {},
      create: {
        id: "elm",
        name: "Elm Essence",
        description:
          "For temporary loss of confidence due to overwhelming responsibility.",
        price: 19.99,
        type: "Flower Essence",
        stock: 100,
      },
    }),
    prisma.product.upsert({
      where: { id: "gentian" },
      update: {},
      create: {
        id: "gentian",
        name: "Gentian Essence",
        description: "For mild downheartedness and discouragement.",
        price: 19.99,
        type: "Flower Essence",
        stock: 100,
      },
    }),
    // Helper Remedies
    prisma.product.upsert({
      where: { id: "honeysuckle" },
      update: {},
      create: {
        id: "honeysuckle",
        name: "Honeysuckle Essence",
        description: "For those living in the past.",
        price: 19.99,
        type: "Flower Essence",
        stock: 100,
      },
    }),
    prisma.product.upsert({
      where: { id: "rock-water" },
      update: {},
      create: {
        id: "rock-water",
        name: "Rock Water Essence",
        description: "For self-repression and rigidity.",
        price: 19.99,
        type: "Flower Essence",
        stock: 100,
      },
    }),
    prisma.product.upsert({
      where: { id: "vine" },
      update: {},
      create: {
        id: "vine",
        name: "Vine Essence",
        description: "For over-concentration on work and dominance.",
        price: 19.99,
        type: "Flower Essence",
        stock: 100,
      },
    }),
    prisma.product.upsert({
      where: { id: "walnut" },
      update: {},
      create: {
        id: "walnut",
        name: "Walnut Essence",
        description: "For protection during times of change.",
        price: 19.99,
        type: "Flower Essence",
        stock: 100,
      },
    }),
    prisma.product.upsert({
      where: { id: "white-chestnut" },
      update: {},
      create: {
        id: "white-chestnut",
        name: "White Chestnut Essence",
        description: "For persistent unwanted thoughts.",
        price: 19.99,
        type: "Flower Essence",
        stock: 100,
      },
    }),
    prisma.product.upsert({
      where: { id: "wild-oat" },
      update: {},
      create: {
        id: "wild-oat",
        name: "Wild Oat Essence",
        description: "For uncertainty about life direction.",
        price: 19.99,
        type: "Flower Essence",
        stock: 100,
      },
    }),
    prisma.product.upsert({
      where: { id: "willow" },
      update: {},
      create: {
        id: "willow",
        name: "Willow Essence",
        description: "For resentment and blame.",
        price: 19.99,
        type: "Flower Essence",
        stock: 100,
      },
    }),
    // Additional Remedies
    prisma.product.upsert({
      where: { id: "impatiens" },
      update: {},
      create: {
        id: "impatiens",
        name: "Impatiens Essence",
        description: "For impatience and frustration.",
        price: 19.99,
        type: "Flower Essence",
        stock: 100,
      },
    }),
    prisma.product.upsert({
      where: { id: "larch" },
      update: {},
      create: {
        id: "larch",
        name: "Larch Essence",
        description: "For lack of self-confidence.",
        price: 19.99,
        type: "Flower Essence",
        stock: 100,
      },
    }),
    prisma.product.upsert({
      where: { id: "mimulus" },
      update: {},
      create: {
        id: "mimulus",
        name: "Mimulus Essence",
        description: "For known fears and everyday fears.",
        price: 19.99,
        type: "Flower Essence",
        stock: 100,
      },
    }),
    prisma.product.upsert({
      where: { id: "mustard" },
      update: {},
      create: {
        id: "mustard",
        name: "Mustard Essence",
        description: "For deep gloom and depression without cause.",
        price: 19.99,
        type: "Flower Essence",
        stock: 100,
      },
    }),
    prisma.product.upsert({
      where: { id: "olive" },
      update: {},
      create: {
        id: "olive",
        name: "Olive Essence",
        description: "For exhaustion after mental or physical effort.",
        price: 19.99,
        type: "Flower Essence",
        stock: 100,
      },
    }),
    prisma.product.upsert({
      where: { id: "pine" },
      update: {},
      create: {
        id: "pine",
        name: "Pine Essence",
        description: "For guilt and self-reproach.",
        price: 19.99,
        type: "Flower Essence",
        stock: 100,
      },
    }),
    prisma.product.upsert({
      where: { id: "red-chestnut" },
      update: {},
      create: {
        id: "red-chestnut",
        name: "Red Chestnut Essence",
        description: "For excessive worry about the welfare of loved ones.",
        price: 19.99,
        type: "Flower Essence",
        stock: 100,
      },
    }),
    prisma.product.upsert({
      where: { id: "rock-rose" },
      update: {},
      create: {
        id: "rock-rose",
        name: "Rock Rose Essence",
        description: "For terror and panic.",
        price: 19.99,
        type: "Flower Essence",
        stock: 100,
      },
    }),
    prisma.product.upsert({
      where: { id: "scleranthus" },
      update: {},
      create: {
        id: "scleranthus",
        name: "Scleranthus Essence",
        description: "For indecision between two choices.",
        price: 19.99,
        type: "Flower Essence",
        stock: 100,
      },
    }),
    prisma.product.upsert({
      where: { id: "star-of-bethlehem" },
      update: {},
      create: {
        id: "star-of-bethlehem",
        name: "Star of Bethlehem Essence",
        description: "For shock and trauma.",
        price: 19.99,
        type: "Flower Essence",
        stock: 100,
      },
    }),
    prisma.product.upsert({
      where: { id: "sweet-chestnut" },
      update: {},
      create: {
        id: "sweet-chestnut",
        name: "Sweet Chestnut Essence",
        description:
          "For extreme mental anguish and reaching the limits of endurance.",
        price: 19.99,
        type: "Flower Essence",
        stock: 100,
      },
    }),
    prisma.product.upsert({
      where: { id: "vervain" },
      update: {},
      create: {
        id: "vervain",
        name: "Vervain Essence",
        description: "For over-enthusiasm and over-striving.",
        price: 19.99,
        type: "Flower Essence",
        stock: 100,
      },
    }),
    prisma.product.upsert({
      where: { id: "violet" },
      update: {},
      create: {
        id: "violet",
        name: "Violet Essence",
        description: "For shyness and self-consciousness.",
        price: 19.99,
        type: "Flower Essence",
        stock: 100,
      },
    }),
    prisma.product.upsert({
      where: { id: "wild-rose" },
      update: {},
      create: {
        id: "wild-rose",
        name: "Wild Rose Essence",
        description: "For resignation and apathy.",
        price: 19.99,
        type: "Flower Essence",
        stock: 100,
      },
    }),
    prisma.product.upsert({
      where: { id: "water-violet" },
      update: {},
      create: {
        id: "water-violet",
        name: "Water Violet Essence",
        description: "For pride and aloofness.",
        price: 19.99,
        type: "Flower Essence",
        stock: 100,
      },
    }),
  ]);

  console.log({ admin, user, platonicSolids, bachFlowers });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
