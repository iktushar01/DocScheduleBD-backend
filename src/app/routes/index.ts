import express from "express";
import { SpecialityRoute } from "../module/speciality/speciality.route";
import { AuthRoute } from "../module/auth/auth.route";
import { UserRoutes } from "../module/user/user.route";
const router = express.Router();

router.use("/specialities", SpecialityRoute);
router.use("/auth", AuthRoute);
router.use("/doctors", UserRoutes);
export const IndexRoute = router;