import express from "express";
import { SpecialityRoute } from "../module/speciality/speciality.route";
import { AuthRoute } from "../module/auth/auth.route";
import { UserRoutes } from "../module/user/user.route";
import { DoctorRoutes } from "../module/doctor/doctor.route";
const router = express.Router();

router.use("/specialities", SpecialityRoute);
router.use("/auth", AuthRoute);
router.use("/users", UserRoutes);
router.use("/doctors", DoctorRoutes);


export const IndexRoute = router;