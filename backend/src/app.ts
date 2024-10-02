import express from "express";
import cors from "cors"; // Import cors
import taskRoutes from "./routes/taskRoutes";
import { PrismaClient } from "@prisma/client";

const app = express();
const PORT = process.env.PORT || 3000;
const prisma = new PrismaClient();

// Use cors to allow all origins
app.use(cors());

app.use(express.json());
app.use("/tasks", taskRoutes);

async function main() {
  try {
    await prisma.$connect();
    console.log("Connected to Database");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to PostgreSQL", error);
    process.exit(1);
  }
}

main();
