/** @format */
import { app } from "./app";
import { config } from "./config/index";
import { connectDB } from "./config/dbConfig";

const startServer = async (): Promise<void> => {
  await connectDB();
  console.log("✅ Database connected successfully");
  app.listen(config.port, () => {
    console.log(`🚀 Server running on http://localhost:${config.port}`);
  });
};

startServer().catch((err) => {
  console.error("Startup failed:", err);
  process.exit(1);
});
