import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { IndexRoute } from "./routes";
import { globalErrorhandler } from "./middleware/globalErrorhandler";
import { notFound } from "./middleware/notFound";
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("API is running 🚀");
});


app.use("/api/v1", IndexRoute);


app.use(globalErrorhandler);
app.use(notFound);
export default app;
