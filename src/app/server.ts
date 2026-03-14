import app from "./app";
import dotenv from "dotenv";
import { envVars } from "./config/env";
import { seedSuperAdmin } from "./utils/seed";

dotenv.config();



const bootstrap = async () => {
  try {
    await seedSuperAdmin();
    app.listen(envVars.PORT);
    console.log(`Server running on ${envVars.NODE_ENV} mode on port ${envVars.PORT} ${envVars.FRONTEND_URL}`);
  } catch (error) {
    console.error("Failed to start server:", error);
  }
};

bootstrap();
