/** @format */
import { app } from "./app";
import { config } from "./config/index";

const startServer = async (): Promise<void> => {
  console.log("4. Starting server...");
  app.listen(config.port, () => {
    console.log(`🚀 Server running on http://localhost:${config.port}`);
  });
};

startServer().catch((err) => {
  console.error("Startup failed:", err);
  process.exit(1);
});
