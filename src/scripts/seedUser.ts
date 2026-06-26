import "dotenv/config";
import { dbConnect } from "../config/mongo";
import User from "../models/User";
import { UserRole } from "../config/constants";

async function seedUser() {
  await dbConnect();

  const email = process.env.SEED_USER_EMAIL || "dreyes@bakano.ec";
  const password = process.env.SEED_USER_PASSWORD || "123456789";
  const name = process.env.SEED_USER_NAME || "Diego Reyes";

  const existing = await User.findOne({ email });
  if (existing) {
    console.log("User already exists");
    process.exit(0);
  }

  await User.create({
    email,
    password,
    name,
    role: UserRole.ADMIN,
    isActive: true,
  });

  console.log("User created successfully");
  process.exit(0);
}

seedUser().catch((error) => {
  console.error("Seed error:", error);
  process.exit(1);
});
