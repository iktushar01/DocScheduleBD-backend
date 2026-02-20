import app from "./app";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5000;


const bootstrap = async () => {
  try {
    await app.listen(PORT);
    console.log(`Server running on port ${PORT}`);
  } catch (error) {
    console.error("Failed to start server:", error);
  }
};

bootstrap();
