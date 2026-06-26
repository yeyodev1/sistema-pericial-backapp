import "dotenv/config";
import { dbConnect } from "../config/mongo";
import User from "../models/User";
import { UserRole } from "../config/constants";

async function seedAdmin() {
  await dbConnect();

  const adminEmail = process.env.ADMIN_SEED_EMAIL || "admin@sistemapericial.com";
  const adminPassword = process.env.ADMIN_SEED_PASSWORD || "Admin123!";

  const existing = await User.findOne({ email: adminEmail });
  if (existing) {
    console.log("Admin user already exists");
    process.exit(0);
  }

  await User.create({
    email: adminEmail,
    password: adminPassword,
    name: "Administrador General",
    role: UserRole.ADMIN,
    isActive: true,
  });

  console.log("Admin user created successfully");
  process.exit(0);
}

seedAdmin().catch((error) => {
  console.error("Seed error:", error);
  process.exit(1);
});
