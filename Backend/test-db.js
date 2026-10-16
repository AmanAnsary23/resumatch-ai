import prisma from "./lib/prisma.js";

try {
  await prisma.$connect();
  console.log("PostgreSQL connected successfully!.....");

  const users = await prisma.user.count();
  console.log("Total users:", users);
} catch (error) {
  console.error("Database connection failed:", error.message);
} finally {
  await prisma.$disconnect();
}