import express from "express";
import { SpecialityRoute } from "../module/speciality/speciality.route";
import { AuthRoute } from "../module/auth/auth.route";
const router = express.Router();

router.use("/specialities", SpecialityRoute);
router.use("/auth", AuthRoute);
export const IndexRoute = router;