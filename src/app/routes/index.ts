import express from "express";
import { SpecialityRoute } from "../module/speciality/speciality.route";
const router = express.Router();

router.use("/specialities", SpecialityRoute);
export const IndexRoute = router;