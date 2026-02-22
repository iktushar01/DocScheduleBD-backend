import express from "express";
import { SpecialityController } from "./speciality.controller";

const router = express.Router();

router.post("/", SpecialityController.createSpeciality);
router.get("/", SpecialityController.getAllSpecialities);
router.patch("/:id", SpecialityController.updateSpeciality);
router.delete("/:id", SpecialityController.deleteSpeciality);

export const SpecialityRoute = router;
