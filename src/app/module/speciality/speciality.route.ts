import express from "express";
import { SpecialityController } from "./speciality.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma";

const router = express.Router();

router.post("/", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), SpecialityController.createSpeciality);
router.get("/", SpecialityController.getAllSpecialities);
router.patch("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), SpecialityController.updateSpeciality);
router.delete("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), SpecialityController.deleteSpeciality);

export const SpecialityRoute = router;
