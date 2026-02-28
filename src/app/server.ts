import app from "./app";
import dotenv from "dotenv";
import { envVars } from "../config/env";

dotenv.config();



const bootstrap = async () => {
  try {
    await app.listen(envVars.PORT);
    console.log(`Server running on ${envVars.NODE_ENV} mode on port ${envVars.PORT} ${envVars.FRONTEND_URL}`);
  } catch (error) {
    console.error("Failed to start server:", error);
  }
};

bootstrap();
